# Composition vs Inheritance

React has a powerful composition model, and we recommend using composition instead of inheritance to reuse code between components.

React 有一个强大的组合模型，同时我们推荐使用组合而非继承来重用组件之间的代码。

In this section, we will consider a few problems where developers new to React often reach for inheritance, and show how we can solve them with composition.

本章节中，我们将对 React 新手经常使用继承的一些情况进行分析，并展示如何使用组合来解决这些问题。

## Containment

Some components don’t know their children ahead of time. This is especially common for components like `Sidebar` or `Dialog` that represent generic “boxes”.

一些组件并不能提前知道它们的孩子节点会是什么。尤其是对 `Sidebar` 或者 `Dialog` 这类的通用 “盒子” 组件更是常见。
 
We recommend that such components use the special `children` prop to pass children elements directly into their output:

在这种组件中我们推荐使用 `children` 属性来将子元素直接传递到组件里面去。

```js
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

This lets other components pass arbitrary children to them by nesting the JSX:

这使得其他组件能够通过嵌套 JSX 来传递任意的子节点给他们：

```js
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

[在 codePen 打开](https://codepen.io/gaearon/pen/ozqNOV?editors=0010)

Anything inside the `<FancyBorder>` JSX tag gets passed into the `FancyBorder` component as a `children` prop. Since `FancyBorder` renders `{props.children}` inside a `<div>`, the passed elements appear in the final output.

`<FancyBorder>` 标签中的任何内容都会作为 `children` 属性传递给 `FancyBorder` 组件。因为 `FancyBorder` 在 `<div>` 中渲染了 `{props.children}`，所以传入到 FancyBorder 的元素出现在了最终的输出中。

While this is less common, sometimes you might need multiple “holes” in a component. In such cases you may come up with your own convention instead of using `children`:

有时候你确实需要在一个组件中保留多个位置，尽管这可能并非一般情况。在这种情况下你可以使用自己的约定来代替 `children`:

```js
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

[在 codePen 打开](https://codepen.io/gaearon/pen/gwZOJp?editors=0010)

React elements like `<Contacts />` and `<Chat />` are just objects, so you can pass them as props like any other data. This approach may remind you of “slots” in other libraries but there are no limitations on what you can pass as props in React.

像 `<Contacts />` 和 `<Chat />` 这样的 React 元素其实就是对象，因此你可以像传递其他数据一样来传递它们。这种方式可能会让你联想到其它库的 “slots”，但在 React 中并不会对你传递什么做限制。 

## Specialization

Sometimes we think about components as being “special cases” of other components. For example, we might say that a `WelcomeDialog` is a special case of `Dialog`.

有时候我们会考虑将一个组件当做另一个组件的 “特定情况”。例如，`WelcomeDialog` 是 `Dialog` 的特殊情况。

In React, this is also achieved by composition, where a more “specific” component renders a more “generic” one and configures it with props:

这个在 React 中也可以使用组合来完成，通过使用 props 对一个更 “通用” 的组件进行配置可以得到一个 “特定” 组件。

```js
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
    </FancyBorder>
  );
}

function WelcomeDialog() {
  return (
    <Dialog
      title="Welcome"
      message="Thank you for visiting our spacecraft!" />
  );
}
```

[在 codePen 打开](https://codepen.io/gaearon/pen/kkEaOZ?editors=0010)

Composition works equally well for components defined as classes:

组合也可以很好的用在通过 “class” 定义的组件中：

```js
function Dialog(props) {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        {props.title}
      </h1>
      <p className="Dialog-message">
        {props.message}
      </p>
      {props.children}
    </FancyBorder>
  );
}

class SignUpDialog extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.state = {login: ''};
  }

  render() {
    return (
      <Dialog title="Mars Exploration Program"
              message="How should we refer to you?">
        <input value={this.state.login}
               onChange={this.handleChange} />

        <button onClick={this.handleSignUp}>
          Sign Me Up!
        </button>
      </Dialog>
    );
  }

  handleChange(e) {
    this.setState({login: e.target.value});
  }

  handleSignUp() {
    alert(`Welcome aboard, ${this.state.login}!`);
  }
}
```

[在 codePen 打开](https://codepen.io/gaearon/pen/gwZbYa?editors=0010)

## So What About Inheritance?

At Facebook, we use React in thousands of components, and we haven’t found any use cases where we would recommend creating component inheritance hierarchies.

在 Facebook，我们在数以千计的组件中用到了 React，但还没有遇到哪种情况是我们需要推荐使用组件继承的。

Props and composition give you all the flexibility you need to customize a component’s look and behavior in an explicit and safe way. Remember that components may accept arbitrary props, including primitive values, React elements, or functions.

Porps 和 组合的方式为你以一种显式、安全的方式来自定义组件提供了足够的灵活性。记住，组件可以接受任意的属性，包括基本类型， React 元素或者函数等。

If you want to reuse non-UI functionality between components, we suggest extracting it into a separate JavaScript module. The components may import it and use that function, object, or a class, without extending it.

如果你希望在组件之间重用非 UI 的功能，我们推荐将它提到单独的 JavaScript 模块中去。这样你就可以只通过 import 它而不需要继承它就可以使用它的函数，对象或类。