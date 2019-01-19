# Thinking in React

React is, in our opinion, the premier way to build big, fast Web apps with JavaScript. It has scaled very well for us at Facebook and Instagram.

在我们看来，React 是使用 JavaScript 来构建大型、快速 Web 应用程序的首选方式。它在Facebook 和 Instagram 中表现非常好。

One of the many great parts of React is how it makes you think about apps as you build them. In this document, we’ll walk you through the thought process of building a searchable product data table using React.

React 可以使你在构建应用的时候对它们进行思考。在这篇文档中，我们将带你使用 React 来构建一个可搜索的产品数据表。

## Start With A Mock

*译者注：Mock 在这里理解为设计稿更好（或者原型，但设计稿更贴近），下面翻译为设计稿。*

Imagine that we already have a JSON API and a mock from our designer. The mock looks like this:

想象一下我们已经从设计师那里拿到了 JSON API 和设计稿，设计稿看起来如下：

![](https://reactjs.org/static/thinking-in-react-mock-1071fbcc9eed01fddc115b41e193ec11-4dd91.png)

Our JSON API returns some data that looks like this:

我们的 JSON API 返回下面的格式：

```json
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Step 1: Break The UI Into A Component Hierarchy（第一步：将 UI 划分为组件层级）

The first thing you’ll want to do is to draw boxes around every component (and subcomponent) in the mock and give them all names. If you’re working with a designer, they may have already done this, so go talk to them! Their Photoshop layer names may end up being the names of your React components!

首先你需要做的就是在设计稿中圈出每个组件（和子组件）并给它们命名。如果你和设计师在一起工作，他们可能已经这么做了，因此可以直接问他们！他们 Photoshop 层级的名字可能就是你 React 组件最终的名字！ 

But how do you know what should be its own component? Just use the same techniques for deciding if you should create a new function or object. One such technique is the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), that is, a component should ideally only do one thing. If it ends up growing, it should be decomposed into smaller subcomponents.

但是你又怎么知道组件应该由哪些部分组成呢？这里要用到和创建新函数或者对象一样的决策方式，那就是 [单一责任原则](https://en.wikipedia.org/wiki/Single_responsibility_principle)，即一个组件只负责做一件事情。如果你发现它的功能在增长的话就应该把它拆分成更多实现单一功能的子组件。

Since you’re often displaying a JSON data model to a user, you’ll find that if your model was built correctly, your UI (and therefore your component structure) will map nicely. That’s because UI and data models tend to adhere to the same information architecture, which means the work of separating your UI into components is often trivial. Just break it up into components that represent exactly one piece of your data model.

如果你经常将 JSON 数据展示给用户，你就会发现如果你的数据层（model）构建准确，那你的 UI （和组件结构）层将能够很好的把数据映射出来。

![](https://reactjs.org/static/thinking-in-react-components-eb8bda25806a89ebdc838813bdfa3601-82965.png)

You’ll see here that we have five components in our simple app. We’ve italicized the data each component represents.

这儿可以看到我们对这个简单的应用划分了 5 个组件。

- **FilterableProductTable (orange)**: contains the entirety of the example
>> **FilterableProductTable (橙色)**: 包含整个应用
- **SearchBar (blue)**: receives all user input
>> **SearchBar (蓝色)**: 接收用户的输入
- **ProductTable (green)**: displays and filters the data collection based on user input
>> **ProductTable (绿色)**: 根据用户的输入对数据进行过滤和展示
- **ProductCategoryRow (turquoise)**: displays a heading for each category
>> **ProductCategoryRow (天蓝色)**: 显示每一项分类的标题
- **ProductRow (red)**: displays a row for each product
>> **ProductRow (red)**: 展示每项产品

If you look at `ProductTable`, you’ll see that the table header (containing the “Name” and “Price” labels) isn’t its own component. This is a matter of preference, and there’s an argument to be made either way. For this example, we left it as part of `ProductTable` because it is part of rendering the data collection which is `ProductTable`’s responsibility. However, if this header grows to be complex (i.e. if we were to add affordances for sorting), it would certainly make sense to make this its own `ProductTableHeader` component.

如果你仔细看 `ProductTable`，你会发现表头（包含 “Name” 和 “Price” 标签）并没有独立成一个组件。这只是一个偏好问题，不管是单独作为一个组件还是放在 `ProductTable` 里面都无伤大雅。这个例子中，我们让它成为 `ProductTable` 的一部分，因为它也是渲染数据集的一部分，这正是 `ProductTable` 的职责。然而，如果头部变得复杂（如：我们需要添加可供选择的分类）那我们就应该将它独立成 `ProductTableHeader` 组件。

Now that we’ve identified the components in our mock, let’s arrange them into a hierarchy. This is easy. Components that appear within another component in the mock should appear as a child in the hierarchy:

现在我们已经在设计稿中区分出来了各个组件，下面将它们按如下层级罗列出来。在圈出的设计稿中某个组件内部的组件就是这个组件的子组件：

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## Step 2: Build A Static Version in React

<p data-height="265" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js,result" data-user="gaearon" data-pen-title="Thinking In React: Step 4" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" class="codepen"><span>See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ/">Thinking In React: Step 4</a> by Dan Abramov (<a href="https://codepen.io/gaearon">@gaearon</a>) on <a href="https://codepen.io">CodePen</a>.</span></p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

Now that you have your component hierarchy, it’s time to implement your app. The easiest way is to build a version that takes your data model and renders the UI but has no interactivity. It’s best to decouple these processes because building a static version requires a lot of typing and no thinking, and adding interactivity requires a lot of thinking and not a lot of typing. We’ll see why.

现在已经定好了组件的层级结构，是时候动手开发了。最简单的方式就是先构建一个能把数据转成 UI 的没有交互的版本。最好将这些过程解耦，因为构建静态版本需要的是多编码少思考，而添加交互性需要多思考而少编码。稍后我们会明白这是为什么。

To build a static version of your app that renders your data model, you’ll want to build components that reuse other components and pass data using props. props are a way of passing data from parent to child. If you’re familiar with the concept of state, **don’t use state at all** to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don’t need it.

要构建能呈现数据模型的应用程序的静态版本，需要构建可重用其他组件并使用 props 来传递数据的组件。props 是一种从父组件传递到子组件的方式。如果你对 state 的概念比较熟悉，但请不要使用 state 来构建这个静态版本。 State 只用来进行交互，也就是说，只用来存放那些随时间发生改变的数据。因为这是一个静态版本，因此你并不需要它。

You can build top-down or bottom-up. That is, you can either start with building the components higher up in the hierarchy (i.e. starting with `FilterableProductTable`) or with the ones lower in it (`ProductRow`). In simpler examples, it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up and write tests as you build.

你可以自上而下或自下而上地来构建这个应用。也就是说，你可以选择从之前划分出来的层级的顶级（`FilterableProductTable`）开始开发，也可以从层级的末梢（`ProductRow`）开始开发。在比较简单的项目中，通从自上而下会比较容易一些，在大型项目中则相反，自下而上的开发和编写测试会更容易。

At the end of this step, you’ll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `ReactDOM.render()` again, the UI will be updated. It’s easy to see how your UI is updated and where to make changes since there’s nothing complicated going on. React’s one-way data flow (also called one-way binding) keeps everything modular and fast.

在这一步结尾的时候，你应该已经完成了一系列展示用户数据的可重用组件库。这些组件只有 `render()` 方法，因为这只是当前应用的一个静态版本。组件顶层 (`FilterableProductTable`) 将会以一个属性来接收数据。如果你改变所依赖的数据然后调用 `ReactDOM.render()` 方法则会更新 UI 界面。由于没有什么复杂的事情发生， 因此你很容易看出 UI 是如何更新的以及在在哪些地方进行了更改。React 的单向数据流（也称作单向绑定）使得代码更具模块化和更快的执行速度。

Simply refer to the [React docs](https://reactjs.org/docs/) if you need help executing this step.

如果你在完成这一步需要任何帮助请参考 [React docs](https://reactjs.org/docs/)

### A Brief Interlude: Props vs State

There are two types of “model” data in React: props and state. It’s important to understand the distinction between the two; skim [the official React docs](https://reactjs.org/docs/interactivity-and-dynamic-uis.html) if you aren’t sure what the difference is.

在 React 中有两种类型的数据： props 和 state。理解二者的区别是非常重要的。如果你不太确定他们之间的不同请浏览 [React 官方文档](https://reactjs.org/docs/interactivity-and-dynamic-uis.html)

## Step 3: Identify The Minimal (but complete) Representation Of UI State

To make your UI interactive, you need to be able to trigger changes to your underlying data model. React makes this easy with **state**.

为了让 UI 具有交互性，你需要能够触发 UI 所依赖的数据发生改变。React 的 **state** 可以轻松胜任这份工作。

To build your app correctly, you first need to think of the minimal set of mutable state that your app needs. The key here is [DRY: Don’t Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Figure out the absolute minimal representation of the state your application needs and compute everything else you need on-demand. For example, if you’re building a TODO list, just keep an array of the TODO items around; don’t keep a separate state variable for the count. Instead, when you want to render the TODO count, simply take the length of the TODO items array.

为了正确的构建你的应用，你首先需要思考应用所需要的最小可变状态集。这里的关键是 [DRY: Don’t Repeat Yourself](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) 原则。找出应用需要的最小绝对状态，其他的则通过按需计算得出。例如，如果你正在编写一个 TODO 列表，那么久只需要保留包含每一项 TODO 项的数组；不要保存一个独立的 count 变量，而应该是在你需要 count 的时候通过数组的 length 来获取。

Think of all of the pieces of data in our example application. We have:

思考一下当前示例应用所需要的所有数据。我们有如下：

- The original list of products
>> 原始产品列表
- The search text the user has entered
>> 用户输入的搜索文本
- The value of the checkbox
>> 复选框的值
- The filtered list of products
>> 产品过滤列表 

The original list of products is passed in as props, so that’s not state. The search text and the checkbox seem to be state since they change over time and can’t be computed from anything. And finally, the filtered list of products isn’t state because it can be computed by combining the original list of products with the search text and value of the checkbox.

原始产品列表是通过 props 而非 state 传入组件。搜索文本和复选框则使用 state 因为它们会在不同的时刻发生改变并且不能通过其他数据计算出来。最后，过滤后的产品列表不用 state，因为它可以根据产品原始列表和搜索文本以及复选框的值来计算得出。

So finally, our state is:

最后，我们得到的 state 如下：

- The search text the user has entered
>> 用户输入的搜索文本
- The value of the checkbox
>> 复选框的值

## Step 4: Identify Where Your State Should Live

<p data-height="265" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js,result" data-user="gaearon" data-pen-title="Thinking In React: Step 4" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" class="codepen"><span>See the Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ/">Thinking In React: Step 4</a> by Dan Abramov (<a href="https://codepen.io/gaearon">@gaearon</a>) on <a href="https://codepen.io">CodePen</a>.</span></p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

OK, so we’ve identified what the minimal set of app state is. Next, we need to identify which component mutates, or owns, this state.

OK，我们已经确定了应用所需的最小状态集。下一步就是确定某个组件具体负责哪些状态。

Remember: React is all about one-way data flow down the component hierarchy. It may not be immediately clear which component should own what state. **This is often the most challenging part for newcomers to understand**, so follow these steps to figure it out:

记住： React 中的一切的组件层级结构都是围绕单项数据流。因此可能并不能立马分清楚哪个组件负责哪个状态。**这也经常会成为新手最难掌握的一部分**，你可以根据以下步骤来区分它们：

For each piece of state in your application:

你应用中的每一个 state 应该满足：

- Identify every component that renders something based on that state.
- Find a common owner component (a single component above all the components that need the state in the hierarchy).
- Either the common owner or another component higher up in the hierarchy should own the state.
- If you can’t find a component where it makes sense to own the state, create a new component simply for holding the state and add it somewhere in the hierarchy above the common owner component.

Let’s run through this strategy for our application:

- `ProductTable` needs to filter the product list based on state and `SearchBar` needs to display the search text and checked state.
- The common owner component is `FilterableProductTable`.
- It conceptually makes sense for the filter text and checked value to live in `FilterableProductTable`

Cool, so we’ve decided that our state lives in `FilterableProductTable`. First, add an instance property `this.state = {filterText: '', inStockOnly: false}` to `FilterableProductTable`’s `constructor` to reflect the initial state of your application. Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as a prop. Finally, use these props to filter the rows in `ProductTable` and set the values of the form fields in `SearchBar`.

You can start seeing how your application will behave: set `filterText` to `"ball"` and refresh your app. You’ll see that the data table is updated correctly.

## Step 5: Add Inverse Data Flow

<p data-height="265" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="gaearon" data-pen-title="Thinking In React: Step 5" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid black; margin: 1em 0; padding: 1em;" class="codepen"><span>See the Pen <a href="https://codepen.io/gaearon/pen/LzWZvb/">Thinking In React: Step 5</a> by Dan Abramov (<a href="https://codepen.io/gaearon">@gaearon</a>) on <a href="https://codepen.io">CodePen</a>.</span></p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

So far, we’ve built an app that renders correctly as a function of props and state flowing down the hierarchy. Now it’s time to support data flowing the other way: the form components deep in the hierarchy need to update the state in `FilterableProductTable`.

React makes this data flow explicit to make it easy to understand how your program works, but it does require a little more typing than traditional two-way data binding.

If you try to type or check the box in the current version of the example, you’ll see that React ignores your input. This is intentional, as we’ve set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.

Let’s think about what we want to happen. We want to make sure that whenever the user changes the form, we update the state to reflect the user input. Since components should only update their own state, `FilterableProductTable` will pass callbacks to `SearchBar` that will fire whenever the state should be updated. We can use the `onChange` event on the inputs to be notified of it. The callbacks passed by `FilterableProductTable` will call `setState()`, and the app will be updated.

Though this sounds complex, it’s really just a few lines of code. And it’s really explicit how your data is flowing throughout the app.

## And That’s It
Hopefully, this gives you an idea of how to think about building components and applications with React. While it may be a little more typing than you’re used to, remember that code is read far more than it’s written, and it’s extremely easy to read this modular, explicit code. As you start to build large libraries of components, you’ll appreciate this explicitness and modularity, and with code reuse, your lines of code will start to shrink. :)