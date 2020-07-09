import { playSingleAnimation } from "../eventListenerSetup";
import "web-animations-js/web-animations-next-lite.min";
// import { animation } from "./animationMocks";

const element = document.createElement("button");

const timeLine = document.timeline;
const keyFrames = new KeyframeEffect(
  element,
  { color: ["red", "green"] },
  {
    duration: 1000,
    fill: "both",
    easing: "ease",
  }
);

const animation = new Animation(keyFrames, timeLine);
const mockPlayfn = (Animation.prototype.play = jest.fn());
const mockAnimationState = Animation.prototype.playState;

describe("playSingleAnimation", () => {
  it.only("should play the animation", () => {
    animation.play();
    console.log(timeLine);
    playSingleAnimation(animation);
    console.log(timeLine);
    expect(animation.playState).toEqual("running");
    expect(mockPlayfn).toBeCalledTimes(1);
  });

  it("should play the animation", async () => {
    await animation.play();
    expect(animation.playState).toEqual("running");

    // console.log(animation.startTime);
    // playSingleAnimation(animation);
    // expect(animation.playState).toEqual("running");
    // expect(mockPlayfn).toBeCalledTimes(1);
  });
});
