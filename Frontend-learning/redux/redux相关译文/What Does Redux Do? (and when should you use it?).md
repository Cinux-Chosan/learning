# What Does Redux Do? (and when should you use it?) 【Redux 有什么用（什么时候会用到它）】（已校验）

Struggling to wrap your head around Redux? Don’t worry, you’re not alone.

在学习 Redux 的路上苦苦挣扎？别担心，还有我呢。

I’ve heard from many, many people that Redux is the biggest barrier to writing the React apps they want to.

我从很多人那里了解到 Redux 是他们开发 React 应用最大的障碍。

By the end of this post you’ll understand what Redux is for, and how to know when it’s time to add it to your own app.

读完本文你将了解到 Redux 是干什么的，以及什么使用会用到它。

## Why? 【为什么要用 Redux】

The best question to start with is, Why should we use Redux at all?

如果非要以一个问题来引出下文，那就是为什么我们要使用 Redux ？

And the answer isn’t “because everyone else on the internet is using it.” (I don’t doubt that’s why a lot of people are using it, but let’s go deeper.)

问题的答案并不是 “因为互联网人都在用它。”

The reason Redux is useful is that it solves a problem.

而是因为它解决了一个问题。

And no, the problem it solves is not “state management.” That’s super vague. Heck, React already does state management. Redux does help manage state, but that’s not the problem it solves.

这个问题并不是 “状态管理。”，这是一种非常模糊的说法。React 已经做了状态管理。Redux 只是辅助状态管理，但这并不是它解决的问题。

## It’s About Data Flow （）

If you’ve used React for more than a few minutes, you probably know about props and one-way data flow. Data is passed down the component tree via props. Given a component like this:

如果你已经使用了一段时间的 React，你应该知道 props 和单项数据流。组件树中的数据通过 props 向下进行传递。假定有个像下面这样的组件：

![](https://daveceddia.com/images/counter-component@2x.png)

The `count`, stored in `App`’s state, would be passed down as a prop:

存放在 `App` state 中的 `count` 会被当做 prop 向下传递：

![](https://daveceddia.com/images/passing-props-down@2x.png)

For data to come back up the tree, it needs to flow through a callback function, so that callback function must be passed down to any components that want to pass data up.

对于那些需要向上传递的数据，则需要通过回调函数的方式来做，因此回调函数也必须向下传递给那些需要向上传递数据的组件。

![](https://daveceddia.com/images/passing-callbacks-down@2x.png)

You can think of the data like electricity, connected by colored wires to the components that care about it. Data flows down and up through these wires, but the wires can’t be run through thin air – they have to be connected between each component in the tree.

你可以将数据想象成是电流，组件通过电线跟数据联系在一起。数据在这些电线中进行上下传递，但又不能只有电线 —— 它们需要跟组件进行关联。

This is all review, hopefully. (If not, you should stop here, [go learn React](https://daveceddia.com/learning-react-start-small/), build a [couple small apps](https://daveceddia.com/react-practice-projects/), and come back in a few days. Seriously. Redux is gonna make no sense until you understand how React works.).

到此这就是这个示例所有的回顾内容。（如果你并不清楚是怎么回事，请你即刻停止阅读，[先去学习 React](https://daveceddia.com/learning-react-start-small/), 构建 [几个小的应用程序](https://daveceddia.com/react-practice-projects/), 然后过几天再倒回这里来看。真的，在你了解 React 是如何工作之前，Redux 对你来说没有任何意义。）。

## Layers and Layers of Data Flow 【层级和数据流层级】

Sooner or later you run into a situation where a top-level container has some data, and a child 4 levels down needs that data. Here’s a screenshot of Twitter, with all the avatars highlighted:

你迟早会遇到这样一种情况：顶级容器组件中的一些数据需要被其下 4 层的子组件所用到。这里有一个来自 Twitter 的截图，所有头像都被标注出来了：

![](https://daveceddia.com/images/twitter-user-data@2x.png)

Let’s say the user’s avatar is stored as part of their profile data, and the top-level `App` component holds the user. In order to deliver the `user` data to the all 3 `Avatar` components, the `user` needs to be woven through a bunch of intermediate components that don’t need the data.

假设用户头像作为用户个人数据的一部分被存在在顶级 `App` 组件中。为了将 `user` 代表的数据传递到这 3 个 `Avatar` 组件，`user` 需要通过一堆不需要用到它的组件来帮助传递。

![](https://daveceddia.com/images/twitter-hierarchy@2x.png)

Getting the data down there is like threading a needle through a mining expedition. Wait that doesn’t make any sense. Anyway, it’s a pain in the ass.

获取数据就像是大海捞针一样的艰难。而且这样做根本没有任何意义，它就是个痛点。

More than that, it’s not very good software design. Intermediate components in the chain must accept and pass along props that they don’t care about. This means refactoring and reusing components from that chain will be harder than it needs to be.

更重要的是，这并不满足一个好的软件设计规范。那些传递数据的中间组件不得不接收和传递那些它们并不需要关心的属性。这也意味着对这些组件的重构和重用都会变得更加困难。

Wouldn’t it be nice if the components that didn’t need the data didn’t have to see it at all?

如果数据对于那些用不到它们的组件来说是完全透明的就好了。

## Plug Any Data Into Any Component 【将任意数据插入到任意组件中】

This is the problem that Redux solves. It gives components direct access to the data they need.

这就是 Redux 解决的问题。它使得组件能够直接访问它们需要的数据（即不需要其它组件来间接传递数据）。

Using the `connect` function that comes with Redux, you can plug any component into Redux’s data store, and the component can pull out the data it requires.

使用 Redux 提供的 `connect` 函数可以将任意组件与 Redux 的数据存储关联起来，此后组件就可以在需要时去拉取数据。

![](https://daveceddia.com/images/redux-connected-twitter@2x.png)

This is Redux’s raison d’etre.

这就是 Redux 存在的理由。

Yeah, it also does some other cool stuff too, like make debugging easier (Redux DevTools let you inspect every single state change), time-travel debugging (you can roll back state changes and see how your app looked in the past), and it can make your code more maintainable in the long run. It’ll teach you more about functional programming too.

是的。它还有一些其它很酷的特性，如让调试变得更简单（Redux DevTools 让你能够观察每次发生在单个 state 上的改变），状态回滚（你可以回滚状态以便查看当时的应用程序），并且长期来说你还可以提升代码的可维护性。它还能够教会你很多关于函数式编程方面的知识。

But this thing here, “plug any data into any component,” is the main event. If you don’t need that, you probably don’t need Redux.

但应该以 “将任意数据插入到任意组件” 的目的作为主导。如果你不需要它，你可能根本用不着 Redux。

### The `Avatar` Component 【`Avatar` 组件】

To tie all this back to code, here’s an example of the `Avatar` component from above:

现在回到代码上，看看上面的 `Avatar` 示例组件：

```jsx
import React from 'react';
import { connect } from 'react-redux';

const Avatar = ({ user }) => (
  <img src={user.avatar}/>
);

const mapStateToProps = state => ({
  user: state.user
});

export { Avatar };
export default connect(mapStateToProps)(Avatar);
```

The component itself doesn’t know about Redux – it just accepts a `user` prop and renders the avatar image. The `mapStateToProps` function extracts the `user` from Redux’s store and maps it to the `user` prop. Finally, the `connect` function is what actually feeds the data from Redux through `mapStateToProps` and into `Avatar`.

组件自身并不知道 Redux —— 它只管接收一个叫 `user` 的 prop 并把用户头像渲染出来。`mapStateToProps` 函数从 Redux store 中提取出 `user` 并映射为组件自身的 `user` prop。最终，实际上就是 `connect` 函数通过 `mapStateToProps` 将数据从 Redux 中拿出来提供给了 `Avatar`。

You’ll notice there are two `exports` at the end – a named one, and a default. This isn’t strictly necessary, but it can be useful to have access to the raw component and the Redux-wrapped version of it.

你也许注意到了在最后有两个 `exports` —— 一个有名字，一个是 default。这并非必须，但是对于可能会用到源组件和被 Redux 包装后的组件版本会比较有用。

The raw component is useful to have when writing unit tests, and can also increase reusability. For example, part of the app might want to render an `Avatar` for another user other than the signed-in user. In that case, you could even go a step further and export the Redux-connected version as `CurrentUserAvatar` to make the code clearer.

对于编写单元测试来说源组件会很有用，并且能够提升可重用性。例如，应用的某一部分希望 `Avatar` 展示其他用户而非当前登录用户。在这样的情况下，你甚至可以更进一步，把 Redux 关联的版本导出为 `CurrentUserAvatar`，从而让代码看起来更简洁。

## When To Add Redux 【何时需要用到 Redux】

If you have a component structure like the one above – where props are being forwarded down through many layers – consider using Redux.

如果你有一个组件的结构跟前面提到的一样 —— prop 需要多层传递 —— 请考虑使用 Redux。

If you need to cache data between views – for instance, loading data when the user clicks on a detail page, and remembering the data so the next access is fast – consider storing that data in Redux.

如果你需要在多个视图之间缓存数据 —— 例如，在用户点击详情页的时候加载并缓存数据以便提升下一次的访问速度 —— 请考虑将数据存放在 Redux 中。

If your app will be large, maintaining vast data, related and not – consider using Redux. But also consider starting without it, and adding it when you run into a situation where it will help.

如果你的应用变得越来越大，需要维护大量数据的时候，不管这之间是否有关联 —— 请考虑使用 Redux。但一开始应该从不使用 Redux 的情况入手，在你觉得你需要它的时候再将它添加进你的项目里。

## Up Next 【接下来做什么】

Read [Part 2 of this series](https://daveceddia.com/how-does-redux-work) where we’ll dive into the details of Redux: how to set it up, and how the important pieces fit together (actions and reducers and stores oh my!).

阅读 [本系列第二部分](https://daveceddia.com/how-does-redux-work)，我们将深入 Redux：如何配置它，如何将各个重要的部分组合起来（action、reducer 和 store）。

## Translations 【翻译】

You can [read this in Russian](http://howtorecover.me/cto-delaet-redux) thanks to translation [by howtorecover.me](http://howtorecover.me/).

你可以查看 [howtorecover.me](http://howtorecover.me/) 翻译的[俄语版](http://howtorecover.me/cto-delaet-redux)。

[点击查看原文](https://daveceddia.com/what-does-redux-do/)