import React from "react";
import { useAnimation } from "./animations/animation";
// import { useAllAnimations } from "./animations/stackedAnimations";

const callback = () => {
  console.log("external callback");
};

const App = () => {
  // const [completed] = useAnimation({
  //   target: ".test",
  //   animation: { color: ["black", "red"], easing: ["ease-in"] },
  //   alternate: true,
  //   time: 500,
  //   trigger: { target: ".other", action: "onclick" },
  //   callback: callback,
  // });

  useAnimation({
    target: "#sidebar",
    animation: { width: ["30rem", "5rem"], easing: ["ease"] },
    alternate: true,
    time: 1000,
    trigger: { target: ".other", action: "onclick" },
  });

  // useAnimation({
  //   target: ".test",
  //   animation: { backgroundColor: ["red", "green"], easing: ["cubic-bezier(0.175, 0.885, 0.320, 1.275)"] },
  //   // alternate: true,
  //   time: 500,
  //   trigger: "click",
  //   callback: callback,
  // });

  return (
    <div style={{ display: "flex" }}>
      <div id="sidebar" style={{ height: "100vh", width: "30rem", backgroundColor: "black" }}>
        hello
      </div>
      <div>
        <div className="test">hello world</div>
        <button className="other">Click Me</button>
      </div>
    </div>
  );
};

export default App;
