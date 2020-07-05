import React, { useEffect, useState } from "react";
import { useAnimation } from "./animations/animation";
import { useAnimationMain } from "./animations/animationV2";

const callback = () => {
  console.log("external callback");
};

const App = () => {
  const [apiData, setApiDataState] = useState(false);

  useAnimationMain({
    targets: ["li"],
    animation: { width: ["_initial", "50%", "100%", "50%"], color: ["_initial", "green", "yellow", "red"] },
    commitStyles: true,
    alternate: true,
    spacingDelay: 200,
    easing: "ease",
    time: 1000,
    continuous: true,
    trigger: { target: ".other", action: "click" },
  });

  useAnimationMain({
    targets: ["li"],
    animation: { width: ["_initial", "50%", "100%", "50%"], color: ["_initial", "green", "yellow", "red"] },
    commitStyles: true,
    // alternate: true,
    // spacingDelay: 200,
    easing: "ease",
    time: 1000,
    // continuous: true,
    trigger: { action: "click" },
  });

  // const [playOtherAnimation, animationIsPlaying] = useAnimation({
  //   targets: ["li"],
  //   animation: { width: ["_initial", "50%", "100%", "50%"], color: ["_initial", "green", "yellow", "red"] },
  //   commitStyles: true,
  //   alternate: true,
  //   spacingDelay: 200,
  //   easing: "ease",
  //   time: 1000,
  //   continuous: true,
  //   trigger: { target: ".other", action: "click" },
  // });

  // useAnimation({
  //   targets: ["#sidebar"],
  //   animation: { backgroundColor: ["green", "red"] },
  //   commitStyles: true,
  //   easing: "easeInOutBack",
  //   time: 1500,
  //   iterations: 100,
  //   //@ts-ignore
  //   trigger: { target: animationIsPlaying },
  //   callback: () => {},
  // });

  // useAnimation({
  //   targets: ["#sidebar"],
  //   animation: { backgroundColor: ["red", "green"], easing: ["ease-out"] },
  //   alternate: true,
  //   spacingDelay: 200,
  //   time: 5000,
  //   easing: "ease-out",
  //   trigger: { action: "click" },
  // });

  return (
    <div style={{ display: "flex" }}>
      <div id="sidebar" style={{ height: "100vh", flex: "0.6", backgroundColor: "black", color: "white" }}>
        hello
      </div>
      <div style={{ flex: "1", color: "white" }}>
        <div className="test">hello world</div>
        <div className="test">Goodbve</div>
        <ul style={{ textDecoration: "none", listStyle: "none" }}>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "30%", padding: "1rem", color: "green" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem", color: "red" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "30%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "50%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
        </ul>
        <button
          className="other"
          onClick={() => {
            //@ts-ignore
            // playAnimation.play();
          }}>
          Click Me
        </button>
        <button
          className="other"
          onClick={() => {
            //@ts-ignore
            // playAnimation.stop();
          }}>
          play other animation
        </button>
      </div>
    </div>
  );
};

export default App;
