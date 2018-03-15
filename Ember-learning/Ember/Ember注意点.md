# Ember 3.0 注意点

Note that bindings don't update immediately. Ember waits until all of your application code has finished running before synchronizing changes, so you can change a bound property as many times as you'd like without worrying about the overhead of syncing bindings when values are transient.

注意绑定(单双向绑定)不会立即更新. 相互绑定的变量同步值之前, Ember 会等待应用的所有的代码全部完成之后才会进行它们之间的同步, 因此如果某个值会出现很多的瞬态时, 你可以修改它多次而不需要担心会带来过多的开销.

------

https://guides.emberjs.com/v3.0.0/routing/specifying-a-routes-model/

Note: A route with a dynamic segment will always have its model hook called when it is entered via the URL. If the route is entered through a transition (e.g. when using the link-to Handlebars helper), and a model context is provided (second argument to link-to), then the hook is not executed. If an identifier (such as an id or slug) is provided instead then the model hook will be executed.

通过 URL 进入一个有动态段的路由的时候总是会导致 model 钩子被调用. 如果路由通过 transition 进入(如使用 link-to helper 或 transitionTo 这种 Ember 提供的方法时), 且此时提供了 model 上下文(即给 link-to 传递了一个对象作为第二个参数), 则此时不会调用路由的钩子函数. 如果是提供的一个标识符(如非对象的 id 或 slug) 则会导致 model 钩子被调用执行.

For example, transitioning to the photo route this way won't cause the model hook to be executed (because link-to was passed a model):

下面这个例子中不会导致 model 执行, 因为传入了一个对象 photo 作为 model:

```hbs
<h1>Photos</h1>
{{#each model as |photo|}}
  <p>
    {{#link-to "photo" photo}}
      <img src="{{photo.thumbnailUrl}}" alt="{{photo.title}}" />
    {{/link-to}}
  </p>
{{/each}}
```

while transitioning this way will cause the model hook to be executed (because link-to was passed photo.id, an identifier, instead):

下面这种方式就会导致 model 执行, 因为传入的只是一个标识符 photo.id:

```hbs
<h1>Photos</h1>
{{#each model as |photo|}}
  <p>
    {{#link-to "photo" photo.id}}
      <img src="{{photo.thumbnailUrl}}" alt="{{photo.title}}" />
    {{/link-to}}
  </p>
{{/each}}
```

**Routes without dynamic segments will always execute the model hook.**

**没有动态段的路由总是会调用 model 钩子.**

------

### Reusing Route Context (路由上下文重用)

Sometimes you need to fetch a model, but your route doesn't have the parameters, because it's a child route and the route directly above or a few levels above has the parameters that your route needs.

有时候你需要获取数据, 但是当前路由路由没有这个参数, 它的上级路由或者祖先路由具有这个参数.

In this scenario, you can use the paramsFor method to get the parameters of a parent route.

这种场景下, 你可以使用 `paramsFor` 从父级或者祖先路由那里获取这个参数.

```js
// app/routes/album/index.js
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let { album_id } = this.paramsFor('album');

    return this.store.query('song', { album: album_id });
  }
});
```

This is guaranteed to work because the parent route is loaded. But if you tried to do paramsFor on a sibling route, you wouldn't have the results you expected.

请放心使用, 因为祖先路由会比当前路由先加载完成. 但是反之则不然啊, 你不能对兄弟路由这么使用.

This is a great way to use the parent context to load something that you want. Using paramsFor will also give you the query params defined on that route's controller. This method could also be used to look up the current route's parameters from an action or another method on the route, and in that case we have a shortcut: this.paramsFor(this.routeName).

这是一种使用父级上下文来加载你需要的数据的好方法. 使用 `paramsFor` 也能够得到那个路由的 `controller` 上定义的查询参数. 可以在路由的 action 或者当前路由的其他方法中使用该方法来获取路由的参数, 这种情况下有个快捷写法:

```js
this.paramsFor(this.routeName);
```

In our case, the parent route had already loaded its songs, so we would be writing unnecessary fetching logic. Let's rewrite the same route, but use modelFor, which works the same way, but returns the model from the parent route.

在我们的例子中, 父级路由已经加载了 songs, 所有我们不必要再写多余的逻辑来获取数据. 现在我们将使用 `modelFor` 来从父级路由获取数据.

```js
// app/routes/album/index.js
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let { songs } = this.modelFor('album');

    return songs;
  }
});
```

In the case above, the parent route looked something like this:

上面例子中, 父级路由可能如下:

```js
// app/routes/album.js

import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model({ album_id }) {
    return RSVP.hash({
      album: this.store.findRecord('album', album_id),
      songs: this.store.query('songs', { album: album_id })
    });
  }
});
```

And calling modelFor returned the result of the model hook.

使用 modelFor 返回指定路由 model钩子获得的结果.

---


By default, a route handler will render the template with the same name as the route.

默认情况下, 路由处理函数会渲染与路由同名的 template

If you want to render a template other than the default one, set the route's [templateName](https://www.emberjs.com/api/ember/release/classes/Route/properties/templateName?anchor=templateName) property to the name of the template you want to render instead.

如果你想要显示的不是默认的 template, 设置路由的 [templateName](https://www.emberjs.com/api/ember/release/classes/Route/properties/templateName?anchor=templateName) 属性为你希望使用的 template 的名字.

```js
import Route from '@ember/routing/route';

export default Route.extend({
  templateName: 'posts/favorite-posts'
});
```

You can override the [renderTemplate()](https://www.emberjs.com/api/ember/release/classes/Route/methods/renderTemplate?anchor=renderTemplate) hook if you want finer control over template rendering. Among other things, it allows you to choose the controller used to configure the template and specific outlet to render it into.

如果你希望更细的控制 template 的渲染, 你可以覆写 [renderTemplate()](https://www.emberjs.com/api/ember/release/classes/Route/methods/renderTemplate?anchor=renderTemplate) 方法. 它可以让你指定 controller 来配置 template, 并且可以指定渲染进哪个 outlet helper 中去

---

transitionTo() behaves exactly like the link-to helper.

[transitionTo()](https://www.emberjs.com/api/ember/release/classes/Route/methods/transitionTo?anchor=transitionTo) 的表现与 [link-to](https://guides.emberjs.com/v3.0.0/templates/links) helper 完全相同.

If the new route has dynamic segments, you need to pass either a model or an identifier for each segment. Passing a model will skip the route's model() hook since the model is already loaded.

如果路由有动态段, 你需要给每个段传入 model 或者 标识符. 传入 model 将会跳过钩子 `model()`, 因为它被当做已经加载了.

### 跳转到子路由

如果路由的定义是下面这样的:

```js
Router.map(function() {
  this.route('posts', function() {
    this.route('post', { path: '/:post_id' });
  });
});
```

即 post 是 posts 的子路由.

If we redirect to `posts.post` in the `afterModel` hook, afterModel essentially invalidates the current attempt to enter this route. So the posts route's `beforeModel`, `model`, and `afterModel` hooks will fire again within the new, redirected transition. This is inefficient, since they just fired before the redirect.

如果我们在 posts 的 `afterModel` 中往 `posts.post` 进行跳转, afterModel 实际上使得当前尝试进入该路由变得无效. 因此 posts 的 `beforeModel`, `model`, `afterModel` 会在这个新的重定向中再次触发. 因为它们在重定向之前已经触发过了.

Instead, we can use the redirect() method, which will leave the original transition validated, and not cause the parent route's hooks to fire again:

上面的目的我们可以使用 `redirect()` 方法来完成. 该方不会导致父级路由再次触发.

```js
import Route from '@ember/routing/route';

export default Route.extend({
  redirect(model, transition) {
    if (model.get('length') === 1) {
      this.transitionTo('posts.post', model.get('firstObject'));
    }
  }
});
```

---

Note that you can't bind queryParams to computed properties, they have to be values.

注意, 不能将 queryParams 绑定到计算属性上, 它们必须是一个值.

By default, a query param property change won't cause a full router transition (i.e. it won't call model hooks and setupController, etc.); it will only update the URL.

默认情况下, 查询参数的改变不会导致一个路由发生完全的转换(如它不会调用 model 和 setupController 方法等). 它仅仅更新 URL.


### transitionTo

`Route#transitionTo` and `Controller#transitionToRoute` accept a final argument, which is an object with the key `queryParams`.

`Route#transitionTo` 和 `Controller#transitionToRoute` 的最后一个参数如果是包含 `queryParams` 属性的对象, 则会将 queryParams 的字段当做路由的查询参数.

```js
this.transitionTo('post', object, { queryParams: { showDetails: true }});
this.transitionTo('posts', { queryParams: { sort: 'title' }});

// if you want to transition the query parameters without changing the route
// 如果只是想修改查询参数而不改变路由, 可以这样写
this.transitionTo({ queryParams: { direction: 'asc' }});
```

You can also add query params to URL transitions:
也可以在使用 URL 跳转时添加查询参数:

```js
this.transitionTo('/posts/1?sort=date&showDetails=true');
```

### Opting into a full transition

When you change query params through a transition (`transitionTo` and `link-to`), it is not considered a full transition. This means that the controller properties associated with the query params will be updated, as will the URL, but no `Route` method hook like `model` or `setupController` will be called.

当你通过 transition(`transitionTo` 和 `link-to`) 方式改变了查询参数的时候, 并不会被当做完整的 transition. 也就意味着 controller 中与查询参数关联的属性会同步更新, 但是不会调用 `Route` 和 `model` 钩子.

If you need a query param change to trigger a full transition, and thus the method hooks, you can use the optional `queryParams` configuration hash on the `Route`. If you have a `category` query param and you want it to trigger a model refresh, you can set it as follows:

如果你需要在查询参数改变的时候触发完整的 transtion, 并调用钩子方法, 你可以在 `Route` 的 `queryParams` 属性中配置. 如果你有一个查询参数 category, 希望它在改变的时候能触发 model 刷新, 你可以向下面这样设置.

```js
// app/routes/articles.js

import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    category: {
      refreshModel: true
    }
  },

  model(params) {
    // This gets called upon entering 'articles' route
    // for the first time, and we opt into refiring it upon
    // query param changes by setting `refreshModel:true` above.

    // params has format of { category: "someValueOrJustNull" },
    // which we can forward to the server.
    return this.get('store').query('article', params);
  }
});
```

```js
// app/controllers/articles.js

import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['category'],
  category: null
});
```

---

`{{if}}` checks for truthiness, which means all values except `false`, `undefined`, `null`, `''`, `0` or `[]` (i.e., any JavaScript falsy value or an empty array).

`{{if}}` 检查逻辑真假, 除了 `false`, `undefined`, `null`, `''`, `0`, `[]` (任何 JavaScript 逻辑假的值和**空数组**)

---

### Class-based Helpers

By default, helpers are stateless. They are passed inputs (parameters and a hash), they perform an operation on those inputs, and return a single output. They have no side-effects and don't save any information that is used on subsequent runs of the function.

helpers 默认情况下是无状态的. 它们接受输入(参数和 hash, hash 即命名参数对象), 对输入进行处理然后返回结果值. 它们没有副作用, 也不为后续的函数保存任何信息.

In some situations, however, you may need to write a helper that interacts with the rest of your application. You can create class-based helpers that have access to services in your application, and can optionally save state as well, although this is usually unnecessary and error-prone.

有时候, 你可能希望 helper 能够与接下来的代码进行交互, 这种情况下你就需要一个基于类的(class-based) helper, 它可以保存状态, 尽管通常情况下这样易错也并非是必要的.

To create a class-based helper, rather than exporting a simple function, you should export a subclass of `Ember.Helper`. Helper classes must contain a `compute` method that behaves the same as the function passed to `Ember.Helper.helper`. In order to access a service, you must first inject it into the class-based helper. Once added, you can call the service's methods or access its properties from within the `compute()` method.

为了创建一个基于类的 helper, 你应该 export 一个 [`Ember.Helper`](https://www.emberjs.com/api/ember/release/classes/Helper) 的子类而不是 export 一个简单的方法. Helper 类必须包含一个 [`compute`](https://www.emberjs.com/api/ember/release/classes/Helper/methods/compute?anchor=compute) 方法, 它与传入 [`Ember.Helper.helper`](https://emberjs.com/api/ember/2.15/classes/Ember.Helper/methods/helper?anchor=helper) 的方法表现一致. 如果希望访问一个 service, 你必须首先将 service 注入到当前这个基于类的 helper 中. 注入之后, 你就可以在 `compute()` 方法中调用该 service 的方法或者属性.

As an exercise, here is the above format-currency helper re-factored into a class-based helper:
这里将[上面例子](https://guides.emberjs.com/v3.0.0/templates/writing-helpers/)中的 format-currency helper 重构成为一个 基于类的 helper:

```js
import Helper from '@ember/component/helper';

export default Helper.extend({
  compute([value, ...rest], hash) {
    let dollars = Math.floor(value / 100);
    let cents = value % 100;
    let sign = hash.sign === undefined ? '$' : hash.sign;

    if (cents.toString().length === 1) { cents = '0' + cents; }
    return `${sign}${dollars}.${cents}`;
  }
});
```

This is exactly equivalent to the format-currency example above. You can think of the function version as a shorthand for the longer class form if it does not require dependency injection.

这与上面的 format-currency 例子完全相同. 所以当不需要注入依赖的时候, 你可以使用 export 函数的方式, 那样更简洁.

As another example, let's make a helper utilizing an authentication service that welcomes users by their name if they're logged in:

再举个例子, 比如有一个基于用户身份认证 service 对用户进行不同提示的 helper:

```js
import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  authentication: service(),   // 提前注入依赖

  compute() {
    let authentication = this.get('authentication');   // 在 compute 中调用 service

    if (authentication.get('isAuthenticated')) {
      return 'Welcome back, ' + authentication.get('username');
    } else {
      return 'Not logged in';
    }
  }
});
```

### Escaping HTML Content
To protect your application from cross-site scripting attacks (XSS), Ember automatically escapes any value you return from a helper so that the browser will not interpret it as HTML.

为了避免你的应用遭受跨域攻击(XSS), Ember 会自动转义 helper 返回的任何值. 所以浏览器就不会把它解释为 HTML.

For example, here's a make-bold helper that returns a string containing HTML:

例如, 下面这个 make-bold helper 返回一个包含 HTML 的字符串:

```js
// app/helpers/make-bold.js

import { helper } from '@ember/component/helper';

export function makeBold([param, ...rest]) {
  return `<b>${param}</b>`;
});

export default helper(makeBold);
```

You can invoke it like this:

像下面这样调用:

```hbs
{{make-bold "Hello world"}}
```

Ember will escape the HTML tags, like this:

Ember 会转义 HTML 标签, 就像下面这样:

```html
&lt;b&gt;Hello world&lt;/b&gt;
```

This shows the literal string `<b>Hello world</b>` to the user, rather than the text in bold as you probably intended. We can tell Ember not to escape the return value (that is, that it is safe) by using the `htmlSafe` string utility:

这样展示给用户的就是字符串 `<b>Hello world</b>` 而不是加粗了的 Hello world. 可以通过字符串的工具方法 `htmlSafe` 告诉 Ember 不转义返回值:

```js
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function makeBold([param, ...rest]) {
  return htmlSafe(`<b>${param}</b>`);
});

export default helper(makeBold);
```

If you return a SafeString (a string that has been wrapped in a call to htmlSafe), Ember knows that you have vouched on its behalf that it contains no malicious HTML.

如果你返回一个 SafeString(包含在 htmlSafe 中的字符串), Ember 就知道你已经确认了里面没有包含恶意的 HTML 代码.

However, note that in the above code we may have inadvertently introduced an XSS vulnerability into our application! By blindly marking the string as safe, a malicious user could get their own HTML into our app, allowing them to do things like access sensitive customer data.

注意, 上面的代码我们还是忽略了 XSS 攻击. 盲目的将告诉 Ember 未处理过的字符串为安全的字符串将可能遭到恶意的用户把代码嵌入到你的 app 中, 让他们有机会获取敏感的用户信息.

For example, imagine that we have a chat app and use our make-bold helper to welcome the new users into the channel:

例如, 设想一下如果我们有一个聊天的 app, 我们使用 make-bold helper 来向用户展示进入频道的欢迎信息:

```hbs
Welcome back! {{make-bold model.firstName}} has joined the channel.
```

Now a malicious user simply needs to set their firstName to a string containing HTML (like a `<script>` tag that sends private customer data to their server, for example) and every user in that chat room has been compromised.

现在有个可以用户将他的 firstName 设置为包含 HTML 标签(如用`<script>`来发送用户数据到第三方服务器)的字符串, 那么那个频道中的每个用户都会遭到这样的攻击.

In general, you should prefer using components if you are wrapping content in HTML. However, if you really want to include a mix of HTML and values from models in what you return from the helper, make sure you escape anything that may have come from an untrusted user with the `escapeExpression` utility:

通常, 你更应该使用 components 来将内容封装到 HTML 中. 然而, 如果你实在希望在 helper 的返回值中把 HTML 和 model 中某个值混合在一起, 请确保你已经使用 `escapeExpression` 工具将来自用户的不可信的数据进行了转义:

```js
import Ember from "ember";
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function makeBold([param, ...rest]) {
  let value = Ember.Handlebars.Utils.escapeExpression(param);
  return htmlSafe(`<b>${value}</b>`);
});

export default helper(makeBold);
```

Now the value passed into the helper has its HTML escaped, but the trusted `<b>` tags that we want to wrap the value in are not escaped. A malicious user setting their firstName to something containing HTML would see this:

现在给 helper 传入的值对 HTML 进行了转义, 但是我们希望用于包含内容值的 `<b>` 标签没有进行转义. 如果一个恶意用户将 firstName 设置为包含 HTML 的代码就可能看起来是像下面这样:

```html
Welcome back! <b>&lt;script
type="javascript"&gt;alert('pwned!');&lt;/script&gt;</b> has joined the channel.
```


---

After a component successfully renders its backing HTML element into the DOM, it will trigger its didInsertElement() hook.

component 成功将它的 HTML 渲染进 DOM 之后, 会触发 `didInsertElement()` 钩子.

Ember guarantees that, by the time `didInsertElement()` is called:

在调用 `didInsertElement()` 之前 Ember 将确保:

- The component's element has been both created and inserted into the DOM.

component 的元素已经创建成功并且插入到 DOM 中去了.

- The component's element is accessible via the component's `$()` method.

component 的元素可以通过 `$()` 进行访问.


There are a few things to note about the didInsertElement() hook:

这里有几点关于使用 `didInsertElement()` 需要注意的地方:

- It is only triggered once when the component element is first rendered.

它只会在 component 首次渲染的时候执行一次.

- In cases where you have components nested inside other components, the child component will always receive the didInsertElement() call before its parent does.

如果 component 与 component 嵌套, 子 component 的 `didInsertElement()` 总是会在父级之前调用.

- Setting properties on the component in didInsertElement() triggers a re-render, and for performance reasons, is not allowed.

在  `didInsertElement()` 中设置属性值会导致重绘, 由于性能原因, 这是不允许的.

- While didInsertElement() is technically an event that can be listened for using on(), it is encouraged to override the default method itself, particularly when order of execution is important.

从技术上讲, `didInsertElement()` 可以通过 `on()` 进行监听, 推荐覆写默认的该方法, 尤其是当执行顺序非常重要的时候.

### Making Updates to the Rendered DOM with didRender
The `didRender` hook is called during both render and re-render after the template has rendered and the DOM updated. You can leverage this hook to perform post-processing on the DOM of a component after it's been updated.

`didRender` 会在 template 已经渲染并且 DOM 更新完成之后的渲染或者重绘的时候调用. 所以可以使用这个钩子 component 更新之后的 DOM 上执行操作.

In this example, there is a list component that needs to scroll to a selected item when rendered. Since scrolling to a specific spot is based on positions within the DOM, we need to ensure that the list has been rendered before scrolling. We can first render this list, and then set the scroll.

在这个例子中, 有个列表组件需要在渲染之后滑动到已选中元素的地方. 由于滑动到一个特定的点需要根据 DOM 中的具体位置来确定, 所以我们需要确保在滑动前该列表已经渲染完成. 我们可以先渲染这个列表, 然后执行滚动.

The component below takes a list of items and displays them on the screen. Additionally, it takes an object representing which item is selected and will select and set the scroll top to that item.

下面这个 component 将一个列表渲染到屏幕. 另外, 它还需要确定哪个选项被选中了, 并且设置容器的 scroll top 使其滚动到那个元素的位置.

```hbs
{{selected-item-list items=items selectedItem=selection}}
```

When rendered the component will iterate through the given list and apply a class to the one that is selected.

渲染 component 的时候会通过给定的列表进行迭代, 并且给选中元素添加一个 class 样式.

```hbs
{{#each items as |item|}}
  <div class="list-item {{if item.isSelected 'selected-item'}}">{{item.label}}</div>
{{/each}}
```

The scroll happens on `didRender`, where it will scroll the component's container to the element with the selected class name.

scroll 发生在 `didRender` 中, 它根据选中元素的样式名将 component 的容器滚动到元素的位置.

```js
import Component from '@ember/component';

export default Component.extend({
  classNames: ['item-list'],

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('items', this.get('items').map((item) => {
      if (item.id === this.get('selectedItem.id')) {
        item.isSelected = true;
      }
      return item;
    }));
  },

  didRender() {
    this._super(...arguments);
    this.$('.item-list').scrollTop(this.$('.selected-item').position.top);
  }
});
```


---

### Positional Params
In addition to passing parameters in by name, you can pass them in by position. In other words, you can invoke the above component example like this:

除了通过名字的方式传递参数, 你还可以通过指定参数位置, 然后通过位置来传递参数. 换言之, [上面的例子](https://guides.emberjs.com/v3.0.0/components/passing-properties-to-a-component/)可以像下面这样:

```hbs
{{#each model as |post|}}
  {{blog-post post.title post.body}}
{{/each}}
```

To set the component up to receive parameters this way, you need to set the `positionalParams` attribute in your component class.

如果需要通过这种方式接收参数, 你需要设置该 component 的 `positionalParams` 属性.

```js
import Component from '@ember/component';

export default Component.extend({}).reopenClass({
  positionalParams: ['title', 'body']
});
```

Then you can use the attributes in the component exactly as if they had been passed in like `{{blog-post title=post.title body=post.body}}`.

然后就可以像之前通过 `{{blog-post title=post.title body=post.body}}` 传递的参数一样使用通过位置传入的参数了.

Notice that the `positionalParams` property is added to the class as a static variable via `reopenClass`. Positional params are always declared on the component class and cannot be changed while an application runs.

注意, `positionalParams` 属性是通过 `reopenClass` 添加的静态变量. 在应用运行期间, Positional params 始终被声明在 component 的 class 上并且不能改变.

Alternatively, you can accept an arbitrary number of parameters by setting positionalParams to a string, e.g. positionalParams: 'params'. This will allow you to access those params as an array like so:

另外, 你可以通过把 `positionalParams` 设置为字符串来接收任意数量的参数. 如 `positionalParams: 'params'` 会使用一个数组接收这些参数. 就像下面这样:

```js
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  title: computed('params.[]', function(){
    return this.get('params')[0];
  }),
  body: computed('params.[]', function(){
    return this.get('params')[1];
  })
}).reopenClass({
  positionalParams: 'params'
});
```

Additionally, since the component isn't instantiated until the block content is rendered, we can add arguments within the block. In this case we'll add a text style option which will dictate the style of the body text we want in our post. When {{post.body}} is instantiated, it will have both the editStyle and postData given by its wrapping component, as well as the bodyStyle declared in the template.

此外, 由于在呈现块内容之前 component 并没有被实例化(备注, 这里呈现内容之前是指下例中 blog-post 呈现内容之前, component 是指 blog-post 的子组件 post.body, 由于正常情况下是先执行组件自身的 init, 然后才渲染它的内容, 也就是先实例化组件再渲染它的包括块内容的模板, 这里只有这么理解, 否则理解不通)，所以我们可以在块中添加参数。在这种情况下，我们将添加一个文本样式选项，该选项将决定我们在文章中想要的正文文本的样式。 当 {{post.body}} 被实例化时, 它将会得到包含它的 component 提供的 editStyle 和 postData 参数, 还有模板中声明的 bodyStyle 参数.

```hbs
{{#blog-post editStyle="markdown-style" postData=myText as |post|}}
  <p class="author">by {{author}}</p>
  {{post.body bodyStyle="compact-style"}}
{{/blog-post}}
```


---

To utilize an event object as a function parameter:

将事件对象用作为函数参数的方法有:

- Define the event handler in the component (which is designed to receive the browser event object).

在 component 中定义事件处理函数(非 actions hash 中的 action, 而是在组件中直接定义的 click、doubleClick 方法 等, [点击查看支持的事件](https://guides.emberjs.com/v3.0.0/components/handling-events/#toc_event-names) [点击查看如何自定义事件](https://www.emberjs.com/api/ember/release/classes/Application/properties/customEvents?anchor=customEvents)) (这种方法被设计为接收浏览器事件对象作为参数)

```js
import Component from '@ember/component';
import Ember from 'ember';

export default Component.extend({
  doubleClick() {   //  直接定义 Ember 内建的事件处理函数,
    console.info('DoubleClickableComponent was clicked!');
    return true;
  }
});
```

- Or, assign an action to an inline event handler in the template (which creates a closure action and does receive the event object as an argument).

在 template 中将 action 赋值给行内的事件处理函数(这会创建一个 closure action, 并且会接收事件对象作为参数)

```hbs
<button onclick={{action "signUp"}}>Sign Up</button>
```


### Invoking Actions Directly on Component Collaborators

Actions can be invoked on objects other than the component directly from the template. For example, in our send-message component we might include a service that processes the sendMessage logic.

Actions 可以直接在某个对象上进行调用而不是直接在模板中调用 component 的 actions. 例如, 在例子 send-message 这个 component 包含一个处理 sendMessage 逻辑的 service:

```js
// app/components/send-message.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  messaging: service(),

  // component implementation
});
```

We can tell the action to invoke the sendMessage action directly on the messaging service with the `target` attribute.

我们可以通过 `target` 属性来告诉 action 直接在 messaging 这个 service 上调用 sendMessage actions.

```hbs
<!-- // app/templates/components/send-message.hbs -->
{{#button-with-confirmation
    text="Click to send your message."
    onConfirm=(action "sendMessage" "info" target=messaging)
    as |confirmValue| }}
  {{input value=confirmValue}}
{{/button-with-confirmation}}
```

```js
// app/services/messaging.js
import Service from '@ember/service';

export default Ember.Service.extend({
  actions: {
    sendMessage(messageType, text) {
      //handle message send and return a promise
    }
  }
});
```

### Destructuring Objects Passed as Action Arguments

A component will often not know what information a parent needs to process an action, and will just pass all the information it has. For example, our user-profile component is going to notify its parent, system-preferences-editor, that a user's account was deleted, and passes along with it the full user profile object.

通常 component 并不清楚父级需要什么信息, 所以直接把所有信息都传递给调用的 action. 例如, user-profile component 通知父级 system-preferences-editor 用户账号被删除的时候传入了整个用户信息对象.

```js
// app/components/user-profile.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  login: service(),

  actions: {
    userDidDeleteAccount() {
      this.get('login').deleteUser();
      this.get('didDelete')(this.get('login.currentUserObj'));
    }
  }
});
```

All our system-preferences-editor component really needs to process a user deletion is an account ID. For this case, the action helper provides the value attribute to allow a parent component to dig into the passed object to pull out only what it needs.

实际上 system-preferences-editor 真正需要的只是一个账户 ID. 这种情况下, action helper 提供了一个 value 属性让父级 component 从传来的对象参数中取得自己需要的信息(value 属性的值作为参数对象中属性的路径, 如 value="target.value" 即实际上 action 参数得到的值就是传递给 action 对象上的 `target.value` 属性)

```hbs
<!-- app/templates/components/system-preferences-editor.hbs -->
{{user-profile didDelete=(action "userDeleted" value="account.id")}}
```

Now when the system-preferences-editor handles the delete action, it receives only the user's account id string.

现在当 system-preferences-editor 处理删除操作的时候, 它得到的仅仅是一个用于标识用户账户的 ID 字符串.

```js
// app/components/system-preferences-editor.js
import Component from '@ember/component';

export default Component.extend({
  actions: {
    userDeleted(idStr) {
      //respond to deletion
    }
  }
});
```
