import React from "react";
import { shallow } from "enzyme";
import { useSetUpTargets } from "../animationV2";

const dispatchMock = jest.fn();
const animation = { color: ["red", "black"] };
const targetsMock = [".test"];
let useEffect;
let props;
const TestUseSetupTargets = ({ dispatch, targets, animation }) => {
  useSetUpTargets({ dispatch, targets, animation });
  return <span className="test">test</span>;
};

// const mockHook = () => {
//   useEffect.mockImplementationOnce((f) => f());
// };

beforeEach(() => {
  useEffect = jest.spyOn(React, "useEffect").mockImplementation((f) => f());
  props = {
    dispatch: dispatchMock,
    targets: targetsMock,
    animation,
  };
  const wrapper = shallow(<TestUseSetupTargets {...props} />);
});

describe("on load", () => {
  // const wrapper = shallow(<TestUseSetupTargets />);
  expect(dispatchMock).toHaveBeenCalledTimes(2);
});
