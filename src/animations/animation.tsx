import React, { useEffect, useState } from "react";

interface IUseAnimationProps {
  target: string;
  animation: Keyframe[] | PropertyIndexedKeyframes;
  time: number;
  trigger: string | undefined;
}

export const useAnimation = (data: IUseAnimationProps) => {
  //   const [animationEnded, setAnimationEndedState] = useState(true);
  const { target, animation, time, trigger } = data;

  //   const callBack = () => {
  //     // setAnimationEndedState(true);
  //     console.log("here");
  //   };

  useEffect(() => {
    const element = document.querySelector(target);
    // const sharedTimeline = document.timeline;

    const keyFrames = new KeyframeEffect(element, animation, time);
    const animationObj = new Animation(keyFrames);
    animationObj.onfinish = () => console.log("done");

    console.log("before", animationObj.finished);
    if (element) {
      if (trigger) {
        const workingElement = element as HTMLElement;
        //@ts-ignore
        workingElement[trigger] = () => {
          animationObj.cancel();
          animationObj.play();
        };
      }
    }
  }, []);
  //   console.log(animationEnded);
};
