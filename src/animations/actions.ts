export const setTargetElements = (data: {
  [index: string]: HTMLElement;
}): { type: "SET_TARGET_ELEMENTS"; payload: { [index: string]: HTMLElement } } => ({
  type: "SET_TARGET_ELEMENTS",
  payload: data,
});

export const setAnimations = (data: {
  [index: string]: Animation;
}): { type: "SET_ANIMATIONS"; payload: { [index: string]: Animation } } => ({
  type: "SET_ANIMATIONS",
  payload: data,
});

export const setAnimationStyles = (data: {
  [key: string]: PropertyIndexedKeyframes;
}): { type: "SET_ANIMATION_STYLES"; payload: { [key: string]: PropertyIndexedKeyframes } } => ({
  type: "SET_ANIMATION_STYLES",
  payload: data,
});

export const setAllSelfTriggeredPlayDirection = (data: {
  [index: string]: boolean;
}): { type: "SET_PLAYDIRECTION_SELF_TRIGGER"; payload: { [index: string]: boolean } } => ({
  type: "SET_PLAYDIRECTION_SELF_TRIGGER",
  payload: data,
});

export const togglePlayDirection = (): { type: "TOGGLE_PLAY_DIRECTION" } => ({
  type: "TOGGLE_PLAY_DIRECTION",
});

export const toggleSelfTriggeredPlayDirection = (
  key: string
): { type: "TOGGLE_PLAY_DIRECTION_SELF_TRIGGER"; payload: string } => ({
  type: "TOGGLE_PLAY_DIRECTION_SELF_TRIGGER",
  payload: key,
});

export const setEventListenerTriggerState = (
  key: string,
  value: boolean
): { type: "SET_EVENT_LISTENER_TRIGGER_STATE"; payload: { key: string; value: boolean } } => ({
  type: "SET_EVENT_LISTENER_TRIGGER_STATE",
  payload: { key, value },
});

export const setAllEventListenerTriggerStates = (data: {
  [index: string]: boolean;
}): { type: "SET_ALL_EVENT_LISTENER_TRIGGER_STATES"; payload: { [index: string]: boolean } } => ({
  type: "SET_ALL_EVENT_LISTENER_TRIGGER_STATES",
  payload: data,
});

export type ActionTypes =
  | ReturnType<typeof setTargetElements>
  | ReturnType<typeof setAnimations>
  | ReturnType<typeof setAnimationStyles>
  | ReturnType<typeof togglePlayDirection>
  | ReturnType<typeof toggleSelfTriggeredPlayDirection>
  | ReturnType<typeof setAllSelfTriggeredPlayDirection>
  | ReturnType<typeof setAllSelfTriggeredPlayDirection>
  | ReturnType<typeof setEventListenerTriggerState>
  | ReturnType<typeof setAllEventListenerTriggerStates>;
