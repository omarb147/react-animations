import React from "react";
import { useAnimation } from "./animations/animation";
// import { useAllAnimations } from "./animations/stackedAnimations";

const callback = () => {
  console.log("external callback");
};

const App = () => {
  // useAnimation({
  //   targets: ["#sidebar"],
  //   animation: { flex: ["0.6", "0.08"] },
  //   alternate: true,
  //   easing: "easeInBack",
  //   time: 1000,
  //   trigger: { target: ".other", action: "click" },
  // });

  const [completed] = useAnimation({
    targets: ["li"],
    animation: { width: ["20%", "100%"] },
    alternate: true,
    spacingDelay: 500,
    easing: "easeInBack",
    time: 1000,
    trigger: { target: ".other", action: "click" },
    callback: callback,
  });

  // useAnimation({
  //   targets: ["li"],
  //   animation: { backgroundColor: ["red", "green"], easing: ["ease-out"] },
  //   // alternate: true,
  //   spacingDelay: 200,
  //   time: 5000,
  //   easing: "ease-out",
  //   trigger: { action: "click" },
  //   callback: callback,
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
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
          <li
            className="testSubject"
            style={{ backgroundColor: "blue", marginTop: "1rem", width: "20%", padding: "1rem" }}>
            test
          </li>
        </ul>
        <button className="other">Click Me</button>
      </div>
    </div>
  );
};

export default App;
