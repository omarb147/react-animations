import {
  TargetElementsObject,
  AnimationPlayDirection,
  IAnimationOptions,
  TriggerObject,
  AnimationObjects,
} from "./types";
import Easings from "./easing";

export const setAnimationPlayDirectionState = (targets: TargetElementsObject) => {
  const animationPlayDirectionObj: AnimationPlayDirection = {};
  const eventListenerTriggerStateObj: { [key: string]: boolean } = {};

  Object.keys(targets).forEach((key) => {
    animationPlayDirectionObj[key] = true;
    eventListenerTriggerStateObj[key] = false;
  });

  return { animationPlayDirectionObj, eventListenerTriggerStateObj };
};

export const setupAnimations = (
  elements: { [index: string]: HTMLElement | undefined },
  animationStyles: { [key: string]: PropertyIndexedKeyframes },
  animationOptions: IAnimationOptions,
  trigger: TriggerObject | undefined,
  animationPlayDirection: AnimationPlayDirection
) => {
  let spacingDelayCount = 0;
  let animations: AnimationObjects = {};
  const { time, commitStyles, spacingDelay, continuous, easing, alternate, callback } = animationOptions;
  const elementKeys = Object.keys(elements);

  elementKeys.forEach((key, index) => {
    const playDirection =
      typeof animationPlayDirection === "boolean"
        ? animationPlayDirection
        : animationPlayDirection[key] === undefined
        ? false
        : animationPlayDirection[key];
    const element = elements[key];
    if (element && animationStyles) {
      // console.log("is ALTERNATE DEFINED", playDirection);
      const timeLine = document.timeline;
      const keyFrames = new KeyframeEffect(element, animationStyles[key], {
        duration: time,
        fill: alternate || commitStyles ? "both" : "none",
        direction: alternate ? (playDirection ? "normal" : "reverse") : "normal",
        easing: easing ? Easings[easing] : "ease",
        // iterations: !alternate && iterations ? iterations : undefined,
        delay: spacingDelay && trigger?.target ? spacingDelayCount : undefined,
      });
      const animationObj = new Animation(keyFrames, timeLine);
      animationObj.id = key;
      animationObj.onfinish = () => {
        if (continuous && !alternate) {
          animationObj.reverse();
        }
        if (index === elementKeys.length - 1) {
          // DISPATCH PLAYSTATE ACTION
        }
        if (callback) callback();
      };

      animations[key] = animationObj;
      spacingDelayCount += spacingDelay ? spacingDelay : 0;
      return;
    }
  });

  return { animations };
};
