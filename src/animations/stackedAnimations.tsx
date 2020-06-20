import { useAnimation } from "./animation";
//@ts-ignore
import { bounce } from "@pluginjs/keyframes";

const callback = () => {
  console.log("external callback");
};

export const useAllAnimations = () => {
  // onclick animation
  useAnimation({
    target: ".test",
    animation: { opacity: [0, 1], color: ["red", "black"], easing: ["ease-in"] },
    time: 2000,
    trigger: { target: ".other", action: "onclick" },
    callback: callback,
  });

  // on mouse over button animation
  useAnimation({
    target: ".other",
    animation: { filter: ["blur(10px)", "none"], easing: ["ease-in"] },
    time: 2000,
    trigger: "onmouseover",
    callback: callback,
  });
};
