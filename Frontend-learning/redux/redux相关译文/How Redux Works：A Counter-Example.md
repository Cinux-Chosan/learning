# How Redux Works: A Counter-Example 【Redux 是如何工作的：一个计数器示例】

After learning a bit about React and getting into Redux, it’s really confusing how it all works.

在对 React 和 Redux 都做了一些了解之后，我们或许会对它们是如何工作的感到好奇。

Actions, reducers, action creators, middleware, pure functions, immutability…

Action，Reducer，action creator，中间件（middleware），纯函数（pure function），不变性（immutability）

Most of these terms seem totally foreign.

这些术语听起来是那么的陌生。

So in this post we’re going to demystify how Redux works with a backwards approach and a very simple React + Redux example that I think will help your understanding. As in the [what does Redux do](https://daveceddia.com/what-does-redux-do/)（[点击这里查看中文译文](https://github.com/Cinux-Chosan/learning/blob/master/Frontend-learning/redux/redux%E7%9B%B8%E5%85%B3%E8%AF%91%E6%96%87/What%20Does%20Redux%20Do%EF%BC%9F(and%20when%20should%20you%20use%20it%EF%BC%9F).md)）post, I’ll try to explain Redux in simple terms before tackling the terminology.

因此本文将用一个非常简单的 React + Redux 示例来揭秘 Redux 是如何进行工作的。和 [what does Redux do](https://daveceddia.com/what-does-redux-do/)（[点击这里查看中文译文](https://github.com/Cinux-Chosan/learning/blob/master/Frontend-learning/redux/redux%E7%9B%B8%E5%85%B3%E8%AF%91%E6%96%87/What%20Does%20Redux%20Do%EF%BC%9F(and%20when%20should%20you%20use%20it%EF%BC%9F).md)） 一样，我会在讲解这个术语之前尽量用一些简单的

If you’re not yet sure what Redux is for or why you should use it, read [this explanation of Redux](https://daveceddia.com/what-does-redux-do/) and then come back here.

如果你尚不清楚 Redux 是做什么的以及为什么要使用 Redux，请先阅读 [this explanation of Redux](https://daveceddia.com/what-does-redux-do/)（[点击这里查看中文译文](https://github.com/Cinux-Chosan/learning/blob/master/Frontend-learning/redux/redux%E7%9B%B8%E5%85%B3%E8%AF%91%E6%96%87/What%20Does%20Redux%20Do%EF%BC%9F(and%20when%20should%20you%20use%20it%EF%BC%9F).md)）。

## First: Plain React State 【第一步：纯 React State】

We’ll start with an example of plain old React state, and then add Redux piece-by-piece.

我们的示例将以单纯的 React state 开始，然后一步一步加入 Redux。

Here is a counter:

这里有一个计数器：

![](https://daveceddia.com/images/counter-plain@2x.png)

And here’s the code (I left out the CSS to keep this simple, so it won’t be as pretty as the image):

下面是它的代码（为了保持简洁我省略了 CSS 代码，所以下面代码的效果可能没图片这么漂亮）：

```jsx
import React from 'react';

class Counter extends React.Component {
  state = { count: 0 }

  increment = () => {
    this.setState({
      count: this.state.count + 1
    });
  }

  decrement = () => {
    this.setState({
      count: this.state.count - 1
    });
  }

  render() {
    return (
      <div>
        <h2>Counter</h2>
        <div>
          <button onClick={this.decrement}>-</button>
          <span>{this.state.count}</span>
          <button onClick={this.increment}>+</button>
        </div>
      </div>
    )
  }
}

export default Counter;
```

As a quick review, here’s how this works:

来快速回顾一下它是如何工作的：

- The `count` state is stored in the top level `Counter` component

> `count` 存放在顶级组件 `Counter` 的 state 中

- When the user clicks “+”, the button’s `onClick` handler is called, which is bound to the `increment` function in the `Counter` component.

> 当用户点击 “+” 的时候会调用按钮的 `onClick` 事件处理函数，该函数在 `Counter` 组件中被指定为了 `increment` 函数。

- The `increment` function updates the state with the new count.

> `increment` 函数会用新的计数更新当前计数。

- Because state was changed, React re-renders the `Counter` component (and its children), and the new counter value is displayed.

> 由于 state 发生了改变，React 重绘了 `Counter` 组件（以及其子组件），将新的计数值显示出来。

If you need more detail about how state changes work, go read [A Visual Guide to State in React](https://daveceddia.com/visual-guide-to-state-in-react/) and then come back here. Seriously: if the above was not review for you, you need to learn how React state works before you learn Redux.

如果你需要了解更多关于 state 更新的机制，请参考 [A Visual Guide to State in React](https://daveceddia.com/visual-guide-to-state-in-react/)。提醒：如果你对前面的回顾并不了解，那么你应该先学习 React state 是如何工作的，然后再回过来学习 Redux。

### Quick Setup 【快速开始】

If you’d like to follow along with the code, create a project now:

如果你希望接下来以代码的方式继续，那先来创建一个项目：

- Install create-react-app if you don’t have it (`npm install -g create-react-app`)

> 如果你没有 create-react-app 请先安装它 （`npm install -g create-react-app`）

- Create a project: `create-react-app redux-intro`

> 创建一个项目：`create-react-app redux-intro`

- Open `src/index.js` and replace it with this:

> 用下面的代码替换 `src/index.js` 中的内容：
>
> ```jsx
> import React from 'react';
> import { render } from 'react-dom';
> import Counter from './Counter';
>
> const App = () => (
>   <div>
>    <Counter />
>   </div>
> );
>
> render(<App />, document.getElementById('root'));
> ```

- Create a `src/Counter.js` with the code from the Counter example above.

> 用上面的计数器示例代码创建 `src/Counter.js`。

## On to the React Redux Example 【】

As [discussed in Part 1](https://daveceddia.com/what-does-redux-do/), Redux keeps the **state** of your app in a single **store**. Then, you can extract parts of that state and plug it into your components as props. This lets you keep data in one global place (the store) and feed it directly to any component in the app, without the gymnastics of passing props down multiple levels.

正如在 [第一部分中讲到的那样](https://daveceddia.com/what-does-redux-do/)，Redux 将整个应用的 **状态（state）** 放在单独的一个 **store** 中。然后你可以从状态中取出其中一部分当做属性（props）添加到组件中。这样能够使数据统一保持在一个全局空间（即 store）中并且它可以 “哺育” 应用中的任意组件，而不需要将属性通过多层进行传递。

Side note: you’ll often see the words “state” and “store” used interchangably. Technically, the **state** is the data, and the **store** is where it’s kept.

边注：你可能经常会看到 “状态（state）” 和 “存储（store）” 交替出现。从技术上讲，**状态（state）** 就是指数据，**存储（store）** 就是存放数据的地方。

As we go through the steps below, follow along in your editor! It will help you understand how this works (and we’ll get to work through some errors together).

请在你的编辑器中跟着我们来完成下面的操作！它会帮助你理解它们是如何工作的（同时我们将一起解决出现的一些错误）

Add Redux to the project:

将 Redux 添加到项目中：

```sh
yarn add redux react-redux
```

### redux vs react-redux 【redux vs react-redux】

Wait – 2 libraries? “What’s react-redux,” you say? Well, I’ve kinda been lying to you (sorry).

等等，怎么有两个库？你可能会问： “react-redux 又是什么？” 。好吧，骗你的（sorry）。

See, `redux` gives you a store, and lets you keep state in it, and get state out, and respond when the state changes. But that’s all it does. It’s actually `react-redux` that lets you connect pieces of the state to React components. That’s right: `redux` knows nothing about React at all.

`redux` 为你提供一个存储（store），让你能够在其中存取状态数据，并且可以对状态发生的改变做出响应，这就是它做的所有事情。让你将 state 关联到 React 组件的实际上是 `react-redux`。`redux` 并不清楚 React。

These libraries are like two peas in a pod. 99.999% of the time, when anyone mentions “Redux” in the context of React, they are referring to both of these libraries in tandem. So keep that in mind when you see Redux mentioned on StackOverflow, or Reddit, or elsewhere. (here are some ideas for [how to keep up with JavaScript](https://daveceddia.com/keeping-up-with-javascript/))

它们就像一颗豆荚中的两粒豌豆。当在 React 中提到 “React” 的时候， 99.999% 都是指它们两个在一起的情况。因此当你在 StackOverflow、Reddit 或者其他地方看到 Redux 时一定要记住这点。（这里有一些关于[如何跟上 JavaScript 步伐](https://daveceddia.com/keeping-up-with-javascript/)的思路）

This app will show an example of redux and react-redux working together.

这个应用会演示 redux 和 react-redux 结合在一起使用的情况。

## Last Things First 【最后】

Most tutorials start by creating a store, setting up Redux, writing a reducer, and so on. Lots must happen before anything appears on screen.

大多数教程都从创建 store、设置 Redux、编写一个 reducer 等作为开始。其中大多数操作都发生在我们能在屏幕上看到结果之前。

I’m going to take a backwards approach, and it will take just as much code to make things appear on screen, but hopefully the motivation behind each step will be clearer.

我准备用相反的方式，用同样多的代码但能够在屏幕上先看到一些结果，并且每一步的动机更加明确。

Here’s a video walkthrough of converting the Counter to use Redux (or if video is not your thing, keep on reading!).

下面是将计数器应用迁移为 Redux 版本的视频（如果你不喜欢看视频，请继续向下阅读！）

[视频地址](https://www.youtube.com/watch?v=sX3KeP7v7Kg)

Back to the Counter app, let’s just imagine for a second that we moved the component’s state into Redux.

回到计数器应用，我们先想象一下将组件的 state 移到 Redux。

We’ll remove the state from the component, since we’ll be getting that from Redux soon:

我们将从组件中移除 state，因为即将使用 Redux 来代替它：

```jsx
import React from 'react';

class Counter extends React.Component {
  increment = () => {
    // fill in later
  }

  decrement = () => {
    // fill in later
  }

  render() {
    return (
      <div>
        <h2>Counter</h2>
        <div>
          <button onClick={this.decrement}>-</button>
          <span>{this.props.count}</span>
          <button onClick={this.increment}>+</button>
        </div>
      </div>
    )
  }
}

export default Counter;
```

## Wiring Up The Counter 【将数据与计数器关联】

Notice that `{this.state.count}` changed to `{this.props.count}`. This won’t work yet, of course, because the Counter is not receiving a `count` prop. We’re gonna use Redux to inject that.

注意 `{this.state.count}` 变成了 `{this.props.count}`。只这样当然不行，因为计数器组件并没有收到 `count` 属性。我们需要用 Redux 来将其注入。

To get the count out of Redux, we first need to import the `connect` function at the top:

为了将计数从 Redux 中取出来，我们首先需要在文件顶部引入 `connect` 函数：

```js
import { connect } from 'react-redux';
```

Then we need to “connect” the Counter component to Redux at the bottom:

我们需要在文件底部将计数器组件和 Redux 进行 “关联”：

```js
// Add this function:
function mapStateToProps(state) {
  return {
    count: state.count
  };
}

// Then replace this:
// export default Counter;

// With this:
export default connect(mapStateToProps)(Counter);
```

This will fail with an error (more on that in a second).

这样会出现错误导致失败（过一会儿再说吧）。

Where previously we were exporting the component itself, now we’re wrapping it with this `connect` function call.

我们之前是直接导出组件本身，现在我们用 `connect` 函数调用来将其进行封装。

### What’s `connect`? 【什么是 `connect`？】

You might notice the call looks little… weird. Why `connect(mapStateToProps)(Counter)` and not `connect(mapStateToProps, Counter)` or `connect(Counter, mapStateToProps)`? What’s that doing?

你可能觉得这样调用看起来有点...奇怪。为什么是 `connect(mapStateToProps)(Counter)` 而不是 `connect(mapStateToProps, Counter)` 或者 `connect(Counter, mapStateToProps)`？它是干什么的？

It’s written this way because `connect` is a higher-order function, which is a fancy way of saying it returns a function when you call it. And then calling that function with a component returns a new (wrapped) component.

之所以要写成这种方式是因为 `connect` 是一个高阶函数，也就是说调用它得到的返回值也是一个函数。使用组件作为参数去调用返回的函数会得到一个新（包装后的）组件。

Another name for this is a [higher-order component](https://daveceddia.com/extract-state-with-higher-order-components/) (aka “HOC”). HOCs have gotten some bad press lately, but they’re still quite useful, and `connect` is a good example of a useful one.

这种方式的另一种称呼是 [高阶组件](https://daveceddia.com/extract-state-with-higher-order-components/) (aka “HOC”)。虽然高阶组件最近有些负面消息，但它们仍然十分有用，`connect` 就是一个例子。

What `connect` does is hook into Redux, pull out the entire state, and pass it through the `mapStateToProps` function that you provide. This needs to be a custom function because only you will know the “shape” of the state in Redux.

`connect` 作为 Redux 的钩子，将整个状态（state）数据取出，并传递给你提供的 `mapStateToProps` 函数。这个函数需要你自己来提供，因为只有你才知道 Redux 中存放的状态（state）数据是什么格式的。

`connect` passes the entire state as if to say, “Hey, tell me what you need out of this jumbled mess.”

`connect` 将整个状态（state）传进去，就像在说 “嘿，告诉我你需要从这对数据里面拿到什么。”

The object you return from `mapStateToProps` gets fed into your component as props. The example above will pass `state.count` as the value of the `count` prop: the keys in the object become prop names, and their corresponding values become the props’ values. So you see, this function literally defines a mapping from state into props.

从 `mapStateToProps` 返回的对象会被当做属性传进你的组件中。上面的例子会将 `state.count` 传递给组件作为其 `count` 属性：对象中的字段名变为属性名，字段值作为属性值。因此你会看到这个函数从字面上定义了从状态（state）到属性的映射。

## Errors Mean Progress! 【错误意味着有进步】

If you’re following along, you will see an error like this in the console:

如果你在跟着做，你应该会在控制台中看到如下错误：

      Could not find “store” in either the context or props of “Connect(Counter)”. Either wrap the root component in a , or explicitly pass "store" as a prop to "Connect(Counter)".

Since `connect` pulls data from the Redux store, and we haven’t set up a store or told the app how to find it, this error is pretty logical. Redux has no dang idea what’s going on right now.

因为 `connect` 从 Redux 存储中获取数据，然而此时我们并没有设置一个存储（store）或者告诉应用如何找到它，产生这个错误也是理所当然的。Redux 此时并不知道发生了什么。

## Provide a Store

Redux holds the global state for the entire app, and by wrapping the entire app with the `Provider` component from `react-redux`, every component in the app tree will be able to use `connect` to access the Redux store if it wants to.

This means `App`, and children of `App` (like `Counter`), and children of their children, and so on – all of them can now access the Redux store, but only if they are explicitly wrapped by a call to `connect`.

I’m not saying to actually do that – `connect`ing every single component would be a bad idea (messy design, and slow too).

This `Provider` thing might seem like total magic right now. It is a little bit; it actually uses React’s “context” feature under the hood.

It’s like a secret passageway connected to every component, and using `connect` opens the door to the passageway.

Imagine pouring syrup on a pile of pancakes, and how it manages to make its way into ALL the pancakes even though you just poured it on the top one. `Provider` does that for Redux.

In `src/index.js`, import the `Provider` and wrap the contents of `App` with it.

```jsx
import { Provider } from 'react-redux';

...

const App = () => (
  <Provider>
    <Counter/>
  </Provider>
);
```

We’re still getting that error though – that’s because `Provider` needs a store to work with. It’ll take the store as a prop, but we need to create one first.

## Create the Store

Redux comes with a handy function that creates stores, and it’s called `createStore`. Yep. Let’s make a store and pass it to Provider:

```jsx
import { createStore } from 'redux';

const store = createStore();

const App = () => (
  <Provider store={store}>
    <Counter/>
  </Provider>
);
```

Another error, but different this time:

      Expected the reducer to be a function.

So, here’s the thing about Redux: it’s not very smart. You might expect that by creating a store, it would give you a nice default value for the state inside that store. Maybe an empty object?

But no: Redux makes zero assumptions about the shape of your state. It’s up to you! It could be an object, or a number, or a string, or whatever you need. So we have to provide a function that will return the state. That function is called a **reducer** (we’ll see why in a minute). So let’s make the simplest one possible, pass it into `createStore`, and see what happens:

```js
function reducer() {
  // just gonna leave this blank for now
  // which is the same as `return undefined;`
}

const store = createStore(reducer);
```

## The Reducer Should Always Return Something

The error is different now:

      Cannot read property ‘count’ of undefined


It’s breaking because we’re trying to access `state.count`, but `state` is undefined. Redux expected our `reducer` function to return a value for `state`, except that it (implicitly) returned `undefined`. Things are rightfully broken.

The reducer is expected to return the state. It’s actually supposed to take the current state and return the new state, but nevermind; we’ll come back to that.

Let’s make the reducer return something that matches the shape we need: an object with a `count` property.

```js
function reducer() {
  return {
    count: 42
  };
}
```

Hey! It works! The count now appears as “42”. Awesome.

Just one thing though: the count is forever stuck at 42.

## The Story So Far

Before we get into how to actually update the counter, let’s look at what we’ve done up til now:

- We wrote a mapStateToProps function that does what the name says: transforms the Redux state into an object containing props.
- We connected the Redux store to our Counter component with the connect function from react-redux, using the mapStateToProps function to configure how the connection works.
- We created a reducer function to tell Redux what our state should look like.
We used the ingeniously-named createStore function to create a store, and passed it the reducer.
- We wrapped our whole app in the Provider component that comes with react-redux, and passed it our store as a prop.
- The app works flawlessly, except the fact that the counter is stuck at 42.

With me so far?

## Interactivity (Making It Work)

So far this is pretty lame, I know. You could’ve written a static HTML page with the number “42” and 2 broken buttons in 60 seconds flat, yet here you are, reading how to overcomplicate that very same thing with React and Redux and who knows what else.

I promise this next section will make it all worthwhile.

Actually, no. I take that back. A simple Counter app is a great teaching tool, but Redux is absolutely overkill for something like this. React state is perfectly fine for something so simple. Heck, even plain JS would work great. Pick the right tool for the job. Redux is not always that tool. But I digress.

## Initial State

So we need a way to tell Redux to change the counter.

Remember the `reducer` function we wrote? (of course you do, it was 2 minutes ago)

Remember how I mentioned it takes the current state and returns the new state? Well, I lied again. It actually takes the current state and an action, and then it returns the new state. We should have written it like this:

Remember how I mentioned it takes the current state and returns the new state? Well, I lied again. It actually takes the current state and an action, and then it returns the new state. We should have written it like this:

```js
function reducer(state, action) {
  return {
    count: 42
  };
}
```

The very first time Redux calls this function, it will pass `undefined` as the `state`. That is your cue to return the initial state. For us, that’s probably an object with a `count` of 0.

It’s common to write the initial state above the reducer, and use ES6’s default argument feature to provide a value for the `state` argument when it’s undefined.

```js
const initialState = {
  count: 0
};

function reducer(state = initialState, action) {
  return state;
}
```

Try this out. It should still work, except now the counter is stuck at 0 instead of 42. Awesome.

## Action

We’re finally ready to talk about the `action` parameter. What is it? Where does it come from? How can we use it to change the damn counter?

An “action” is a JS object that describes a change that we want to make. The only requirement is that the object needs to have a `type` property, and its value should be a string. Here’s an example of an action:

```js
{
  type: "INCREMENT"
}
```

Here’s another one:

```js
{
  type: "DECREMENT"
}
```

Are the gears turning in your head? Do you know what we’re gonna do next?

## Respond to Actions

Remember the reducer’s job is to take the current state and an action and figure out the new state. So if the reducer received an action like `{ type: "INCREMENT" }`, what might you want to return as the new state?

If you answered something like this, you’re on the right track:

```js
function reducer(state = initialState, action) {
  if(action.type === "INCREMENT") {
    return {
      count: state.count + 1
    };
  }

  return state;
}
```

It’s common to use a `switch` statement with `case`s for each action you want to handle. Change your reducer to look like this:

```js
function reducer(state = initialState, action) {
  switch(action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        count: state.count - 1
      };
    default:
      return state;
  }
}
```

### Always Return a State

You’ll notice that there’s always the fallback case where all it does is `return state`. This is important, because Redux can (will) call your reducer with actions that it doesn’t know what to do with. In fact, the very first action you’ll receive is `{ type: "@@redux/INIT" }`. Try putting a `console.log(action)` above the `switch` and see.

Remember that the reducer’s job is to return a new state, even if that state is unchanged from the current one. You never want to go from “having a state” to “state = undefined”, right? That’s what would happen if you left off the `default` case. Don’t do that.

### Never Change State

One more thing to never do: do not mutate the `state`. State is immutable. You must never change it. That means you can’t do this:

```js
function brokenReducer(state = initialState, action) {
  switch(action.type) {
    case 'INCREMENT':
      // NO! BAD: this is changing state!
      state.count++;
      return state;

    case 'DECREMENT':
      // NO! BAD: this is changing state too!
      state.count--;
      return state;

    default:
      // this is fine.
      return state;
  }
}
```

You also can’t do things like `state.foo = 7`, or `state.items.push(newItem)`, or `delete state.something`.

Think of it like a game where the only thing you can do is `return { ... }`. It’s a fun game. Maddening at first. But you’ll get better at it with practice.

I put together a short guide on [how to do immutable updates](https://daveceddia.com/react-redux-immutability-guide/), showing 7 common patterns for updating state within objects and arrays.

### All These Rules…

Always return a state, never change state, don’t connect every component, eat your broccoli, don’t stay out past 11… it’s exhausting. It’s like a rules factory, and I don’t even know what that is.

Yeah, Redux can be like an overbearing parent. But it comes from a place of love. Functional programming love.

Redux is built on the idea of immutability, because mutating global state is the road to ruin.

Have you ever kept a global object and used it to pass state around an app? It works great at first. Nice and easy. And then the state starts changing in unpredictable ways and it becomes impossible to find the code that’s changing it.

Redux avoids these problems with some simple rules. State is read-only, and actions are the only way to modify it. Changes happen one way, and one way only: action -> reducer -> new state. The reducer function must be “pure” – it cannot modify its arguments.

There are even addon packages that let you log every action that comes through, rewind and replay them, and anything else you could imagine. Time-travel debugging was one of the original motivations for creating Redux.

## Where Do Actions Come From?

One piece of this puzzle remains: we need a way to feed an action into our reducer function so that we can increment and decrement the counter.

Actions are not born, but they are **dispatched**, with a handy function called `dispatch`.

The `dispatch` function is provided by the instance of the Redux store. That is to say, you can’t just `import { dispatch }` and be on your way. You can call `store.dispatch(someAction)`, but that’s not very convenient since the `store` instance is only available in one file.

As luck would have it, the `connect` function has our back. In addition to injecting the result of `mapStateToProps` as props, `connect` also injects the `dispatch` function as a prop. And with that bit of knowledge, we can finally get the counter working again.

Here is the final component in all its glory. If you’ve been following along, the only things that changed are the implementations of `increment` and `decrement`: they now call the `dispatch` prop, passing it an action.

```jsx
import React from 'react';
import { connect } from 'react-redux';

class Counter extends React.Component {
  increment = () => {
    this.props.dispatch({ type: 'INCREMENT' });
  }

  decrement = () => {
    this.props.dispatch({ type: 'DECREMENT' });
  }

  render() {
    return (
      <div>
        <h2>Counter</h2>
        <div>
          <button onClick={this.decrement}>-</button>
          <span>{this.props.count}</span>
          <button onClick={this.increment}>+</button>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    count: state.count
  };
}

export default connect(mapStateToProps)(Counter);
```

The code for the entire project (all two files of it) can be found [on Github](https://github.com/dceddia/redux-intro).

## What Now?

With the Counter app under your belt, you are well-equipped to learn more about Redux.

      “What?! There’s more?!”

There is much I haven’t covered here, in hopes of making this guide easily digestible – action constants, action creators, middleware, thunks and asynchronous calls, selectors, and on and on. There’s a lot. The [Redux docs](https://redux.js.org/) are well-written and cover all that and more.

But you’ve got the basic idea now. Hopefully you understand how data flows in Redux (`dispatch(action) -> reducer -> new state -> re-render`), and what a reducer does, and what an action is, and how that all fits together.

I’m putting together a new course that will cover all of this and more! You can read more about that [here](https://daveceddia.com/refactoring-to-redux/).



