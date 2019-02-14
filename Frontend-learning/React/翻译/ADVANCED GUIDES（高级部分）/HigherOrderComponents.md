# Higher-Order Components

A higher-order component (HOC) is an advanced technique in React for reusing component logic. HOCs are not part of the React API, per se. They are a pattern that emerges from React’s compositional nature.

高阶组件是 React 中一项重用组件逻辑的高级技术。它本身并不是 React API 的一部分，而是伴随 React 组合的特性而出现的。

Concretely, **a higher-order component is a function that takes a component and returns a new component**.

总结来说，**高阶组件是一个把一个组件转换成另一个组件的函数**。

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Whereas a component transforms props into UI, a higher-order component transforms a component into another component.

常规组件把 props 转换成 UI，高阶组件把组件转换成另一个组件以满足某些需求。

HOCs are common in third-party React libraries, such as Redux’s [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) and Relay’s [createFragmentContainer](http://facebook.github.io/relay/docs/en/fragment-container.html).

高阶组件在一些第三方库中很常见，如 Redux 中的 [connect](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options) 和 Relay 的 [createFragmentContainer](http://facebook.github.io/relay/docs/en/fragment-container.html)。

In this document, we’ll discuss why higher-order components are useful, and how to write your own.

在当前文档中，我们将告诉你为什么高阶组件非常有用，以及如何编写自己的高阶组件。

## Use HOCs For Cross-Cutting Concerns

**Note**

We previously recommended mixins as a way to handle cross-cutting concerns. We’ve since realized that mixins create more trouble than they are worth. [Read more](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) about why we’ve moved away from mixins and how you can transition your existing components.

最初我们推荐使用 mixin 来处理代码交叉（就是有一部分公共逻辑，但实际上又不满足继承，比如 A 和 B 都有某个常规需求，但 A 和 B 并没有任何关系）的问题。但后来我们意识到 mixin 带来的问题比它带来的好处还多。我们在[这里](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) 告诉了你为什么要移除 mixin 以及你需要怎么把那些已经存在的组件从 mixin 中迁移出来。

Components are the primary unit of code reuse in React. However, you’ll find that some patterns aren’t a straightforward fit for traditional components.

组件是 React 中重用代码的主要单元。然而，你会发现传统组件对某些模式来说不太合适。

For example, say you have a `CommentList` component that subscribes to an external data source to render a list of comments:

例如，`CommentList` 组件订阅了外部数据源，并根据该数据源渲染了一个评论列表：

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Later, you write a component for subscribing to a single blog post, which follows a similar pattern:

然后你又写了一个组件来订阅该数据源的单个博文，遵循同样的模式：

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` and `BlogPost` aren’t identical — they call different methods on `DataSource`, and they render different output. But much of their implementation is the same:

虽然 `CommentList` 和 `BlogPost` 并不相同 —— 因为它们调用的是 `DataSource` 上面不同的方法，并且渲染内容也不同，但它们的实现却大体差不多：

- On mount, add a change listener to `DataSource`.
>> 在挂载的时候监听 `DataSource` 改变。
- Inside the listener, call `setState` whenever the data source changes.
>> 在事件处理函数内部，调用了 `setState`，这样数据发生改变的时候就能及时做出响应。
- On unmount, remove the change listener.
>> 在组件被卸载的时候移除事件监听器。

You can imagine that in a large app, this same pattern of subscribing to `DataSource` and calling `setState` will occur over and over again. We want an abstraction that allows us to define this logic in a single place and share it across many components. This is where higher-order components excel.

你可以想象在一个大型应用中，调用 `DataSource` 和 `setState` 这样相同的操作将会被一遍又一遍的重复调用。此时我们希望把这一部分逻辑抽象出来，然后在某个地方定义一遍之后共享给其它组件。这正是高阶组件擅长做的事情。

We can write a function that creates components, like `CommentList` and `BlogPost`, that subscribe to `DataSource`. The function will accept as one of its arguments a child component that receives the subscribed data as a prop. Let’s call the function `withSubscription`:

我们可以编写一个用于创建类似于 `CommentList` 和 `BlogPost` 这种订阅了 `DataSource` 的组件的函数。这个函数其中一个参数用于接收一个子组件，该子组件通过 props 来获取订阅的数据。这里我们把这个函数命名为 `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

The first parameter is the wrapped component. The second parameter retrieves the data we’re interested in, given a `DataSource` and the current props.

第一个参数就是包装的组件。在给定 DataSource 和当前 props 的情况下，第二个参数用于检索我们感兴趣的数据。

When `CommentListWithSubscription` and `BlogPostWithSubscription` are rendered, `CommentList` and `BlogPost` will be passed a `data` prop with the most current data retrieved from `DataSource`:

当 `CommentListWithSubscription` 和 `BlogPostWithSubscription` 被渲染的时候，它们会把从 `DataSource` 那里获取的数据通过 props 传递给 `CommentList` 和 `BlogPost`。

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Note that a HOC doesn’t modify the input component, nor does it use inheritance to copy its behavior. Rather, a HOC composes the original component by wrapping it in a container component. A HOC is a pure function with zero side-effects.

注意高阶组件不会修改传入的组件，也不会使用继承来拷贝它们的行为。 相反，高阶组件通过把原来的组件封装在一个容器组件中来包含它。高阶组件应该是一个零副作用的纯函数。

And that’s it! The wrapped component receives all the props of the container, along with a new prop, `data`, which it uses to render its output. The HOC isn’t concerned with how or why the data is used, and the wrapped component isn’t concerned with where the data came from.

容器组件把自己所有的 props 都传递给了其内部封装的组件，其中包括一个新的 `data` 属性，内部组件使用这些属性来渲染内容。高阶组件不会关心这些数据被如何使用，内部封装的组件也不关心数据是从何而来的。

Because `withSubscription` is a normal function, you can add as many or as few arguments as you like. For example, you may want to make the name of the `data` prop configurable, to further isolate the HOC from the wrapped component. Or you could accept an argument that configures `shouldComponentUpdate`, or one that configures the data source. These are all possible because the HOC has full control over how the component is defined.

因为 `withSubscription` 是一个普通函数，你可以按需自行添加参数。例如，你可能希望 `data` 属性的名字也是可配置的，这样就可以进一步将内部封装的组件和高阶组件分离开来。或者你需要一个参数来配置 `shouldComponentUpdate` 或者添加配置数据源的参数。这些都是可以实现的，因为高阶组件对其内部的组件该如何定义具有绝对的控制权。

Like components, the contract between `withSubscription` and the wrapped component is entirely props-based. This makes it easy to swap one HOC for a different one, as long as they provide the same props to the wrapped component. This may be useful if you change data-fetching libraries, for example.

和普通组件一样，高阶组件 `withSubscription` 和其内部封装的组件之间也是通过 props 进行传值的。这使得将一个高阶组件替换为另一个高阶组件变得非常容易，只要它们为包装的组件提供相同的 props 参数即可。例如，如果你需要替换获取数据的 lib 时非常有用。

## Don’t Mutate the Original Component. Use Composition.（不要修改原组件。尽量使用组合的方式来做）

Resist the temptation to modify a component’s prototype (or otherwise mutate it) inside a HOC.

不要在高阶组件内部修改组件的原型链 prototype（或者修改组件本身）。

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentWillReceiveProps = function(nextProps) {
    console.log('Current props: ', this.props);
    console.log('Next props: ', nextProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

There are a few problems with this. One is that the input component cannot be reused separately from the enhanced component. More crucially, if you apply another HOC to `EnhancedComponent` that also mutates `componentWillReceiveProps`, the first HOC’s functionality will be overridden! This HOC also won’t work with function components, which do not have lifecycle methods.

这种做法会有一些问题。首先，传入的组件不能与 `EnhancedComponent` 组件分开重用（因为传入的组件原型链已经被修改了）。更严重的是，如果你也修改了 `EnhancedComponent` 的 `componentWillReceiveProps`，那第一个高阶组件中的同名方法就会被覆盖！这种高阶组件不能用于函数组件，因为它们没有生命周期函数。

Mutating HOCs are a leaky abstraction—the consumer must know how they are implemented in order to avoid conflicts with other HOCs.

这种会修改传入组件的高阶组件会破坏对组件的抽象 —— 该高阶组件的使用者必须知道它是如何实现的以便可以避免和其它高阶组件之间产生冲突。

Instead of mutation, HOCs should use composition, by wrapping the input component in a container component:

高阶组件应该使用组合来取代对组件的修改行为，那就是将传入的组件封装在一个容器组件中：

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

This HOC has the same functionality as the mutating version while avoiding the potential for clashes. It works equally well with class and function components. And because it’s a pure function, it’s composable with other HOCs, or even with itself.

与修改传入组件的方式相比，上面使用组合这种方式的高阶组件具有相同的功能，并且还能避免一些潜在的冲突。它在类组件和函数组件中都能良好的工作。由于它是纯函数，它还能够和其它高阶组件进行组合，包括它自己。

You may have noticed similarities between HOCs and a pattern called **container components**. Container components are part of a strategy of separating responsibility between high-level and low-level concerns. Containers manage things like subscriptions and state, and pass props to components that handle things like rendering UI. HOCs use containers as part of their implementation. You can think of HOCs as parameterized container component definitions.

你可能已经注意到高阶组件和一种称之为 **容器组件** 的模式非常相似。容器组件是用来分离高级和底级概念的策略中的一部分。容器负责管理如订阅、状态之类的事情，并将数据通过属性传递给渲染 UI 的组件。高阶组件使用容器作为其实现的一部分，你可以将高阶组件当做带参数传递的容器组件。

## Convention: Pass Unrelated Props Through to the Wrapped Component（约定：高阶组件应该传递不相关的属性到内部组件）

HOCs add features to a component. They shouldn’t drastically alter its contract. It’s expected that the component returned from a HOC has a similar interface to the wrapped component.

高阶组件用于为组件添加功能和特性。它们不应该对组件本身的功能特性进行大幅修改。从高阶组件返回的组件应该和组件本身具有类似的接口。

HOCs should pass through props that are unrelated to its specific concern. Most HOCs contain a render method that looks something like this:

高阶组件传递的属性应该是和组件的某个特定概念不相关的内容。大多数高阶组件可能都会包含一个下面这样的 render 函数：

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

This convention helps ensure that HOCs are as flexible and reusable as possible.

这种约定能够帮助确保高阶组件最大的灵活性和可重用性。

## Convention: Maximizing Composability（约定：最大化使用组合）

Not all HOCs look the same. Sometimes they accept only a single argument, the wrapped component:

并不是所有的高阶组件看起来都一样。有些组件只接受一个参数 —— 传入的组件：

```js
const NavbarWithRouter = withRouter(Navbar);
```

Usually, HOCs accept additional arguments. In this example from Relay, a config object is used to specify a component’s data dependencies:

通常，高阶组件接受额外的参数。这里有个使用 Relay 的例子，它使用了一个配置对象来指定组件的数据依赖：

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

The most common signature for HOCs looks like this:

大多数高阶组件的使用方式看起来是这样的：

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

What?! If you break it apart, it’s easier to see what’s going on.

什么？！ 如果你把它拆看看，就非常容易看出这里发生了什么。

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```

In other words, `connect` is a higher-order function that returns a higher-order component!

换句话说， `connect` 是一个返回了一个高阶组件的高阶函数。

This form may seem confusing or unnecessary, but it has a useful property. Single-argument HOCs like the one returned by the `connect` function have the signature `Component => Component`. Functions whose output type is the same as its input type are really easy to compose together.

这种格式让人感觉迷惑并且没有必要，但它有一个很有用的特性。像 `connect` 这样的函数签名为 `Component => Component` 的函数返回了一个单参数的高阶组件，这种输入类型和输出类型一样函数很容易组合在一起。

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(This same property also allows `connect` and other enhancer-style HOCs to be used as decorators, an experimental JavaScript proposal.)

（相同属性也使得 `connect` 和其他增强类型的高阶组件可以当做 decorator 使用，这是一种处于试验阶段的 JavaScript 提案。）

The `compose` utility function is provided by many third-party libraries including lodash (as [lodash.flowRight](https://lodash.com/docs/#flowRight)), [Redux](http://redux.js.org/docs/api/compose.html), and [Ramda](http://ramdajs.com/docs/#compose).

很多第三方库提供了这种组合类型的工具函数，如 lodash（[lodash.flowRight](https://lodash.com/docs/#flowRight)）,[Redux](http://redux.js.org/docs/api/compose.html) 和 [Ramda](http://ramdajs.com/docs/#compose).

## Convention: Wrap the Display Name for Easy Debugging（公约：为调试添加 Display Name）

The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it’s the result of a HOC.

高阶组件创建的容器组件在 [React 开发者工具中](https://github.com/facebook/react-devtools) 和其他组件并没有两样。为了更方便调试，为组件指定一个用于在开发者工具中展示的名称，这样就可以方便看出它来自哪个高阶组件。

The most common technique is to wrap the display name of the wrapped component. So if your higher-order component is named `withSubscription`, and the wrapped component’s display name is `CommentList`, use the display name `WithSubscription(CommentList)`:

最常用的技术就是给封装的组件添加 displayName 属性。如果你的高阶组件名为 `withSubscription`，封装在内部的组件名为 `CommentList`，则使用 `WithSubscription(CommentList)` 作为容器组件的名字：

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {
      /* ... */
  }
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```

## Caveats （注意事项）

Higher-order components come with a few caveats that aren’t immediately obvious if you’re new to React.

如果你是 React 新手，高阶组件带来的陷阱可能对你来说并不那么明显。

### Don’t Use HOCs Inside the render Method（不要在 render 函数中使用高阶组件）

React’s diffing algorithm (called reconciliation) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one. If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one. If they’re not equal, the previous subtree is unmounted completely.

React 的差异比较算法（称作 reconciliation）使用组件标识来检测应该更新该组件的子树还是将它丢弃重新挂载一个新的子树。如果从 `render` 返回的组件与之前渲染的组件相同（`===`），React 就会通过对比该节点与新节点之间的差异并递归的更新组件的子树。如果它们不相等，那就将之前的子树完全卸载。

Normally, you shouldn’t need to think about this. But it matters for HOCs because it means you can’t apply a HOC to a component within the render method of a component:

通常，你不需要考虑这些。但是对高阶组件来说这就很重要，你不能在组件的 render 方法中使用高阶组件：

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

The problem here isn’t just about performance — remounting a component causes the state of that component and all of its children to be lost.

这里不只是性能的问题 —— 重新挂载一个组件将会导致组件及其子节点的状态缺失。

Instead, apply HOCs outside the component definition so that the resulting component is created only once. Then, its identity will be consistent across renders. This is usually what you want, anyway.

取而代之的是在组件的定义之外创建高阶组件，这样它就只会被创建一次，并且它的标识将在渲染之间保持一致，这通常才是你想要的。

In those rare cases where you need to apply a HOC dynamically, you can also do it inside a component’s lifecycle methods or its constructor.

在极少数情况下，你需要动态应用 HOC，你也可以在组件的生命周期方法或其构造函数中执行此操作。

### Static Methods Must Be Copied Over（静态方法也必须被拷贝）

Sometimes it’s useful to define a static method on a React component. For example, Relay containers expose a static method `getFragment` to facilitate the composition of GraphQL fragments.

在某些情况下给组件定义静态方法会非常有用。例如，Relay 容器暴露了一个 `getFragment` 静态方法以便 GraphQL 片段的合成。

When you apply a HOC to a component, though, the original component is wrapped with a container component. That means the new component does not have any of the static methods of the original component.

当你将高阶组件应用于组件的时候，原组件会被封装在一个容器组件中。这就意味着高阶组件返回的新的组件不会有任何原组件的静态方法。

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

To solve this, you could copy the methods onto the container before returning it:

为了解决这个问题，你可以在高阶组件返回之前将原组件的静态方法拷贝到容器组件中去：

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

However, this requires you to know exactly which methods need to be copied. You can use [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) to automatically copy all non-React static methods:

然而，这需要你明确知道哪些方法是需要进行拷贝的。你可以使用 [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) 来将所有非 React 的静态方法自动拷贝到容器组件上。

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Another possible solution is to export the static method separately from the component itself.

另一个可用的解决方案就是将静态方法和组件分开导出：

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Refs Aren’t Passed Through

While the convention for higher-order components is to pass through all props to the wrapped component, this does not work for refs. That’s because `ref` is not really a prop — like `key`, it’s handled specially by React. If you add a ref to an element whose component is the result of a HOC, the ref refers to an instance of the outermost container component, not the wrapped component.

尽管高阶组件的公约是将所有的属性传递给内部封装的组件，但对 ref 并不起作用。因为对于 React 来说， `ref` 并非一个真正的属性 —— 就像 `key` 一样，React 会对它们单独处理。如果你使用 ref 来引用高阶组件返回的组件，那么这个引用实际上指向外部的容器组件的实例，而非指向内部封装的那个组件。

The solution for this problem is to use the `React.forwardRef` API (introduced with React 16.3). [Learn more about it in the forwarding refs section](https://reactjs.org/docs/forwarding-refs.html).

这个问题的解决方案是使用 `React.forwardRef` API （在 React 16.3 中引入的特性），[如有需要请前往 forwarding refs 了解更多](https://reactjs.org/docs/forwarding-refs.html)