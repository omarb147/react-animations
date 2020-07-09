import { useEffect, useState } from "react";
import Easings, { EasingTypes } from "./animations/easing";
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
  commitStyles?: boolean;
  time: number;
  easing?: EasingTypes;
  alternate?: boolean;
  continuous?: boolean;
  spacingDelay?: number;
  trigger?: { target?: string | boolean; action?: string };
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
  const [animationPlaying, setAnimationPlayState] = useState<boolean>(false);
  const [isPlayingForwards, setIsPlayingForwards] = useState<boolean>(true);
  const [manualAnimationTrigger, setAnimationTrigger] = useState<{ play: () => void }>({ play: () => {} });
  const [componentCount, setComponentCount] = useState<number>(0);
  const {
    targets,
    animation,
    time,
    trigger,
    callback,
    alternate,
    easing,
    spacingDelay,
    commitStyles,
    continuous,
  } = data;

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
    setDefaultAnimationStyles(animationStyleValues);
    setComponentCount(Object.keys(targetElementsObj).length);
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
    // Get all target elements and save them in state
    const animations: AnimationsObject = {};
    if (targetElements) {
      let spacingDelayCal = 0;
      Object.keys(targetElements).forEach((key, index) => {
        const element = targetElements[key];
        // insert animation data]

        // not sure if this works!?

        if (element && animationStyles) {
          const timeLine = document.timeline;
          const keyFrames = new KeyframeEffect(element, animationStyles[key], {
            duration: time,
            fill: alternate || commitStyles ? "both" : "none",
            direction: alternate ? (isPlayingForwards ? "normal" : "reverse") : "normal",
            easing: easing ? Easings[easing] : "ease",
            // iterations: !alternate && iterations ? iterations : undefined,
            delay: spacingDelay && trigger?.target ? spacingDelayCal : undefined,
          });
          const animationObj = new Animation(keyFrames, timeLine);
          animationObj.id = key;
          animationObj.onfinish = () => {
            if (continuous && !alternate) {
              // console.log(animationObj.currentTime);
              // if (spacingDelay) {
              //   window.setTimeout(() => {
              //     animationObj.reverse();
              //   }, spacingDelay * (componentCount - 1));
              // } else if (!spacingDelay) {
              animationObj.reverse();
              // }
              // }
              if (index === componentCount - 1) {
                setAnimationPlayState(false);
              }
              if (callback) callback();
            }
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
    if (currentAnimations && targetElements && trigger) {
      //1. if self target -> trigger.target not defined -> foreach element set event listener
      if (trigger.target === undefined) {
        Object.keys(targetElements).forEach((key, index) => {
          const element = targetElements[key];
          if (element && trigger.action) {
            setEventListenerTrigger(
              element,
              trigger.action,
              alternate,
              { key: currentAnimations[key] },
              setAnimationPlayState,
              isPlayingForwards,
              setIsPlayingForwards
            );
          }
        });
      } else if (typeof trigger.target === "string" && trigger.action) {
        let externalTriggerElement;
        if (trigger.target) externalTriggerElement = document.querySelector(trigger.target) as HTMLElement;
        setEventListenerTrigger(
          externalTriggerElement,
          trigger.action,
          alternate,
          currentAnimations,
          setAnimationPlayState,
          isPlayingForwards,
          setIsPlayingForwards
        );
      } else if (typeof trigger.target === "boolean") {
        if (trigger.target) {
          if (alternate) {
            Object.keys(currentAnimations).forEach((key, index) => {
              if (index === 0) {
                alternateAnimationEvent(
                  currentAnimations[key],
                  isPlayingForwards,
                  setIsPlayingForwards,
                  setAnimationPlayState,
                  key
                );
              } else {
                normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
              }
            });
          } else if (!alternate) {
            if (currentAnimations) {
              Object.keys(currentAnimations).forEach((key, index) => {
                normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
              });
            }
          }
        } else {
          Object.keys(currentAnimations).forEach((key, index) => {
            const animation = currentAnimations[key];
            if (animation && animation.playState === "running") currentAnimations[key]?.finish();
          });
        }
      }

      //2. if external target -> set 1 event listner that plays all animations
    }
  }, [currentAnimations, targetElements, trigger?.target]);

  useEffect(() => {
    const animationPlay = () => {
      if (currentAnimations) {
        if (alternate) {
          Object.keys(currentAnimations).forEach((key, index) => {
            if (index === 0) {
              alternateAnimationEvent(
                currentAnimations[key],
                isPlayingForwards,
                setIsPlayingForwards,
                setAnimationPlayState,
                key
              );
            } else {
              normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
            }
          });
        } else if (!alternate) {
          if (currentAnimations) {
            Object.keys(currentAnimations).forEach((key, index) => {
              normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
            });
          }
        }
      }
    };

    const animationStop = () => {
      if (currentAnimations) {
        Object.keys(currentAnimations).forEach((key, index) => {
          const animation = currentAnimations[key];
          if (animation) animation.cancel();
        });
      }
    };
    //@ts-ignore
    setAnimationTrigger((currentState) => ({ ...currentState, play: animationPlay, stop: animationStop }));
  }, [currentAnimations]);

  return [manualAnimationTrigger, animationPlaying];
};

const alternateAnimationEvent = (
  currentAnimation: Animation | undefined,
  isPlayingForwards: boolean,
  setPlayDirection: (_: boolean) => void | undefined,
  setAnimationPlayState: (_: boolean) => void,
  key: string
) => {
  if (currentAnimation) {
    //@ts-ignore
    setAnimationPlayState(true);
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
  setAnimationPlayState: (_: boolean) => void,
  key: string,
  index: number
) => {
  if (currentAnimation) {
    // currentAnimation.finish();

    if (index === 0) setAnimationPlayState(true);
    currentAnimation.cancel();
    //@ts-ignore

    currentAnimation.play();
  }
};

const setEventListenerTrigger = (
  triggerElement: HTMLElement | undefined,
  triggerAction: string,
  alternate: boolean | undefined,
  currentAnimations: AnimationsObject | undefined,
  setAnimationPlayState: (_: boolean) => void,
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
                  normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
                }
              });
            }
          },
          { once: true }
        );
    } else if (!alternate) {
      triggerElement.addEventListener(triggerAction, () => {
        if (currentAnimations) {
          Object.keys(currentAnimations).forEach((key, index) => {
            normalAnimationEvent(currentAnimations[key], setAnimationPlayState, key, index);
          });
        }
      });
    }
  }
};
