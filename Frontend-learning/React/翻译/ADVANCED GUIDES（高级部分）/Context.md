# Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level.

Context 提供了一种不用每次通过手动向组件树中子组件传值的方式。

In a typical React application, data is passed top-down (parent to child) via props, but this can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.

在典型的 React 应用中，数据通过 props 自上而下传递，但是对于那些被多个子组件同时使用的 props 则显得过于笨重。Context 提供了一种不用一级一级往下传而可以在这些子组件之间共享这些属性值的手段。

## When to Use Context（何时使用 Context）

Context is designed to share data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language. For example, in the code below we manually thread through a “theme” prop in order to style the Button component:

Context 可以理解为是 React 组件树的一个 “全局变量”，它的设计初衷是来共享数据，如用户当前的认证信息、主题、语言等。例如，下面的代码中我们手动将 “theme” 属性向下传递到 Button 组件以便它能区分使用何种主题。

```jsx
class App extends React.Component {
  render() {
    return <Toolbar theme="dark" />;
  }
}

function Toolbar(props) {
  // The Toolbar component must take an extra "theme" prop
  // and pass it to the ThemedButton. This can become painful
  // if every single button in the app needs to know the theme
  // because it would have to be passed through all components.
  return (
    <div>
      <ThemedButton theme={props.theme} />
    </div>
  );
}

class ThemedButton extends React.Component {
  render() {
    return <Button theme={this.props.theme} />;
  }
}
```

Using context, we can avoid passing props through intermediate elements:

如果使用 context，我们就可以不必再用中间元素来传递 props：

```jsx
// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current theme (with "light" as the default).
const ThemeContext = React.createContext('light');

class App extends React.Component {
  render() {
    // Use a Provider to pass the current theme to the tree below.
    // Any component can read it, no matter how deep it is.
    // In this example, we're passing "dark" as the current value.
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// A component in the middle doesn't have to
// pass the theme down explicitly anymore.
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // Assign a contextType to read the current theme context.
  // React will find the closest theme Provider above and use its value.
  // In this example, the current theme is "dark".
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

## Before You Use Context

Context is primarily used when some data needs to be accessible by many components at different nesting levels. Apply it sparingly because it makes component reuse more difficult.

Context 最主要的使用场景是当某个数据需要被不同层级的组件使用时。谨慎使用它，因为它会降低组件的重用性。

**If you only want to avoid passing some props through many levels, [component composition](https://reactjs.org/docs/composition-vs-inheritance.html) is often a simpler solution than context.**

**如果你仅仅只是希望避免在多个层级中传值，那么可以使用组件组合可以作为 context 的替代方案**

For example, consider a `Page` component that passes a `user` and `avatarSize` prop several levels down so that deeply nested `Link` and `Avatar` components can read it:

例如，一个 `Page` 组件向多个层级下的子组件 `Link` 和 `Avatar` 传递了 `user` 和 `avatarSize` 属性：

```jsx
<Page user={user} avatarSize={avatarSize} />
// ... which renders ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... which renders ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... which renders ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

It might feel redundant to pass down the `user` and `avatarSize` props through many levels if in the end only the `Avatar` component really needs it. It’s also annoying that whenever the `Avatar` component needs more props from the top, you have to add them at all the intermediate levels too.

把  `user` 和 `avatarSize` 属性通过多个层级向下传递这种方式看起来有点冗余，因为最后只有 `Avatar` 组件真正需要它。并且在需要的属性变得更多的情况下会更加麻烦。

One way to solve this issue **without context** is [to pass down the Avatar component itself](https://reactjs.org/docs/composition-vs-inheritance.html#containment) so that the intermediate components don’t need to know about the `user` prop:

一种不使用 context 来解决这个问题的方法是 [将 Avatar 组件向下传递](https://reactjs.org/docs/composition-vs-inheritance.html#containment) ，这样中间的这些组件就不用知道像 `user` 这样的属性。

```jsx
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Now, we have:
<Page user={user} />
// ... which renders ...
<PageLayout userLink={...} />
// ... which renders ...
<NavigationBar userLink={...} />
// ... which renders ...
{props.userLink}
```

With this change, only the top-most Page component needs to know about the `Link` and `Avatar` components’ use of `user` and `avatarSize`.

变成这种方式以后，只有最顶级的 Page 组件需要知道 `Link` 和 `Avatar` 组件会用到 `user` 和 `avatarSize` 属性。

This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. However, this isn’t the right choice in every case: moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.

这种 *控制反转* 的方式可以让你的代码看起来更加清爽简洁，因为它减少了你需要向下传递的 props 数量并且将更多的控制权交给了根组件。然而，并不是所有场合它都是最佳选择：将组件向树的上层移动会使得上层的组件变得更加复杂，并且强制低层级的组件具有更强的灵活性。

You’re not limited to a single child for a component. You may pass multiple children, or even have multiple separate “slots” for children, [as documented here](https://reactjs.org/docs/composition-vs-inheritance.html#containment):

你不必被组件的单个子元素限制。你可以像文档这里指出的这样给组件传递多个子元素，甚至为多个子元素提供多个独立的 “slots”

```jsx
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

This pattern is sufficient for many cases when you need to decouple a child from its immediate parents. You can take it even further with [render props](https://reactjs.org/docs/render-props.html) if the child needs to communicate with the parent before rendering.

这种模式能够满足当你需要将子元素和它的直接父元素进行分离的场景。如果子组件在渲染之前需要和父组件进行通信的话，你可以配合使用 [render props](https://reactjs.org/docs/render-props.html) 得到更进一步的提升。

However, sometimes the same data needs to be accessible by many components in the tree, and at different nesting levels. Context lets you “broadcast” such data, and changes to it, to all components below. Common examples where using context might be simpler than the alternatives include managing the current locale, theme, or a data cache.

然而，有时候相同的数据需要被许多不同层级的组件访问到。 Context 使得你可以向所有的子组件“广播” 数据、修改数据。使用 context 的常规示例在管理当前、主题或者数据缓存时可能比可能比替代方案更简单。

## API

### React.createContext

```jsx
const MyContext = React.createContext(defaultValue);
```

Creates a Context object. When React renders a component that subscribes to this Context object it will read the current context value from the closest matching `Provider` above it in the tree.

创建一个 Context 对象。当 React 渲染一个订阅了该 Context 对象的组件时它会从离它最近的 `Provider` 读取当前 context 的值。

The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.

`defaultValue` 参数只用于当。注意：如果传递 `undefined` 作为 Provider 的值不会使得使用的组件使用 `defaultValue`。

### Context.Provider

```jsx
<MyContext.Provider value={/* some value */}>
```

Every Context object comes with a Provider React component that allows consuming components to subscribe to context changes.

Accepts a `value` prop to be passed to consuming components that are descendants of this Provider. One Provider can be connected to many consumers. Providers can be nested to override values deeper within the tree.

All consumers that are descendants of a Provider will re-render whenever the Provider’s `value` prop changes. The propagation from Provider to its descendant consumers is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component bails out of the update.

Changes are determined by comparing the new and old values using the same algorithm as [Object.is](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

**Note**

The way changes are determined can cause some issues when passing objects as value: see [Caveats](https://reactjs.org/docs/context.html#caveats).

