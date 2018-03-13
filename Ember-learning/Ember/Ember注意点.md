# Ember 3.0 注意点

#### Note that bindings don't update immediately. Ember waits until all of your application code has finished running before synchronizing changes, so you can change a bound property as many times as you'd like without worrying about the overhead of syncing bindings when values are transient.

#### 注意绑定(单双向绑定)不会立即更新. 相互绑定的变量同步值之前, Ember 会等待应用的所有的代码全部完成之后才会进行它们之间的同步, 因此如果某个值会出现很多的瞬态时, 你可以修改它多次而不需要担心会带来过多的开销.

------

https://guides.emberjs.com/v3.0.0/routing/specifying-a-routes-model/

#### Note: A route with a dynamic segment will always have its model hook called when it is entered via the URL. If the route is entered through a transition (e.g. when using the link-to Handlebars helper), and a model context is provided (second argument to link-to), then the hook is not executed. If an identifier (such as an id or slug) is provided instead then the model hook will be executed.

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

#### Routes without dynamic segments will always execute the model hook.

#### 通过 URL 进入具有动态段的路由时, 钩子 model 总是会被调用. 如果是从其它地方过渡到这个页面(如使用 link-to),并且传递了 model 上下文(link-to 的第二个参数),则钩子不会执行. 如果不是传入的 model 上下文, 而是一个标识符(如 id ), 则会执行 model 钩子.

#### 没有动态段的路由总是会调用 model 钩子.

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