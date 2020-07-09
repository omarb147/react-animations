import shortid from "shortid";
import { ActionTypes } from "./actions";
import { IAnimationStyles, TargetElementsObject } from "./types";
import { isHTMLElement } from "./typeGuards";

export const setUpTargets = (
  dispatch: React.Dispatch<ActionTypes>,
  targets: string[],
  animation: PropertyIndexedKeyframes
) => {
  const animationKeysToIgnore = ["composite", "easing", "offset"];

  //   React.useEffect(() => {
  // Initiate empty arrays for the animation styles and target elements objects
  const animationStyleValues: IAnimationStyles = {};
  const targetElementsObj: TargetElementsObject = {};

  targets.forEach((target) => {
    // FIND HTML ELEMENT(S) relating to the target - if none should throw an error
    const elements = document.querySelectorAll(target);

    //If no elements match the criteria, then throw an error
    if (elements.length === 0) {
      throw Error("Could not find target element(s) matching the target specified");
    }
    // Get all relevant elements into an array
    elements.forEach((element) => {
      if (isHTMLElement(element)) {
        const id = shortid();
        // copy over all animation styles (in case any given element has a style )
        animationStyleValues[id] = Object.assign({}, animation);
        targetElementsObj[id] = element;
      }
    });
  });

  // ensure that no object has _initial as a value
  Object.keys(animationStyleValues).forEach((elementId) => {
    const selectedHtmlElement = targetElementsObj[elementId];
    const selectedAnimationStyles = animationStyleValues[elementId];

    Object.keys(selectedAnimationStyles).forEach((styleName) => {
      if (!animationKeysToIgnore.includes(styleName) && selectedHtmlElement) {
        // we know we have a valid style
        // not sure how to fix as the style only takes number index
        //@ts-ignore
        const style = selectedHtmlElement.style[styleName];
        //@ts-ignore
        const updatedStyles = selectedAnimationStyles[styleName].map((val) =>
          val.replace("_initial", style || "inherit")
        );
        animationStyleValues[elementId][styleName] = updatedStyles;
      }
    });
  });

  // Dispatch to save to state
  //   dispatch(setAnimationStyles(animationStyleValues));
  //   dispatch(setTargetElements(targetElementsObj));
  return { targetElementsObj, animationStyleValues };
  //   }, []);
};
