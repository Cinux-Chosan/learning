# [Redux and React: An Introduction](http://jakesidsmith.com/blog/post/2017-11-18-redux-and-react-an-introduction/)

In this post I’m going to briefly explain what [redux](https://github.com/reactjs/redux/) is, all of the basic elements, and how to set up a React project with redux as your data storage / flow solution using [react-redux](https://github.com/reactjs/react-redux/). You will need some prior knowledge of React; JSX, state, props, context; and ES6 syntax, and classes.

我打算在这篇文章中简要的介绍一下什么是 [redux](https://github.com/reactjs/redux/)、它所有的基本元素以及如何结合 [react-redux](https://github.com/reactjs/react-redux/) 来配置一个用 Redux 作为数据存储/流动解决方案的 React 项目。

## What We’ll Cover 【我们会覆盖以下知识点】

- [What is redux?](#what-is-redux什么是-redux)
- [Actions](#actions)
- [Action creators](#action-creators-action-制造机)
- [Reducers](#reducers)
- [Creating a store](#creating-a-store-创建一个-store)
- [Store methods](#store-methods-store-中的方法)
  - [getState](#getstate)
  - [dispatch](#dispatch)
- [Combining reducers](#combining-reducers-合并-reducer)
- [Provider](#provider)
- [Connecting a component](#connecting-a-component-关联到组件)
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

Here’s a simple example of a reducer that keeps track of a number and handles the “add number” action that we defined above.

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

- Our state will be undefined to begin with, so we’ll want to give this a sensible default value (0 in this case)
- Our reducer cannot return an undefined value
- Our reducer will be triggered by any action that is dispatched, so we should return the existing state if the action is not relevant to this reducer (that’s what the default case is for).

## Creating A Store 【创建一个 Store】

Now that you understand the basics of actions and reducers we can actually put them to use and create a store.

In this case we are going to create a simple store that only contains our single “count” reducer.

```js
import { createStore } from 'redux';
import { count } from './our-reducers-file';

export const store = createStore(count);
```

With this example our “count” reducer will make up the entirety of our store state, so calling the method `store.getState()` will simply return a number. Let’s talk a bit about some of the available store methods…

## Store Methods 【Store 中的方法】

We wont actually need to call any of these methods ourselves, (and I’d actually avoid this at all costs), as the tools we’ll cover shortly will handle this for us, but for the purposes of describing how the store composes our state, and how actions are dispatched it’s important to cover briefly.

### getState

`store.getState()` is pretty self explanatory - it simply returns the current state of the store.

### dispatch

`store.dispatch()` is the method that is used to dispatch an action and subsequently trigger our reducers.

If we were to manually dispatch our “add number” action we would do so in the following way:

```js
store.dispatch(addNumber(7));
```

This would cause our “count” reducer to then be called with the current store state and our “add number” action.

Note that we are not passing the action creator itself to the dispatch function, but instead the action that is returned by it.

## Combining Reducers 【合并 Reducer】

For most applications we are going to want to store more than a single number, which we can then access from an object tree. In order to save us a lot of hassle handling all of the store state in a single reducer we can use a function provided by redux to combine our reducers into an object tree.

```js
import { combineReducers, createStore } from 'redux';
import { count, someOtherReducer } from './our-reducers-file';

export const store = createStore(combineReducers({
  count,
  someOtherReducer
}));
```

What this is actually doing behind the scenes is creating another function that calls all our our reducers with the state that is relevant to them. It’s basically like a magical parent reducer.

If we were to over simplify how this works it’d look something like the following:

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

After we combine our reducers, calling `store.getState()` would return something like this:

```js
const state = {
  count: 0,
  someOtherReducer: 'Some value'
};
```

This allows use to access each of our reducers state individually e.g.

```js
const count = state.count;
```

But this isn’t exactly how we’ll be doing things. As I mentioned before, we wont be manually calling `getState` or `dispatch`.

## Provider

Here’s where we start to integrate redux with our react application.

To do so we’ll also need to install a module called react-redux.

React redux provides several tools that allow us to easily access store state and dispatch actions from our react components.

The provider is a react component that sits at the root level of your app, and allows any of its children access to the store (which we supply to it as a prop) via [context](https://reactjs.org/docs/context.html) and the `connect` function (which we’ll get to in a second).

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

## Connecting A Component 【关联到组件】

The final piece of the puzzle is the `connect` function provided by react-redux. This allows us to map parts of the store state to a component, and at the same time, automatically wrap our actions with the `dispatch` method so that we don’t have to worry about calling it ourselves.

The main benefits of using a provider with this `connect` function are that an application can be provided an entirely different store when needed, which is very useful for server side rendering, but I wont be covering that today.

Here’s a simple component that allows us to display a number and add to it:

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

Here we’re going to connect our component:

```js
const mapStateToProps = ({count}) => ({
  count
});

export default connect(mapStateToProps, { addNumber })(Counter);
```

Let’s break this down a bit…

Firstly, `connect` is a function that returns another function. Connect takes 2 optional arguments; `mapStateToProps`, and `mapDispatchToProps`; and returns a function that takes our component as an argument.

So what are `mapStateToProps` and `mapDispatchToProps`?

### mapStateToProps

`mapStateToProps` is a function that will be called when our component mounts, updates, or our store state is changed. All this does is extract the state that we want from the store and return it as an object. The `connect` function then provides these values as props to our component so that we can access them with `this.props.count` for example.

### mapDispatchToProps

`mapDispatchToProps`, which in this case is simply an object containing our action creator (but can also be a function that allows you to do some more complex stuff), wraps each of our actions with `dispatch` so that when called with `this.props.addNumber(7)`, for example, automatically dispatches our action. Similarly to `mapStateToProps`, the `connect` function provides these values to our component so they can be accessed as props.

An over simplified example of what happens to our `mapDispatchToProps` behind the scenes would look something like this:

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

```js
export default connect(mapStateToProps)(Counter);
```

This might seem like an odd thing to do at first, but if we do not provide dispatch props then the store’s `dispatch` method is automatically provided as a prop, so we can manually dispatch actions.

I know I said that we shouldn’t need to call dispatch directly on the store ourselves, but in this case it is fine because we are not accessing the store directly. It’s being provided by the `connect` function.

Some may prefer this approach as you can avoid shadowing variable names when destructuring actions from props that are also imported, which can occasionally result in calling the wrong function, like in the following example:

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

- Custom `mapStateToProps` function
- Middleware (which allows applying additional effects to actions)
- Asynchronous actions using something like [redux-thunk](https://github.com/gaearon/redux-thunk) or [redux-saga](https://github.com/redux-saga/redux-saga) (which are middleware)
I hope you’ve learnt something useful today. Now go make something awesome!