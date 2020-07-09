import { ActionTypes } from "./actions";
import { IAnimationState } from "./types";

export const initialAnimationState: IAnimationState = {
  targetElements: {},
  animationObjects: {},
  animationStyles: {},
  eventListenerTriggerState: {},
  manualAnimationTrigger: { play: () => {}, stop: () => {} },
  animationPlayDirection: true,
  animationPlayState: false,
  componentCount: 0,
};

export const animationsReducer = (state: IAnimationState, action: ActionTypes): IAnimationState => {
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
    case "SET_PLAYDIRECTION_SELF_TRIGGER": {
      return { ...state, animationPlayDirection: action.payload };
    }
    case "TOGGLE_PLAY_DIRECTION": {
      return { ...state, animationPlayDirection: !state.animationPlayDirection };
    }
    case "TOGGLE_PLAY_DIRECTION_SELF_TRIGGER": {
      const playDirection = state.animationPlayDirection;
      if (typeof playDirection !== "boolean") {
        const currentElement = playDirection[action.payload];
        if (currentElement !== undefined) {
          return {
            ...state,
            animationPlayDirection: { ...playDirection, [action.payload]: !playDirection[action.payload] },
          };
        } else {
          return { ...state, animationPlayDirection: { ...playDirection, [action.payload]: false } };
        }
      } else {
        return { ...state, animationPlayDirection: { [action.payload]: false } };
      }
    }
    case "SET_ALL_EVENT_LISTENER_TRIGGER_STATES": {
      return { ...state, eventListenerTriggerState: { ...action.payload } };
    }
    case "SET_EVENT_LISTENER_TRIGGER_STATE": {
      return {
        ...state,
        eventListenerTriggerState: { ...state.eventListenerTriggerState, [action.payload.key]: action.payload.value },
      };
    }

    default:
      return state;
  }
};
