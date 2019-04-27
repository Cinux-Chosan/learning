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

## Provide a Store 【提供存储（Store）】

Redux holds the global state for the entire app, and by wrapping the entire app with the `Provider` component from `react-redux`, every component in the app tree will be able to use `connect` to access the Redux store if it wants to.

通过将整个应用包装在 `react-redux` 提供的 `Provider` 组件中，可以让 Redux 掌管整个应用的全局状态数据（state），应用中的每个组件都能通过 `connect` 访问到 Redux 存储（store）。

This means `App`, and children of `App` (like `Counter`), and children of their children, and so on – all of them can now access the Redux store, but only if they are explicitly wrapped by a call to `connect`.

这意味着 `App` 和它的子级元素（如 `Counter`）以及子级的子级元素等等都能访问到 Redux 存储（store），但它们必须显式的包装在 `connect` 函数调用中。

I’m not saying to actually do that – `connect`ing every single component would be a bad idea (messy design, and slow too).

我并不是说要将每个组件都通过 `connect` 关联到 Redux，这不是什么好主意（这是杂乱的设计，并且会降低性能）。

This `Provider` thing might seem like total magic right now. It is a little bit; it actually uses React’s “context” feature under the hood.

`Provider` 看起来像是具有魔力一样。确实有点。它实际上是使用了 React 提供的 “context” 特性。

It’s like a secret passageway connected to every component, and using `connect` opens the door to the passageway.

它就像一个连接到每个组件的秘密通道，`connect` 打开了这条秘密通道的大门。

Imagine pouring syrup on a pile of pancakes, and how it manages to make its way into ALL the pancakes even though you just poured it on the top one. `Provider` does that for Redux.

想象一下把糖浆倒在一堆煎饼上，尽管你是倒在最上面它也会想方设法流到下面的煎饼上。`Provider` 就相当于是 Redux 的糖浆。

In `src/index.js`, import the `Provider` and wrap the contents of `App` with it.

在 `src/index.js` 中，引入 `Provider` 然后用它将 `App` 包装起来。

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

我们还是会看到那个错误 —— 因为 `Provider` 还需要一个存储（store）。它需要接收一个 store 作为属性，但我们还没创建它，先来创建一个。

## Create the Store 【创建存储（Store）】

Redux comes with a handy function that creates stores, and it’s called `createStore`. Yep. Let’s make a store and pass it to Provider:

Redux 与生俱来一个创建存储（store）的函数，它叫 `createStore`。来吧，我们先创建一个 store 然后传给 Provider：

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

另一个错误：

      Expected the reducer to be a function.

So, here’s the thing about Redux: it’s not very smart. You might expect that by creating a store, it would give you a nice default value for the state inside that store. Maybe an empty object?

所以，一点关于 Redux 的事情就是：它并不是太智能。你可能觉得它应该在

But no: Redux makes zero assumptions about the shape of your state. It’s up to you! It could be an object, or a number, or a string, or whatever you need. So we have to provide a function that will return the state. That function is called a **reducer** (we’ll see why in a minute). So let’s make the simplest one possible, pass it into `createStore`, and see what happens:

然而并不是：Redux 并不会对你的 state 做任何假设。这完全取决于你！它可以是一个对象、一个数字、字符串或者任何你希望的结构。因此我们需要提供一个能够返回 state 的函数。这个函数就被称作 **reducer** （稍后我们会对它进行说明）。我们用最简单的方式来实现，直接将它传给 `createStore`，看看会发生什么：

```js
function reducer() {
  // just gonna leave this blank for now
  // which is the same as `return undefined;`
}

const store = createStore(reducer);
```

## The Reducer Should Always Return Something 【Reducer 始终应该有返回值】

The error is different now:

现在报的错又有所不同了：

      Cannot read property ‘count’ of undefined

It’s breaking because we’re trying to access `state.count`, but `state` is undefined. Redux expected our `reducer` function to return a value for `state`, except that it (implicitly) returned `undefined`. Things are rightfully broken.

导致执行中断的原因是因为我们访问 `state.count`，而 `state` 又未定义。Redux 期望我们提供的 `reducer` 函数能够为 `state` 返回一个值，而非返回 `undefined`。因此理所当然的在这里出现了中断。

The reducer is expected to return the state. It’s actually supposed to take the current state and return the new state, but nevermind; we’ll come back to that.

Redux 预期 reducer 会返回 state。它实际上假设会得到当前的 state 作为参数，返回新的 state，但没关系，我们一会儿会过来看。

Let’s make the reducer return something that matches the shape we need: an object with a `count` property.

我们让 reducer 返回我们需要的 state 结构：一个包含 `count` 属性的对象。

```js
function reducer() {
  return {
    count: 42
  };
}
```

Hey! It works! The count now appears as “42”. Awesome.

哈！起作用了！现在计数值（count）是 “42”。真棒。

Just one thing though: the count is forever stuck at 42.

但还有一件事：计数值 count 永远都是 42。

## The Story So Far 【总结一下目前为止所做的事情】

Before we get into how to actually update the counter, let’s look at what we’ve done up til now:

在深入了解如何更新计数值前，我们先来看看目前为止我们做了些什么：

- We wrote a `mapStateToProps` function that does what the name says: transforms the Redux state into an object containing props.

> 写了一个 `mapStateToProps` 函数，它完成的操作就如它名字表示的那样：将 Redux 中的状态数据转换到一个对象中去。

- We connected the Redux store to our `Counter` component with the `connect` function from `react-redux`, using the `mapStateToProps` function to configure how the connection works.

> 使用 `react-redux` 提供的 `connect` 函数将 Redux store 关联到 `Counter` 组件，使用 `mapStateToProps` 函数来配置具体如何进行关联。

- We created a `reducer` function to tell Redux what our state should look like.

> 创建了一个 `reducer` 函数来告诉 Redux 我们希望 state 应该是什么结构。

- We used the ingeniously-named `createStore` function to create a store, and passed it the `reducer`.

> 使用 `createStore` 来创建 store 并传给 `reducer`。

- We wrapped our whole app in the `Provider` component that comes with `react-redux`, and passed it our store as a prop.

> 用 `react-redux` 提供的 `Provider` 组件来包装整个应用，并把 store 作为属性传递给它。

- The app works flawlessly, except the fact that the counter is stuck at 42.

> 除了计数值一直是 42 之外，应用完美运行。

With me so far?

还在跟着我的节奏一起吗？

## Interactivity (Making It Work) 【互动 （使其发挥作用）】

So far this is pretty lame, I know. You could’ve written a static HTML page with the number “42” and 2 broken buttons in 60 seconds flat, yet here you are, reading how to overcomplicate that very same thing with React and Redux and who knows what else.



I promise this next section will make it all worthwhile.

Actually, no. I take that back. A simple Counter app is a great teaching tool, but Redux is absolutely overkill for something like this. React state is perfectly fine for something so simple. Heck, even plain JS would work great. Pick the right tool for the job. Redux is not always that tool. But I digress.

## Initial State 【初态（state）】

So we need a way to tell Redux to change the counter.

因此我们需要一种方式了告诉 Redux 改变计数值。

Remember the `reducer` function we wrote? (of course you do, it was 2 minutes ago)

还记得我们写的 `reducer` 函数吗？（当然，那才 2 分钟之前）

Remember how I mentioned it takes the current state and returns the new state? Well, I lied again. It actually takes the current state and an action, and then it returns the new state. We should have written it like this:

还记得我之前说的它以当前 state 作为参数返回一个新的 state 吗？我有一次说了谎。实际上它是以当前 state 和一个 action 作为入参，返回新的 state。我们应该这样写：

```js
function reducer(state, action) {
  return {
    count: 42
  };
}
```

The very first time Redux calls this function, it will pass `undefined` as the `state`. That is your cue to return the initial state. For us, that’s probably an object with a `count` of 0.

Redux 在最初调用这个函数的时候会以 `undefined` 作为 `state`。这就是你为什么要返回初始状态。对于我们来说，它应该是一个包含 `count` 值为 0 的对象。

It’s common to write the initial state above the reducer, and use ES6’s default argument feature to provide a value for the `state` argument when it’s undefined.

将初始 state 写在 reducer 前面是一种很普遍的做法，ES6 的默认值参数也会在当 `state` 为 undefined 的时候为它提供一个值。

```js
const initialState = {
  count: 0
};

function reducer(state = initialState, action) {
  return state;
}
```

Try this out. It should still work, except now the counter is stuck at 0 instead of 42. Awesome.

尝试一下。它应该也能工作，只是计数值现在一直是 0 而不是 42 了。棒。

## Action

We’re finally ready to talk about the `action` parameter. What is it? Where does it come from? How can we use it to change the damn counter?

我们终于要谈到 `action` 参数了。它是什么？它来自哪里？我们需要如何用它来改变该死的计数值？

An “action” is a JS object that describes a change that we want to make. The only requirement is that the object needs to have a `type` property, and its value should be a string. Here’s an example of an action:

一个 “action” 就是一个描述我们希望如何去改变 state 的 JS 对象。它唯一必须的属性就是 `type`，它的值应该是一个字符串。下面是一个 action 的示例：

```js
{
  type: "INCREMENT"
}
```

Here’s another one:

另一个 action 示例：

```js
{
  type: "DECREMENT"
}
```

Are the gears turning in your head? Do you know what we’re gonna do next?

你脑海中是否已经跑起来了呢？你知道接下来我们要做什么了吗？

## Respond to Actions 【对 Action 做出响应】

Remember the reducer’s job is to take the current state and an action and figure out the new state. So if the reducer received an action like `{ type: "INCREMENT" }`, what might you want to return as the new state?

记住，reducer 的工作就是用当前的 state 和一个 action 参数来确定接下来的 state 该是什么样子。因此如果 reducer 接收一个像 `{ type: "INCREMENT" }` 这样的 action，你希望以什么作为新的 state 返回呢？

If you answered something like this, you’re on the right track:

如果你回答了这样的问题，说明你还走在正确的轨道上：

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

一种通常的做法是使用 `switch` 语句来处理每一种情况。将 reducer 改成下面这样：

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

### Always Return a State 【总是需要返回一个 state】

You’ll notice that there’s always the fallback case where all it does is `return state`. This is important, because Redux can (will) call your reducer with actions that it doesn’t know what to do with. In fact, the very first action you’ll receive is `{ type: "@@redux/INIT" }`. Try putting a `console.log(action)` above the `switch` and see.

你会发现默认情况下始终都会 `return state`。这是很重要的做法，因为 Redux 会用一些并不知道该如何处理的 action 来调用你的 reducer。实际上，你最开始收到的 action 是 `{ type: "@@redux/INIT" }`。尝试在 `switch` 前面放个 `console.log(action)` 看看吧。

Remember that the reducer’s job is to return a new state, even if that state is unchanged from the current one. You never want to go from “having a state” to “state = undefined”, right? That’s what would happen if you left off the `default` case. Don’t do that.

记住，reducer 的工作就是返回一个新的 state，即便新的 state 和当前 state 并没有任何改变。你肯定不希望从 “有 state” 的情况变成 “state 为 undefined” 的情况，是吧？但如果你漏了 `default` 的情况就会发生这样的事情。千万别那么做。

### Never Change State 【永远不要修改 state】

One more thing to never do: do not mutate the `state`. State is immutable. You must never change it. That means you can’t do this:

千万不要做的另一件事就是：不要修改 `state`。state 是不可修改的。永远都不要修改它。因此你不能像下面这样做：

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

你也不能做像 `state.foo = 7` 或 `state.items.push(newItem)` 或 `delete state.something` 这样的事情。

Think of it like a game where the only thing you can do is `return { ... }`. It’s a fun game. Maddening at first. But you’ll get better at it with practice.

把它当做是一个游戏，你唯一能做的就是 `return { ... }`。这是一个有趣的游戏，一开始会抓狂，但慢慢会越来越好。

I put together a short guide on [how to do immutable updates](https://daveceddia.com/react-redux-immutability-guide/), showing 7 common patterns for updating state within objects and arrays.

我整理了一份关于 [如何执行不可变更新操作](https://daveceddia.com/react-redux-immutability-guide/) 的总结，它展示了 7 种关于更新 state 中对象和数组的常用模式。

### All These Rules… 【所有的规则】

Always return a state, never change state, don’t connect every component, eat your broccoli, don’t stay out past 11… it’s exhausting. It’s like a rules factory, and I don’t even know what that is.

总是需要返回一个 state。永远不要修改它，不要关联每一个组件，多吃西兰花，11 点后不要呆在外面...... 这是些磨人的规则。看起来就像是规则工厂，然而我也不知道它是个什么东西。

Yeah, Redux can be like an overbearing parent. But it comes from a place of love. Functional programming love.

是的，Redux 看起来就像是一个霸道的家长。但它来自一个有爱的地方。函数式编程之爱。

Redux is built on the idea of immutability, because mutating global state is the road to ruin.

Redux 基于不变性原则。因为修改全局 state 就是在走向毁灭。

Have you ever kept a global object and used it to pass state around an app? It works great at first. Nice and easy. And then the state starts changing in unpredictable ways and it becomes impossible to find the code that’s changing it.

你曾经是否维护了一个全局对象并且用它来在整个应用中传递 state？一开始没什么问题。既简单又漂亮。然后 state 开始以不可预测的方式进行修改并且几乎不可能找到是哪里在对它进行修改。

Redux avoids these problems with some simple rules. State is read-only, and actions are the only way to modify it. Changes happen one way, and one way only: action -> reducer -> new state. The reducer function must be “pure” – it cannot modify its arguments.

Redux 使用一些简单的规则来避免这些问题。State 是只读的，并且 action 是唯一可以修改它的方式。改变是单向的，而且只能是单向的：action -> reducer -> 新 state。reducer 必须是纯函数 —— 它不会修改自己的参数。

There are even addon packages that let you log every action that comes through, rewind and replay them, and anything else you could imagine. Time-travel debugging was one of the original motivations for creating Redux.

甚至有一些插件可以记录每一个通过的 action，能够进行回退和重播它们，或者任何其它你能够想到的事情。时间回退（time-travel）调试是创建 Redux 最初的动机之一。

## Where Do Actions Come From? 【Action 来自哪里】

One piece of this puzzle remains: we need a way to feed an action into our reducer function so that we can increment and decrement the counter.

难题仍然存在：我们需要一种方式能够将 action 提供给 reducer 函数以便能够对计数值进行增减。

Actions are not born, but they are **dispatched**, with a handy function called `dispatch`.

Action 不是凭空来的，而是被一个称作 `dispatch` 的函数 **派发** 过来的。

The `dispatch` function is provided by the instance of the Redux store. That is to say, you can’t just `import { dispatch }` and be on your way. You can call `store.dispatch(someAction)`, but that’s not very convenient since the `store` instance is only available in one file.

`dispatch` 函数是 Redux store 实例提供的一个方法。也就是说，你不能只 `import { dispatch }` 并继续。你可以调用 `store.dispatch(someAction)`，但这也并不方便，因为 `store` 实例只能在一个文件中可用。

As luck would have it, the `connect` function has our back. In addition to injecting the result of `mapStateToProps` as props, `connect` also injects the `dispatch` function as a prop. And with that bit of knowledge, we can finally get the counter working again.

幸运的是，我们得到了 `connect` 函数的支持。除了将 `mapStateToProps` 的结果作为属性注入意外，`connect` 还将 `dispatch` 函数作为属性注入。有了这些，我们就可以让计数器再次运作了。

Here is the final component in all its glory. If you’ve been following along, the only things that changed are the implementations of `increment` and `decrement`: they now call the `dispatch` prop, passing it an action.

下面是组件的最终效果。如果你一直跟着我在做，唯一需要改变的就是 `increment` 和 `decrement` 的实现：现在它们调用 `dispatch` 属性，给它传递一个 action 入参。

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

完整的项目代码可以在 [Github](https://github.com/dceddia/redux-intro) 获取到。

## What Now? 【现在】

With the Counter app under your belt, you are well-equipped to learn more about Redux.

有了计数器应用的经验，你就可以去了解更多关于 Redux 的知识了。

      “What?! There’s more?!”
      “什么？！还有更多？！”

There is much I haven’t covered here, in hopes of making this guide easily digestible – action constants, action creators, middleware, thunks and asynchronous calls, selectors, and on and on. There’s a lot. The [Redux docs](https://redux.js.org/) are well-written and cover all that and more.

还有很多我这里没有覆盖到的知识点，为了让这篇指南易于消化 —— action 常量，action 创建器，中间件，thunk 和异步调用，选择器等等这些都没有包含在这里。 [Redux 文档](https://redux.js.org/) 写的不错，它包含了上面的所有内容。

But you’ve got the basic idea now. Hopefully you understand how data flows in Redux (`dispatch(action) -> reducer -> new state -> re-render`), and what a reducer does, and what an action is, and how that all fits together.

但是你现在已经有基础知识了。希望你了解 Redux 中数据流是如何传播的 (`dispatch(action) -> reducer -> new state -> re-render`)，reducer 是做什么的， action 是做什么的，它们是如何协作的。

I’m putting together a new course that will cover all of this and more! You can read more about that [here](https://daveceddia.com/refactoring-to-redux/).

我正在整理一门新的课程，它会包含所有这些内容！你可以到[这里](https://daveceddia.com/refactoring-to-redux/)来看它。

