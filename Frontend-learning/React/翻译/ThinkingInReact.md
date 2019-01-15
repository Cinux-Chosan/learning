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

Now that we’ve identified the components in our mock, let’s arrange them into a hierarchy. This is easy. Components that appear within another component in the mock should appear as a child in the hierarchy:

- `FilterableProductTable`
  - `SearchBar`
  - `ProductTable`
    - `ProductCategoryRow`
    - `ProductRow`

## Step 2: Build A Static Version in React

<iframe height='265' scrolling='no' title='Thinking In React: Step 2' src='//codepen.io/gaearon/embed/BwWzwm/?height=265&theme-id=0&default-tab=js,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/gaearon/pen/BwWzwm/'>Thinking In React: Step 2</a> by Dan Abramov (<a href='https://codepen.io/gaearon'>@gaearon</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

Now that you have your component hierarchy, it’s time to implement your app. The easiest way is to build a version that takes your data model and renders the UI but has no interactivity. It’s best to decouple these processes because building a static version requires a lot of typing and no thinking, and adding interactivity requires a lot of thinking and not a lot of typing. We’ll see why.

To build a static version of your app that renders your data model, you’ll want to build components that reuse other components and pass data using props. props are a way of passing data from parent to child. If you’re familiar with the concept of state, **don’t use state at all** to build this static version. State is reserved only for interactivity, that is, data that changes over time. Since this is a static version of the app, you don’t need it.

You can build top-down or bottom-up. That is, you can either start with building the components higher up in the hierarchy (i.e. starting with `FilterableProductTable`) or with the ones lower in it (`ProductRow`). In simpler examples, it’s usually easier to go top-down, and on larger projects, it’s easier to go bottom-up and write tests as you build.

At the end of this step, you’ll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `ReactDOM.render()` again, the UI will be updated. It’s easy to see how your UI is updated and where to make changes since there’s nothing complicated going on. React’s one-way data flow (also called one-way binding) keeps everything modular and fast.

