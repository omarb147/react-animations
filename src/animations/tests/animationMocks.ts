const element = document.createElement("button");

const timeLine = document.timeline;
const keyFrames = new KeyframeEffect(
  element,
  { backgroundColor: ["red", "green"] },
  {
    duration: 100,
    fill: "both",
    easing: "ease",
  }
);
export const animation = new Animation(keyFrames, timeLine);
