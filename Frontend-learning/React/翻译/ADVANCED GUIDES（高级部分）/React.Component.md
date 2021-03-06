---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

This page contains a detailed API reference for the React component class definition. It assumes you're familiar with fundamental React concepts, such as [Components and Props](https://reactjs.org/docs/components-and-props.html), as well as [State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html). If you're not, read them first.

此页包含了 React 组件类详细的 API 文档。这建立在你对一些 React 基本概念（如 [Components and Props](https://reactjs.org/docs/components-and-props.html) 或者 [State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)）比较熟悉的情况下。如果你不熟悉，请先阅读它们。

## Overview {#overview}

React lets you define components as classes or functions. Components defined as classes currently provide more features which are described in detail on this page. To define a React component class, you need to extend `React.Component`:

你可以通过类或者函数定义组件。用类的方式定义的 Components 提供了更多的特性。如果需要定义 React 组件类，你需要继承 `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

The only method you *must* define in a `React.Component` subclass is called [`render()`](#render). All the other methods described on this page are optional.

`React.Component` 的子类中唯一需要定义的方法就是 [`render()`](#render)。本页面的所有其他方法都是非必须的。

**We strongly recommend against creating your own base component classes.** In React components, [code reuse is primarily achieved through composition rather than inheritance](https://reactjs.org/docs/composition-vs-inheritance.html).

**我们强烈建议你不要创建自己的组件基类**。在 React 组件中， [代码重用的主要方式是通过组合而非继承](https://reactjs.org/docs/composition-vs-inheritance.html)

>Note:
>
>React doesn't force you to use the ES6 class syntax. If you prefer to avoid it, you may use the `create-react-class` module or a similar custom abstraction instead. Take a look at [Using React without ES6](https://reactjs.org/docs/react-without-es6.html) to learn more.
>
> React 并不强制你使用 ES6 语法。如果你不希望使用它，你可以使用 `create-react-class` 模块或者自定义一个类似功能的模块。这里有[React 中不使用 ES 6 的方式](https://reactjs.org/docs/react-without-es6.html)

### The Component Lifecycle {#the-component-lifecycle}

Each component has several "lifecycle methods" that you can override to run code at particular times in the process. **You can use [this lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) as a cheat sheet.** In the list below, commonly used lifecycle methods are marked as **bold**. The rest of them exist for relatively rare use cases.

每个组件都有一系列的 “生命周期函数” 供你调用，它们会在特定的时刻被执行。**你可以点击这里查看[生命周期图表](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)**。在下面罗列出的生命周期函数中，常用的会被标记为“粗体”字，其余的则不太常用。

#### Mounting {#mounting}

These methods are called in the following order when an instance of a component is being created and inserted into the DOM:

以下方法在组件被创建和插入到 DOM 时按顺序调用：

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Note:
>
>These methods are considered legacy and you should [avoid them](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) in new code:
>
> 下面的方法为遗留方法，[应避免再使用]((https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html))
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Updating {#updating}

An update can be caused by changes to props or state. These methods are called in the following order when a component is being re-rendered:

对 props 和 state 的修改都会导致更新操作的产生。下面这些方法会在重绘的时候按顺序被调用：

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Note:
>
>These methods are considered legacy and you should [avoid them](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) in new code:
>
> 以下方法作为遗留方法，[应避免再使用](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html) 
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Unmounting {#unmounting}

This method is called when a component is being removed from the DOM:

该方法会在组件被从 DOM 中移除时调用：

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Error Handling {#error-handling}

These methods are called when there is an error during rendering, in a lifecycle method, or in the constructor of any child component.

以下方法会在渲染期间的任意子组件的生命周期函数或者 constructor 中发生错误时被调用。

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### Other APIs {#other-apis}

Each component also provides some other APIs:

每个组件同时也提供了一些其他的 API：

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Class Properties {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Instance Properties {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Reference {#reference}

### Commonly Used Lifecycle Methods {#commonly-used-lifecycle-methods}

The methods in this section cover the vast majority of use cases you'll encounter creating React components. **For a visual reference, check out [this lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

本节中的方法涵盖了创建 React 组件时遇到的绝大多数使用场景。**[这里有图表类型的参考](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)**

### `render()` {#render}

```javascript
render()
```

The `render()` method is the only required method in a class component.

`render()` 方法是组件中唯一一个必须要实现的方法。

When called, it should examine `this.props` and `this.state` and return one of the following types:

当它被调用时，它应该要读取 `this.props` 和 `this.state` 的值并且返回以下类型之一：

- **React elements.** Typically created via [JSX](https://reactjs.org/docs/introducing-jsx.html). For example, `<div />` and `<MyComponent />` are React elements that instruct React to render a DOM node, or another user-defined component, respectively.
> **React elements**。通常由 [JSX](https://reactjs.org/docs/introducing-jsx.html) 创建。例如，`<div />` 和 `<MyComponent />` 是能够让 React 渲染 DOM 节点或者其他用户自定义组件的 React 元素。
- **Arrays and fragments.** Let you return multiple elements from render. See the documentation on [fragments](https://reactjs.org/docs/fragments.html) for more details.
>  **Arrays and fragments**。让你可以从 render 中返回多个元素。参考 [fragments](https://reactjs.org/docs/fragments.html)
- **Portals**. Let you render children into a different DOM subtree. See the documentation on [portals](https://reactjs.org/docs/portals.html) for more details.
>  **Portals**。在渲染期间将元素渲染到其他 DOM 中去（即不在原来的位置）。
- **String and numbers.** These are rendered as text nodes in the DOM.
> **String and numbers**。这些值会在 DOM 中被渲染为文本节点。
- **Booleans or `null`**. Render nothing. (Mostly exists to support `return test && <Child />` pattern, where `test` is boolean.)
> **Booleans or `null`**。什么都不渲染（大多数情况是为了满足 `return test && <Child />` 这种模式，`test` 是一个布尔值）

The `render()` function should be pure, meaning that it does not modify component state, it returns the same result each time it's invoked, and it does not directly interact with the browser.

`render()` 函数应该是一个纯函数，也就是说它不应该修改组件的 state，（在相同条件下）每次调用会返回相同的结果，并且不应该直接和浏览器进行交互。

If you need to interact with the browser, perform your work in `componentDidMount()` or the other lifecycle methods instead. Keeping `render()` pure makes components easier to think about.

如果你需要和浏览器进行交互，请将内容放到 `componentDidMount()` 或者其他生命周期函数中去。保持 `render()` 的纯净可以让组件逻辑更清晰。

> Note
>
> `render()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.
>
> 如果 [`shouldComponentUpdate()`](#shouldcomponentupdate) 返回 false 则 `render()` 不会被调用。

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**If you don't initialize state and you don't bind methods, you don't need to implement a constructor for your React component.**

**如果你不需要初始化 state 或不需要 bind 方法，则你就不必实现组件的 constructor。**

The constructor for a React component is called before it is mounted. When implementing the constructor for a `React.Component` subclass, you should call `super(props)` before any other statement. Otherwise, `this.props` will be undefined in the constructor, which can lead to bugs.

React 组件的 constructor 会在组件挂载之前执行。当实现继承自 `React.Component` 子类的 constructor 时，你需要其他代码最前面执行 `super(props)`。否则，`this.props` 将会是 `undefined`，这就会导致 bug 产生。

Typically, in React constructors are only used for two purposes:

React constructor 只用于一下两种用途：

* Initializing [local state](https://reactjs.org/docs/state-and-lifecycle.html) by assigning an object to `this.state`.
> 通过给 `this.state` 赋值一个对象来初始化组件的[state](https://reactjs.org/docs/state-and-lifecycle.html)
* Binding [event handler](https://reactjs.org/docs/handling-events.html) methods to an instance.
> 给实例绑定一个 [事件处理函数](https://reactjs.org/docs/handling-events.html) 

You **should not call `setState()`** in the `constructor()`. Instead, if your component needs to use local state, **assign the initial state to `this.state`** directly in the constructor:

你 **不应该在 `constructor()` 中调用 `setState()`**。如果组件需要自己的 state，则 **直接在 constructor 中为 `this.state` 赋值即可。**

```js
constructor(props) {
  super(props);
  // Don't call this.setState() here!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Constructor is the only place where you should assign `this.state` directly. In all other methods, you need to use `this.setState()` instead.

Constructor 是唯一可以对 `this.state` 直接赋值的地方。在其它方法中，你需要使用 `this.setState()`。

Avoid introducing any side-effects or subscriptions in the constructor. For those use cases, use `componentDidMount()` instead.

避免在 constructor 中引入任何具有副作用的行为。这些情况一般放在 `componentDidMount()` 中去做。

>Note
>
>**Avoid copying props into state! This is a common mistake:**
>
> **不要把 props 中的值拷贝到 state 中！这是一个常见的错误：**
>
>```js
>constructor(props) {
>  super(props);
>  // Don't do this!
>  this.state = { color: props.color };
>}
>```
>
>The problem is that it's both unnecessary (you can use `this.props.color` directly instead), and creates bugs (updates to the `color` prop won't be reflected in the state).
>
> 因为这完全是没必要的（直接使用 `this.props.color` 即可），并且会导致 bug 产生（对 props 中的 `color` 进行更新并不会反映到 state 对应的值上）
>
>**Only use this pattern if you intentionally want to ignore prop updates.** In that case, it makes sense to rename the prop to be called `initialColor` or `defaultColor`. You can then force a component to "reset" its internal state by [changing its `key`](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) when necessary.
>
> **只有在你希望忽略 props 更新的时候才采用该模式。**这种情况下，最好是将 props 的名字改成类似于 `initialColor` 或者 `defaultColor` 这种形式。必要的时候你可以通过 [改变`key` prop](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) 来强制组件 “重置” 其内部状态。
>
>Read our [blog post on avoiding derived state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html) to learn about what to do if you think you need some state to depend on the props.
>
>在你认为某些 state 需要依赖于 props 的时候，请阅读 [blog post on avoiding derived state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html) 来学习该如何做。

* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` is invoked immediately after a component is mounted (inserted into the tree). Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.

`componentDidMount()` 在组件被挂载（插入到 DOM 树中）之后立马被调用。需要 DOM 节点的初始化操作应该放在该函数中。如果你需要从加载远程数据，那这里就是实例化网络请求的最佳地方。

This method is a good place to set up any subscriptions. If you do that, don't forget to unsubscribe in `componentWillUnmount()`.

该方法还是执行一些订阅操作的好地方。但不要忘了在 `componentWillUnmount()` 中取消订阅。

You **may call `setState()` immediately** in `componentDidMount()`. It will trigger an extra rendering, but it will happen before the browser updates the screen. This guarantees that even though the `render()` will be called twice in this case, the user won't see the intermediate state. Use this pattern with caution because it often causes performance issues. In most cases, you should be able to assign the initial state in the `constructor()` instead. It can, however, be necessary for cases like modals and tooltips when you need to measure a DOM node before rendering something that depends on its size or position.

你也许会在 `componentDidMount()` 中立即调用 `setState()`。它将会触发额外的渲染操作，但会在浏览器更新屏幕之前发生。这保证了即便是 `render()` 被调用了两次，用户也不会看到发生在中间的状态改变。这么做需要小心，因为这种做法经常会导致性能问题。在大多数情况中，你应该直接在 constructor 中为 state 赋值初始状态。但在某些场景中，如弹窗和提示工具条等，需要在渲染之前对 DOM 节点的大小和位置进行测量的时候 `componentDidMount()` 就显得很有必要。

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` is invoked immediately after updating occurs. This method is not called for the initial render.

`componentDidUpdate()` 在改变发生之后立马被执行，该方法不会在首次渲染的时候调用。

Use this as an opportunity to operate on the DOM when the component has been updated. This is also a good place to do network requests as long as you compare the current props to previous props (e.g. a network request may not be necessary if the props have not changed).

当组件被更新之后，可以使用该方法来操作 DOM。如果你对比前后 props 发生了改变，也可以在这里发送网络请求（如果 props 没有发生改变，则可能并不需要发送网络请求）

```js
componentDidUpdate(prevProps) {
  // Typical usage (don't forget to compare props):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

You **may call `setState()` immediately** in `componentDidUpdate()` but note that **it must be wrapped in a condition** like in the example above, or you'll cause an infinite loop. It would also cause an extra re-rendering which, while not visible to the user, can affect the component performance. If you're trying to "mirror" some state to a prop coming from above, consider using the prop directly instead. Read more about [why copying props into state causes bugs](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html).

你 **可会会在 `componentDidUpdate()` 中调用 `setState()`**，但请注意你需要**像上面那样把它函数在条件判断中**，否则将会导致无限循环。它还会导致额外的重新渲染，这同样对用户不可见，但影响组件的性能。如果你尝试将 prop 中的属性映射到 state 中，请不要这么做，直接使用 prop 来代替。[为什么将 prop 中的属性映射到 state 会导致bug](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

If your component implements the `getSnapshotBeforeUpdate()` lifecycle (which is rare), the value it returns will be passed as a third "snapshot" parameter to `componentDidUpdate()`. Otherwise this parameter will be undefined.

如果组件实现了声明周期函数 `getSnapshotBeforeUpdate()` ，则它返回的值会被作为第三个参数传递给 `componentDidUpdate()`。否则该参数为 `undefined`。

> Note
>
> `componentDidUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.
>
>如果 [`shouldComponentUpdate()`](#shouldcomponentupdate) 返回 false 则不会调用 `componentDidUpdate()` 

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` is invoked immediately before a component is unmounted and destroyed. Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests, or cleaning up any subscriptions that were created in `componentDidMount()`.

`componentWillUnmount()` 会在组件被卸载和销毁之前被调用。该函数用于执行一些必要的清理操作，如清除计时器、取消网络请求或者清除一些在 `componentDidMount()` 中创建的订阅操作。

You **should not call `setState()`** in `componentWillUnmount()` because the component will never be re-rendered. Once a component instance is unmounted, it will never be mounted again.

你 **不能在 `componentWillUnmount()`  中调用 `setState()`**，因为组件将永远不会再次被重新渲染。一旦一个组件实例被卸载，则永远不会被再次挂载。

* * *

### Rarely Used Lifecycle Methods {#rarely-used-lifecycle-methods}

The methods in this section correspond to uncommon use cases. They're handy once in a while, but most of your components probably don't need any of them. **You can see most of the methods below on [this lifecycle diagram](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) if you click the "Show less common lifecycles" checkbox at the top of it.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Use `shouldComponentUpdate()` to let React know if a component's output is not affected by the current change in state or props. The default behavior is to re-render on every state change, and in the vast majority of cases you should rely on the default behavior.

`shouldComponentUpdate()` is invoked before rendering when new props or state are being received. Defaults to `true`. This method is not called for the initial render or when `forceUpdate()` is used.

This method only exists as a **[performance optimization](https://reactjs.org/docs/optimizing-performance.html).** Do not rely on it to "prevent" a rendering, as this can lead to bugs. **Consider using the built-in [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent)** instead of writing `shouldComponentUpdate()` by hand. `PureComponent` performs a shallow comparison of props and state, and reduces the chance that you'll skip a necessary update.

If you are confident you want to write it by hand, you may compare `this.props` with `nextProps` and `this.state` with `nextState` and return `false` to tell React the update can be skipped. Note that returning `false` does not prevent child components from re-rendering when *their* state changes.

We do not recommend doing deep equality checks or using `JSON.stringify()` in `shouldComponentUpdate()`. It is very inefficient and will harm performance.

Currently, if `shouldComponentUpdate()` returns `false`, then [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), and [`componentDidUpdate()`](#componentdidupdate) will not be invoked. In the future React may treat `shouldComponentUpdate()` as a hint rather than a strict directive, and returning `false` may still result in a re-rendering of the component.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

`getDerivedStateFromProps` is invoked right before calling the render method, both on the initial mount and on subsequent updates. It should return an object to update the state, or null to update nothing.

This method exists for [rare use cases](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) where the state depends on changes in props over time. For example, it might be handy for implementing a `<Transition>` component that compares its previous and next children to decide which of them to animate in and out.

Deriving state leads to verbose code and makes your components difficult to think about.  
[Make sure you're familiar with simpler alternatives:](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.

* If you want to **re-compute some data only when a prop changes**, [use a memoization helper instead](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* If you want to **"reset" some state when a prop changes**, consider either making a component [fully controlled](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

This method doesn't have access to the component instance. If you'd like, you can reuse some code between `getDerivedStateFromProps()` and the other class methods by extracting pure functions of the component props and state outside the class definition.

Note that this method is fired on *every* render, regardless of the cause. This is in contrast to `UNSAFE_componentWillReceiveProps`, which only fires when the parent causes a re-render and not as a result of a local `setState`.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` is invoked right before the most recently rendered output is committed to e.g. the DOM. It enables your component to capture some information from the DOM (e.g. scroll position) before it is potentially changed. Any value returned by this lifecycle will be passed as a parameter to `componentDidUpdate()`.

This use case is not common, but it may occur in UIs like a chat thread that need to handle scroll position in a special way.

A snapshot value (or `null`) should be returned.

For example:

`embed:react-component-reference/get-snapshot-before-update.js`

In the above examples, it is important to read the `scrollHeight` property in `getSnapshotBeforeUpdate` because there may be delays between "render" phase lifecycles (like `render`) and "commit" phase lifecycles (like `getSnapshotBeforeUpdate` and `componentDidUpdate`).

* * *

### Error boundaries {#error-boundaries}

[Error boundaries](https://reactjs.org/docs/error-boundaries.html) are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

A class component becomes an error boundary if it defines either (or both) of the lifecycle methods `static getDerivedStateFromError()` or `componentDidCatch()`. Updating state from these lifecycles lets you capture an unhandled JavaScript error in the below tree and display a fallback UI.

Only use error boundaries for recovering from unexpected exceptions; **don't try to use them for control flow.**

For more details, see [*Error Handling in React 16*](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html).

> Note
> 
> Error boundaries only catch errors in the components **below** them in the tree. An error boundary can’t catch an error within itself.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

This lifecycle is invoked after an error has been thrown by a descendant component.
It receives the error that was thrown as a parameter and should return a value to update state.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Note
>
> `getDerivedStateFromError()` is called during the "render" phase, so side-effects are not permitted.
For those use cases, use `componentDidCatch()` instead.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

This lifecycle is invoked after an error has been thrown by a descendant component.
It receives two parameters:

1. `error` - The error that was thrown.
2. `info` - An object with a `componentStack` key containing [information about which component threw the error](https://reactjs.org/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` is called during the "commit" phase, so side-effects are permitted.
It should be used for things like logging errors:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

> Note
> 
> In the event of an error, you can render a fallback UI with `componentDidCatch()` by calling `setState`, but this will be deprecated in a future release.
> Use `static getDerivedStateFromError()` to handle fallback rendering instead.

* * *

### Legacy Lifecycle Methods {#legacy-lifecycle-methods}

The lifecycle methods below are marked as "legacy". They still work, but we don't recommend using them in the new code. You can learn more about migrating away from legacy lifecycle methods in [this blog post](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Note
>
> This lifecycle was previously named `componentWillMount`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillMount()` is invoked just before mounting occurs. It is called before `render()`, therefore calling `setState()` synchronously in this method will not trigger an extra rendering. Generally, we recommend using the `constructor()` instead for initializing state.

Avoid introducing any side-effects or subscriptions in this method. For those use cases, use `componentDidMount()` instead.

This is the only lifecycle method called on server rendering.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Note
>
> This lifecycle was previously named `componentWillReceiveProps`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

> Note:
>
> Using this lifecycle method often leads to bugs and inconsistencies
>
> * If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) lifecycle instead.
> * If you used `componentWillReceiveProps` for **re-computing some data only when a prop changes**, [use a memoization helper instead](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * If you used `componentWillReceiveProps` to **"reset" some state when a prop changes**, consider either making a component [fully controlled](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a `key`](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.
>
> For other use cases, [follow the recommendations in this blog post about derived state](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` is invoked before a mounted component receives new props. If you need to update the state in response to prop changes (for example, to reset it), you may compare `this.props` and `nextProps` and perform state transitions using `this.setState()` in this method.

Note that if a parent component causes your component to re-render, this method will be called even if props have not changed. Make sure to compare the current and next values if you only want to handle changes.

React doesn't call `UNSAFE_componentWillReceiveProps()` with initial props during [mounting](#mounting). It only calls this method if some of component's props may update. Calling `this.setState()` generally doesn't trigger `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Note
>
> This lifecycle was previously named `componentWillUpdate`. That name will continue to work until version 17. Use the [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) to automatically update your components.

`UNSAFE_componentWillUpdate()` is invoked just before rendering when new props or state are being received. Use this as an opportunity to perform preparation before an update occurs. This method is not called for the initial render.

Note that you cannot call `this.setState()` here; nor should you do anything else (e.g. dispatch a Redux action) that would trigger an update to a React component before `UNSAFE_componentWillUpdate()` returns.

Typically, this method can be replaced by `componentDidUpdate()`. If you were reading from the DOM in this method (e.g. to save a scroll position), you can move that logic to `getSnapshotBeforeUpdate()`.

> Note
>
> `UNSAFE_componentWillUpdate()` will not be invoked if [`shouldComponentUpdate()`](#shouldcomponentupdate) returns false.

* * *

## Other APIs {#other-apis-1}

Unlike the lifecycle methods above (which React calls for you), the methods below are the methods *you* can call from your components.

There are just two of them: `setState()` and `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater[, callback])
```

`setState()` enqueues changes to the component state and tells React that this component and its children need to be re-rendered with the updated state. This is the primary method you use to update the user interface in response to event handlers and server responses.

Think of `setState()` as a *request* rather than an immediate command to update the component. For better perceived performance, React may delay it, and then update several components in a single pass. React does not guarantee that the state changes are applied immediately.

`setState()` does not always immediately update the component. It may batch or defer the update until later. This makes reading `this.state` right after calling `setState()` a potential pitfall. Instead, use `componentDidUpdate` or a `setState` callback (`setState(updater, callback)`), either of which are guaranteed to fire after the update has been applied. If you need to set the state based on the previous state, read about the `updater` argument below.

`setState()` will always lead to a re-render unless `shouldComponentUpdate()` returns `false`. If mutable objects are being used and conditional rendering logic cannot be implemented in `shouldComponentUpdate()`, calling `setState()` only when the new state differs from the previous state will avoid unnecessary re-renders.

The first argument is an `updater` function with the signature:

```javascript
(state, props) => stateChange
```

`state` is a reference to the component state at the time the change is being applied. It should not be directly mutated. Instead, changes should be represented by building a new object based on the input from `state` and `props`. For instance, suppose we wanted to increment a value in state by `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Both `state` and `props` received by the updater function are guaranteed to be up-to-date. The output of the updater is shallowly merged with `state`.

The second parameter to `setState()` is an optional callback function that will be executed once `setState` is completed and the component is re-rendered. Generally we recommend using `componentDidUpdate()` for such logic instead.

You may optionally pass an object as the first argument to `setState()` instead of a function:

```javascript
setState(stateChange[, callback])
```

This performs a shallow merge of `stateChange` into the new state, e.g., to adjust a shopping cart item quantity:

```javascript
this.setState({quantity: 2})
```

This form of `setState()` is also asynchronous, and multiple calls during the same cycle may be batched together. For example, if you attempt to increment an item quantity more than once in the same cycle, that will result in the equivalent of:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Subsequent calls will override values from previous calls in the same cycle, so the quantity will only be incremented once. If the next state depends on the current state, we recommend using the updater function form, instead:

```js
this.setState((state) => {
  return {quantity: state.quantity + 1};
});
```

For more detail, see:

* [State and Lifecycle guide](https://reactjs.org/docs/state-and-lifecycle.html)
* [In depth: When and why are `setState()` calls batched?](https://stackoverflow.com/a/48610973/458193)
* [In depth: Why isn't `this.state` updated immediately?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

By default, when your component's state or props change, your component will re-render. If your `render()` method depends on some other data, you can tell React that the component needs re-rendering by calling `forceUpdate()`.

Calling `forceUpdate()` will cause `render()` to be called on the component, skipping `shouldComponentUpdate()`. This will trigger the normal lifecycle methods for child components, including the `shouldComponentUpdate()` method of each child. React will still only update the DOM if the markup changes.

Normally you should try to avoid all uses of `forceUpdate()` and only read from `this.props` and `this.state` in `render()`.

* * *

## Class Properties {#class-properties-1}

### `defaultProps` {#defaultprops}

`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for undefined props, but not for null props. For example:

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

If `props.color` is not provided, it will be set by default to `'blue'`:

```js
  render() {
    return <CustomButton /> ; // props.color will be set to blue
  }
```

If `props.color` is set to null, it will remain null:

```js
  render() {
    return <CustomButton color={null} /> ; // props.color will remain null
  }
```

* * *

### `displayName` {#displayname}

The `displayName` string is used in debugging messages. Usually, you don't need to set it explicitly because it's inferred from the name of the function or class that defines the component. You might want to set it explicitly if you want to display a different name for debugging purposes or when you create a higher-order component, see [Wrap the Display Name for Easy Debugging](https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) for details.

* * *

## Instance Properties {#instance-properties-1}

### `props` {#props}

`this.props` contains the props that were defined by the caller of this component. See [Components and Props](https://reactjs.org/docs/components-and-props.html) for an introduction to props.

In particular, `this.props.children` is a special prop, typically defined by the child tags in the JSX expression rather than in the tag itself.

### `state` {#state}

The state contains data specific to this component that may change over time. The state is user-defined, and it should be a plain JavaScript object.

If some value isn't used for rendering or data flow (for example, a timer ID), you don't have to put it in the state. Such values can be defined as fields on the component instance.

See [State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html) for more information about the state.

Never mutate `this.state` directly, as calling `setState()` afterwards may replace the mutation you made. Treat `this.state` as if it were immutable.