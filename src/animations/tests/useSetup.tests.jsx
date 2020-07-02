import React from "react";
import { shallow } from "enzyme";
import { useSetUpTargets } from "../animationV2";

const dispatchMock = jest.fn();
const animation = { color: ["red", "black"] };
const targetsMock = [".test"];

const TestUseSetupTargets = () => {
  useSetUpTargets({ dispatchMock, targetsMock, animation });
  return <span>test</span>;
};

beforeEach(() => {
  const useEffect = jest.spyOn(React, "useEffect").mockImplementation((f) => f());
});

describe("on load", () => {
  const wrapper = shallow(<TestUseSetupTargets />);
  expect(dispatchMock).toHaveBeenCalledTimes(2);
});
