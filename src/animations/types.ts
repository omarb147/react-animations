import { EasingTypes } from "./easing";

export interface IUseAnimationProps {
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

export type TriggerObject = { target?: string | boolean; action?: string };
export type AnimationObjects = { [index: string]: Animation };
export type ElementObjects = { [index: string]: HTMLElement };
export type AnimationPlayDirection = boolean | { [key: string]: boolean };
export interface IAnimationOptions {
  time: number;
  commitStyles?: boolean;
  easing?: EasingTypes;
  continuous?: boolean;
  spacingDelay?: number;
  alternate?: boolean;
  callback?: () => void;
}

export interface IAnimationState {
  targetElements: { [index: string]: HTMLElement };
  eventListenerTriggerState: { [index: string]: boolean };
  animationStyles: { [key: string]: PropertyIndexedKeyframes };
  animationObjects: AnimationObjects;
  manualAnimationTrigger: { play: () => void; stop: () => void };
  animationPlayState: boolean;
  animationPlayDirection: AnimationPlayDirection;
  componentCount: number;
}

export interface IAction {
  type: string;
  payload: { [index: string]: string };
}

export type TargetElementsObject = { [index: string]: HTMLElement };

export interface IAnimationStyles {
  [id: string]: PropertyIndexedKeyframes;
}
