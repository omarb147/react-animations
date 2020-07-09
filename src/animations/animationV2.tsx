import React from "react";
import { IUseAnimationProps, TargetElementsObject, IAnimationStyles, AnimationObjects } from "./types";
import { animationsReducer, initialAnimationState } from "./reducer";
import { setTargetElements, setAnimationStyles, setAllEventListenerTriggerStates } from "./actions";
import { setUpTargets } from "./targetSetup";
import { setAnimationPlayDirectionState, setupAnimations } from "./animationSetup";
import {
  setupSelfTriggeredEventListener,
  setupExternalElementEventListener,
  setupBooleanEvent,
} from "./eventListenerSetup";

export const useAnimation = (data: IUseAnimationProps) => {
  const [state, dispatch] = React.useReducer(animationsReducer, initialAnimationState);
  const { animationPlayDirection } = state;
  const { targets, animation, trigger, ...animationOptions } = data;

  React.useEffect(() => {
    let targetElements: TargetElementsObject = state.targetElements;
    let animationStyles: IAnimationStyles = state.animationStyles;
    let animationObjects: AnimationObjects = state.animationObjects;
    let animationPlayDirection: boolean | { [key: string]: boolean } = state.animationPlayDirection;
    let eventListenerTriggerState: { [key: string]: boolean } = state.eventListenerTriggerState;
    // console.log(animationPlayDirection);

    if (Object.keys(state.targetElements).length === 0) {
      const { targetElementsObj, animationStyleValues } = setUpTargets(dispatch, targets, animation);

      dispatch(setTargetElements(targetElementsObj));
      dispatch(setAnimationStyles(animationStyleValues));

      targetElements = targetElementsObj;
      animationStyles = animationStyleValues;

      if (trigger && typeof trigger.action === "string" && !trigger?.target) {
        // console.log("here again");
        const { animationPlayDirectionObj, eventListenerTriggerStateObj } = setAnimationPlayDirectionState(
          targetElements
        );

        // dispatch(setAllSelfTriggeredPlayDirection(animationPlayDirectionObj));
        dispatch(setAllEventListenerTriggerStates(eventListenerTriggerStateObj));
        eventListenerTriggerState = eventListenerTriggerStateObj;
        animationPlayDirection = animationPlayDirectionObj;
      }
    }

    const { animations } = setupAnimations(
      targetElements,
      animationStyles,
      animationOptions,
      trigger,
      animationPlayDirection
    );
    animationObjects = animations;

    if (trigger && Object.keys(targetElements).length !== 0) {
      const { action, target } = trigger;
      if (action && !target) {
        //Self triggered
        setupSelfTriggeredEventListener(
          action,
          targetElements,
          animationObjects,
          animationOptions.alternate,
          eventListenerTriggerState,
          dispatch
        );
        // console.log("self triggered");
      } else if (action && typeof target === "string") {
        //triggered by external element
        setupExternalElementEventListener(target, action, animationObjects, dispatch, animationOptions.alternate);
      } else if (typeof target === "boolean") {
        setupBooleanEvent(target, animationObjects, dispatch, animationOptions.alternate);
      }
    }
    if (!animationOptions.alternate) {
      //   setUpStandardEventListners(trigger, targetElements, animationObjects);
    }

    // if (Object.keys(targetElements).length !== 0) {
    //   // console.log("targets", targetElementsObj);
    //   // console.log("animationStyles", animationStyleValues);
    //   console.log(animationObjects);
    // }

    // Sets the animation, using the the keyframes, target elements and options passed in (which have been updated via the first use effect)
  }, [trigger?.target, animationPlayDirection]);

  //   useEffect(() => {
  //     //sets the event listeners for the animation dependent on which trigger is being used to trigger the element
  //   }, [animationObjects]);

  //   useEffect(() => {
  //     // sets the manual trigger event functions
  //   }, [animationObjects]);
};

const useAlternateAnimation = () => {};
