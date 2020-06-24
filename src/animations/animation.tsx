import { useEffect, useState } from "react";
import Easings, { EasingTypes } from "./easing";
import shortid from "shortid";

// interface CustomKeyframe extends Omit<Keyframe, "easing"> {
//   easing?: EasingTypes;
// }

// interface CustomPropertyIndexedKeyFrames extends Omit<, "easing"> {
//   easing?: EasingTypes | EasingTypes[];
// }

const compositeObjectStandardKeys = ["composite", "easing", "offset"];
interface IUseAnimationProps {
  targets: string[];
  animation: PropertyIndexedKeyframes;
  time: number;
  easing?: EasingTypes;
  alternate?: boolean;
  spacingDelay?: number;
  trigger?: { target?: string; action?: string };
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

interface IAnimationStyles {
  [id: string]: PropertyIndexedKeyframes;
}

export const useAnimation = (data: IUseAnimationProps) => {
  const [currentAnimations, setCurrentAnimations] = useState<AnimationsObject>();
  const [animationStyles, setDefaultAnimationStyles] = useState<IAnimationStyles>();
  const [targetElements, setTargetElements] = useState<TargetElementsObject>();
  const [animationEnded, setAnimationEndedState] = useState<PlayStateObject>({});
  const [isPlayingForwards, setIsPlayingForwards] = useState<boolean>(true);
  const [animationPlayTrigger, setAnimationPlayTrigger] = useState<() => void>(() => {});
  const { targets, animation, time, trigger, callback, alternate, easing, spacingDelay } = data;

  // 3rd useEffect -> updates the animation
  useEffect(() => {
    const styleProperties = Object.keys(animation).filter((key) => !compositeObjectStandardKeys.includes(key));
    const animationStyleValues: IAnimationStyles = {};
    // Get the elements which are being targetted
    const targetElementsObj: TargetElementsObject = {};
    targets.forEach((target) => {
      const elements = document.querySelectorAll(target);
      elements.forEach((element) => {
        const singularElement = (element as HTMLElement) || undefined;

        const id = shortid.generate();
        animationStyleValues[id] = Object.assign({}, animation);
        styleProperties.forEach((styleName) => {
          //@ts-ignore
          const typedStyle = styleName as CSStyleDeclaration;
          const style = singularElement.style[typedStyle];
          //@ts-ignore
          if (animationStyleValues[id][typedStyle][0] === "_initial") {
            //@ts-ignore
            animationStyleValues[id][styleName] = [style || "inherit", ...animationStyleValues[id][styleName]];
          }
        });
        targetElementsObj[id] = singularElement;
      });
    });

    let initialPlaydirection: PlayStateObject = {};
    Object.keys(targetElementsObj).forEach((key) => (initialPlaydirection[key] = true));

    //get the current state of the object being changes
    console.log(animationStyleValues);
    setDefaultAnimationStyles(animationStyleValues);
    setTargetElements(targetElementsObj);
    // setIsPlayingForwards(initialPlaydirection);
  }, []);

  //load effects
  useEffect(() => {
    if (trigger?.action === "load" && currentAnimations) {
      Object.keys(currentAnimations).forEach((key) => {
        const animation = currentAnimations[key];
        if (animation) animation.play();
      });
    }
  }, [currentAnimations]);

  // 1st useEffect -> sets up animation and saves it into the state and deals with changes to the animation
  useEffect(() => {
    console.log(trigger?.target);
    // Get all target elements and save them in state
    const animations: AnimationsObject = {};
    if (targetElements) {
      let spacingDelayCal = 0;
      Object.keys(targetElements).forEach((key, index) => {
        const element = targetElements[key];
        // insert animation data]

        // not sure if this works!?
        setAnimationEndedState({ ...animationEnded, [key]: true });
        if (element && animationStyles) {
          const timeLine = document.timeline;
          const keyFrames = new KeyframeEffect(element, animationStyles[key], {
            duration: time,
            fill: alternate ? "both" : "none",
            direction: alternate ? (isPlayingForwards ? "normal" : "reverse") : "normal",
            easing: easing ? Easings[easing] : "ease",
            delay: spacingDelay && trigger?.target ? spacingDelayCal : undefined,
          });
          const animationObj = new Animation(keyFrames, timeLine);
          animationObj.id = key;
          animationObj.onfinish = () => {
            if (callback) callback();
            setAnimationEndedState({ ...animationEnded, [animationObj.id]: true });
          };
          animations[key] = animationObj;
          spacingDelayCal += spacingDelay ? spacingDelay : 0;
          return;
        }
        animations[key] = undefined;
        spacingDelayCal += spacingDelay ? spacingDelay : 0;
        return;
      });

      setCurrentAnimations(animations);
    }
  }, [targetElements, isPlayingForwards]);

  // 2nd useEffect -> deals with replaying animation
  useEffect(() => {
    if (currentAnimations && targetElements && trigger && trigger?.action !== undefined) {
      //1. if self target -> trigger.target not defined -> foreach element set event listener
      if (!trigger.target) {
        Object.keys(targetElements).forEach((key, index) => {
          const element = targetElements[key];
          if (element && trigger.action) {
            setEventListenerTrigger(
              element,
              trigger.action,
              alternate,
              { key: currentAnimations[key] },
              setAnimationEndedState,
              isPlayingForwards,
              setIsPlayingForwards
            );
          }
        });
      } else if (typeof trigger.target === "string") {
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
  }, [currentAnimations, targetElements, trigger?.target]);

  useEffect(() => {
    const animationPlay = () => {
      if (trigger && !trigger.target && currentAnimations) {
        if (alternate) {
          Object.keys(currentAnimations).forEach((key, index) => {
            if (index === 0) {
              alternateAnimationEvent(
                currentAnimations[key],
                isPlayingForwards,
                setIsPlayingForwards,
                setAnimationEndedState,
                key
              );
            } else {
              normalAnimationEvent(currentAnimations[key], setAnimationEndedState, key);
            }
          });
        } else if (!alternate) {
          if (currentAnimations) {
            Object.keys(currentAnimations).forEach((key) => {
              normalAnimationEvent(currentAnimations[key], setAnimationEndedState, key);
            });
          }
        }
      }
    };

    setAnimationPlayTrigger(animationPlay);
  }, [currentAnimations, trigger]);

  const manualStopAnimation = () => {
    //consider alternate/non alternate
  };

  return [animationPlayTrigger];
};

const alternateAnimationEvent = (
  currentAnimation: Animation | undefined,
  isPlayingForwards: boolean,
  setPlayDirection: (_: boolean) => void | undefined,
  setAnimationPlayState: (_: { [key: string]: boolean }) => void,
  key: string
) => {
  if (currentAnimation) {
    //@ts-ignore
    setAnimationPlayState((prevPlayState) => ({ ...prevPlayState, [key]: false }));
    currentAnimation.finish();
    if (isPlayingForwards) {
      //@ts-ignore
      setPlayDirection((prevPlayDirection) => !prevPlayDirection);
      currentAnimation.play();
    } else if (!isPlayingForwards) {
      //@ts-ignore
      setPlayDirection((prevPlayDirection) => !prevPlayDirection);
      currentAnimation.play();
    }
  }
};

const normalAnimationEvent = (
  currentAnimation: Animation | undefined,
  setAnimationPlayState: (_: { [key: string]: boolean }) => void,
  key: string
) => {
  if (currentAnimation) {
    currentAnimation.finish();
    // currentAnimation.cancel();
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
  isPlayingForwards: boolean | undefined,
  setPlayDirection: (_: boolean) => void | undefined
) => {
  if (triggerElement) {
    if (alternate) {
      if (isPlayingForwards !== undefined && setPlayDirection)
        triggerElement.addEventListener(
          triggerAction,
          () => {
            if (currentAnimations) {
              Object.keys(currentAnimations).forEach((key, index) => {
                if (index === 0) {
                  alternateAnimationEvent(
                    currentAnimations[key],
                    isPlayingForwards,
                    setPlayDirection,
                    setAnimationPlayState,
                    key
                  );
                } else {
                  normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key);
                }
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

// const allAnimationsCompleted = () => {
//   ob
// }
// const isAnimation = (animation:AnimationsObject | undefined | Animation): animation is Animation => {
//   if((animation as Animation).currentTime){
//     return true
//   }
//   return false
// }
