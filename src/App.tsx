import React from "react";
import { useAnimation } from "./animations/animation";
import { useAllAnimations } from "./animations/stackedAnimations";

const callback = () => {
  console.log("external callback");
};

const App = () => {
  const [completed] = useAnimation({
    target: ".test",
    animation: { opacity: [0, 1], color: ["red", "black"], easing: ["ease-in"] },
    time: 2000,
    trigger: "onmouseover",
    callback: callback,
  });

  //   useAllAnimations();
  return (
    <div>
      <div className="test">hello world</div>
      <button className="other">Click Me</button>
    </div>
  );
};

export default App;
