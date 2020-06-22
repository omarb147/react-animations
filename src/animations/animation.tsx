import { useEffect, useState } from "react";
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
  trigger: { target?: string; action: string; delay?: string } | undefined;
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
    const element = document.querySelector(target);
    if (currentAnimation && element && trigger) {
      const currentElement = element as HTMLElement;
      let externalTriggerElement;
      if (trigger.target) externalTriggerElement = document.querySelector(trigger.target) as HTMLElement;
      setEventListenerTrigger(
        externalTriggerElement ? externalTriggerElement : currentElement,
        trigger.action,
        alternate,
        currentAnimation,
        setAnimationEndedState,
        isPlayingForwards,
        setIsPlayingForwards
      );
    }
  }, [currentAnimation]);

  useEffect(() => {
    console.log(currentAnimation);
  }, [currentAnimation?.playState]);

  return [animationEnded];
};

const alternateAnimationEvent = (
  currentAnimation: Animation,
  isPlayingForwards: boolean,
  setPlayDirection: (_: boolean) => void,
  setAnimationPlayState: (_: boolean) => void
) => {
  currentAnimation.cancel();
  setAnimationPlayState(false);
  if (isPlayingForwards) setPlayDirection(false);
  if (!isPlayingForwards) setPlayDirection(true);
  currentAnimation.play();
  console.log(currentAnimation.currentTime);
};

const normalAnimationEvent = (currentAnimation: Animation, setAnimationPlayState: (_: boolean) => void) => {
  currentAnimation.cancel();
  setAnimationPlayState(false);
  currentAnimation.play();
};

const setEventListenerTrigger = (
  triggerElement: HTMLElement,
  triggerAction: string,
  alternate: boolean | undefined,
  currentAnimation: Animation,
  setAnimationPlayState: (_: boolean) => void,
  isPlayingForwards: boolean | undefined,
  setPlayDirection: (_: boolean) => void | undefined
) => {
  if (alternate) {
    if (isPlayingForwards !== undefined && setPlayDirection)
      triggerElement.addEventListener(
        triggerAction,
        () => {
          alternateAnimationEvent(currentAnimation, isPlayingForwards, setPlayDirection, setAnimationPlayState);
        },
        { once: true }
      );
  } else if (!alternate) {
    triggerElement.addEventListener(triggerAction, () => {
      normalAnimationEvent(currentAnimation, setAnimationPlayState);
    });
  }
};
