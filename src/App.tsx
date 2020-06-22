import React from "react";
import { useAnimation } from "./animations/animation";
// import { useAllAnimations } from "./animations/stackedAnimations";

const callback = () => {
  console.log("external callback");
};

const App = () => {
  useAnimation({
    targets: ["#sidebar"],
    animation: { flex: ["0.6", "0.08"] },
    alternate: true,
    easing: "easeInBack",
    time: 1000,
    trigger: { target: ".other", action: "click" },
  });

  const [completed] = useAnimation({
    targets: [".test", "#sidebar"],
    animation: { color: ["black", "red"], easing: ["ease-in"] },
    alternate: true,
    time: 500,
    trigger: { target: ".other", action: "click" },
    callback: callback,
  });

  useAnimation({
    targets: [".test", "#sidebar"],
    animation: { backgroundColor: ["red", "green"], easing: ["ease-out"] },
    // alternate: true,
    time: 500,
    easing: "ease-out",
    trigger: { action: "click" },
    callback: callback,
  });

  return (
    <div style={{ display: "flex" }}>
      <div id="sidebar" style={{ height: "100vh", flex: "0.6", backgroundColor: "black" }}>
        hello
      </div>
      <div style={{ flex: "1" }}>
        <div className="test">hello world</div>
        <button className="other">Click Me</button>
      </div>
    </div>
  );
};

export default App;
