# Portals

Portals provide a first-class way to render children into a DOM node that exists outside the DOM hierarchy of the parent component.

Portals 提供了一类可以将子节点渲染到并非其父节点的组件中去。（也就是说你可以将一个节点通过 Portals 渲染到另一个指定的节点中，比如弹窗类组件就需要将其内容渲染到 DOM 上层以避免被其他高 `z-index` 的元素影响）

```js
ReactDOM.createPortal(child, container)
```

The first argument (`child`) is any [renderable React child](https://reactjs.org/docs/react-component.html#render), such as an element, string, or fragment. The second argument (`container`) is a DOM element.

第一个参数(`child`) 是任意 [renderable React child](https://reactjs.org/docs/react-component.html#render)，如元素、字符串或者文档片段。第二个参数 (`container`) 是一个 DOM 元素

## Usage

Normally, when you return an element from a component’s render method, it’s mounted into the DOM as a child of the nearest parent node:

通常，render 返回的元素会作为其父节点的子元素（这是理所当然的）：

```js
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

However, sometimes it’s useful to insert a child into a different location in the DOM:

然而，有时候却需要将子节点渲染到 DOM 中不同的位置去：

```js
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

A typical use case for portals is when a parent component has an `overflow: hidden` or `z-index` style, but you need the child to visually “break out” of its container. For example, dialogs, hovercards, and tooltips.

一个典型的使用场景就是当父组件有 `overflow: hidden` 或者 `z-index` 这类的样式，但是你需要子元素能够跳出父元素，从而使其可见。例如，弹窗、hovercards 或者提示工具。

**Note:**

When working with portals, remember that [managing keyboard focus](https://reactjs.org/docs/accessibility.html#programmatically-managing-focus) becomes very important.

当使用 portals 的时候，记住 [管理键盘焦点](https://reactjs.org/docs/accessibility.html#programmatically-managing-focus)，这会非常重要。

For modal dialogs, ensure that everyone can interact with them by following the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

对于弹窗，最好通过遵循 [WAI-ARIA 模态创作实践](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal)，确保每个人都可以与他们互动。

[查看 codePen 中的示例](https://codepen.io/gaearon/pen/yzMaBd)

## Event Bubbling Through Portals（Portals 中的事件传递）

Even though a portal can be anywhere in the DOM tree, it behaves like a normal React child in every other way. Features like context work exactly the same regardless of whether the child is a portal, as the portal still exists in the React tree regardless of position in the DOM tree.

尽管 portal 可能出现在 DOM 中的任何位置，但它在其它方面表现得很像一个普通的 React 元素。像 context 这样的特性不会因为该子元素是 portal 而有所不同，只要 portal 仍然存在于 React 树中而不管 DOM 树中的什么位置。

This includes event bubbling. An event fired from inside a portal will propagate to ancestors in the containing React tree, even if those elements are not ancestors in the DOM tree. Assuming the following HTML structure:

这包括事件冒泡。在 portal 中触发的事件会传播到包含它的 React 树的祖先元素中去，甚至这些元素在 DOM 中并非其祖先元素。假设 HTML 结构如下：

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

A `Parent` component in `#app-root` would be able to catch an uncaught, bubbling event from the sibling node `#modal-root`.

在 `#app-root` 中的 `Parent` 组件能够捕获到那些从兄弟节点 `#modal-root` 冒泡过来的未捕获的事件。

```js
// These two containers are siblings in the DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // The portal element is inserted in the DOM tree after
    // the Modal's children are mounted, meaning that children
    // will be mounted on a detached DOM node. If a child
    // component requires to be attached to the DOM tree
    // immediately when mounted, for example to measure a
    // DOM node, or uses 'autoFocus' in a descendant, add
    // state to Modal and only render the children when Modal
    // is inserted in the DOM tree.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This will fire when the button in Child is clicked,
    // updating Parent's state, even though button
    // is not direct descendant in the DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Number of clicks: {this.state.clicks}</p>
        <p>
          Open up the browser DevTools
          to observe that the button
          is not a child of the div
          with the onClick handler.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // The click event on this button will bubble up to parent,
  // because there is no 'onClick' attribute defined
  return (
    <div className="modal">
      <button>Click</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[查看 codePen 中的示例](https://codepen.io/gaearon/pen/jGBWpE)

Catching an event bubbling up from a portal in a parent component allows the development of more flexible abstractions that are not inherently reliant on portals. For example, if you render a `<Modal />` component, the parent can capture its events regardless of whether it’s implemented using portals.

在父组件中捕获从 portal 冒泡的事件使得可以开发出更灵活的抽象工具，这些抽象本身并不依赖 portals。例如，如果你渲染一个 `<Modal />` 组件，父组件可以捕获它的事件而不用管它是否是使用 portals 来进行开发。

