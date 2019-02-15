# Refs and the DOM

Refs provide a way to access DOM nodes or React elements created in the render method.

Ref 提供了一种可以直接引用到 render 方法中创建的 DOM 节点或者 React 元素的方法。

In the typical React dataflow, [props](https://reactjs.org/docs/components-and-props.html) are the only way that parent components interact with their children. To modify a child, you re-render it with new props. However, there are a few cases where you need to imperatively modify a child outside of the typical dataflow. The child to be modified could be an instance of a React component, or it could be a DOM element. For both of these cases, React provides an escape hatch.

在典型的 React 数据流中，[props](https://reactjs.org/docs/components-and-props.html) 是父组件与其子组件进行沟通的唯一方式。如果需要修改一个子节点，你需要用新的 props 来重绘它。然而在某些情况下，你需要在典型数据流之外对子元素进行修改（操作）。需要操作的子元素可以是 React 组件的实例，也可以是 DOM 元素。对于这两种情况，React 提供了更好的方式。

## When to Use Refs

There are a few good use cases for refs:

以下是一些应该使用 ref 的场景：

- Managing focus, text selection, or media playback.
>> 管理焦点状态，文本选择或者媒体播放回调
- Triggering imperative animations.
>> 触发动画
- Integrating with third-party DOM libraries.
>> 与第三方 DOM 库进行整合

Avoid using refs for anything that can be done declaratively.

应该避免使用 ref 来做可以通过声明性的方式来完成的事情。

For example, instead of exposing `open()` and `close()` methods on a `Dialog` component, pass an `isOpen` prop to it.

例如，对于一个 `Dialog` 组件，应该使用 `isOpen` 属性来管理它的开启和关闭状态而非暴露 `open()` and `close()` 方法来进行管理。

## Don’t Overuse Refs（不要过度使用 ref）

Your first inclination may be to use refs to “make things happen” in your app. If this is the case, take a moment and think more critically about where state should be owned in the component hierarchy. Often, it becomes clear that the proper place to “own” that state is at a higher level in the hierarchy. See the [Lifting State Up](https://reactjs.org/docs/lifting-state-up.html) guide for examples of this.

你一开始可能会倾向于在你的应用中使用 ref 来触发很多操作。如果是这种情况，请多花一点时间来思考一下组件的状态是否应该提取出来以及应该将状态置于组件层级结构中何处。通常来说，把状态放在更高层级的组件中来管理会使条理变得清晰。具体例子请参考 [Lifting State Up（状态提升）](https://reactjs.org/docs/lifting-state-up.html)

**Note**

The examples below have been updated to use the `React.createRef()` API introduced in React 16.3. If you are using an earlier release of React, we recommend using [callback refs](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) instead.

下面的示例使用了 React 16.3 中引入的 `React.createRef()`。如果你在使用更早版本的 React，我们建议你使用 [callback refs（回调方式的 ref）](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs)。

## Creating Refs

Refs are created using `React.createRef()` and attached to React elements via the `ref` attribute. Refs are commonly assigned to an instance property when a component is constructed so they can be referenced throughout the component.

使用 `React.createRef()` 创建引用，然后通过 `ref` 属性来和 React 元素进行关联。在构造组件的同时，将 ref 赋值给某个实例属性以便可以在整个组件中都可以引用它们（如下面示例中的 `this.myRef = React.createRef()`， `this`就是实例，`myRef` 就是 `this` 实例的属性）。

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

## Accessing Refs

When a ref is passed to an element in render, a reference to the node becomes accessible at the current attribute of the ref.

当在 render 中把 ref 传递给元素时之后就可以通过 ref 的 current 属性来引用该节点了。

```js
const node = this.myRef.current;
```

The value of the ref differs depending on the type of the node:

ref 的值根据节点的类型而有所不同：

- When the `ref` attribute is used on an HTML element, the `ref` created in the constructor with `React.createRef()` receives the underlying DOM element as its `current` property.
>> 当 `ref` 属性用于 HTML 元素时，该 `ref` 的 `current` 属性指向底层的 DOM 元素 
- When the `ref` attribute is used on a custom class component, the `ref` object receives the mounted instance of the component as its `current`.
>> 当 `ref` 属性指向一个自定义的类组件时， `ref` 对象的 `current` 指向已挂载的组件实例
- **You may not use the ref attribute on function components** because they don’t have instances.
>> 由于函数组件没有实例，因此**你不能对函数组件使用 ref 属性**。

The examples below demonstrate the differences.

下面的示例演示了它们的不同：

### Adding a Ref to a DOM Element（对 DOM 元素使用 Ref）

This code uses a `ref` to store a reference to a DOM node:

下面的代码使用 `ref` 来引用 DOM 节点：

```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />

        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will assign the `current` property with the DOM element when the component mounts, and assign it back to `null` when it unmounts. `ref` updates happen before `componentDidMount` or `componentDidUpdate` lifecycle methods.

React 会在组件挂载的时候把 DOM 元素赋值给 `current` 属性，当组件被卸载时又会将 `current` 置为 `null`。`ref` 的更新操作将会在 `componentDidMount` 或者 `componentDidUpdate` 生命周期函数之前发生。

### Adding a Ref to a Class Component （对类组件使用 Ref）

If we wanted to wrap the `CustomTextInput` above to simulate it being clicked immediately after mounting, we could use a ref to get access to the custom input and call its `focusTextInput` method manually:

如果我们希望将上面的 `CustomTextInput` 封装起来以便模拟在它挂载之后立即被点击的操作，我们可以使用 ref 来访问自定义 input 并手动调用 `focusTextInput` 方法：

```js
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    // current 指向 CustomTextInput，它有一个实例方法 focusTextInput 用于执行输入框的聚焦操作
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Note that this only works if `CustomTextInput` is declared as a class:

注意这种方式只能在 `CustomTextInput` 是类组件时才会起作用：

```js
class CustomTextInput extends React.Component {
  // ...
}
```

### Refs and Function Components（Ref 与函数组件）

**You may not use the ref attribute on function components** because they don’t have instances:

**不能对函数组件使用 ref 属性**，因为函数组件没有实例：

```js
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // This will *not* work!
    // 下面这样并不会起作用
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

You should convert the component to a class if you need a ref to it, just like you do when you need lifecycle methods or state.

对于函数组件，你需要像使用它的生命周期函数和 state 那样将它转换成类组件来使用。

You can, however, **use the ref attribute inside a function component** as long as you refer to a DOM element or a class component:

然而，在函数组件中你可以使用 ref 属性来引用 DOM 元素或者类组件（这应当是理所当然的，因为它是在函数组件中声明 ref 而非用 ref 组件来引用函数组件本身）：

```js
function CustomTextInput(props) {
  // textInput must be declared here so the ref can refer to it
  let textInput = React.createRef();

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />

      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
```

## Exposing DOM Refs to Parent Components（将 DOM 引用暴露给父组件）

In rare cases, you might want to have access to a child’s DOM node from a parent component. This is generally not recommended because it breaks component encapsulation, but it can occasionally be useful for triggering focus or measuring the size or position of a child DOM node.

在很少情况下，你可能希望在父组件中访问子组件中的 DOM 节点。通常不建议这么做，因为它打破了组件的封装性，但偶尔又不得不用，比如触发 DOM 类型的子节点的聚焦、测量其大小或者位置等。

While you could [add a ref to the child component](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-class-component), this is not an ideal solution, as you would only get a component instance rather than a DOM node. Additionally, this wouldn’t work with function components.

尽管你可以 [给子组件添加 ref](https://reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-class-component)，但这并非理想的解决方案，因为你只能获得组件实例而非 DOM 节点。此外，它也不能用于函数组件。

If you use React 16.3 or higher, we recommend to use [ref forwarding](https://reactjs.org/docs/forwarding-refs.html) for these cases. **Ref forwarding lets components opt into exposing any child component’s ref as their own**. You can find a detailed example of how to expose a child’s DOM node to a parent component [in the ref forwarding documentation](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

如果你使用 React 16.3 或者更高的版本，这种情况下我们建议你使用 [ref forwarding](https://reactjs.org/docs/forwarding-refs.html)。**引用转发使得组件可以将其子组件的引用当做自己的引用暴露给外部组件**。你可以在 [引用转发文档](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components) 中找到如何将子组件的 DOM 节点暴露给父组件的方法。

If you use React 16.2 or lower, or if you need more flexibility than provided by ref forwarding, you can use [this alternative approach](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) and explicitly pass a ref as a differently named prop.

如果你使用的是 React 16.2 或者更低版本，或者你需要使用到比引用转发更灵活的特性，你可以该替代方案并且显式的将 ref 通过其它属性传入（这种方式中不要使用 ref 属性）

When possible, we advise against exposing DOM nodes, but it can be a useful escape hatch. Note that this approach requires you to add some code to the child component. If you have absolutely no control over the child component implementation, your last option is to use [findDOMNode()](https://reactjs.org/docs/react-dom.html#finddomnode), but it is discouraged and deprecated in [StrictMode](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

如果可能，我们建议不要暴露 DOM 节点，但是在某些情况下这会很方便。注意这种方式需要你在子组件中添加一些代码。如果你对子组件没有绝对控制权，那最后的方案就只能使用 [findDOMNode()](https://reactjs.org/docs/react-dom.html#finddomnode)
 方法，但它在 [StrictMode](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage) 中已经被弃用。

## Callback Refs

React also supports another way to set refs called “callback refs”, which gives more fine-grain control over when refs are set and unset.

React 也支持另一种被称作 “callback refs” 的方式来设置引用，这使得你对引用的设置和取消具有更精确的控制权。

Instead of passing a `ref` attribute created by `createRef()`, you pass a function. The function receives the React component instance or HTML DOM element as its argument, which can be stored and accessed elsewhere.

这种方式使用函数去代替 `createRef()` 创建的对象来赋值给 `ref` 属性。函数的参数为 React 组件的实例或者 HTML DOM 元素，因此可以将其存起来以便其它地方需要用到。

The example below implements a common pattern: using the ref callback to store a reference to a DOM node in an instance property.

下面的示例实现了一种常规模式：使用 ref 回调来将 DOM 节点的引用存放到实例属性中。

```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Focus the text input using the raw DOM API
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus the input on mount
    this.focusTextInput();
  }

  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React will call the `ref` callback with the DOM element when the component mounts, and call it with `null` when it unmounts. Refs are guaranteed to be up-to-date before `componentDidMount` or `componentDidUpdate` fires.

React 将会在组件挂载的时候使用 DOM 元素作为参数来调用 `ref` 回调，当卸载的时候会使用 `null` 作为参数再次调用。 ref 的更新会保证在 `componentDidMount` 或 `componentDidUpdate` 触发之前。

You can pass callback refs between components like you can with object refs that were created with `React.createRef()`.

ref 回调函数同样像 `React.createRef()` 创建的对象那样在组件之间传递。

```js
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

In the example above, `Parent` passes its ref callback as an `inputRef` prop to the `CustomTextInput`, and the `CustomTextInput` passes the same function as a special `ref` attribute to the `<input>`. As a result, `this.inputElement` in `Parent` will be set to the DOM node corresponding to the `<input>` element in the `CustomTextInput`.

上面的例子中，`Parent` 通过 `inputRef` 属性将 ref 回调传递给组件 `CustomTextInput`， `CustomTextInput` 则直接通过 `ref` 属性将该方法传递给它的 `<input>` 元素。最终结果就是，`Parent` 中的 `this.inputElement` 将被设置为 `CustomTextInput` 中 `<input>` 元素的引用。

## Legacy API: String Refs

If you worked with React before, you might be familiar with an older API where the `ref` attribute is a string, like `"textInput"`, and the DOM node is accessed as `this.refs.textInput`. We advise against it because string refs have [some issues](https://github.com/facebook/react/pull/8333#issuecomment-271648615), are considered legacy, and **are likely to be removed in one of the future releases**.

如果你之前也使用 React，你也许会对字符串方式的 `ref` 属性还有印象，如 `"textInput"`，然后通过 `this.refs.textInput` 来访问所引用的 DOM 节点，这是一种旧的 API。我们不建议使用这种字符串 ref，因为它会涉及到一些问题，目前这种方式被当做遗留的 API 存在于 React 中，在之后的版本中很有可能被移除掉。

**Note**

If you’re currently using `this.refs.textInput` to access refs, we recommend using either the [callback pattern](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs) or the [createRef API](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) instead.

如果你正在使用 `this.refs.textInput` 访问 ref，我们建议要么将它替换为 [回调模式的 ref](https://reactjs.org/docs/refs-and-the-dom.html#callback-refs)，要么替换为 [createRef API](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs)。

## Caveats with callback refs（回调模式 ref 中的注意事项）

If the `ref` callback is defined as an inline function, it will get called twice during updates, first with `null` and then again with the DOM element. This is because a new instance of the function is created with each render, so React needs to clear the old ref and set up the new one. You can avoid this by defining the `ref` callback as a bound method on the class, but note that it shouldn’t matter in most cases.

如果 `ref` 回调被当做内联函数定义，则在需要更新 ref 的时候该函数会被调用两次，第一次使用 `null` 作为参数，然后马上又会使用 DOM 元素作为参数来再次调用。因为在每次 render 的时候都会创建一个新的函数实例，因此 React 需要清除旧的引用然后再设置一个新的引用。你可以通过将 `ref` 回调函数定义为类的一个函数方法来避免这种情况，不过在大多数情况下这无关紧要。