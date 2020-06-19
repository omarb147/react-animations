import React from "react";
import { useAnimation } from "./animations/animation";

const App = () => {
  useAnimation({
    target: ".test",
    animation: { opacity: [0, 1], color: ["red", "black"], easing: ["ease-in"] },
    time: 2000,
    trigger: "onmouseleave",
  });
  return (
    <div>
      <div className="test">hello world</div>
      <button className="other">Click Me</button>
    </div>
  );
};

export default App;
