import React, { useEffect, useReducer } from "react";
import Easings, { EasingTypes } from "./easing";
import shortid from "shortid";

interface IUseAnimationProps {
  targets: string[];
  animation: PropertyIndexedKeyframes;
  commitStyles?: boolean;
  time: number;
  easing?: EasingTypes;
  alternate?: boolean;
  continuous?: boolean;
  spacingDelay?: number;
  trigger?: TriggerObject;
  callback?: () => void;
}

type TriggerObject = { target?: string | boolean; action?: string };
type AnimationObjects = { [index: string]: Animation };
type ElementObjects = { [index: string]: HTMLElement };
interface IAnimationOptions {
  time: number;
  commitStyles?: boolean;
  easing?: EasingTypes;
  continuous?: boolean;
  spacingDelay?: number;
  alternate?: boolean;
  callback?: () => void;
}

interface IAnimationState {
  targetElements: { [index: string]: HTMLElement };
  animationStyles: { [key: string]: PropertyIndexedKeyframes };
  animationObjects: AnimationObjects;
  manualAnimationTrigger: { play: () => void; stop: () => void };
  animationPlayState: boolean;
  animationPlayDirection: boolean;
  componentCount: number;
}

interface IAction {
  type: string;
  payload: { [index: string]: string };
}

const initialAnimationState: IAnimationState = {
  targetElements: {},
  animationObjects: {},
  animationStyles: {},
  manualAnimationTrigger: { play: () => {}, stop: () => {} },
  animationPlayDirection: false,
  animationPlayState: false,
  componentCount: 0,
};

const setTargetElements = (data: {
  [index: string]: HTMLElement;
}): { type: "SET_TARGET_ELEMENTS"; payload: { [index: string]: HTMLElement } } => ({
  type: "SET_TARGET_ELEMENTS",
  payload: data,
});

const setAnimations = (data: {
  [index: string]: Animation;
}): { type: "SET_ANIMATIONS"; payload: { [index: string]: Animation } } => ({
  type: "SET_ANIMATIONS",
  payload: data,
});

const setAnimationStyles = (data: {
  [key: string]: PropertyIndexedKeyframes;
}): { type: "SET_ANIMATION_STYLES"; payload: { [key: string]: PropertyIndexedKeyframes } } => ({
  type: "SET_ANIMATION_STYLES",
  payload: data,
});

type ActionTypes =
  | ReturnType<typeof setTargetElements>
  | ReturnType<typeof setAnimations>
  | ReturnType<typeof setAnimationStyles>;

const animationsReducer = (state: IAnimationState, action: ActionTypes): IAnimationState => {
  switch (action.type) {
    case "SET_TARGET_ELEMENTS": {
      return { ...state, targetElements: { ...action.payload } };
    }
    case "SET_ANIMATIONS": {
      return { ...state, animationObjects: { ...action.payload } };
    }
    case "SET_ANIMATION_STYLES": {
      return { ...state, animationStyles: { ...action.payload } };
    }
    default:
      return state;
  }
};

type TargetElementsObject = { [index: string]: HTMLElement };

interface IAnimationStyles {
  [id: string]: PropertyIndexedKeyframes;
}

const isHTMLElement = (value: Element): value is HTMLElement => {
  return (value as HTMLElement).style !== undefined;
};

export const setUpTargets = (
  dispatch: React.Dispatch<ActionTypes>,
  targets: string[],
  animation: PropertyIndexedKeyframes
) => {
  const animationKeysToIgnore = ["composite", "easing", "offset"];

  //   React.useEffect(() => {
  // Initiate empty arrays for the animation styles and target elements objects
  const animationStyleValues: IAnimationStyles = {};
  const targetElementsObj: TargetElementsObject = {};

  targets.forEach((target) => {
    // FIND HTML ELEMENT(S) relating to the target - if none should throw an error
    const elements = document.querySelectorAll(target);

    //If no elements match the criteria, then throw an error
    if (elements.length === 0) {
      throw Error("Could not find target element(s) matching the target specified");
    }
    // Get all relevant elements into an array
    elements.forEach((element) => {
      if (isHTMLElement(element)) {
        const id = shortid();
        // copy over all animation styles (in case any given element has a style )
        animationStyleValues[id] = Object.assign({}, animation);
        targetElementsObj[id] = element;
      }
    });
  });

  // ensure that no object has _initial as a value
  Object.keys(animationStyleValues).forEach((elementId) => {
    const selectedHtmlElement = targetElementsObj[elementId];
    const selectedAnimationStyles = animationStyleValues[elementId];

    Object.keys(selectedAnimationStyles).forEach((styleName) => {
      if (!animationKeysToIgnore.includes(styleName) && selectedHtmlElement) {
        // we know we have a valid style
        // not sure how to fix as the style only takes number index
        //@ts-ignore
        const style = selectedHtmlElement.style[styleName];
        //@ts-ignore
        const updatedStyles = selectedAnimationStyles[styleName].map((val) =>
          val.replace("_initial", style || "inherit")
        );
        animationStyleValues[elementId][styleName] = updatedStyles;
      }
    });
  });

  // Dispatch to save to state
  //   dispatch(setAnimationStyles(animationStyleValues));
  //   dispatch(setTargetElements(targetElementsObj));
  return { targetElementsObj, animationStyleValues };
  //   }, []);
};

const setupAnimations = (
  elements: { [index: string]: HTMLElement | undefined },
  animationStyles: { [key: string]: PropertyIndexedKeyframes },
  animationOptions: IAnimationOptions,
  trigger: TriggerObject | undefined
) => {
  let spacingDelayCount = 0;
  let animations: AnimationObjects = {};
  const { time, commitStyles, spacingDelay, continuous, easing, alternate, callback } = animationOptions;
  const elementKeys = Object.keys(elements);

  elementKeys.forEach((key, index) => {
    const element = elements[key];
    if (element && animationStyles) {
      const timeLine = document.timeline;
      const keyFrames = new KeyframeEffect(element, animationStyles[key], {
        duration: time,
        fill: alternate || commitStyles ? "both" : "none",
        // direction: alternate ? (isPlayingForwards ? "normal" : "reverse") : "normal",
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

const playSingleAnimation = (animation: Animation) => {
  if (animation.playState === "running") animation.finish();
  animation.play();
};

const playAllAnimations = (animations: AnimationObjects) => {
  const animationEntries = Object.entries(animations);

  animationEntries.forEach(([key, animation]) => {
    if (animation.playState === "running") animation.finish();
    animation.play();
  });
};

const stopAllAnimations = (animations: AnimationObjects) => {
  const animationEntries = Object.entries(animations);

  animationEntries.forEach(([key, animation]) => {
    if (animation.playState === "running") animation.finish();
  });
};

const setUpStandardEventListners = (
  trigger: TriggerObject | undefined,
  elements: ElementObjects,
  animations: AnimationObjects
) => {
  if (trigger && elements) {
    const { action, target } = trigger;
    if (action && !target) {
      //Self triggered
      const elementEntries = Object.entries(elements);
      elementEntries.forEach(([key, element]) => {
        const selectedAnimation = animations[key];
        if (selectedAnimation)
          element.addEventListener(action, () => {
            playSingleAnimation(selectedAnimation);
          });
      });
    } else if (action && typeof target === "string") {
      //triggered by external element
      const triggerElement = document.querySelector(target);

      if (triggerElement) triggerElement.addEventListener(action, () => playAllAnimations(animations));
    } else if (typeof target === "boolean") {
      if (target) {
        playAllAnimations(animations);
      } else {
        stopAllAnimations(animations);
      }
    }
  }
};

export const useAnimationMain = (data: IUseAnimationProps) => {
  const [state, dispatch] = useReducer(animationsReducer, initialAnimationState);
  const { targetElements, animationObjects, animationStyles } = state;
  const { targets, animation, trigger, ...animationOptions } = data;

  //   useEffect(() => {
  //     //1. Gets keyframe styles and makes sure that they are defined, will set if not sufficently defined (incase the _initial option is used)
  //     //2. Gets and sets a count of the objects being animated.
  //     //3. Gets and sets the Objects being animated (using a query selector)
  //   }, []);

  useEffect(() => {
    const { targetElementsObj, animationStyleValues } = setUpTargets(dispatch, targets, animation);
    const { animations } = setupAnimations(targetElementsObj, animationStyleValues, animationOptions, trigger);

    if (!animationOptions.alternate) {
      setUpStandardEventListners(trigger, targetElementsObj, animations);
    }

    if (Object.keys(targetElementsObj).length !== 0) {
      // console.log("targets", targetElementsObj);
      // console.log("animationStyles", animationStyleValues);
      console.log(animations);
    }
    // Sets the animation, using the the keyframes, target elements and options passed in (which have been updated via the first use effect)
  }, [trigger?.target]);

  //   useEffect(() => {
  //     //sets the event listeners for the animation dependent on which trigger is being used to trigger the element
  //   }, [animationObjects]);

  //   useEffect(() => {
  //     // sets the manual trigger event functions
  //   }, [animationObjects]);
};

const useAlternateAnimation = () => {};
