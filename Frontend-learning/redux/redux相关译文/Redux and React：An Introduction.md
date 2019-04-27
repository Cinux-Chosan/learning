# [Redux and React: An Introduction](http://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/)

In this post I’m going to briefly explain what [redux](https://github.com/reactjs/redux/) is, all of the basic elements, and how to set up a React project with redux as your data storage / flow solution using [react-redux](https://github.com/reactjs/react-redux/). You will need some prior knowledge of React; JSX, state, props, context; and ES6 syntax, and classes.

我打算在这篇文章中简要的介绍一下什么是 [redux](https://github.com/reactjs/redux/)、它所有的基本元素以及如何结合 [react-redux](https://github.com/reactjs/react-redux/) 来配置一个用 Redux 作为数据存储/流动解决方案的 React 项目。

## What We’ll Cover 【本文会覆盖以下知识点】

- [什么是 redux](#what-is-redux什么是-redux)
- [Action](#actions)
- [Action 生成器](#action-creators-action-制造机)
- [Reducers](#reducers)
- [创建一个 store](#creating-a-store-创建一个-store)
- [Store 中的方法](#store-methods-store-中的方法)
  - [getState](#getstate)
  - [dispatch](#dispatch)
- [合并 reducer](#combining-reducers-合并-reducer)
- [Provider](#provider)
- [关联组件](#connecting-a-component-关联到组件)
  - [mapStateToProps](#mapstatetoprops)
  - [mapDispatchToProps](#mapdispatchtoprops)

## What is redux？【什么是 redux】

Redux is a [flux](https://facebook.github.io/flux/docs/in-depth-overview.html) based state container for handling javascript application state. It is a popular choice for storing application state mainly due to its three defining principles:

Redux 是一个基于 [flux](https://facebook.github.io/flux/docs/in-depth-overview.html) 的用于处理 JavaScript 应用程序状态的一个状态容器。它之所以在存储应用状态方面如此流行主要是因为它的以下三原则：

- A single object tree stores all of your application state

> 所有应用状态数据都只存放在一个对象中

- State is readonly and changes are triggered by actions

> state 是只读的，只会通过触发 action 来改变

- The state can only be manipulated by pure functions that are triggered by your actions
You can read a bit more about redux [here](https://redux.js.org/docs/introduction/).

> 操作 state 的只能是被 action 触发的纯函数。你可以到 [这里](https://redux.js.org/docs/introduction/) 了解更多关于 redux 的内容。

## Actions

An action is simply an object that describes a change you want to make to your state. These are somewhat similar to event objects.

Action 就是一个描述如何修改 state 的对象。它在某种程度上和事件对象有点相似。

A standard pattern for actions is the following structure:

一个标准的 action 结构如下：

```js
const action = {
  type: 'ACTION_TYPE',
  payload: 'Some data'
};
```

This is the structure we’ll use to describe all of our actions in this post as it keeps our actions very consistent.

当前文章所有的 action 都会使用这个结构，因为它使得我们的 action 结构非常一致。

The type is similar to an event type and is required for all actions, and the payload is the data that will be used to transform our state.

Type 就如同事件的 type，并且所有的 action 都必须拥有该字段。payload 就是通过 action 传递进来的数据，我们将要用它来完成对 state 的修改。

Not all actions need a payload though, as some actions like incrementing a number do not require any additional data e.g.

并非所有的 action 都需要用到 payload，因为比如像增加计数的 action 并不需要任何额外的数据。

```js
const increment = {
  type: 'INCREMENT'
};
```

## Action Creators 【Action 制造机】

Action creators are simply a function that allow us to abstract away the creation of actions, allowing us to easily dispatch an action without having to define all of its properties.

Action 制造机其实就是一个简单的函数，它把创建 action 的操作抽象出来，让我们可以轻松的 dispatch 一个 action 而不用去每次都对 action 的所有属性定义一遍。

You may often hear action creators being referring to as actions, but for the purposes of this post I’ll refer to them as separate entities.

你可能经常会听到把 action 制造机当成 action 的说法，但是本文会把它们当做两个独立的事物来区分开。

Here’s an example of a simple action creator:

下面是一个简单的 action 制造机示例：

```js
export const ADD_NUMBER = 'ADD_NUMBER';

export const addNumber = (number) => ({
  type: ADD_NUMBER,
  payload: number
});
```

Now we can use this later to quickly create an action with some additional data attached to it e.g.

比如现在我们就可以使用它来快速创建一个关联了一些额外数据（这里指 payload 被指定为了 7）的 action。

```js
const action = addNumber(7);
```

## Reducers

A reducer is the pure function that we will use to transform our store state. Reducers are triggered whenever an action is dispatched and receive both the current state of that reducer (which will be undefined to begin with) and the action that was dispatched.

Reducer 是用于转换 state 的纯函数。不管何时 Reducer 都是通过 dispatch action 来触发，它会收到当前 state（首次调用为 undefined） 和 action 作为参数。 

Here’s a simple example of a reducer that keeps track of a number and handles the “add number” action that we defined above.

下面是一个 reduer 的简单示例，它跟踪记录一个数字并处理我们定义的 “增加数字（add number）” action。

```js
import { ADD_NUMBER } from './our-actions-file';

export const count = (state = 0, action) => {
  switch (action.type) {
    case ADD_NUMBER:
      return state + action.payload;
    default:
      return state;
  }
};
```


There are several things are important to understand when defining a reducer:

定义 reducer 的时候有几点需要注意的地方：

- Our state will be undefined to begin with, so we’ll want to give this a sensible default value (0 in this case)

> state 一开始为 undefined，因此我们需要给它一个默认值（前面的例子我们以 0 为默认值）

- Our reducer cannot return an undefined value

> reducer 不能返回 undefined

- Our reducer will be triggered by any action that is dispatched, so we should return the existing state if the action is not relevant to this reducer (that’s what the default case is for).

> reducer 会被任意 dispatch 的 action 触发，因此如果 reducer 和 action 无关时我们需要在 reducer 中返回已经存在的 state（也就是 switch 中的 default 情况下）。

## Creating A Store 【创建一个 Store】

Now that you understand the basics of actions and reducers we can actually put them to use and create a store.

既然你知道了 action 和 reducer 的基本知识，那么我们就可以将它用以实践，先来创建一个 store。

In this case we are going to create a simple store that only contains our single “count” reducer.

本例中我们只需要创建一个简单的 store，它仅包含一个 “count” reducer。

```js
import { createStore } from 'redux';
import { count } from './our-reducers-file';

export const store = createStore(count);
```

With this example our “count” reducer will make up the entirety of our store state, so calling the method `store.getState()` will simply return a number. Let’s talk a bit about some of the available store methods…

本例中的 “count” reducer 将构成整个 store（因为只有这一个 reducer，reducer 返回的 state 会成为整个 store state 的一部分），因此调用 `store.getState()` 会返回一个数字。我们来谈谈 store 的方法。

## Store Methods 【Store 中的方法】

We wont actually need to call any of these methods ourselves, (and I’d actually avoid this at all costs), as the tools we’ll cover shortly will handle this for us, but for the purposes of describing how the store composes our state, and how actions are dispatched it’s important to cover briefly.

我们不需要亲自去调用这些方法，（我会不惜一切代价避免这种情况的发生），因为稍后我们介绍的工具将会为我们处理这种事情，但是对于讲解 store 是如何将 state 组合起来的以及 action 是如何 dispatch 的时还是有必要简单介绍一下它们。

### getState

`store.getState()` is pretty self explanatory - it simply returns the current state of the store.

`store.getState()` 不言而喻 —— 它就是返回当前 store 中的 state。

### dispatch

`store.dispatch()` is the method that is used to dispatch an action and subsequently trigger our reducers.

`store.dispatch()` 用于发送 action 并触发接下来的 reducer 执行。

If we were to manually dispatch our “add number” action we would do so in the following way:

如果我们要手动发送 “add number” action 就需要像下面这样做：

```js
store.dispatch(addNumber(7));
```

This would cause our “count” reducer to then be called with the current store state and our “add number” action.

它会导致 “count” reducer 被调用，参数就是当前 store 中的 state 和 “add number” action。

Note that we are not passing the action creator itself to the dispatch function, but instead the action that is returned by it.

注意我们没有将 action 创建器传递给 dispatch 函数，而是将 action 创建器返回的 action 传递给了 dispatch 函数。

## Combining Reducers 【合并 Reducer】

For most applications we are going to want to store more than a single number, which we can then access from an object tree. In order to save us a lot of hassle handling all of the store state in a single reducer we can use a function provided by redux to combine our reducers into an object tree.

大多数应用实际上不只是存放一个数字这么简单，然后我们希望能从对象中访问它。将所有的 store state 放到一个 reducer 中可以省去我们诸多麻烦，我们可以使用 redux 提供的一个函数来将我们的 reducer 合并到一个对象树中。

```js
import { combineReducers, createStore } from 'redux';
import { count, someOtherReducer } from './our-reducers-file';

export const store = createStore(combineReducers({
  count,
  someOtherReducer
}));
```

What this is actually doing behind the scenes is creating another function that calls all our our reducers with the state that is relevant to them. It’s basically like a magical parent reducer.

实际上在幕后创建了另一个函数，它会用对应的 state 去调用我们所有的 reducer。它基本上就像是一个充满魔力的父 reducer。

If we were to over simplify how this works it’d look something like the following:

下面是这个函数的精简版：

```js
const combineReducers = (reducers) => {
  return (state = {}, action) => {
    const newState = {};

    for (let key in reducers) {
      const reducer = reducers[key];

      newState[key] = reducer(state[key], action);
    }

    return newState;
  };
}
```

Note how all of the reducers are called with the same action.

注意所有的这些 reducer 是如何通过相同的 action 去调用的。

After we combine our reducers, calling `store.getState()` would return something like this:

将 reducer 组合之后，调用 `store.getState()` 将会返回像下面这样的数据：

```js
const state = {
  count: 0,
  someOtherReducer: 'Some value'
};
```

This allows use to access each of our reducers state individually e.g.

这使得我们可以独立的访问各个 reducer 的 state。

```js
const count = state.count;
```

But this isn’t exactly how we’ll be doing things. As I mentioned before, we wont be manually calling `getState` or `dispatch`.

但这并不是我们应该做的事情。就像我前面提到的那样，我们不应该手动调用 `getState` 或 `dispatch`。

## Provider

Here’s where we start to integrate redux with our react application.

从这里开始我们把 redux 和 react 整合到一起。

To do so we’ll also need to install a module called react-redux.

我们需要安装一个叫 react-redux 的模块来帮助我们完成这一步。

React redux provides several tools that allow us to easily access store state and dispatch actions from our react components.

React redux 提供了一些工具让我们可以轻松的从 react 组件中访问 store 中的 state 和发送 action。

The provider is a react component that sits at the root level of your app, and allows any of its children access to the store (which we supply to it as a prop) via [context](https://reactjs.org/docs/context.html) and the `connect` function (which we’ll get to in a second).

provider 是一个 react 组件，它被安排在应用的最上层，并允许它的任何子元素通过 [context](https://reactjs.org/docs/context.html) 和 `connect` 函数（稍后我们将讲到它）访问到 store（我们以属性的方式提供给它）。

```js
import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './our-store-file';
import Counter from './somewhere-else';

const App = () => (
  <Provider store={store}>
    <Counter />
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('app'));
```

You can also manually supply the store to a connected component (which we’ll cover in a second), which is useful when testing components. I would not, however, recommend giving any of your components direct access to the store in your application.

你也可以手动给关联组件（稍后将会讲到）提供 store，这在测试组件的时候非常有帮助。但我不建议在应用中让你的组件直接访问 store。

## Connecting A Component 【关联到组件】

The final piece of the puzzle is the `connect` function provided by react-redux. This allows us to map parts of the store state to a component, and at the same time, automatically wrap our actions with the `dispatch` method so that we don’t have to worry about calling it ourselves.

最后一个问题是 react-redux 提供的 `connect` 函数。它允许我们将 store 中 state 的某一部分映射到组件中，与此同时，自动用 `dispatch` 方法来封装操作（action），因此我们不用担心自己去调用它。 

The main benefits of using a provider with this `connect` function are that an application can be provided an entirely different store when needed, which is very useful for server side rendering, but I wont be covering that today.

将 provider 与 `connect` 函数一起使用的最大好处就是在必要时可以为应用程序提供一个完全不同的 store，这在服务端渲染的时候很有帮助，但今天我不打算讲它。 

Here’s a simple component that allows us to display a number and add to it:

下面是一个可以显示和增加数字的组件：

```js
import React, { Component } from 'react';
import { addNumber } from './our-actions-file';

class Counter extends Component {
  onAddClick = () => {
    this.props.addNumber(7);
  }

  render () {
    return (
      <div>
        Count: {this.props.count}
        <button onClick={this.onAddClick}>
          Add 7!
        </button>
      </div>
    );
  }
}
```

Right now, if this component was rendered like in the above provider example, it wont have access to either of the props `count` or `addNumber` as we are not providing them, but after we connect the component, these state values and actions will be mapped to its props.

现在，如果组件还是像之前的那个 provider 示例那样渲染的话，它并不能访问到 `count` 或者 `addNumber` 属性，因为我们没有给组件提供这两个属性，但是当我们将组件关联之后，这些 state 值和操作（action）将会映射到对应的属性上。

Here we’re going to connect our component:

现在我们来关联组件：

```js
const mapStateToProps = ({count}) => ({
  count
});

export default connect(mapStateToProps, { addNumber })(Counter);
```

Let’s break this down a bit…

让我们来分解一下。

Firstly, `connect` is a function that returns another function. Connect takes 2 optional arguments; `mapStateToProps`, and `mapDispatchToProps`; and returns a function that takes our component as an argument.

首先，`connect` 是一个返回另一个函数的函数。Connect 接收两个可选参数：`mapStateToProps`, and `mapDispatchToProps`，并且返回一个以我们提供的组件作为入参的函数。

So what are `mapStateToProps` and `mapDispatchToProps`?

那 `mapStateToProps` 和 `mapDispatchToProps` 又是什么？

### mapStateToProps

`mapStateToProps` is a function that will be called when our component mounts, updates, or our store state is changed. All this does is extract the state that we want from the store and return it as an object. The `connect` function then provides these values as props to our component so that we can access them with `this.props.count` for example.

`mapStateToProps` 是一个函数，它在当我们组件挂载、更新或者 store state 发生改变的时候调用。它所做的所有事情就是从 store 中提取出我们想要的 state 并将其作为一个对象返回。然后 `connect` 函数将这些值以属性的方式提供给我们的组件以便我们能够通过 `this.props.count` 这种方式访问。

### mapDispatchToProps

`mapDispatchToProps`, which in this case is simply an object containing our action creator (but can also be a function that allows you to do some more complex stuff), wraps each of our actions with `dispatch` so that when called with `this.props.addNumber(7)`, for example, automatically dispatches our action. Similarly to `mapStateToProps`, the `connect` function provides these values to our component so they can be accessed as props.

`mapDispatchToProps` 在本例中就是一个包含 action 创建器的对象（但也可以是一个可以让你执行更多复杂逻辑的函数），它用 `dispatch` 对我们的每一个操作进行封装并自动完成发送 action 的操作以便我们可以像 `this.props.addNumber(7)` 这样来调用。就像 `mapStateToProps` 一样，`connect` 函数将这些值（指 `mapDispatchToProps` 中的各种操作）以属性的方式提供给我们的组件以便我们可以访问到它们。

An over simplified example of what happens to our `mapDispatchToProps` behind the scenes would look something like this:

下面是一个用于展示关于 `mapDispatchToProps` 背后的实现逻辑的精简示例：

```js
const mapDispatchToProps = (actionCreators) => {
  const dispatchedActionCreators = {};

  for (let key in actionCreators) {
    const actionCreator = actionCreators[key];

    dispatchedActionCreators[key] = (...args) => {
      // For the purposes of this example `dispatch` magically comes out of nowhere
      dispatch(actionCreator(...args));
    };
  }

  return dispatchedActionCreators;
};
```

An alternative to using a `mapDispatchToProps` function or object, is to provide nothing e.g.

除了以函数或者对象的方式来指定 `mapDispatchToProps`，还可以什么都不提供。

```js
export default connect(mapStateToProps)(Counter);
```

This might seem like an odd thing to do at first, but if we do not provide dispatch props then the store’s `dispatch` method is automatically provided as a prop, so we can manually dispatch actions.

这样做一开始看起来有点奇怪，但如果我们不提供这些属性的话 store 的 `dispatch` 方法就回自动的被以属性的方式提供给组件，这样我们就可以手动发送 action 了。

I know I said that we shouldn’t need to call dispatch directly on the store ourselves, but in this case it is fine because we are not accessing the store directly. It’s being provided by the `connect` function.

我知道我前面说了我们不应该直接调用 store 的 dispatch 方法，但在这种场景下是可以的，因为我们没有直接访问到 store，而是通过 `connect` 函数提供的 dispatch。

Some may prefer this approach as you can avoid shadowing variable names when destructuring actions from props that are also imported, which can occasionally result in calling the wrong function, like in the following example:

有的人喜欢用这种方式来避免在从 props 中解构操作（action）时造成和已有变量名冲突的影子变量名（shadowing variable names），这种情况可能会导致不小心调用了错误的函数的情况，就像下面这个示例：

```js
import React, { Component } from 'react';
import { addNumber } from './our-actions-file';

class Counter extends Component {
  onAddClick = () => {
    const { addNumber } = this.props;

    // This shares a variable name with the imported action creator
    // Sometimes the action creator may be accidentally called instead of the dispatch version
    addNumber(7);
  }

  render () {
    return (
      <div>
        Count: {this.props.count}
        <button onClick={this.onAddClick}>
          Add 7!
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps, { addNumber })(Counter);
```

An example that uses the `dispatch` prop rather than `mapDispatchToProps`:

一个使用 `dispatch` 属性而非 `mapDispatchToProps` 的示例：

```js
import React, { Component } from 'react';
import { addNumber } from './our-actions-file';

class Counter extends Component {
  onAddClick = () => {
    // Now we are directly referencing our imported action creator
    // And manually dispatching it with the dispatch prop provided by connect
    this.props.dispatch(addNumber(7));
  }

  render () {
    return (
      <div>
        Count: {this.props.count}
        <button onClick={this.onAddClick}>
          Add 7!
        </button>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Counter);
```

## We’re Done! 【完结】

That’s pretty much all you need to know to get started using redux with react, but there are plenty of other complexities to learn to really master redux, and more tools that can be used with redux and react to allow some other functionality e.g.

以上就是所有你刚开始在 react 中使用 redux 所要了解的知识点，但如果要真正掌握 redux，还需要了解很多复杂的概念，并且还有很多工具可以帮助你在使用 redux 的过程中完成很多其它的功能。

- Custom `mapStateToProps` function

> 自定义 `mapStateToProps` 函数

- Middleware (which allows applying additional effects to actions)

> 中间件（它可以给 action 添加一些附加效果）

- Asynchronous actions using something like [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-saga](https://github.com/redux-saga/redux-saga) (which are middleware)

> 使用 [redux-thunk](https://github.com/gaearon/redux-thunk) 或者 [redux-saga](https://github.com/redux-saga/redux-saga)（它们就是中间件） 来实现异步操作。

I hope you’ve learnt something useful today. Now go make something awesome!

我希望你今天学到了一些有用的东西。现在就用它们去做一些很棒的事情吧！