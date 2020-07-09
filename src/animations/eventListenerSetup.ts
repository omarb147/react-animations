import {
  setEventListenerTriggerState,
  toggleSelfTriggeredPlayDirection,
  togglePlayDirection,
  ActionTypes,
} from "./actions";
import { AnimationObjects, ElementObjects } from "./types";

export const playSingleAnimation = (animation: Animation) => {
  console.log(animation.playState);
  if (animation.playState === "running") {
    animation.finish();
  }
  animation.play();
};

const playSingleAlternatingAnimation = (animation: Animation, dispatch: React.Dispatch<ActionTypes>, key: string) => {
  if (animation.playState === "running") animation.finish();
  animation.play();
  dispatch(setEventListenerTriggerState(key, true));
  dispatch(toggleSelfTriggeredPlayDirection(key));
};

const playAllAlternatingAnimations = (animations: AnimationObjects, dispatch: React.Dispatch<ActionTypes>) => {
  const animationEntries = Object.entries(animations);

  animationEntries.forEach(([key, animation], index) => {
    if (animation.playState === "running") animation.finish();
    animation.play();
    if (index === 0) dispatch(togglePlayDirection());
  });
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
    if (animation.playState === "running") animation.cancel();
  });
};

export const setupSelfTriggeredEventListener = (
  action: string,
  elements: ElementObjects,
  animations: AnimationObjects,
  alternate: boolean | undefined,
  eventListenerTriggerState: { [index: string]: boolean },
  dispatch: React.Dispatch<ActionTypes>
) => {
  const elementEntries = Object.entries(elements);
  const eventListenerTriggerStateEntries = Object.entries(eventListenerTriggerState);
  const resetAllEventListners = eventListenerTriggerStateEntries.filter(([key, value]) => value === true).length === 0;
  elementEntries.forEach(([key, element]) => {
    const selectedAnimation = animations[key];
    if (selectedAnimation) {
      if (!alternate) {
        element.addEventListener(action, () => {
          playSingleAnimation(selectedAnimation);
        });
      } else {
        const _listner = () => {
          playSingleAlternatingAnimation(selectedAnimation, dispatch, key);
        };
        if (resetAllEventListners) {
          // element.removeEventListener(action, _listner, true);
          element.addEventListener(action, _listner, { once: true });
        } else if (eventListenerTriggerState[key] === true) {
          dispatch(setEventListenerTriggerState(key, false));
          element.addEventListener(action, _listner, { once: true });
        }
      }
    }
  });
};

export const setupExternalElementEventListener = (
  target: string,
  action: string,
  animations: AnimationObjects,
  dispatch: React.Dispatch<ActionTypes>,
  alternate: boolean | undefined
) => {
  const triggerElement = document.querySelector(target);

  if (triggerElement) {
    if (!alternate) {
      triggerElement.addEventListener(action, () => playAllAnimations(animations));
    } else {
      triggerElement.addEventListener(action, () => playAllAlternatingAnimations(animations, dispatch), { once: true });
    }
  }
};

export const setupBooleanEvent = (
  target: boolean,
  animations: AnimationObjects,
  dispatch: React.Dispatch<ActionTypes>,
  alternate: boolean | undefined
) => {
  if (target) {
    if (!alternate) return playAllAnimations(animations);
    playAllAlternatingAnimations(animations, dispatch);
  } else {
    // check if this needs alternating
    stopAllAnimations(animations);
  }
};
// const setUpStandardEventListners = (
//   trigger: TriggerObject | undefined,
//   elements: ElementObjects,
//   animations: AnimationObjects,
//   animationPlayDirection: boolean,
//   dispatch: React.Dispatch<ActionTypes>
// ) => {
//   if (trigger && elements) {
//     const { action, target } = trigger;
//     if (action && !target) {
//       //Self triggered
//       setupSelfTriggeredEventListener(action, elements, animations, dispatch);
//     } else if (action && typeof target === "string") {
//       //triggered by external element
//       setupExternalElementEventListener(target, action, animations,dispatch);
//     } else if (typeof target === "boolean") {
//       setupBooleanEvent(target, animations,dispatch);
//     }
//   }
// };
