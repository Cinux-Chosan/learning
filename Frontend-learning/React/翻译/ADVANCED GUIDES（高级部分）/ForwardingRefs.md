# Forwarding Refs （引用转发）

Ref forwarding is a technique for automatically passing a [ref](https://reactjs.org/docs/refs-and-the-dom.html) through a component to one of its children. This is typically not necessary for most components in the application. However, it can be useful for some kinds of components, especially in reusable component libraries. The most common scenarios are described below.

Ref 转发是一项通过组件自动向下传递 [ref（引用）](https://reactjs.org/docs/refs-and-the-dom.html) 的技术。虽然在大多数应用中可能都用不上这项技术，但是对于一些可重用组件库就特别有用。下面会叙述它的常用场景。

## Forwarding refs to DOM components

Consider a `FancyButton` component that renders the native `button` DOM element:

考虑一个 `FancyButton` 组件，它的作用是渲染一个原生的 DOM `button`：

```js
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```

React components hide their implementation details, including their rendered output. Other components using `FancyButton` **usually will not need to** [obtain a ref](https://reactjs.org/docs/refs-and-the-dom.html) to the inner `button` DOM element. This is good because it prevents components from relying on each other’s DOM structure too much.

React 组件对外隐藏了其内部实现，包括了它们的渲染输出。其他使用 `FancyButton` 的组件通常 **不需要** [获取其内部的 DOM 元素 `button` 的 ref（引用）](https://reactjs.org/docs/refs-and-the-dom.html)。

Although such encapsulation is desirable for application-level components like `FeedStory` or `Comment`, it can be inconvenient for highly reusable “leaf” components like `FancyButton` or `MyTextInput`. These components tend to be used throughout the application in a similar manner as a regular DOM `button` and `input`, and accessing their DOM nodes may be unavoidable for managing focus, selection, or animations.

尽管这种封装对于像 `FeedStory` 或者 `Comment` 这样应用级的组件来说是合情合理的，但是对于一些像 `FancyButton` 或者 `MyTextInput` 这样的末梢级组件来说就尤其不方便。这些组件希望能使用到像 `button` 或者 `input` 这样原生的 DOM 元素，因为它们需要通过这些原生的 DOM 元素来实现聚焦、选择、动画等。

**Ref forwarding is an opt-in feature that lets some components take a ref they receive, and pass it further down (in other words, “forward” it) to a child**.

**引用转发是一项可选特性，它的作用就是帮助那些收到引用的组件能够将引用向下传递得更远（换句话说，“转发”引用）**

In the example below, `FancyButton` uses `React.forwardRef` to obtain the `ref` passed to it, and then forward it to the DOM `button` that it renders:

在下面的例子中， `FancyButton` 使用 `React.forwardRef` 来获取传递给它的 `ref`，然后把 ref 传递（转发）给它渲染的 `button`。

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// You can now get a ref directly to the DOM button:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```

This way, components using `FancyButton` can get a ref to the underlying `button` DOM node and access it if necessary—just like if they used a DOM `button` directly.

通过这种方式，那些使用 `FancyButton` 的组件就能够获取到底层的 `button` DOM 元素节点，然后就可以像直接使用 `button` 元素那样去执行某些操作。

Here is a step-by-step explanation of what happens in the above example:

下面是上面示例的分步详解：

- We create a [React ref](https://reactjs.org/docs/refs-and-the-dom.html) by calling `React.createRef` and assign it to a `ref` variable.
>> 我们通过 `React.createRef` 创建了一个 [React ref](https://reactjs.org/docs/refs-and-the-dom.html)，并将它赋值给 `ref` 变量。
- We pass our `ref` down to `<FancyButton ref={ref}>` by specifying it as a JSX attribute.
>> 将 `ref` 传递给 `<FancyButton ref={ref}>`
- React passes the ref to the `(props, ref) => ...` function inside `forwardRef` as a second argument.
>> React 将 ref 传递给 `forwardRef` 中的 `(props, ref) => ...` 函数
- We forward this ref argument down to `<button ref={ref}>` by specifying it as a JSX attribute.
>> 我们吧 ref 参数转发给了 `<button ref={ref}>`
- When the ref is attached, `ref.current` will point to the `<button>` DOM node.
>> 当 ref 挂载成功时，`ref.current` 将会指向 `<button>` DOM 节点。

**Note**

The second `ref` argument only exists when you define a component with `React.forwardRef` call. Regular function or class components don’t receive the `ref` argument, and ref is not available in props either.

第二个 `ref` 参数只能在通过 `React.forwardRef` 创建的组件中访问。常规的函数组件或者类组件是接收不到 `ref` 参数的，并且 ref 也不能通过 props 来访问。

Ref forwarding is not limited to DOM components. You can forward refs to class component instances, too.

引用转发并不限制于 DOM 组件。你也可以用于类组件实例。

## Note for component library maintainers

**When you start using forwardRef in a component library, you should treat it as a breaking change and release a new major version of your library**. This is because your library likely has an observably different behavior (such as what refs get assigned to, and what types are exported), and this can break apps and other libraries that depend on the old behavior.

**当你准备在一个组件库中使用引用转发的时候，你应该把它当成一种突破性的变化，并且为该库发布一个新的主版本号**。因为你的库接下来的表现会有明显的不同（如 refs 被分配给了什么以及导出的类型会是什么等），并且这会破坏那些依赖于该库之前的表现行为的应用。

Conditionally applying `React.forwardRef` when it exists is also not recommended for the same reasons: it changes how your library behaves and can break your users’ apps when they upgrade React itself.

处于相同的原因，即便是 `React.forwardRef` 存在也不建议使用：它会改变你的库的表现行为并且当用户升级 React 的时候会破坏应用。

## Forwarding refs in [higher-order components](https://reactjs.org/docs/higher-order-components.html)
This technique can also be particularly useful with [higher-order components](https://reactjs.org/docs/higher-order-components.html) (also known as HOCs). Let’s start with an example HOC that logs component props to the console:

引用转发这项技术在[高阶组件](https://reactjs.org/docs/higher-order-components.html)（也被称为 HOC）中也非常有用。我们从一个输出日志组件 props 到控制台的高阶组件示例开始：

```js
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```

The “logProps” HOC passes all `props` through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our “fancy button” component:

这个例子中高阶组件 “logProps” 通过它内部封装的 logPorps 组件来传递所有的 `props`，因此渲染出来的结果是一样的。例如，我们可以使用这个高阶组件来输出所有传递给 "fancy button" 组件的属性：

```js
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Rather than exporting FancyButton, we export LogProps.
// It will render a FancyButton though.
export default logProps(FancyButton);
```

There is one caveat to the above example: refs will not get passed through. That’s because `ref` is not a `prop`. Like key, it’s handled differently by React. If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

上面的例子中有一个陷阱：refs 并不会被传递。因为 `ref` 不会存在 `props` 中。就像 `key` 这个属性一样，它们被 React 特殊对待。如果你给一个高阶组件添加 ref，该 ref 将会引用到最外层的容器组件，而不是包装在内的组件。 

This means that refs intended for our `FancyButton` component will actually be attached to the `LogProps` component:

这意味着我们希望用来引用 `FancyButton` 组件的 ref 实际上被关联到了 `logProps` 组件：

```js
import FancyButton from './FancyButton';

const ref = React.createRef();

// The FancyButton component we imported is the LogProps HOC.
// Even though the rendered output will be the same,
// Our ref will point to LogProps instead of the inner FancyButton component!
// This means we can't call e.g. ref.current.focus()
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;
```

Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. `React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. For example:

幸运的是，我们可以使用 `React.forwardRef` API 来显式的将 ref 转发给内部的 `FancyButton` 组件。`React.forwardRef` 接收一个方法，该方法能够接收 `props` 和 `ref` 参数并且返回 React 元素。例如：

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

## Displaying a custom name in DevTools

`React.forwardRef` accepts a render function. React DevTools uses this function to determine what to display for the ref forwarding component.

`React.forwardRef` 接收的是一个渲染函数。React DevTools 会使用该函数来确定如何展示引用转发组件。

For example, the following component will appear as ”ForwardRef” in the DevTools:

例如，以下组件将在 DevTools 中显示为 “ForwardRef”：

```js
const WrappedComponent = React.forwardRef((props, ref) => {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

If you name the render function, DevTools will also include its name (e.g. ”ForwardRef(myFunction)”):

如果你给这个函数起一个名字，则 DevTools 也会收录它的名字 (如： `ForwardRef(myFunction)`)

```js
const WrappedComponent = React.forwardRef(
  function myFunction(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }
);
```

You can even set the function’s `displayName` property to include the component you’re wrapping:

你甚至可以通过设置该函数的 `displayName` 属性来在 DevTools 中收录你封装的组件：

```js
function logProps(Component) {
  class LogProps extends React.Component {
    // ...
  }     

  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // Give this component a more helpful display name in DevTools.
  // e.g. "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
```