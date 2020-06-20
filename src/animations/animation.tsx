import React, { useEffect, useState } from "react";
import Easings, { EasingTypes } from "./easing";

// interface CustomKeyframe extends Omit<Keyframe, "easing"> {
//   easing?: EasingTypes;
// }

// interface CustomPropertyIndexedKeyFrames extends Omit<, "easing"> {
//   easing?: EasingTypes | EasingTypes[];
// }
interface IUseAnimationProps {
  target: string;
  animation: Keyframe[] | PropertyIndexedKeyframes;
  time: number;
  easing?: EasingTypes;
  alternate?: boolean;
  trigger: string | { target: string; action: string } | undefined;
  callback?: () => void;
}

export const useAnimation = (data: IUseAnimationProps) => {
  const [currentAnimation, setCurrentAnimation] = useState<Animation | undefined>();
  const [animationEnded, setAnimationEndedState] = useState(true);
  const [isPlayingForwards, setIsPlayingForwards] = useState(true);
  const { target, animation, time, trigger, callback, alternate, easing } = data;

  // 3rd useEffect -> updates the animation

  // 1st useEffect -> sets up animation and saves it into the state and deals with changes to the animation
  useEffect(() => {
    const element = document.querySelector(target);
    setAnimationEndedState(true);
    const timeLine = document.timeline;
    const keyFrames = new KeyframeEffect(element, animation, {
      duration: time,
      fill: alternate ? "both" : "none",
      direction: alternate ? (isPlayingForwards ? "normal" : "reverse") : "normal",
      easing: easing ? Easings[easing] : "ease",
    });
    const animationObj = new Animation(keyFrames, timeLine);
    animationObj.onfinish = () => {
      if (callback) callback();
      setAnimationEndedState(true);
    };
    setCurrentAnimation(animationObj);
  }, [isPlayingForwards]);

  // 2nd useEffect -> deals with replaying animation
  useEffect(() => {
    console.log("called");
    const element = document.querySelector(target);
    if (currentAnimation && element) {
      if (typeof trigger === "string") {
        const workingElement = element as HTMLElement;

        //ALTERNATING ANIMATION HANDLER
        if (alternate) {
          workingElement.addEventListener(
            trigger,
            () => {
              currentAnimation.cancel();
              setAnimationEndedState(false);
              if (isPlayingForwards) setIsPlayingForwards(false);
              if (!isPlayingForwards) setIsPlayingForwards(true);
              currentAnimation.play();
            },
            { once: true }
          );
        } else {
          workingElement.addEventListener(trigger, () => {
            currentAnimation.cancel();
            setAnimationEndedState(false);
            currentAnimation.play();
          });
        }
      } else if (typeof trigger === "object") {
        const triggerObject = document.querySelector(trigger.target) as HTMLElement;
        if (triggerObject) {
          if (alternate) {
            triggerObject.addEventListener(
              trigger.action,
              () => {
                currentAnimation.cancel();
                setAnimationEndedState(false);
                if (isPlayingForwards) setIsPlayingForwards(false);
                if (!isPlayingForwards) setIsPlayingForwards(true);
                currentAnimation.play();
              },
              { once: true }
            );
          } else {
            triggerObject.addEventListener(
              trigger.action,
              () => {
                currentAnimation.cancel();
                setAnimationEndedState(false);
                currentAnimation.play();
              },
              { once: true }
            );
          }
        }
      }
    }
  }, [currentAnimation]);

  return [animationEnded];
};
