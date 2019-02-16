# Render Props

The term [“render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) refers to a technique for sharing code between React components using a prop whose value is a function.

[“render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) 指使用其值为函数的属性来在组件中共享代码的技术（实际上就是给组件传递一个能够返回渲染内容的函数）。

A component with a render prop takes a function that returns a React element and calls it instead of implementing its own render logic.

render prop 使用能够返回 React 元素的函数来作为组件渲染内容的一部分。

```js
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

Libraries that use render props include [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) and [Downshift](https://github.com/paypal/downshift).

使用 render 属性的库包括 [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) 和 [Downshift](https://github.com/paypal/downshift)。

In this document, we’ll discuss why render props are useful, and how to write your own.

在当前文档中，我们会讨论 render 属性有哪些用以及如何使用它。

### Use Render Props for Cross-Cutting Concerns

Components are the primary unit of code reuse in React, but it’s not always obvious how to share the state or behavior that one component encapsulates to other components that need that same state.

组件是 React 中重用代码的主要单元，但在一个组件包裹另一个组件并且它们需要用到某些相同状态的情况下，要区分如何共享状态和行为并不是一件简单的事情。

For example, the following component tracks the mouse position in a web app:

例如，下面的组件能跟踪鼠标位置：

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Move the mouse around!</h1>
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

As the cursor moves around the screen, the component displays its (x, y) coordinates in a `<p>`.

当光标在屏幕上移动时，组件会在 `<p>` 中展示它的 (x, y) 坐标。

Now the question is: How can we reuse this behavior in another component? In other words, if another component needs to know about the cursor position, can we encapsulate that behavior so that we can easily share it with that component?

但现在的问题是：我们要怎样在其他组件中重用该行为？换句话说，如果另一个组件也需要知道光标的位置，我们能否将这种行为进行封装以便可以共享到其他组件中去。

Since components are the basic unit of code reuse in React, let’s try refactoring the code a bit to use a `<Mouse>` component that encapsulates the behavior we need to reuse elsewhere.

由于组件是 React 中重用代码的最小单元，让我们对代码进行重构，使用一个名为 `<Mouse>` 的组件来对这种行为进行封装，以便能够在其它地方使用。

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/* ...but how do we render something other than a <p>? */}
        <p>The current mouse position is ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse />
      </div>
    );
  }
}
```

Now the `<Mouse>` component encapsulates all behavior associated with listening for `mousemove` events and storing the (x, y) position of the cursor, but it’s not yet truly reusable.

现在，`<Mouse>` 组件封装了监听`mousemove` 事件和存储光标 （x, y） 位置的所有行为，但它还不是真正的可重用。

For example, let’s say we have a `<Cat>` component that renders the image of a cat chasing the mouse around the screen. We might use a `<Cat mouse={{ x, y }}>` prop to tell the component the coordinates of the mouse so it knows where to position the image on the screen.

例如，假如我们有一个 `<Cat>` 组件来根据鼠标在屏幕上的位置来渲染一幅猫的图像。我们可以通过 `<Cat mouse={{ x, y }}>` 的方式来告诉组件鼠标的位置，组件通过该位置在屏幕上渲染图片。

As a first pass, you might try rendering the `<Cat>` inside `<Mouse>`’s render method, like this:

第一关，你需要像下面这样把 `<Cat>` 放到 `<Mouse>` 的 render 方法中：

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          We could just swap out the <p> for a <Cat> here ... but then
          we would need to create a separate <MouseWithSomethingElse>
          component every time we need to use it, so <MouseWithCat>
          isn't really reusable yet.
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

This approach will work for our specific use case, but we haven’t achieved the objective of truly encapsulating the behavior in a reusable way. Now, every time we want the mouse position for a different use case, we have to create a new component (i.e. essentially another `<MouseWithCat>`) that renders something specifically for that use case.

这种方式在我们当前特定的使用场景中奏效，但我们还没有真正达到以可重用的方式对行为进行封装的这一目标。目前，每次我们希望在其他使用场景中获取鼠标的位置时，我们不得不创建一个新的组件（如`<MouseWithCat>`）来渲染其他特定使用场景的内容。

Here’s where the render prop comes in: Instead of hard-coding a `<Cat>` inside a `<Mouse>` component, and effectively changing its rendered output, we can provide `<Mouse>` with a function prop that it uses to dynamically determine what to render–a render prop.

这就是 render 属性的来历：为了取代将 `<Cat>` 硬编码进 `<Mouse>` 组件，并且通过为 `<Mouse>` 提供一个名为 render 的函数属性来动态的决定以及高效的修改所要渲染的内容。

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    ); 
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Now, instead of effectively cloning the `<Mouse>` component and hard-coding something else in its `render` method to solve for a specific use case, we provide a `render` prop that `<Mouse>` can use to dynamically determine what it renders.

现在，比起之前需要通过拷贝 `<Mouse>` 组件以及在其 `render` 方法中硬编码的方式来满足特定的使用场景的做法，我们现在给 `<Mouse>` 提供了一个 `render` prop 以便能够让我们动态决定它需要渲染的内容。

More concretely, **a render prop is a function prop that a component uses to know what to render**.

更具体的来说，**render prop 实际上就是一个函数，组件可以用它来渲染自己的内容**（与 slot 和 yield 有异曲同工之妙）。

This technique makes the behavior that we need to share extremely portable. To get that behavior, render a `<Mouse>` with a `render` prop that tells it what to render with the current (x, y) of the cursor.

这项技术使得我们对行为的共享变得非常方便。只需要在渲染 `<Mouse>` 的时候使用 `render` prop 来告诉该组件要渲染的内容就可以达到目的。

One interesting thing to note about render props is that you can implement [most higher-order components](https://reactjs.org/docs/higher-order-components.html) (HOC) using a regular component with a render prop. For example, if you would prefer to have a `withMouse` HOC instead of a `<Mouse>` component, you could easily create one using a regular `<Mouse>` with a render prop:

有趣的是，你可以使用一个普通的组件加一个 render prop 来实现大多数 [高阶组件](https://reactjs.org/docs/higher-order-components.html) 。例如你更喜欢用一个叫 `withMouse` 的高阶组件来代替 `<Mouse>` 组件，你可以使用 `<Mouse>` 和 render prop 轻松的达到这个目的。

```js
// If you really want a HOC for some reason, you can easily
// create one using a regular component with a render prop!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

So using a render prop makes it possible to use either pattern.

因此 render prop 使得你可以选择这两者方式的任一种模式。

### Using Props Other Than render

It’s important to remember that just because the pattern is called “render props” you don’t have to use a prop named render to use this pattern. In fact, [any prop that is a function that a component uses to know what to render is technically a “render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

请记住很重要的一点，你并没有必要因为该模式被称作 "render props" 而使用一个叫 render 的属性名来使用这种模式。实际上，[任何使用函数来告诉组件需要渲染的内容的方式都称作 “render prop”](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)

Although the examples above use `render`, we could just as easily use the `children` prop!

尽管之前的例子全部都使用 `render`，实际上我们也可以使用 `children` 来代替。

```js
<Mouse children={mouse => (
  <p>The mouse position is {mouse.x}, {mouse.y}</p>
)}/>
```

And remember, the `children` prop doesn’t actually need to be named in the list of “attributes” in your JSX element. Instead, you can put it directly inside the element!

记住，`children` 属性实际上并不需要在 JSX 元素中的属性列表中声明，你可以直接把它放到元素内部（即放到标签内）。

```js
<Mouse>
  {mouse => (
    <p>The mouse position is {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

You’ll see this technique used in the [react-motion](https://github.com/chenglou/react-motion) API.

你将在 [react-motion](https://github.com/chenglou/react-motion) API 看到此技术的应用。

Since this technique is a little unusual, you’ll probably want to explicitly state that `children` should be a function in your `propTypes` when designing an API like this.

由于这项技术的特殊性，你可能希望在设计这种 API 的时候就通过 `propTypes` 来显示指定 `children` 应该是一个函数。

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```

## Caveats

### Be careful when using Render Props with React.PureComponent（render prop 配合 React.PureComponent 使用时要小心）

Using a render prop can negate the advantage that comes from using [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) if you create the function inside a `render` method. This is because the shallow prop comparison will always return `false` for new props, and each `render` in this case will generate a new value for the render prop.

如果给 `render` 属性传递的是一个内联函数，则会消除 [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent) 带来的好处。因为每次 `render` 都会创建一个新的函数，从而每次 `React.PureComponent` 进行属性的浅对比时都会返回 `false`;

For example, continuing with our `<Mouse>` component from above, if `Mouse` were to extend `React.PureComponent` instead of `React.Component`, our example would look like this:

例如，继续用上面的 `<Mouse>` 来举例，如果 `Mouse` 继承自 `React.PureComponent` 而非 `React.Component`，就想下面这样：

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>

        {/*
          This is bad! The value of the `render` prop will
          be different on each render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

In this example, each time `<MouseTracker>` renders, it generates a new function as the value of the `<Mouse render>` prop, thus negating the effect of `<Mouse>` extending `React.PureComponent` in the first place!

这个例子中，每次 `<MouseTracker>` 渲染的时候，它都会创建一个新的函数作为 `<Mouse render>` 属性的值，从而消除了 `<Mouse>` 从 `React.PureComponent` 那儿获得的优势。

To get around this problem, you can sometimes define the prop as an instance method, like so:

你可以把该属性定义为实例方法来避免这个问题：

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Move the mouse around!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

In cases where you cannot define the prop statically (e.g. because you need to close over the component’s props and/or state) `<Mouse>` should extend `React.Component` instead.

在你出于某些原因不能这么做的时候，你还是使用 `React.Component` 吧。