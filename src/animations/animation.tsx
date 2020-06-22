import { useEffect, useState } from "react";
import Easings, { EasingTypes } from "./easing";
import shortid from "shortid";

// interface CustomKeyframe extends Omit<Keyframe, "easing"> {
//   easing?: EasingTypes;
// }

// interface CustomPropertyIndexedKeyFrames extends Omit<, "easing"> {
//   easing?: EasingTypes | EasingTypes[];
// }
interface IUseAnimationProps {
  targets: string[];
  animation: Keyframe[] | PropertyIndexedKeyframes;
  time: number;
  easing?: EasingTypes;
  alternate?: boolean;
  trigger: { target?: string; action: string; delay?: string } | undefined;
  callback?: () => void;
}

interface AnimationsObject {
  [index: string]: Animation | undefined;
}

interface PlayStateObject {
  [index: string]: boolean;
}

interface TargetElementsObject {
  [index: string]: HTMLElement | undefined;
}

export const useAnimation = (data: IUseAnimationProps) => {
  const [currentAnimations, setCurrentAnimations] = useState<AnimationsObject>();
  const [targetElements, setTargetElements] = useState<TargetElementsObject>();
  const [animationEnded, setAnimationEndedState] = useState<PlayStateObject>({});
  const [isPlayingForwards, setIsPlayingForwards] = useState<PlayStateObject>({});
  const { targets, animation, time, trigger, callback, alternate, easing } = data;

  // 3rd useEffect -> updates the animation
  useEffect(() => {
    // Initially set the play direction  to be forwards
    const targetElementsObj: TargetElementsObject = {};
    targets.forEach((target) => {
      const elements = document.querySelectorAll(target);
      elements.forEach((element) => {
        const singularElement = (element as HTMLElement) || undefined;
        const id = shortid.generate();
        targetElementsObj[id] = singularElement;
      });
    });
    setTargetElements(targetElementsObj);
    let initialPlaydirection: PlayStateObject = {};
    Object.keys(targetElementsObj).forEach((key) => (initialPlaydirection[key] = true));

    setIsPlayingForwards(initialPlaydirection);
  }, []);

  // 1st useEffect -> sets up animation and saves it into the state and deals with changes to the animation
  useEffect(() => {
    // Get all target elements and save them in state

    const animations: AnimationsObject = {};
    if (targetElements) {
      console.log(isPlayingForwards);
      Object.keys(targetElements).forEach((key, index) => {
        const element = targetElements[key];
        // not sure if this works!?
        setAnimationEndedState({ ...animationEnded, [key]: true });
        if (element) {
          const timeLine = document.timeline;
          const keyFrames = new KeyframeEffect(element, animation, {
            duration: time,
            fill: alternate ? "both" : "none",
            direction: alternate ? (isPlayingForwards[key] ? "normal" : "reverse") : "normal",
            easing: easing ? Easings[easing] : "ease",
          });
          const animationObj = new Animation(keyFrames, timeLine);
          animationObj.id = key;
          animationObj.onfinish = () => {
            if (callback) callback();
            setAnimationEndedState({ ...animationEnded, [animationObj.id]: true });
          };
          animations[key] = animationObj;
          return;
        }
        animations[key] = undefined;
        return;
      });

      setCurrentAnimations(animations);
    }
  }, [isPlayingForwards, targetElements]);

  // 2nd useEffect -> deals with replaying animation
  useEffect(() => {
    if (currentAnimations && targetElements && trigger) {
      //1. if self target -> trigger.target not defined -> foreach element set event listener
      if (!trigger.target) {
        Object.keys(targetElements).forEach((key, index) => {
          const element = targetElements[key];
          if (element) {
            setEventListenerTrigger(
              element,
              trigger.action,
              alternate,
              { key: currentAnimations[key] },
              setAnimationEndedState,
              { key: isPlayingForwards[key] },
              setIsPlayingForwards
            );
          }
        });
      } else if (trigger.target) {
        let externalTriggerElement;
        if (trigger.target) externalTriggerElement = document.querySelector(trigger.target) as HTMLElement;
        setEventListenerTrigger(
          externalTriggerElement,
          trigger.action,
          alternate,
          currentAnimations,
          setAnimationEndedState,
          isPlayingForwards,
          setIsPlayingForwards
        );
      }
    }

    //2. if external target -> set 1 event listner that plays all animations
  }, [currentAnimations, targetElements]);

  return [animationEnded];
};

const alternateAnimationEvent = (
  currentAnimation: Animation | undefined,
  isPlayingForwards: boolean,
  setPlayDirection: (_: PlayStateObject) => void,
  setAnimationPlayState: (_: { [key: string]: boolean }) => void,
  key: string
) => {
  if (currentAnimation) {
    currentAnimation.cancel();
    //@ts-ignore
    setAnimationPlayState((prevPlayState) => ({ ...prevPlayState, [key]: false }));
    //@ts-ignore
    if (isPlayingForwards) setPlayDirection((prevPlayDirection) => ({ ...prevPlayDirection, [key]: false }));

    if (!isPlayingForwards)
      //@ts-ignore
      setPlayDirection((prevPlayDirection: PlayState): PlayStateObject => ({ ...prevPlayDirection, [key]: true }));
    currentAnimation.play();
  }
};

const normalAnimationEvent = (
  currentAnimation: Animation | undefined,
  setAnimationPlayState: (_: { [key: string]: boolean }) => void,
  key: string
) => {
  if (currentAnimation) {
    currentAnimation.cancel();
    //@ts-ignore
    setAnimationPlayState((prevPlayState) => ({ ...prevPlayState, [key]: false }));
    currentAnimation.play();
  }
};

const setEventListenerTrigger = (
  triggerElement: HTMLElement | undefined,
  triggerAction: string,
  alternate: boolean | undefined,
  currentAnimations: AnimationsObject | undefined,
  setAnimationPlayState: (_: { [key: string]: boolean }) => void,
  isPlayingForwards: PlayStateObject | undefined,
  setPlayDirection: (_: { [key: string]: boolean }) => void | undefined
) => {
  if (triggerElement) {
    if (alternate) {
      if (isPlayingForwards !== undefined && setPlayDirection)
        triggerElement.addEventListener(
          triggerAction,
          () => {
            if (currentAnimations) {
              Object.keys(currentAnimations).forEach((key) => {
                alternateAnimationEvent(
                  currentAnimations[key],
                  isPlayingForwards[key],
                  setPlayDirection,
                  setAnimationPlayState,
                  key
                );
              });
            }
          },
          { once: true }
        );
    } else if (!alternate) {
      triggerElement.addEventListener(triggerAction, () => {
        if (currentAnimations) {
          Object.keys(currentAnimations).forEach((key) => {
            normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key);
          });
        }
      });
    }
  }
};

// const isAnimation = (animation:AnimationsObject | undefined | Animation): animation is Animation => {
//   if((animation as Animation).currentTime){
//     return true
//   }
//   return false
// }
