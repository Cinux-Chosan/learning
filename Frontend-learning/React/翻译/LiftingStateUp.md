# Lifting State Up

Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor. Let’s see how this works in action.

通常会有几个组件需要展示同一份数据（即改变同一份数据，各个组件都需要即时展现出来）。我们推荐将这些共享的状态提升到离它们最近的公共祖先元素中去。

In this section, we will create a temperature calculator that calculates whether the water would boil at a given temperature.

这一章节中， 我们会创建一个温度计算器来根据指定的温度判断水是否煮沸。

We will start with a component called `BoilingVerdict`. It accepts the `celsius` temperature as a prop, and prints whether it is enough to boil the water:

我们首先编写一个叫 `BoilingVerdict` 的组件。它接收 `celsius`（摄氏）度作为 prop 参数，然后判断在这个温度下水是否沸腾：

```js
function BoilingVerdict(props) {
  if (props.celsius >= 100) {
    return <p>The water would boil.</p>;
  }
  return <p>The water would not boil.</p>;
}
```

Next, we will create a component called `Calculator`. It renders an `<input>` that lets you enter the temperature, and keeps its value in `this.state.temperature`.

接着，我们再创建一个叫 `Calculator` 的组件。它渲染一个输入框用来输入温度，并且把值保存在 `this.state.temperature` 中。 

Additionally, it renders the `BoilingVerdict` for the current input value.

此外，它还使用 `BoilingVerdict` 来根据这个值做出判断。

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    return (
      <fieldset>
        <legend>Enter temperature in Celsius:</legend>
        <input
          value={temperature}
          onChange={this.handleChange} />

        <BoilingVerdict
          celsius={parseFloat(temperature)} />

      </fieldset>
    );
  }
}
```

[在 codePen 中打开](https://codepen.io/gaearon/pen/ZXeOBm?editors=0010)

## Adding a Second Input

Our new requirement is that, in addition to a Celsius input, we provide a Fahrenheit input, and they are kept in sync.

现在我们有了新的需求，我们还需要提供一个输入华氏度的功能，并和摄氏度保持同步。

We can start by extracting a `TemperatureInput` component from `Calculator`. We will add a new `scale` prop to it that can either be `"c"` or `"f"`:

我们可以从 `Calculator` 中提取出 `TemperatureInput` 组件，并添加一个新的属性 `scale`，它可能是 `"c"` 或者 `"f"` 之一。

```js
const scaleNames = {
  c: 'Celsius',
  f: 'Fahrenheit'
};

class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

We can now change the `Calculator` to render two separate temperature inputs:

然后我们可以将 `Calculator` 改为展示两个独立的温度输入框：

```js
class Calculator extends React.Component {
  render() {
    return (
      <div>
        <TemperatureInput scale="c" />
        <TemperatureInput scale="f" />
      </div>
    );
  }
}
```

[在 codePen 中打开](https://codepen.io/gaearon/pen/jGBryx?editors=0010)

We have two inputs now, but when you enter the temperature in one of them, the other doesn’t update. This contradicts our requirement: we want to keep them in sync.

现在我们有两个输入框，但是当我们在其中一个输入框中输入的时候，另一个并没有同步更新。这并不满足我们的需要：我们希望让他们保持同步。

We also can’t display the `BoilingVerdict` from `Calculator`. The `Calculator` doesn’t know the current temperature because it is hidden inside the `TemperatureInput`.

我们也不能在 `Calculator` 中展示 `BoilingVerdict`。 因为温度被保存在 `TemperatureInput` 中但 `Calculator` 并不知道当前的温度是多少。

## Writing Conversion Functions （编写转换函数）

First, we will write two functions to convert from Celsius to Fahrenheit and back:

首先，我们编写了两个函数来对摄氏和华氏度进行相互转换。

```js
function toCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5 / 9;
}

function toFahrenheit(celsius) {
  return (celsius * 9 / 5) + 32;
}
```

These two functions convert numbers. We will write another function that takes a string `temperature` and a converter function as arguments and returns a string. We will use it to calculate the value of one input based on the other input.

上面两个函数都只对数字进行转换。我们再来编写另一个函数，它接收一个字符串的 `temperature` 和一个转换函数并返回一个转换好的字符串。我们将用它来根据一种温度计算出另一种温度的值。

It returns an empty string on an invalid `temperature`, and it keeps the output rounded to the third decimal place:

如果 `temperature` 不能转换为数字则返回一个空字符串，如果能则四舍五入保留到小数点后第三位。

```js
function tryConvert(temperature, convert) {
  const input = parseFloat(temperature);
  if (Number.isNaN(input)) {
    return '';
  }
  const output = convert(input);
  const rounded = Math.round(output * 1000) / 1000;
  return rounded.toString();
}
```

For example, `tryConvert('abc', toCelsius)` returns an empty string, and `tryConvert('10.22', toFahrenheit)` returns `'50.396'`.

例如， `tryConvert('abc', toCelsius)`  返回空字符串，`tryConvert('10.22', toFahrenheit)` 返回 `'50.396'`.

## Lifting State Up

Currently, both `TemperatureInput` components independently keep their values in the local state:

当前，两个 `TemperatureInput` 都独立的在其内部保存了它们各自的温度值。

```js
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {temperature: ''};
  }

  handleChange(e) {
    this.setState({temperature: e.target.value});
  }

  render() {
    const temperature = this.state.temperature;
    // ...  
```

However, we want these two inputs to be in sync with each other. When we update the Celsius input, the Fahrenheit input should reflect the converted temperature, and vice versa.

然而，我们希望它们两个的输入能相互保持同步。当在摄氏度输入的时候，展示华氏度的地方应该要能即时展示出转换后的华氏度，反之亦然。

In React, sharing state is accomplished by moving it up to the closest common ancestor of the components that need it. This is called “lifting state up”. We will remove the local state from the `TemperatureInput` and move it into the `Calculator` instead.

在 React 中，将共享的状态转移到最近的公共祖先组件中的方式就叫 “状态提升”。 我们将把 `TemperatureInput` 中保存的温度状态移到 `Calculator` 中。

If the `Calculator` owns the shared state, it becomes the “source of truth” for the current temperature in both inputs. It can instruct them both to have values that are consistent with each other. Since the props of both `TemperatureInput` components are coming from the same parent `Calculator` component, the two inputs will always be in sync.

如果 `Calculator` 来管理共享的状态，那当前的温度对于两个输入框组件来说就是 “唯一数据来源”。它使得两者彼此具有一致的值。由于两个 `TemperatureInput` 组件的值都来自于相同的父组件 `Calculator`，因此它们总是会保持一致。

Let’s see how this works step by step.

我们一步一步来看这是怎么工作的。

First, we will replace `this.state.temperature` with `this.props.temperature` in the `TemperatureInput` component. For now, let’s pretend `this.props.temperature` already exists, although we will need to pass it from the `Calculator` in the future:

首先，我们把 `TemperatureInput` 组件中的 `this.props.temperature`  替换为 `this.props.temperature`。尽管后面我们需要从 `Calculator` 中传过来，但现在我们假设 `this.props.temperature` 已经存在，

```js
 render() {
    // Before: const temperature = this.state.temperature;
    const temperature = this.props.temperature;
    // ...
```

We know that [props are read-only](https://reactjs.org/docs/components-and-props.html#props-are-read-only). When the `temperature` was in the local state, the `TemperatureInput` could just call `this.setState()` to change it. However, now that the `temperature` is coming from the parent as a prop, the `TemperatureInput` has no control over it.

我们知道 [`props` 是只读的](https://reactjs.org/docs/components-and-props.html#props-are-read-only)。当 `temperature` 被当做本地状态保存在 `TemperatureInput` 时我们只需要调用 `this.setState()` 来改变它。然而现在它来自于父组件， `TemperatureInput` 现在就无法控制它了。

In React, this is usually solved by making a component “controlled”. Just like the DOM `<input>` accepts both a `value` and an `onChange` prop, so can the custom `TemperatureInput` accept both `temperature` and `onTemperatureChange` props from its parent `Calculator`.

在 React 中通常用让组件 “受控” 的方式来解决这种情况。就像 DOM `<input>` 既接受 `value` 又接受 `onChange` 一样，自定义组件 `TemperatureInput` 也可以接受来自父组件 `Calculator` 的 `temperature` 和 `onTemperatureChange`。

Now, when the `TemperatureInput` wants to update its temperature, it calls `this.props.onTemperatureChange`:

现在，当 `TemperatureInput` 想要更新它的温度时，它调用 `this.props.onTemperatureChange` 即可:

```js
  handleChange(e) {
    // Before: this.setState({temperature: e.target.value});
    this.props.onTemperatureChange(e.target.value);
    // ...
```

Note:

There is no special meaning to either `temperature` or `onTemperatureChange` prop names in custom components. We could have called them anything else, like name them `value` and `onChange` which is a common convention.

`temperature` 和 `onTemperatureChange` 属性的名字并没有特别含义。完全可以使用别的，如更通用的 `value` and `onChange` 

The `onTemperatureChange` prop will be provided together with the `temperature` prop by the parent `Calculator` component. It will handle the change by modifying its own local state, thus re-rendering both inputs with the new values. We will look at the new `Calculator` implementation very soon.

`onTemperatureChange` 会和 `temperature` 一起从父组件 `Calculator` 中传过来。它用于改变 `Calculator` 自己的内部状态，因此两个输入框都会根据新的值进行重绘。我们很快就会看到 `Calculator` 新的实现。

Before diving into the changes in the `Calculator`, let’s recap our changes to the `TemperatureInput` component. We have removed the local state from it, and instead of reading `this.state.temperature`, we now read `this.props.temperature`. Instead of calling `this.setState()` when we want to make a change, we now call `this.props.onTemperatureChange()`, which will be provided by the `Calculator`:

在改变 `Calculator` 之前，让我们再回顾一下 `TemperatureInput` 组件。我们已经将它自己的 state 移除，并从 `this.props.temperature` 而非 `this.state.temperature` 中读取值。我们也不再使用 `this.setState()` 而是用父组件 `Calculator` 提供的 `this.props.onTemperatureChange()`:

```js
class TemperatureInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.props.onTemperatureChange(e.target.value);
  }

  render() {
    const temperature = this.props.temperature;
    const scale = this.props.scale;
    return (
      <fieldset>
        <legend>Enter temperature in {scaleNames[scale]}:</legend>
        <input value={temperature}
               onChange={this.handleChange} />
      </fieldset>
    );
  }
}
```

Now let’s turn to the `Calculator` component.

现在，让我们切换到 `Calculator` 组件上。

We will store the current input’s `temperature` and `scale` in its local state. This is the state we “lifted up” from the inputs, and it will serve as the “source of truth” for both of them. It is the minimal representation of all the data we need to know in order to render both inputs.

我们将当前输入的 `temperature` 和 `scale` 保存为 `Calculator` 的本地状态。这就是从输入框中 “提升” 的状态，并作为它们的 “唯一数据来源”。它是我们能够用于呈现两个输入框需要知道的所有数据的最小数据结构。

For example, if we enter 37 into the Celsius input, the state of the `Calculator` component will be:

例如，如果我们在摄氏度中输入 37，那么 `Calculator` 的 state 为： 

```js
{
  temperature: '37',
  scale: 'c'
}
```

If we later edit the Fahrenheit field to be 212, the state of the `Calculator` will be:

如果稍后我们再在华氏度中输入 212， `Calculator` 的 state 会变为：

```js
{
  temperature: '212',
  scale: 'f'
}
```

We could have stored the value of both inputs but it turns out to be unnecessary. It is enough to store the value of the most recently changed input, and the scale that it represents. We can then infer the value of the other input based on the current `temperature` and `scale` alone.

保留两个输入框的值实际上是多余的。我们只需要保存最新修改的值和它代表的形式（即单位）即可。然后我们就可以根据当前的 `temperature` 和 `scale` 推断出另一个输入框的值。

The inputs stay in sync because their values are computed from the same state:

两个输入框能保持同步是因为它们的值来自同一个 state：

```js
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
    this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
    this.state = {temperature: '', scale: 'c'};
  }

  handleCelsiusChange(temperature) {
    this.setState({scale: 'c', temperature});
  }

  handleFahrenheitChange(temperature) {
    this.setState({scale: 'f', temperature});
  }

  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />

        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />

        <BoilingVerdict
          celsius={parseFloat(celsius)} />

      </div>
    );
  }
}
```

[在 codePen 中打开](https://codepen.io/gaearon/pen/WZpxpz?editors=0010)


Now, no matter which input you edit, `this.state.temperature` and `this.state.scale` in the `Calculator` get updated. One of the inputs gets the value as is, so any user input is preserved, and the other input value is always recalculated based on it.

现在不管你输入什么，`Calculator` 中的 `this.state.temperature` 和 `this.state.scale` 都能得到更新。其中一个输入框按原样获取值，因此能够保留用户的任何输入，并始终根据它重新计算另一个输入值。

Let’s recap what happens when you edit an input:

再来回顾一下当你编辑输入框的时候发生了些啥：

- React calls the function specified as `onChange` on the DOM `<input>`. In our case, this is the `handleChange` method in the `TemperatureInput` component.
>> React 调用 `<input>` 上的 `onChange` 方法。在我们当前这种情况下是 `TemperatureInput` 的 `handleChange` 方法。
- The `handleChange` method in the `TemperatureInput` component calls `this.props.onTemperatureChange()` with the new desired value. Its props, including `onTemperatureChange`, were provided by its parent component, the `Calculator`.
>> `TemperatureInput` 组件的 `handleChange` 会使用新的值作为参数来调用 `this.props.onTemperatureChange()`，它的 props 来自父组件 `Calculator`，并通过父组件传入了 `onTemperatureChange`
- When it previously rendered, the `Calculator` has specified that `onTemperatureChange` of the Celsius `TemperatureInput` is the `Calculator`’s `handleCelsiusChange` method, and `onTemperatureChange` of the Fahrenheit `TemperatureInput` is the `Calculator`’s `handleFahrenheitChange` method. So either of these two `Calculator` methods gets called depending on which input we edited.
>> `Calculator` 中指定摄氏度组件的 `onTemperatureChange` 为 `Calculator` 的 `handleCelsiusChange` 方法，华氏度 `TemperatureInput` 的 `onTemperatureChange` 为 `Calculator` 的 `handleFahrenheitChange`。编辑哪一个输入框就调用哪一个方法。
- Inside these methods, the `Calculator` component asks React to re-render itself by calling `this.setState()` with the new input value and the current scale of the input we just edited.
>> 在这些方法中， `Calculator` 会使用新输入的值来调用 `this.setState()` 并告诉 React 它需要被重新渲染。
- React calls the `Calculator` component’s `render` method to learn what the UI should look like. The values of both inputs are recomputed based on the current temperature and the active scale. The temperature conversion is performed here.
>> React 调用 `Calculator` 组件的 `render` 方法来渲染 UI。两个输入框的值都会根据当前的 temperature 和 scale 重新计算。
- React calls the `render` methods of the individual `TemperatureInput` components with their new props specified by the `Calculator`. It learns what their UI should look like.
>> React 使用 `Calculator` 中的新值来调用每个 `TemperatureInput` 的 `render` 方法从而渲染它们各自的 UI。
- React calls the `render` method of the `BoilingVerdict` component, passing the temperature in Celsius as its props.
>> React 给 `BoilingVerdict` 组件传入以摄氏度记的 temperature 作为其参数并调用它的 `render` 方法。
- React DOM updates the DOM with the boiling verdict and to match the desired input values. The input we just edited receives its current value, and the other input is updated to the temperature after conversion.
>> React DOM 根据输入的值更新 DOM。我们所编辑的输入框获取到当前的值，另一个输入框也将更新转换后的值。
Every update goes through the same steps so the inputs stay in sync.

每次跟新都遵循相同的步骤，因此它们能保持同步。

## Lessons Learned

There should be a single “source of truth” for any data that changes in a React application. Usually, the state is first added to the component that needs it for rendering. Then, if other components also need it, you can lift it up to their closest common ancestor. Instead of trying to sync the state between different components, you should rely on the [top-down data flow](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down).

任何在 React 应用中改变的数据都应该是 “唯一数据来源”。通常，state 首先会添加到需要用它进行渲染的组件中。如果其它组件也需要用到它，你需要将它提升到它们最近的公共祖先元素上。你应该使用 [自顶向下的数据流](https://reactjs.org/docs/state-and-lifecycle.html#the-data-flows-down) 模型而非使用其它方式来保持不同组件之间的状态同步。

Lifting state involves writing more “boilerplate” code than two-way binding approaches, but as a benefit, it takes less work to find and isolate bugs. Since any state “lives” in some component and that component alone can change it, the surface area for bugs is greatly reduced. Additionally, you can implement any custom logic to reject or transform user input.

状态提升会比双向绑定编写更多的样板代码，但是会更容易查找 bug。因为某个组件中的任何状态都只有它自己可以去修改，这样一来查找问题的范围就缩小了很多。此外， 你可以实现任何自定义逻辑来拒绝或者对用户输入进行转换。

If something can be derived from either props or state, it probably shouldn’t be in the state. For example, instead of storing both `celsiusValue` and `fahrenheitValue`, we store just the last edited `temperature` and its `scale`. The value of the other input can always be calculated from them in the `render()` method. This lets us clear or apply rounding to the other field without losing any precision in the user input.

在你不确定是使用 props 还是 state 的时候，那多半就不应该使用 state。例如，我们只需要保存最后编辑的 `temperature` 和它对应的 `scale` 而不是既保存 `celsiusValue` 又保存 `fahrenheitValue`。另一个输入框能够总是在 `render()` 方法中计算出它的值。这让我们可以在不丢失用户输入精度的情况下四舍五入计算出其它字段。

When you see something wrong in the UI, you can use [React Developer Tools](https://github.com/facebook/react-devtools) to inspect the props and move up the tree until you find the component responsible for updating the state. This lets you trace the bugs to their source:

当你发现 UI 渲染与预期不相符时，可以使用 [React 开发者工具](https://github.com/facebook/react-devtools) 来检查 props 并向上查找整棵树结构直到你找到负责更新 state 的组件。这样可以帮助你找到 bug 的根源。

![](https://reactjs.org/react-devtools-state-ef94afc3447d75cdc245c77efb0d63be.gif)