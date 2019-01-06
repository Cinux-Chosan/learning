# Forms

HTML form elements work a little bit differently from other DOM elements in React, because form elements naturally keep some internal state. For example, this form in plain HTML accepts a single name:

在 React 中 HTML 的 from 元素和其他 DOM 元素的工作方式略微有些不同，因为 form 元素本身很自然的会保存一些内部状态。例如，下面使用纯 HTML 写的 from 接收单个 name： 

```js
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

This form has the default HTML form behavior of browsing to a new page when the user submits the form. If you want this behavior in React, it just works. But in most cases, it’s convenient to have a JavaScript function that handles the submission of the form and has access to the data that the user entered into the form. The standard way to achieve this is with a technique called “controlled components”.

当用户提交该表单的时候，该 form 默认的 HTML 行为会导航到一个新页面。 如果你希望在 React 中也保持这种行为，当然它本身就可以。但是大多数情况下，使用一个 JavaScript 函数来获取用户的输入和处理表单的提交会更加方便。这种技术就被称为 “受控组件” 


## Controlled Components （受控组件）

In HTML, form elements such as `<input>`, `<textarea>`, and `<select>` typically maintain their own state and update it based on user input. In React, mutable state is typically kept in the state property of components, and only updated with `setState()`.

在 HTML 中，像 `<input>`, `<textarea>` 和 `<select>` 这些 form 元素会根据用户的输入来管理自身的内部状态。在 React 中，可变状态通常被保存在组件的 state 属性中，并且只能通过 `setState()` 来更新它们。 

We can combine the two by making the React state be the “single source of truth”. Then the React component that renders a form also controls what happens in that form on subsequent user input. An input form element whose value is controlled by React in this way is called a “controlled component”.

我们可以通过保证 React state 为 “单一数据来源” 来将两者结合起来。这样 React 组件既可以渲染一个表单也可以根据用户的输入来控制表单的行为。表单中输入元素的值被 React 管理（控制）起来得方式就称为 “受控组件” 的方式。

For example, if we want to make the previous example log the name when it is submitted, we can write the form as a controlled component:

例如，你希望上一个例子中提交表单的时候在控制台打印 name 的值你就可以将这个组件写成受控组件的形式：

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[在 Codepen 中打开](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)


Since the `value` attribute is set on our form element, the displayed value will always be `this.state.value`, making the React state the source of truth. Since `handleChange` runs on every keystroke to update the React state, the displayed value will update as the user types.

由于设置了 form 元素的 `value` 属性，因此它显示的值始终是 `this.state.value` 的值，这样就使得 React state 作为唯一数据来源。因此 `handleChange` 在每次按键的同时去更新 React state，显示的值也会更新为用户输入的值。

With a controlled component, every state mutation will have an associated handler function. This makes it straightforward to modify or validate user input. For example, if we wanted to enforce that names are written with all uppercase letters, we could write `handleChange` as:

在受控组件的模式下，每个 state 属性都会有一个与之关联的处理函数。它让修改和验证用户的输入变得相当简单。例如，你希望强制用户输入到 name 的值都为大写，你可以这样来编写 `handleChange`：

```jsx
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## The textarea Tag

In HTML, a `<textarea>`element defines its text by its children:

在 HTML 中， `<textarea>` 元素的内容是通过它的子节点来定义的：

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

In React, a `<textarea>` uses a value attribute instead. This way, a form using a `<textarea>` can be written very similarly to a form that uses a single-line input:

在 React 中， `<textarea>` 使用 value 属性来取代子节点。这种方式的 `<textarea>` 写起来很像单行的 `input`。

```jsx
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Notice that `this.state.value` is initialized in the constructor, so that the text area starts off with some text in it.

注意 `this.state.value` 在 constructor 中做了初始化，因此一开始它里面会有一些文本内容。

## The select Tag

In HTML, `<select>` creates a drop-down list. For example, this HTML creates a drop-down list of flavors:

`<select>` 会创建一个下拉列表。下面的 HTML 就会创建一个 flavors 的下拉列表：

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Note that the Coconut option is initially `selected`, because of the `selected` attribute. React, instead of using this selected attribute, uses a `value` attribute on the root `select` tag. This is more convenient in a controlled component because you only need to update it in one place. For example:

注意 Coconut 选项默认为选中状态，因为它有 selectd 属性。React 中的做法是在 `select` 标签上使用 `value` 属性来取代 HTML 中的 selected 属性。在受控组件中使用这种方式更方便，因为你只需要更新一个地方的值。例如：

```jsx
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[在 codePen 中打开](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Overall, this makes it so that `<input type="text">`, `<textarea>`, and `<select>` all work very similarly - they all accept a `value` attribute that you can use to implement a controlled component.

总体来说，（受控组件）这种方式使得 `<input type="text">`, `<textarea>` 和 `<select>` 写起来很相似 —— 它们都接收一个可以让你实现受控组件的 `value` 属性。

**You can pass an array into the value attribute, allowing you to select multiple options in a select tag:**

可以给 value 属性传递一个数组，这使得在 select 中可以选 中多个选项。

```jsx
<select multiple={true} value={['B', 'C']}>
```

## The file input Tag

In HTML, an `<input type="file">` lets the user choose one or more files from their device storage to be uploaded to a server or manipulated by JavaScript via the [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

在 HTML 中，`<input type="file">` 让用户从磁盘中选择一个或多个文件上传到服务器或者通过 JavaScript 的 [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) 来操作它们。


```html
<input type="file" />
```

Because its value is read-only, it is an **uncontrolled** component in React. It is discussed together with other uncontrolled components [later in the documentation](https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag).

因为它的 value 是只读的，因此它在 React 中是一个 **非受控** 组件。它将和其它非受控组件一起在[后面的文档](https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag)中讨论。

## Handling Multiple Inputs

When you need to handle multiple controlled `input` elements, you can add a `name` attribute to each element and let the handler function choose what to do based on the value of `event.target.name`.

当你需要处理多个受控的 `input` 元素时，你可以给每个元素添加一个 `name` 属性，然后让处理函数基于 `event.target.name` 的值来做出相应的响应。

For example:

```jsx
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[在 codePen 中打开](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Note how we used the ES6 [computed property name syntax](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) to update the state key corresponding to the given input name:

注意这里我们使用了 ES6 的 [计算属性名语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E5%90%8D) 来更新 state 中与 input name 中指定的属性的值。

```js
this.setState({
  [name]: value
});
```

It is equivalent to this ES5 code:

它等同于下面的 ES5 代码：

```js
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Also, since `setState()` automatically [merges a partial state into the current state](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-are-merged), we only needed to call it with the changed parts.

由于 `setState()` 会自动与当前 state 进行合并，因此我们调用它的时候只需要传入值发生了改变的部分。

## Controlled Input Null Value

Specifying the value prop on a [controlled component](https://reactjs.org/docs/forms.html#controlled-components) prevents the user from changing the input unless you desire so. If you’ve specified a `value` but the input is still editable, you may have accidentally set `value` to `undefined` or `null`.

在受控组件上指定 value 属性会阻止用户通过输入来改变它的值。如果你指定了 `value` 但是仍然可以编辑输入框中的值，那么很有可能是你不小心将 `value` 设置为了 `undefined` 或者 `null`。


The following code demonstrates this. (The input is locked at first but becomes editable after a short delay.)

下面的代码演示了这种情况。（输入框中的内容一开始被锁定不可编辑，1 秒钟之后变为可编辑状态）

```jsx
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);
```

## Alternatives to Controlled Components

It can sometimes be tedious to use controlled components, because you need to write an event handler for every way your data can change and pipe all of the input state through a React component. This can become particularly annoying when you are converting a preexisting codebase to React, or integrating a React application with a non-React library. In these situations, you might want to check out [uncontrolled components](https://reactjs.org/docs/uncontrolled-components.html), an alternative technique for implementing input forms.

使用受控组件有时候会非常乏味，因为你需要考虑数据的每一种改变方式同时为它们编写事件处理函数，并通过 React 组件来管理所有的 input 状态。当你将已有的代码迁移到 React 的时候或者将 React 应用与非 React 应用进行整合的时候会非常麻烦。在这些情况下，你可能希望使用[非受控组件](https://reactjs.org/docs/uncontrolled-components.html)，它是受控组件的一种替代方式。

## Fully-Fledged Solutions （完全成熟的解决方案）

If you’re looking for a complete solution including validation, keeping track of the visited fields, and handling form submission, [Formik](https://jaredpalmer.com/formik) is one of the popular choices. However, it is built on the same principles of controlled components and managing state — so don’t neglect to learn them.

如果你正在寻找一个完整的解决方案，它包括表单验证、字段追中、处理表单提交等功能，那么 [Formik](https://jaredpalmer.com/formik) 是一个比较好的选择。然而，它同样是建立在和受控组件、状态管理相同的原则上 —— 因此不要忽视对它们的学习。