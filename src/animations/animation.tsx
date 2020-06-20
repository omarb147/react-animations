import React, { useEffect, useState } from "react";
import Easings, { EasingsProps } from "./easing";
interface IUseAnimationProps {
  target: string;
  animation: Keyframe[] | PropertyIndexedKeyframes;
  time: number;
  alternate?: boolean;
  trigger: string | { target: string; action: string } | undefined;
  callback?: () => void;
}

export const useAnimation = (data: IUseAnimationProps) => {
  const [animationEnded, setAnimationEndedState] = useState(true);
  const [isPlayingForwards, setIsPlayingForwards] = useState(true);
  const { target, animation, time, trigger, callback, alternate } = data;

  // 1st useEffect -> sets up animation and saves it into the state
  // 2nd useEffect -> deals with replaying animation
  // 3rd useEffect -> updates the animation

  useEffect(() => {
    const element = document.querySelector(target);
    setAnimationEndedState(true);
    const timeLine = document.timeline;
    const keyFrames = new KeyframeEffect(element, animation, {
      duration: time,
      fill: alternate ? "both" : "none",
    });
    const animationObj = new Animation(keyFrames, timeLine);
    animationObj.onfinish = () => {
      if (callback) callback();
      setAnimationEndedState(true);
    };

    if (element) {
      if (typeof trigger === "string") {
        const workingElement = element as HTMLElement;

        //@ts-ignore
        workingElement.addEventListener(trigger, () => {
          animationObj.cancel();
          setAnimationEndedState(false);
          if (alternate) {
            if (isPlayingForwards) {
              console.log("forward");
              animationObj.play();
              setIsPlayingForwards(false);
            } else {
              console.log("reverse");
              animationObj.reverse();
              setIsPlayingForwards(true);
            }
          } else {
            animationObj.play();
          }
        });

        // //@ts-ignore
        // workingElement[trigger] = () => {
        //   animationObj.cancel();
        //   setAnimationEndedState(false);
        //   if (alternate) {
        //     if (isPlayingForwards) {
        //       animationObj.play();
        //       setIsPlayingForwards(false);
        //     } else {
        //       animationObj.reverse();
        //       setIsPlayingForwards(true);
        //     }
        //   } else {
        //     animationObj.play();
        //   }
        // };
      } else if (typeof trigger === "object") {
        const triggerObject = document.querySelector(trigger.target) as HTMLElement;
        if (triggerObject) {
          // trigger.object.r;
          //@ts-ignore
          triggerObject.addEventListener(
            "click",
            () => {
              animationObj.cancel();
              setAnimationEndedState(false);
              if (alternate) {
                if (isPlayingForwards) {
                  console.log("forward");
                  animationObj.play();
                  setIsPlayingForwards(false);
                } else {
                  console.log("reverse");
                  animationObj.reverse();
                  setIsPlayingForwards(true);
                }
              } else {
                animationObj.play();
              }
            },
            { once: true }
          );

          // triggerObject[trigger.action] = () => {
          //   animationObj.cancel();
          //   setAnimationEndedState(false);
          //   if (alternate) {
          //     if (isPlayingForwards) {
          //       console.log("forward");
          //       animationObj.play();
          //       setIsPlayingForwards(false);
          //     } else {
          //       console.log("reverse");
          //       animationObj.reverse();
          //       setIsPlayingForwards(true);
          //     }
          //   } else {
          //     animationObj.play();
          //   }
          // };
        }
      }
    }
  }, [isPlayingForwards]);

  console.log("playingForwards?", isPlayingForwards);
  return [animationEnded];
};
