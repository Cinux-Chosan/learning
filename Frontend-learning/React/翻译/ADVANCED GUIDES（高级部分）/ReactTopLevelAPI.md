<base href="https://reactjs.org/" />

---
id: react-api
title: React Top-Level API
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---


`React` is the entry point to the React library. If you load React from a `<script>` tag, these top-level APIs are available on the `React` global. If you use ES6 with npm, you can write `import React from 'react'`. If you use ES5 with npm, you can write `var React = require('react')`.

`React` 是 React 库的入口。如果通过 `<script>` 标签来加载的 React，则这些顶级 API 可以通过全局变量 `React` 进行访问。在 npm 中，ES 6 使用 `import React from 'react'`，ES 5 使用`var React = require('react')`。

## Overview {#overview}

### Components {#components}

React components let you split the UI into independent, reusable pieces, and think about each piece in isolation. React components can be defined by subclassing `React.Component` or `React.PureComponent`.

React 组件让你可以把 UI 分成独立的、可复用的片段，并且可以对它们进行独立的思考。React 组件可以通过 `React.Component` 或者 `React.PureComponent` 的子类来定义。

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

If you don't use ES6 classes, you may use the `create-react-class` module instead. See [Using React without ES6](https://reactjs.org/docs/react-without-es6.html) for more information.

如果你没有使用 ES 6 的类，你可以使用 `create-react-class` 模块来取代。参考 [Using React without ES6](https://reactjs.org/docs/react-without-es6.html)。 

React components can also be defined as functions which can be wrapped:

React 组件也可以通过封装在 `React.memo` 中的函数来定义：

- [`React.memo`](#reactmemo)

### Creating React Elements {#creating-react-elements}

We recommend [using JSX](https://reactjs.org/docs/introducing-jsx.html) to describe what your UI should look like. Each JSX element is just syntactic sugar for calling [`React.createElement()`](#createelement). You will not typically invoke the following methods directly if you are using JSX.

我们建议使用 [using JSX](https://reactjs.org/docs/introducing-jsx.html) 来编写 UI。每个 JSX 元素实际上是 [`React.createElement()`](#createelement) 的语法糖。如果你使用 JSX，那你一般不会自己来调用下面这两个函数。

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

See [Using React without JSX](https://reactjs.org/docs/react-without-jsx.html) for more information.

### Transforming Elements {#transforming-elements}

`React` provides several APIs for manipulating elements:

`React` 提供了一些操作元素的 API：

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)


### Fragments {#fragments}

`React` also provides a component for rendering multiple elements without a wrapper.

`React` 也提供了一个可以渲染多个元素而不用容器包装它们的组件：

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

Suspense lets components "wait" for something before rendering. Today, Suspense only supports one use case: [loading components dynamically with `React.lazy`](https://reactjs.org/docs/code-splitting.html#reactlazy). In the future, it will support other use cases like data fetching.

Suspense 可以让组件在渲染之前进行 “等待”。目前，Suspense仅支持一种使用场景：[使用 `React.lazy` 动态加载组件](https://reactjs.org/docs/code-splitting.html#reactlazy)。未来，它会支持更多其它使用场景，如数据的异步获取。

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class. Hooks have a [dedicated docs section](https://reactjs.org/docs/hooks-intro.html) and a separate API reference:

*Hooks* 是在 React 16.8 中添加的新特性。它们可以让你在不编写类的时候使用 state 和其他 React 特性。Hooks 有[专门的文档](https://reactjs.org/docs/hooks-intro.html) 和 API 参考。

- [Basic Hooks](https://reactjs.org/docs/hooks-reference.html#basic-hooks)
  - [`useState`](https://reactjs.org/docs/hooks-reference.html#usestate)
  - [`useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect)
  - [`useContext`](https://reactjs.org/docs/hooks-reference.html#usecontext)
- [Additional Hooks](https://reactjs.org/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](https://reactjs.org/docs/hooks-reference.html#usereducer)
  - [`useCallback`](https://reactjs.org/docs/hooks-reference.html#usecallback)
  - [`useMemo`](https://reactjs.org/docs/hooks-reference.html#usememo)
  - [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](https://reactjs.org/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](https://reactjs.org/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](https://reactjs.org/docs/hooks-reference.html#usedebugvalue)

* * *

## Reference {#reference}

### `React.Component` {#reactcomponent}

`React.Component` is the base class for React components when they are defined using [ES6 classes](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

`React.Component` 是 React 组件的基类。

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

See the [React.Component API Reference](https://reactjs.org/docs/react-component.html) for a list of methods and properties related to the base `React.Component` class.

参考 [React.Component API Reference](https://reactjs.org/docs/react-component.html) 了解与 `React.Component` 相关的方法和属性。 

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` is similar to [`React.Component`](#reactcomponent). The difference between them is that [`React.Component`](#reactcomponent) doesn't implement [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate), but `React.PureComponent` implements it with a shallow prop and state comparison. 

`React.PureComponent` 和 [`React.Component`] 颇为类似。不同点在于 `React.Component` 没有实现 [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate)，但是 `React.PureComponent` 则通过对 prop 和 state 进行浅对比来实现了它。

If your React component's `render()` function renders the same result given the same props and state, you can use `React.PureComponent` for a performance boost in some cases.

如果 React component 中的 `render()` 函数在给定相同 props 和 state 的情况下渲染出的内容也相同，则在某些情况下你可以使用 `React.PureComponent` 来提高性能。

> Note
>
> `React.PureComponent`'s `shouldComponentUpdate()` only shallowly compares the objects. If these contain complex data structures, it may produce false-negatives for deeper differences. Only extend `PureComponent` when you expect to have simple props and state, or use [`forceUpdate()`](https://reactjs.org/docs/react-component.html#forceupdate) when you know deep data structures have changed. Or, consider using [immutable objects](https://facebook.github.io/immutable-js/) to facilitate fast comparisons of nested data.
>
> `React.PureComponent` 中的 `shouldComponentUpdate()` 只会对对象进行浅对比。如果对象中包含了复杂的数据结构，则该方法可能返回 false，但实际上这是错误的（即：false-negatives）。只有当你使用简单的 props 和 state 时使用 `PureComponent`，或者在你知道深层次的数据结构发生了改变的时候使用 [`forceUpdate()`](https://reactjs.org/docs/react-component.html#forceupdate) 来更新 UI，或者考虑使用  [immutable objects](https://facebook.github.io/immutable-js/) 来促进对嵌套数据的快速比较。
>
> Furthermore, `React.PureComponent`'s `shouldComponentUpdate()` skips prop updates for the whole component subtree. Make sure all the children components are also "pure".
>
> 此外，`React.PureComponent` 中的 `shouldComponentUpdate()` 会跳过对整个组件子树属性的更新，因此你需要确保所有子组件也是 `pure` 的。

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});
```

`React.memo` is a [higher order component](https://reactjs.org/docs/higher-order-components.html). It's similar to [`React.PureComponent`](#reactpurecomponent) but for function components instead of classes.

`React.memo` 是一个 [高阶组件](https://reactjs.org/docs/higher-order-components.html)。它类似于 [`React.PureComponent`](#reactpurecomponent)，不过它是用在函数组件上而非类组件。

If your function component renders the same result given the same props, you can wrap it in a call to `React.memo` for a performance boost in some cases by memoizing the result. This means that React will skip rendering the component, and reuse the last rendered result.

如果你的**函数组件**在给定 props 的情况下渲染出相同的内容，则在某些情况下你可以将其封装在 `React.memo` 中来提高性能，它可以缓存和记住渲染的结果。这就意味着 React 将会重用最新一次的渲染结果从而跳过对该组件的渲染。

By default it will only shallowly compare complex objects in the props object. If you want control over the comparison, you can also provide a custom comparison function as the second argument.

默认情况下它只会对 props 中复杂的对象执行浅对比。如果你希望对比较的过程进行控制，你可以提供一个自定义 props 比较函数作为它的第二个参数。

```javascript
function MyComponent(props) {
  /* render using props */
}
function areEqual(prevProps, nextProps) {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}
export default React.memo(MyComponent, areEqual);
```

This method only exists as a **[performance optimization](https://reactjs.org/docs/optimizing-performance.html).** Do not rely on it to "prevent" a render, as this can lead to bugs.

该方法只能用于[性能优化]((https://reactjs.org/docs/optimizing-performance.html))，不能用它来阻止渲染，因为这样做可能会导致 bug。

> Note
>
> Unlike the [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) method on class components, the `areEqual` function returns `true` if the props are equal and `false` if the props are not equal. This is the inverse from `shouldComponentUpdate`.
>
> 与类组件的 [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) 不同的是，`React.memo` 的第二个参数 `areEqual` 函数返回 `true` 代表两个属性相等，返回 `false` 代表不相等，它和 `shouldComponentUpdate` 相反。

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Create and return a new [React element](https://reactjs.org/docs/rendering-elements.html) of the given type. The type argument can be either a tag name string (such as `'div'` or `'span'`), a [React component](https://reactjs.org/docs/components-and-props.html) type (a class or a function), or a [React fragment](#reactfragment) type.

该方法创建并返回一个指定类型的新的 [React 元素](https://reactjs.org/docs/rendering-elements.html)。类型参数可以是一个字符串类型的标签名，一个 [React 组件](https://reactjs.org/docs/components-and-props.html) 类型（一个类或者函数），或者 [React fragment](#reactfragment) 类型。

Code written with [JSX](https://reactjs.org/docs/introducing-jsx.html) will be converted to use `React.createElement()`. You will not typically invoke `React.createElement()` directly if you are using JSX. See [React Without JSX](https://reactjs.org/docs/react-without-jsx.html) to learn more.

使用 [JSX](https://reactjs.org/docs/introducing-jsx.html) 编写的代码会被转换成使用 `React.createElement()` 的 JavaScript 代码。使用 JSX 并不需要你直接调用 `React.createElement()`。你也可以参考 [不在 React 中使用 JSX](https://reactjs.org/docs/react-without-jsx.html)

* * *

### `cloneElement()` {#cloneelement}

```
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Clone and return a new React element using `element` as the starting point. The resulting element will have the original element's props with the new props merged in shallowly. New children will replace existing children. `key` and `ref` from the original element will be preserved.

该方法根据 `element` 克隆一个 React 元素并返回。新的元素获得的 props 是根据原来元素的 props 和新 props 浅合并的一个结果。新的子元素会替代已经存在的子元素。原来的元素的 `key` 和 `ref` 将会被保留。

`React.cloneElement()` is almost equivalent to:

`React.cloneElement()` 等同于：

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

However, it also preserves `ref`s. This means that if you get a child with a `ref` on it, you won't accidentally steal it from your ancestor. You will get the same `ref` attached to your new element.

然而，它保留了 `ref`。这意味着如果你有一个带有 `ref` 的子元素，你不会从你的祖先元素那里意外的获取到它（这里暂时还没明白）。

This API was introduced as a replacement of the deprecated `React.addons.cloneWithProps()`.

该 API 作为已废弃的 `React.addons.cloneWithProps()` 的替代方法。

* * *

### `createFactory()` {#createfactory}

***请使用 `React.createElement()` 来代替该函数。***

```javascript
React.createFactory(type)
```

Return a function that produces React elements of a given type. Like [`React.createElement()`](#createElement), the type argument can be either a tag name string (such as `'div'` or `'span'`), a [React component](https://reactjs.org/docs/components-and-props.html) type (a class or a function), or a [React fragment](#reactfragment) type.

This helper is considered legacy, and we encourage you to either use JSX or use `React.createElement()` directly instead.

You will not typically invoke `React.createFactory()` directly if you are using JSX. See [React Without JSX](https://reactjs.org/docs/react-without-jsx.html) to learn more.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Verifies the object is a React element. Returns `true` or `false`.

校验给定的对象是否是一个 React 元素。返回 `true` 或者 `false`。

* * *

### `React.Children` {#reactchildren}

`React.Children` provides utilities for dealing with the `this.props.children` opaque data structure.

`React.Children` 提供了一套工具函数用来处理 `this.props.children`。

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Invokes a function on every immediate child contained within `children` with `this` set to `thisArg`. If `children` is an array it will be traversed and the function will be called for each child in the array. If children is `null` or `undefined`, this method will return `null` or `undefined` rather than an array.

> Note
>
> If `children` is a `Fragment` it will be treated as a single child and not traversed.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Like [`React.Children.map()`](#reactchildrenmap) but does not return an array.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Returns the total number of components in `children`, equal to the number of times that a callback passed to `map` or `forEach` would be invoked.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Verifies that `children` has only one child (a React element) and returns it. Otherwise this method throws an error.

> Note:
>
>`React.Children.only()` does not accept the return value of [`React.Children.map()`](#reactchildrenmap) because it is an array rather than a React element.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Returns the `children` opaque data structure as a flat array with keys assigned to each child. Useful if you want to manipulate collections of children in your render methods, especially if you want to reorder or slice `this.props.children` before passing it down.

> Note:
>
> `React.Children.toArray()` changes keys to preserve the semantics of nested arrays when flattening lists of children. That is, `toArray` prefixes each key in the returned array so that each element's key is scoped to the input array containing it.

* * *

### `React.Fragment` {#reactfragment}

The `React.Fragment` component lets you return multiple elements in a `render()` method without creating an additional DOM element:

`React.Fragment` 组件使得你可以在 `render()` 中一次性返回多个元素而不用将它们封装在一个容器元素里：

```javascript
render() {
  return (
    <React.Fragment>
      Some text.
      <h2>A heading</h2>
    </React.Fragment>
  );
}
```

You can also use it with the shorthand `<></>` syntax. For more information, see [React v16.2.0: Improved Support for Fragments](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html).

你可以使用 `<></>` 这种简写语法。参考 [React v16.2.0: Improved Support for Fragments](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html)

### `React.createRef` {#reactcreateref}

`React.createRef` creates a [ref](https://reactjs.org/docs/refs-and-the-dom.html) that can be attached to React elements via the ref attribute.
`embed:16-3-release-blog-post/create-ref-example.js`

`React.createRef` 创建一个 [ref](https://reactjs.org/docs/refs-and-the-dom.html) ，它用于通过组件的 ref 属性来关联 React 元素。

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` creates a React component that forwards the [ref](https://reactjs.org/docs/refs-and-the-dom.html) attribute it receives to another component below in the tree. This technique is not very common but is particularly useful in two scenarios:

`React.forwardRef` 创建一个 React 组件，该组件将它从 [ref](https://reactjs.org/docs/refs-and-the-dom.html) 属性接收到的引用转发给它内部的元素（子元素）。该方法虽然不是太常用，但在下面两张情况下却非常有用：

* [Forwarding refs to DOM components](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)（将 ref 转发给 DOM 组件）
* [Forwarding refs in higher-order-components](https://reactjs.org/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)（在高阶组件中转发 ref）

`React.forwardRef` accepts a rendering function as an argument. React will call this function with `props` and `ref` as two arguments. This function should return a React node.

`React.forwardRef` 接收一个用于渲染的函数作为参数。React 将会使用 `props` 和 `ref` 作为参数来调用该方法。该返回应该返回一个 React 节点。

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

In the above example, React passes a `ref` given to `<FancyButton ref={ref}>` element as a second argument to the rendering function inside the `React.forwardRef` call. This rendering function passes the `ref` to the `<button ref={ref}>` element.

上面的例子中， React 将 `<FancyButton ref={ref}>` 中给定的 ref 作为第二个参数传递给 `React.forwardRef` 中的渲染函数。该渲染函数将 `ref` 转发给 `<button ref={ref}>`。

As a result, after React attaches the ref, `ref.current` will point directly to the `<button>` DOM element instance.

最终结果就是，在 React 关联 ref 之后，`ref.current` 将会直接指向DOM 元素 `<button>` 的实例。

For more information, see [forwarding refs](https://reactjs.org/docs/forwarding-refs.html).

详情请参考 [forwarding refs](https://reactjs.org/docs/forwarding-refs.html)。

### `React.lazy` {#reactlazy}

`React.lazy()` lets you define a component that is loaded dynamically. This helps reduce the bundle size to delay loading components that aren't used during the initial render.

`React.lazy()` 让你可以定义动态加载的组件。它可以减小页面首次渲染的文件体积。

You can learn how to use it from our [code splitting documentation](https://reactjs.org/docs/code-splitting.html#reactlazy). You might also want to check out [this article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) explaining how to use it in more detail.

你可以从 [code splitting documentation](https://reactjs.org/docs/code-splitting.html#reactlazy) 学习如何使用它。你也可以查看[这篇文章](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) 以了解更详细的使用方法。

```js
// This component is loaded dynamically
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Note that rendering `lazy` components requires that there's a `<React.Suspense>` component higher in the rendering tree. This is how you specify a loading indicator.

注意使用 `lazy` 组件时需要在其上层出现 `<React.Suspense>` 组件。这是指定加载指示器的方式。

> **Note**
>
> Using `React.lazy` with dynamic import requires Promises to be available in the JS environment. This requires a polyfill on IE11 and below.
>
> 使用 `React.lazy` 动态引入的方式需要当前的 JS 环境支持 Promise。在 IE 11 及其以下的版本需要使用 polyfill 来支持。

### `React.Suspense` {#reactsuspense}

`React.Suspense` let you specify the loading indicator in case some components in the tree below it are not yet ready to render. Today, lazy loading components is the **only** use case supported by `<React.Suspense>`:

`React.Suspense` 可以让你指定当它之下的组件还没准备好渲染的时候所要显示的内容。目前，lazy 组件是 `<React.Suspense>` **唯一**支持的使用场景。

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Displays <Spinner> until OtherComponent loads
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

It is documented in our [code splitting guide](https://reactjs.org/docs/code-splitting.html#reactlazy). Note that `lazy` components can be deep inside the `Suspense` tree -- it doesn't have to wrap every one of them. The best practice is to place `<Suspense>` where you want to see a loading indicator, but to use `lazy()` wherever you want to do code splitting.

[代码分割](https://reactjs.org/docs/code-splitting.html#reactlazy) 部分的文档中有说明。注意 `lazy` 组件可以放在 `Suspense` 之下更深的层级中 ——  并不需要对其中的每一个 `lazy` 进行封装。最佳方式就是将 `<Suspense>` 放在你希望看到加载提示的地方，而 `lazy()` 放在你需要做代码分割的地方。

While this is not supported today, in the future we plan to let `Suspense` handle more scenarios such as data fetching. You can read about this in [our roadmap](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html).

尽管目前还不支持很多功能，不过在未来我们计划让 `Suspense` 可以处理如异步数据获取等更多的场景，你可以在这里查看[我们的规划]((https://reactjs.org/blog/2018/11/27/react-16-roadmap.html))

>Note:
>
>`React.lazy()` and `<React.Suspense>` are not yet supported by `ReactDOMServer`. This is a known limitation that will be resolved in the future.
>
> `React.lazy()` 和 `<React.Suspense>` 现在还不支持 `ReactDOMServer`。。我们会在将来解决这个问题。