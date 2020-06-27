# React-Animation Library

> A library which makes animating React components dynamically with keyframes easier and more controlled using React hooks

## Installation

- clone this repo to your local machine
- run `yarn` to install all the required node modules
- run `yarn start` to start the development server

* currently the animation hook is in the animation.tsx file, in the future, this will be done via an NPM package

## Demo

See the storybook ~~here~~ to try it out (need to make a storybook)

## How to use

> A simple animation implementation of the useAnimation Hook

```js
const App = () => {
  const [manualControl, animationIsPlaying] = useAnimation({
    targets: [".test"],
    animation: { width: ["50%", "100%"] },
    easing: "ease",
    time: 1000,
    trigger: { action: "click" },
  });

  return <div className="test">Hello World</div>;
};
```

**How does it work**
The above syntax only takes advantage of a small number of the recipes which can be used to create dynamic animations see the API documentation for more information.

For a simple animation the following options need to be defined.

1. **Targets** - the element or elements being targeted, this input requires a list of classNames, ids or HTML tags.
2. **Animation** - the Keyframes for the CSS property using Property Indexed KeyFrames syntax for more information on this syntax see the .... section
3. **Easing** - not required but can be set to a selection of predefined easings see the ...section
4. **Time** - Time of the animation
5. **Trigger** - This object has 2 inputs, `target` and `action` the target option is used if you want another element to trigger the animation if no target is provided, the element itself will trigger the animation.

the hook returns 2 values which can be use optionally

1. **manualControl** - contains 2 functions, `play` and `stop` these trigger the play and stop of the animation manually, you only need to declare this object if you are going to play the animation manually
2. **animationIsPlayingState** - this is a boolean which returns `true` when the animation begins playing and false if the animation is no longer playing.

## API documentation

## `targets : string[]` (required)

A target can be one of the following

| Input      | Prefix | Example |
| ---------- | :----: | :-----: |
| Class Name |  '.'   |  .test  |
| ID         |  '#'   |  #this  |
| HTML Tag   |  none  |   li    |

for the **Class Name** and **ID** targets the prefix must be included

**Mutliple Targets**

- you can enter multiple targets as the input as a list
- if more than on component has the same classname, id or HTML tag they will all be targeted

## `animations: PropertyIndexedKeyFrame` (required)

This is the animation you would like to apply to the target element(s), it must be expressed as a PropertyIndexedKeyFrame

**Property Indexed KeyFrame**

A property indexed keyframe is alot simpler than it sounds, it's an expression of the steps of the keyframe without providing information on the %completion of the keyframe.

It's property indexed as you provide the keyframe changes by indexing the CSS property you are referring to in the object. See all CSS properties [here](https://www.w3.org/Style/CSS/all-properties.en.html)

**Example**

```js
animation : { width: ['50%', '100%'], color:['red','blue', 'yellow']}
```

The above example will change the width starting at `50%` to ending at `100%` whilst also changing the text color in the div from `red` to `blue` then ending at `yellow`

> You must define at least two values in each property index, a `start` and `end`

### **Initial Value**

you can use the `"_initial"` value as the first value in the array if you want the animation to begin at whatever the initial value is.

**Example**

```js
animation : { width: ['_initial', '100%'], color:['_initial','blue', 'yellow']}
```

this is the same animation as before however now that we use the `_initial` value both the **Width** and **Color** animations will begin with their respective initial values

## `easing: Easing` (optional)

default value: ease

The easing will describe the easing function by which the animation will transition at the momement there is only support for built in easing functions which are the following:

| Easing Name    | function used                            |
| -------------- | ---------------------------------------- |
| linear         | linear                                   |
| ease           | ease                                     |
| ease-in        | ease-in                                  |
| ease-out       | ease-out                                 |
| easeInQuad     | cubic-bezier(0.550, 0.085, 0.680, 0.530) |
| easeInCubic    | cubic-bezier(0.550, 0.055, 0.675, 0.190) |
| easeInQuart    | cubic-bezier(0.895, 0.030, 0.685, 0.220) |
| easeInQuint    | cubic-bezier(0.755, 0.050, 0.855, 0.060) |
| easeInSine     | cubic-bezier(0.470, 0.000, 0.745, 0.715) |
| easeInExpo     | cubic-bezier(0.950, 0.050, 0.795, 0.035) |
| easeInCirc     | cubic-bezier(0.600, 0.040, 0.980, 0.335) |
| easeInBack     | cubic-bezier(0.600, -0.280, 0.735, 0.045 |
| easeOutQuad    | cubic-bezier(0.250, 0.460, 0.450, 0.940) |
| easeOutCubic   | cubic-bezier(0.215, 0.610, 0.355, 1.000) |
| easeOutQuart   | cubic-bezier(0.165, 0.840, 0.440, 1.000) |
| easeOutQunit   | cubic-bezier(0.230, 1.000, 0.320, 1.000) |
| easeOutSine    | cubic-bezier(0.390, 0.575, 0.565, 1.000) |
| easeOutExpo    | cubic-bezier(0.190, 1.000, 0.220, 1.000) |
| easeOutCirc    | cubic-bezier(0.075, 0.820, 0.165, 1.000) |
| easeOutBack    | cubic-bezier(0.175, 0.885, 0.320, 1.275) |
| easeInOutQuad  | cubic-bezier(0.455, 0.030, 0.515, 0.955) |
| easeInOutCubic | cubic-bezier(0.645, 0.045, 0.355, 1.000) |
| easeInOutQuart | cubic-bezier(0.770, 0.000, 0.175, 1.000) |
| easeInOutQuint | cubic-bezier(0.860, 0.000, 0.070, 1.000) |
| easeInOutSine  | cubic-bezier(0.445, 0.050, 0.550, 0.950) |
| easeInOutExpo  | cubic-bezier(1.000, 0.000, 0.000, 1.000) |
| easeInOutCirc  | cubic-bezier(0.785, 0.135, 0.150, 0.860) |
| easeInOutBack  | cubic-bezier(0.680, 0, 0.265, 1)         |

The chosen easing will be applied to all the property animations set in the `animations` key

## `time: number` (required)

Time allocated for the animation to complete in ms

## `trigger: {trigger?:string | boolean, action?:string}` (optional)

This is the control which triggers the animation

> The trigger is an optional variable, if you do not put a trigger on an animation, the only way to trigger it is using the `manaualControl.play()` function

There are 4 trigger options, these will be applied dependent on the combination of inputs you provide in the trigger option

| Name<sup>\*</sup>     | Trigger Method                       | Trigger Option Input                      | Example                                     |
| --------------------- | ------------------------------------ | ----------------------------------------- | ------------------------------------------- |
| Manual                | Manual Only                          | `trigger: undefined`                      | `trigger: undefined`                        |
| Target Trigger        | by the Target Component              | `trigger: {action:string}`                | `trigger: {action:'load'}`                  |
| Other element Trigger | by component other than target       | `trigger: {target:string ,action:string}` | `trigger: {target:'.test' ,action:'click'}` |
| Bool Trigger          | by the the change of a boolean value | `trigger: {target:boolean}`               | `trigger: {target:apiCallLoading`}          |

_<sup>\*</sup>Name refers to the name I will reference the trigger with in the other parts of the documentation_

### Actions

The actions which can be used for the `self component trigger` and `other component trigger` in the table above is any standard HTML DOM event, some of the common ones are

- click
- mouseover
- mouseout
- change
- focus
- copy
- scroll

for other options see [here](https://www.w3schools.com/jsref/dom_obj_event.asp)

### Target Trigger

if you are targeting multiple elements, using the `targets` option, each will be self triggered e.g. if your action is `click` clicking on each one will only trigger the click animation of that single element.

all you need to provide for this type of trigger is the trigger action as detailed above

### Other Element Trigger

for this type of trigger, all `targets` will be trigger by this single trigger

you must provide the trigger in the same way that you provide a target, either as a **Class Name**, **ID** or **HTML Tag**, be careful to ensure that the is only a single trigger when using any of these options as mutliple triggers will not produce the intended result.

### Bool Trigger

This type of trigger will only will only require a boolean value as the target option, as detailed above. When the input boolean is false the animation will play otherwise, when false, it will not play.

> the option to trigger an animation manually is still available even if you have a designated a trigger option.

## `callback:()=>void` (optional)

this is a callback function which will be called when the animation has completed

you can enter a function which has no arguments and no return values here and it will be triggered by the end of the animation.

## Modifier Options

the following options will modify the basic implementation of the animation hook to produce more intricate results. all of the following options have
`defaultValue = undefined`

## `alternate:bool` (optional)

Setting alternate here will mean that the animation will alternate between playing forwards and backwards each time it is triggered and will commit the style of the ending keyframe each time.

### Example

```js
{
    animation:{backgroundColor:['_initial','red'], width:['20%','40%']}
    alternate:true
}
```

This example will produce the following results

**First Play**

- The background color of the target wll go from the initial style to `red` and remain `red`
- At the same time, the width of the target will go from `20%` to `40%` and remain at `40%`

**Second Play**

- The background color of the target wll go from `red` back to the initial color and remain at the initial color
- At the same time, the width of the target will go from `40%` to `20%` and remain at `20%`

this pattern will repeat on each consecutive play.

> note that the continuous option (mentioned below) does not work when this option is enabled.

## `commitStyles:bool` (optional)

enabling this option will mean that the styles will be committed as the final style once the animation has been completed.

for example, if the animation is `animation:{ color: ["red","black"] }`,when the animation completes the target element's text color will remain 'black'.

NB. if it is played again this animation will not go in reverse.

This option was designed to be used when the `alternate` option is not used as it will have no effect when the `alternate: true`

## `spacingDelay:number` (optional)

This option is the time delay between animating target elements. Therefore it will only have an effect if you have multiple `targets`, this should be used when animating multiple related elements.

the spacingDelay time should be provided in ms

### Example

```js
    targets:['li']
    animation:{backgroundColor:['_initial','red'], width:['20%','40%']}
    spacingDelay:1000
```

in the example above if for example there were 10 li elements each one with a delay of 1s to the previous one, so the first element will animate instantly, then the second will animate 1 second after and the third will animate 1s after the second element starts to animate etc.

## `continuous:bool` (optional)

when this option is set to true the animation will make the animation play continuously.

Once this option is activated there are 2 ways in which it can be stopped.

1. You can manually stop the animation by using the `manualControl.stop()` function.
2. if the trigger for the function is a boolean variable it'll play continuously when true and stop when false.

> there is a known bug when using this option with a spacingDelay and alternate, where the timing of the animations will go out of sync.
