# Error Boundaries

In the past, JavaScript errors inside components used to corrupt React’s internal state and cause it to [emit](https://github.com/facebook/react/issues/4026) [cryptic](https://github.com/facebook/react/issues/6895) [errors](https://github.com/facebook/react/issues/8579) on next renders. These errors were always caused by an earlier error in the application code, but React did not provide a way to handle them gracefully in components, and could not recover from them.

在过去，在组建内的 JavaScript 错误通常会扰乱 React 的内部状态并导致在下一帧渲染的时候出现 [emit](https://github.com/facebook/react/issues/4026) [cryptic](https://github.com/facebook/react/issues/6895) [errors](https://github.com/facebook/react/issues/8579) 这三个错误。这些错误通常是由于在你看到这个错误之前的代码导致的，但 React 并没有提供一种可以优雅的在组件内处理这些错误的方式，因此也无法从这些错误中恢复过来。

## Introducing Error Boundaries

A JavaScript error in a part of the UI shouldn’t break the whole app. To solve this problem for React users, React 16 introduces a new concept of an “error boundary”.

UI 层面的 JavaScript 错误不应该导致整个应用程序崩溃。React 16 引入了一个新的概念叫 “错误边界” 来解决这种情况。

Error boundaries are React components that **catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI** instead of the component tree that crashed. Error boundaries catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them.

错误边界就是能够捕获它子节点中产生的 JavaScript 错误的 React 组件，可以用它来打印这些错误，把错误通过 UI 反馈给用户等，从而避免应用程序发生崩溃。错误边界能够在渲染时、生命周期函数中、或整个层级树中在它之下的组件的构造函数中捕获错误。

**Note**

Error boundaries do **not** catch errors for:

错误边界不能捕获到的错误包括：

- Event handlers (learn more)
>> 事件处理函数中的错误
- Asynchronous code (e.g. `setTimeout` or `requestAnimationFrame` callbacks)
>> 异步代码中的错误
- Server side rendering
>> 服务端渲染产生的错误
- Errors thrown in the error boundary itself (rather than its children)
>> 错误边界自己内部抛出的错误（而非它的子节点抛出的错误）

A class component becomes an error boundary if it defines either (or both) of the lifecycle methods [`static getDerivedStateFromError()`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromerror) or [`componentDidCatch()`](https://reactjs.org/docs/react-component.html#componentdidcatch). Use `static getDerivedStateFromError()` to render a fallback UI after an error has been thrown. Use `componentDidCatch()` to log error information.

一个类组件（非函数组件）如果需要变成错误边界组件，那就至少需要定义 [`static getDerivedStateFromError()`](https://reactjs.org/docs/react-component.html#static-getderivedstatefromerror) 或者 [`componentDidCatch()`](https://reactjs.org/docs/react-component.html#componentdidcatch) 方法之一（或者两者同时定义）。使用 `static getDerivedStateFromError()` 来将错误信息反馈到 UI 界面。使用 `componentDidCatch()` 来打印错误日志。

```js
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
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
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

Then you can use it as a regular component:

然后你可以像一般组件那样使用它：

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

Error boundaries work like a JavaScript `catch {}` block, but for components. Only class components can be error boundaries. In practice, most of the time you’ll want to declare an error boundary component once and use it throughout your application.

错误边界的工作模式就像JavaScript中的 `catch {}` 块，但是它是用于组件的。只有类组件（而非函数组件）才能成为错误边界组件。在实践中，大多数时候你可能只希望定义一次错误边界组件然后在整个应用中都可以用到它。 

Note that **error boundaries only catch errors in the components below them in the tree**. An error boundary can’t catch an error within itself. If an error boundary fails trying to render the error message, the error will propagate to the closest error boundary above it. This, too, is similar to how catch {} block works in JavaScript.

注意 **错误边界组件只会捕获层级树中在它之下的（即它的所有后代节点）组件抛出的错误**，它并不能捕获自己产生的错误。如果错误边界组件也产生了错误，则会传播到离它最近的上层错误组件，这和 JavaScript 中的 catch{} 块类似。

## Live Demo

Check out [this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) with [React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html).

点击这里查看 [React 16](https://reactjs.org/blog/2017/09/26/react-v16.0.html) 开发的[错误边界组件使用示例](https://codepen.io/gaearon/pen/wqvxGa?editors=0010)

## Where to Place Error Boundaries （哪些地方需要使用错误边界组件）

The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user, just like server-side frameworks often handle crashes. You may also wrap individual widgets in an error boundary to protect them from crashing the rest of the application.

错误边界组件的粒度完全取决于你。你可以用它来包装顶级路由组件以便将错误消息输出给用户，就像服务端渲染框架中经常处理崩溃的情况一样。你还可以用它来包装单独的小插件从而阻止插件产生的错误导致应用的其它部分一起崩溃。

## New Behavior for Uncaught Errors

This change has an important implication. **As of React 16, errors that were not caught by any error boundary will result in unmounting of the whole React component tree**.

下面的这种变化具有重要的意义，**因为自从 React 16 起，错误边界未捕获的错误将会导致整个 React 组件树被卸载**。

We debated this decision, but in our experience it is worse to leave corrupted UI in place than to completely remove it. For example, in a product like Messenger leaving the broken UI visible could lead to somebody sending a message to the wrong person. Similarly, it is worse for a payments app to display a wrong amount than to render nothing.

在做这样的决定前我们也有过讨论，但最终的结果是我认为把错误的 UI 显示在页面中还不如直接将它完全移除掉。例如，在发短信的应用中保留错误的 UI 可能导致用户将消息发给错误的人。类似的，在一些支付应用中完全不显示任何东西比显示错误的消息更好。

This change means that as you migrate to React 16, you will likely uncover existing crashes in your application that have been unnoticed before. Adding error boundaries lets you provide better user experience when something goes wrong.

这种改变意味着随着你将项目迁移到 React 16 之后，你会发现之前被 React 忽略的一些错误现在会导致系统崩溃。添加错误边界处理组件让你能在应用发生错误的时候为用户提供一个更好的用户体验。

For example, Facebook Messenger wraps content of the sidebar, the info panel, the conversation log, and the message input into separate error boundaries. If some component in one of these UI areas crashes, the rest of them remain interactive.

例如，Facebook Messenger 使用不同的错误边界组件将侧边栏的内容、消息面板、沟通记录、消息输入框等放在不同的错误边界组件中。

We also encourage you to use JS error reporting services (or build your own) so that you can learn about unhandled exceptions as they happen in production, and fix them.

## Component Stack Traces

React 16 prints all errors that occurred during rendering to the console in development, even if the application accidentally swallows them. In addition to the error message and the JavaScript stack, it also provides component stack traces. Now you can see where exactly in the component tree the failure has happened:

![](https://reactjs.org/static/error-boundaries-stack-trace-f1276837b03821b43358d44c14072945-71000.png)

You can also see the filenames and line numbers in the component stack trace. This works by default in [Create React App](https://github.com/facebookincubator/create-react-app) projects:

![](https://reactjs.org/static/error-boundaries-stack-trace-line-numbers-45611d4fdbd152829b28ae2348d6dcba-4e7a0.png)

If you don’t use Create React App, you can add [this plugin](https://www.npmjs.com/package/babel-plugin-transform-react-jsx-source) manually to your Babel configuration. Note that it’s intended only for development and **must be disabled in production**.

**Note**

Component names displayed in the stack traces depend on the [Function.name](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) property. If you support older browsers and devices which may not yet provide this natively (e.g. IE 11), consider including a `Function.name` polyfill in your bundled application, such as [function.name-polyfill](https://github.com/JamesMGreene/Function.name). Alternatively, you may explicitly set the [displayName](https://reactjs.org/docs/react-component.html#displayname) property on all your components.

## How About try/catch?

`try` / `catch` is great but it only works for imperative code:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

However, React components are declarative and specify what should be rendered:

```js
<Button />
```

Error boundaries preserve the declarative nature of React, and behave as you would expect. For example, even if an error occurs in a `componentDidUpdate` method caused by a `setState` somewhere deep in the tree, it will still correctly propagate to the closest error boundary.

## How About Event Handlers?

Error boundaries **do not** catch errors inside event handlers.

React doesn’t need error boundaries to recover from errors in event handlers. Unlike the render method and lifecycle methods, the event handlers don’t happen during rendering. So if they throw, React still knows what to display on the screen.

If you need to catch an error inside event handler, use the regular JavaScript `try` / `catch` statement:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Do something that could throw
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Caught an error.</h1>
    }
    return <div onClick={this.handleClick}>Click Me</div>
  }
}
```

Note that the above example is demonstrating regular JavaScript behavior and doesn’t use error boundaries.

## Naming Changes from React 15

React 15 included a very limited support for error boundaries under a different method name: `unstable_handleError`. This method no longer works, and you will need to change it to `componentDidCatch` in your code starting from the first 16 beta release.

For this change, we’ve provided a [codemod]
(https://github.com/reactjs/react-codemod#error-boundaries) to automatically migrate your code.









