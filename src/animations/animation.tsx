import React, { useEffect, useState } from "react";

interface IUseAnimationProps {
  target: string;
  animation: Keyframe[] | PropertyIndexedKeyframes;
  time: number;
  trigger: string | { target: string; action: string } | undefined;
  callback: () => void;
}

export const useAnimation = (data: IUseAnimationProps) => {
  const [animationEnded, setAnimationEndedState] = useState(true);
  const { target, animation, time, trigger, callback } = data;

  useEffect(() => {
    const element = document.querySelector(target);
    setAnimationEndedState(true);

    const keyFrames = new KeyframeEffect(element, animation, time);
    const animationObj = new Animation(keyFrames);
    animationObj.onfinish = () => {
      callback();
      setAnimationEndedState(true);
    };

    if (element) {
      if (typeof trigger === "string") {
        const workingElement = element as HTMLElement;
        //@ts-ignore
        workingElement[trigger] = () => {
          animationObj.cancel();
          setAnimationEndedState(false);
          animationObj.play();
        };
      } else if (typeof trigger === "object") {
        const triggerObject = document.querySelector(trigger.target) as HTMLElement;
        if (triggerObject) {
          //@ts-ignore
          triggerObject[trigger.action] = () => {
            animationObj.cancel();
            setAnimationEndedState(false);
            animationObj.play();
          };
        }
      }
    }
  }, []);
  return [animationEnded];
};
