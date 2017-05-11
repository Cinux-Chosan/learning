# Liquid Fire: Animations & Transitions for Ember Apps

Liquid Fire 是一个 Ember 应用程序的动画库。

### 核心思想

页面变换需要在视图层实现，但是任何时候决定作何种转换是一个高层次的话题，它依赖于不同 route 和 model 之间的关系。

因此，我们将它分为 3 个核心部分： template helpers, transition map, transitions。

#### Template Helpers

Liquid Fire 提供的如 `{{liquid-outlet}}`, `{{liquid-if}}` 等 helper，它们几乎可以直接替代常规的 Ember helpers，最大的不同是它们不能在绑定的数据发生改变的时候立即刷新，而是会先查询应用程序的 transition map，如果发现了匹配的 transition，则会同时控制新老内容的变换。[Read more about Template Helpers](http://ember-animation.github.io/liquid-fire/#/helpers)

#### Transition Map

Transition map 与 Ember 的 router.js 类似。它是用来匹配 Ember 应用程序各个部分之间关联规则的地方。按照管理， transition map 在 `app/transitions.js` ，它长下面这样：

``` js
export default function(){
  this.transition(
    this.fromRoute('people.index'),
    this.toRoute('people.detail'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
};
```

Old-school apps without a module resolver should pass their transition map function to `LiquidFire.map`. [There is an example here](https://github.com/ember-animation/liquid-fire/blob/oldstable/example/prebuilt-example.html).

[Read more about the Transition Map](http://ember-animation.github.io/liquid-fire/#/transition-map)


#### Transitions

上面的 Transition map 提到两个 transition: `toLeft` 和 `toRight`。它们都是Liquid Fire 自带的，你也可以自己定义 transition，看起来像下面这个样子：

``` js
import { animate, stop } from "liquid-fire";

export default function fade(oldView, insertNewView) {
  stop(oldView);
  return animate(oldView, {opacity: 0})
    .then(insertNewView)
    .then(function(newView){
      return animate(newView, {opacity: [1, 0]});
    });
}
```
 （上例中， `opacity: [1, 0]` 使用了 velocity 的 `forcefeeding` 技术，格式是 `[endValue, startValue]`，意思是 opacity 从 0 到 1）

 Transition 通过基于 promise 的 API，所以你可以控制相关动画的时间，包括什么时候插入一个行的视图到 DOM 中。[Read more about Transitions](http://ember-animation.github.io/liquid-fire/#/transitions)

## 安装

可以使用 `ember-cli` 安装：

``` sh
ember install liquid-fire
```

#### 支持的 Ember  版本：

- `master` 分支通过 canary 兼容了 Ember 1.13，并且作为发布在 npm 的最新 liquid-fire 版本

- `stable` 分支兼容 Ember 1.11 和 1.12，在 npm 上面发布为 0,19.x 系列。它将续接收高优先级的 bug 并进行修复，但是新特性仅会在 `master` 发布。

- `oldstable` 分支兼容 Ember 1.10.0 到 1.8.1，在 npm 上以 0.17.x 系列发布。它将持续接收高优先级的 bug 并进行修复，但是新特性仅会在 `master` 发布。

As liquid-fire is still pre-1.0, you can expect breaking changes, which will be described in the [CHANGELOG](https://github.com/ef4/liquid-fire/blob/master/CHANGELOG.md).

## Cookbook: 如果在你的 Ember App 中使用 Liquid Fire

为了在你的项目中使用 Liquid Fire，需要遵循以下几个步骤（假如你已经安装了 Liquid Fire）：

- 1、建立 transition

在项目根目录（app/）下面创建 `transitions.js` 文件，与 router.js 同目录，创建好后就有一个 `app/transitions.js` 文件，文件长这样：

``` js
export default function(){
  this.transition(
    this.fromRoute('index'),
    this.toRoute('posts'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
};
```

上例使用了 `swipe` transition， 从右到左，发生在 `index` 路由到 `posts` 路由。reverse 表示从 `posts` 到 `index` 的动画。[ There many more transitions included by default](http://ember-animation.github.io/liquid-fire/#/transitions/predefined)

- 2、替代 template 中的 outlets

现在我们已经定义好了 transition，接下来需要替代 Ember 原生的 `{{outlet}}`，将它替换为 Liquid Fire 提供的 `{{liquid-outlet}}`。你的 `app/templates/application.hbs` 可能这样：

``` hbs
<nav>
    <ul>
        <li>{{#link-to "index"}}Index{{/link-to}}</li>
        <li>{{#link-to "posts"}}Posts{{/link-to}}</li>
    </ul>
</nav>

<main>
    {{liquid-outlet}}
</main>
```

- 3、使用路由之间的跳转来触发 transition

在 `index` 中创建一个链接到 `posts` 的 link-to，点击它就可以看到转换效果。

- 4、嵌套路由的 transition

如果我们要创建[嵌套路由](http://guides.emberjs.com/v2.2.0/routing/defining-your-routes/#toc_nested-routes)的变换需要怎么做呢？这需要一些额外的步骤，假如我们的 `app/router.js` 长这样：

``` js
import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {

  this.route('posts', function () {
    this.route('new');
  });

});
```

现在我们希望用户点击按钮的时候创建一篇新的文章，我们先在 `app/transitions.js` 中添加一个 transition：

``` js
export default function(){
  this.transition(
    this.fromRoute('index'),
    this.toRoute('posts'),
    this.use('toLeft'),
    this.reverse('toRight')
  );
  this.transition(
    this.fromRoute('posts.index'),
    this.toRoute('posts.new'),
    this.use('crossFade'),
    this.reverse('crossFade')
  );
};
```

下一步，将 `app/templates/posts.hbs` 内容移到 `app/templates/posts/index.hbs`。并且把 `{{outlet}}` 替换为 `{{liquid-outlet}}`

最后，在 `app/templates/posts/index.hbs` 中创建一个链接到 `posts.new` 路由的按钮，点击它，你就会看到 cross-fade transition。

记住，你必须使用 `{{liquid-outlet}}`，否则看不到 transition。

## Template Helpers

- `{{#liquid-outlet}}`
  - 执行路由之间的 transition
- `{{#liquid-bind}}`
  - 在某个 route 里面的不同 model 或者其他值之间执行 transition
- `{{#liquid-if}}`
  - 在 `true` 或者 `false` 之间执行内容的切换。
- `{{#liquid-spacer}}`
  - 每当 DOM 发生变化的时候，为动画提供一个平滑增长或者缩小的容器。

### 共性与基本选项

以上所有 helpers 具有相同的行为和选项参数：

- 每个 helper 与 Ember 的 helper 具有语义相通性
- 它们会生成 DOM 元素
  - `<div class="liquid-container">` 为动画提供一个容器，默认 `position:relative`
  - `<div class="liquid-child">` 包装动画内容，并且作为动画的目标元素
- 模板中的数据无论什么时候发生变化，helper 都会先查询 [transition map](http://ember-animation.github.io/liquid-fire/#/transition-map) 来决定采取何种动画(transition)
- 动画过程中， `liquid-container` 会包含 `liquid-children`（ for both the outgoing and incoming states）（or possibly even more, if transitions interrupt each other），并且 transitions 对动画元素有完全控制。
- `liquid-container` 能够根据它里面的新旧内容平滑的调整自身的宽度和高度。
- 必要的时候，liquid-fire 会让你的内容绝对定位，并保持在正常文档流中的位置。这大大简化了设计动画友好布局的问题。

#### Options

**Class**

可以像 Ember 那样传递 class（css） 属性， 它们会被运用于 `liquid-container` 元素。

**use**

让你直接提供 transition 名字来使用一个 transition（例如： `use="crossFade"`），它会跳过查询 transition map。在你不关心上下文并且先使用动画效果的时候这样做最简单。`use` 将会匹配除了首次渲染的所有 transition。 For more control, use the [transition map](http://ember-animation.github.io/liquid-fire/#/transition-map).

**growDuration**

增长的最长时间阈值。如果是小变化，根据 `growPixelsPerSecond` 的值，可能花比这还要少的时间。默认是 250 ms

**growPixelsPerSecond**

增长的最小速度。默认为 200 像素/秒。这会让小尺寸的调整时间短于 `growDuration`

**growEasing**

在增长容器高度和宽度的时候使用的 Velocity easing 函数。默认是 `slide`

**shrinkDelay**

容器变小时的延时，默认是 0

**growDelay**

容器增长前的延时，默认是 0

**enableGrowth**

容器时候可以使用动画改变高度和宽度，默认是 `true`

### {{#liquid-outlet}}

除了以下几点，它与 Ember {{outlet}} 一样：

- 它会查询 transition map 并且执行对应 route 之间的动画。
- 它将内容封装在非虚拟视图中，意思就是它会添加标记。See the [Common Behavior and Options](http://ember-animation.github.io/liquid-fire/#/helpers) that apply to all liquid-fire helpers.
- 它不支持使用 `view` 参数来覆盖 view 样式。

除此之外，它完成所有 `{{outlet}}` 所做的工作，包括命名的 outlet（如： `{{liquid-outlet "sidebar"}}`）

#### 使用场景

用于在不同 route 之间切换动画

#### [Demo](http://ember-animation.github.io/liquid-fire/#/helpers/liquid-outlet)

### {{liquid-bind}}

在模板中显示绑定的值，并且在绑定的值发生改变的时候查询 transition map 来决定执行什么动画。

`{{liquid-bind someValue}}` 替代 `{{someValue}}`，不同的是它会将内容封装起来，用于区别动画目标元素。See the [Common Behavior and Options](http://ember-animation.github.io/liquid-fire/#/helpers) that apply to all liquid-fire helpers.

#### [Demo](http://ember-animation.github.io/liquid-fire/#/helpers/liquid-bind)


### {{#liquid-bind}}

如果使用 {{#liquid-bind}}，这与之绑定的值改变的时候会导致整个块重绘。

#### 使用场景

同一个路由中 model值 改变时的动画切换效果。也不一定必须是 model，只要是与之绑定的值发生改变都适用。

#### [Demo](http://ember-animation.github.io/liquid-fire/#/helpers/liquid-bind-block/1)

### {{#liquid-if}}

`{{#liquid-if}}` 用于替代 Ember 常规的 `{{#if}}`，但是有以下不同：

- 它会检索 transition map ，并更加 `true` 或者 `false` 来执行变换
- 将内容封装起来。 See the [Common Behavior and Options](http://ember-animation.github.io/liquid-fire/#/helpers) that apply to all liquid-fire helpers.

`{{#liquid-unless}}` 作为 `{{#liquid-if}}` 的补充。

#### [Demo](http://ember-animation.github.io/liquid-fire/#/helpers/liquid-if)

### {{#liquid-spacer}}

`{{#liquid-spacer}}` 根据自己内容的变化来改变自己的宽高以适应内容的变化。与其他几个不同的是，它不会运行任何动画或者使用 transition 规则。

#### Options


**growDuration**

增长的最长时间阈值。如果是小变化，根据 `growPixelsPerSecond` 的值，可能花比这还要少的时间。默认是 250 ms

**growPixelsPerSecond**

增长的最小速度。默认为 200 像素/秒。这会让小尺寸的调整时间短于 `growDuration`

**growEasing**

在增长容器高度和宽度的时候使用的 Velocity easing 函数。默认是 `slide`

**shrinkDelay**

容器变小时的延时，默认是 0

**growDelay**

容器增长前的延时，默认是 0

**enableGrowth**

容器时候可以使用动画改变高度和宽度，默认是 `true`


## Transition Map

### 使用 Transition Map

Transition map 的作用是配置各种情况的 Transition 规则。在 ember-cli 中，会自动从 `app/transitions.js` 加载。

Old-school apps without a module resolver should pass their transition map function to `LiquidFire.map`. [There is an example here](https://github.com/ember-animation/liquid-fire/blob/oldstable/example/prebuilt-example.html).

当 Liquid Fire 的 helper 检测某个更新需要执行动画的时候，它就会查询 transition map，最匹配的规则将会用于执行动画。

### Transition map top-level functions

- transition
  - 创建一个 transition 规则用于管理何时执行指定的动画。该规则由一个或多个约束组成，并且还包含一个 `use` 声明。`use` 指定的动画仅会在所有约束匹配的情况下执行。
- setDefault
  - 使用 键/值 对的方式来给 `$.Velocity.defaults` 设值。它可以让你设置全局默认选项如 easing 函数或者动画 duration 等参数。

## Route 约束（通过 route 和 model 进行匹配）

以下三个约束用于路由，它们仅用于 `{{liquid-outlet}}` ，因为只有 `{{liquid-outlet}}` 有能力操作 route（其他的 helper 无法得到任何 route 信息）。

- fromRoute
  - 匹配 transition 开始的 route
- toRoute
  - 匹配 transition 到（结束）的 route
- withinRoute
  - 用于匹配开始和结束名相同的 route，相当于将 fromRoute 和 toRoute 写在一起。

它们都只接收一个参数。参数可以是 route 名字的字符串、用于测试 route 名的函数、或者前两个的数组集合。

接下来的 3 个约束应用于 route 的 `model`，它们也值用于 `{{liquid-outlet}}`

- fromModel
  - 匹配 transition 开始时的 route 的 model
- toModel
  - 匹配 transition 到（结束）的 route 的 model
- betweenModels
  - fromModel 和 toModel 的缩写

它们接收一个函数来检测 model ，该函数接收 model 作为第一个参数，并且应该返回一个 boolean；第二个参数时另一个 model（也就是说， `fromModel` 接收的参数为 `(oldModel, newModel)` ； `toModel` 接收的参数时 `(newModel, oldModel)`）

例子：

``` js
// Matches any transition that ends up in the route named 'foo', no
// matter where it came from.
this.transition(
  this.toRoute('foo'),
  this.use('toLeft')
);

// This is equivalent to the previous example, but showing a more
// generic form that lets you provide an arbitrary test.
this.transition(
  this.toRoute(function(routeName){ return routeName === 'foo'; }),
  this.use('toLeft')
);

// You can list multiple routes, and the constraint will be satisfied
// by any of them. This will match any transition that ends up in 'foo'
// or 'bar'.
this.transition(
  this.toRoute(['foo', 'bar']),
  this.use('toLeft')
);

// You can mix and match strings and functions. This is equivalent to
// the previous example.
this.transition(
  this.toRoute(['foo', function(routeName){ return routeName === 'bar'; }]),
  this.use('toLeft')
);

// All of these examples apply to fromRoute too. This will match any
// transition from 'foo' to 'bar', or from 'foo' to any route name
// starting with 'q'.
this.transition(
  this.fromRoute('foo'),
  this.toRoute(['bar', function(routeName){ return /^q/.test(routeName); }]),
  this.use('toLeft')
);

// withinRoute is just a shorthand. Instead of saying this:
this.transition(
  this.fromRoute('foo'),
  this.toRoute('foo'),
  this.use('toLeft')
);
// you can say this:
this.transition(
  this.withinRoute('foo'),
  this.use('toLeft')
);
```

万一你需要为一个嵌套的 UI 执行子路由 transition，但是又没有定义 `index` route 或 template:

``` hbs
<!-- main-route.hbs -->
<header></header>
<sidebar>{{liquid-outlet}}</sidebar>
```

``` hbs
<!-- main-route.edit.hbs -->
<h1>Edit</h1>
```

你也可以为空 outlet 写 transition 规则：

``` js
this.transition(
  this.fromRoute(null),
  this.toRoute('main-route.edit'),
  this.use('toUp')
);
```

## outlet 约束（通过 outlet 匹配）

以下约束应用于 outlet 名。它仅用于 `{{liquid-outlet}}`，因为只有 `{{liquid-outlet}}` 有能力操作 route（其他的 helper 无法得到任何 route 信息）。

- outletName
  - 匹配开始时的 transition 的 outlet 名

没有指定的 outlet 名默认为 "main"

例子：

``` js
// Matches any transition that ends up in the outlet named 'panel', no
// matter where it came from.
// {{liquid-outlet 'panel'}}
this.transition(
  this.outletName('panel'),
  this.use('toLeft')
);

// Matches nothing to something in the 'panel' outlet
this.transition(
  this.outletName('panel'),
  this.fromRoute(null),
  this.use('toLeft', { duration: 100, easing: 'easeInOut' }),
  this.reverse('toRight', { duration: 500, easing: 'easeInOut' })
);

// Matches the default outlet only
this.transition(
  this.outletName('main'),
  this.use('crossFade')
);
```

## 值(value) 约束 （通过 值 匹配）

下面的约束依赖于直接传递给下面 helper 的值：

- {{liquid-bind}} 匹配它绑定的上下文
- {{liquid-if}} 与传递给它的谓词（true、false）进行匹配

这 3 个约束为：

- fromValue
  - 匹配开始时候的值
- toValue
  - 匹配改变后的值
- betweenValues
  - 匹配开始和结束的值

每个约束接受 1 个参数：

- 一个函数，用于测试约束是否满足条件，满足返回 true
- 一个用于匹配约束的正则表达式
- 一个布尔值，指定该约束匹配或不匹配任意值
- 一个字符串或者数字，用于准确匹配，即匹配该字符串或者数字
- `null`，用于匹配 `null` 或者 `undefined`

下面的例子说明如何使用它们：

``` js
// Matches any change that ends up with a value that's a Person.
this.transition(
  this.toValue(function(value){ value instanceof Person }),
  this.use('toLeft')
);

// You can constrain the from-value too.
this.transition(
  this.fromValue("foo"),
  this.toValue("bar"),
  this.use('toLeft')
);

// When you want to constrain both the same, you can use shorthand:
this.transition(
  this.betweenValues(function(value){ return value > 10; }),
  this.use('toLeft')
);

// `null` matches an undefined value.
this.transition(
  this.fromValue(null),
  this.use('fade')
);

// `true` is essentially shorthand for function(value){ return value; }. And
// `false` works too. These are useful when you're writing a rule that
// targets a liquid-if and you want to animate differently for the two
// different logical transitions.
this.transition(
  this.hasClass('fancy-choice'),
  this.toValue(true),
  this.use('toUp'),
  this.reverse('toDown')
);

// Your test functions also receive an additional argument containing
// the "other" value, so you can do direct comparisons between them:
this.transition(
  // compare them by id and only run this animation if we're moving to
  // a value with a higher id.
  this.toValue(function(toValue, fromValue) {
    return toValue && fromValue && toValue.get('id') > fromValue.get('id');
  }),

  this.use('toLeft')
);
```

## 媒体查询 约束（通过媒体查询匹配）

该约束允许你定义根据媒体查询条件进行运行的规则。允许你为移动端和PC端定义不同的 transition

如果要使用该约束，仅包含 `media()` 方法并传入一个合法的 [`媒体查询条件`](http://www.w3.org/TR/css3-mediaqueries/) 即可。

例子：

``` js
// Matches small screens with a width below 321px. Usually small mobile devices.
this.transition(
  this.toRoute('foo'),
  this.media('(max-width: 320px)'),
  this.use('toLeft')
);

// Matches screens between 321px and 768px. Like large phones and tablets.
this.transition(
  this.toRoute('foo'),
  this.media('(min-width: 321px) and (max-width: 768px)'),
  this.use('fade')
);

// Matches screens with a width larger than the height
this.transition(
  this.toRoute('foo'),
  this.media('(orientation:landscape)'),
  this.use('toBottom')
);
```

## DOM & Template 约束 （根据 DOM 上下文匹配）

这些约束让你可以根据周围的 DOM 或者 template 来定位转换规则：

- hasClass
  - 根据 class 来匹配动画元素。

  ``` js
    this.transition(
      this.hasClass('magical'),
      this.use('crossFade')
    );
  ```

  匹配下面的元素

  ``` hbs
    {{#liquid-if isUnicorn class="magical"}}
      It's a unicorn!
    {{else}}
      It's something else!
    {{/liquid-if}}
  ```

- matchSelector
  - 根据 css 选择器来匹配动画元素，例如：

  ``` js
    this.transition(
      this.matchSelector('.main-container'),
      this.use('toUp')
    );
  ```

  将会匹配下面的元素：

  ``` hbs
    {{liquid-outlet class="main-container"}}
  ```

- childOf
  - 根据 CSS 选择器来判断动画元素的父级是否满足匹配

  ``` js
    this.transition(
      this.childOf('#main-container'),
      this.use('toUp')
    );
  ```

  将会匹配下面的元素：

  ``` hbs
    <div id="main-container">
      {{liquid-outlet}}
    </div>
  ```

- inHelper
  - 使用 helper 的名字，仅匹配在该 helper 内的元素。例如，`this.inHelper('liquid-if')` 仅将约束规则用于 `{{#liquid-if}}`

## Initial Render 约束 （根据 Initial Render 匹配）

默认情况下，liquid fire helpers 在首次渲染的时候不会执行动画。但是你可以选择是否需要执行：

- onInitialRender
  - 在 transition 规则中包含 （`this.onInitialRender()`） 来让规则来匹配仅在首次渲染的 helper
- includingInitialRender
  - 在 transition 规则中包含 （`this.includingInitialRender()`） 来让规则来匹配首次渲染和之后的渲染。

这两个约束与其它所有约束都不同。在这种场景下，它们移除默认的约束而不是定义新的约束。

## 选择 transition 动画

每个 transition 都有一个 `use()` 来声明使用何种动画。

每个 transition 都有一个 `reverse()` 来声明逆规则的动画，逆规则在 `fromRoute` 和 `toRoute` 之间，还有 `fromModel` 和 `toModel` 之间。

`use()` 和 `reverse()` 相同的情况下，我们可以简写为 `useAndReverse()` 。 即 `use()` 和 `reverse()` 具有相同的规则。

``` js
// The simplest 'use' just calls a named transition.
this.transition(
  this.withinRoute('foo'),
  this.use('fade')
);

// Named transitions may take arguments. For example, the predefined
// 'fade' transition accepts an `opts` hash that's passed through to
// Velocity, so you can say:
this.transition(
  this.withinRoute('foo'),
  this.use('fade', { duration: 3000 })
);

// This declares two symmetric rules: "from foo to bar use toLeft" and
// "from bar to foo use toRight".
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar'),
  this.use('toLeft'),
  this.reverse('toRight')
);

// You can also provide an implementation instead of a name, though
// it's probably better to keep implementations in separate files. We
// talk more about transition implementations in the next section.
import { animate, stop } from "liquid-fire";
this.transition(
  this.withinRoute('foo'),
  this.use(function(oldView, insertNewView, opts) {
    stop(oldView);
    return animate(oldView, {opacity: 0}, opts)
      .then(insertNewView)
      .then(function(newView){
        return animate(newView, {opacity: [1, 0]}, opts);
      });
  })
);

// This declares two equivalent rules: "from foo to bar use fade" and
// "from bar to foo use fade".
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar'),
  this.useAndReverse('fade')
);
```

## Debug Transition Matching

transition 规则没有匹配或者约束没有执行，这可能会让人很疑惑。这个时候就需要 `debug()` 了。它将在执行时为每个约束和规则打印结果到控制台。

``` js
// The inclusion of `this.debug()` below causes the match results to be
// logged to the console, so you can see if this transition is not
// animating because the fromRoute is not 'foo', or because the toRoute
// is not 'bar'.
this.transition(
  this.fromRoute('foo'),
  this.toRoute('bar'),
  this.use('crossFade'),
  this.debug()
);
```

## Transitions

Transition 实现了两个状态之间的动画。当一个 [template helper](http://ember-animation.github.io/liquid-fire/#/helpers) 即将发生改变的时候，它会去 [transition map](http://ember-animation.github.io/liquid-fire/#/transition-map) 查看是否有匹配的 transition。如果找到一个，则 transition 就会使用它定义的动画去从旧的状态切换到新的状态中去。

Liquid Fire 自带了一些预定义的 transition 动画。但是它还是希望用户能够自己定义一些 transition 动画。

### 预定义 transition

Liquid Fire 包含了一个预定义 transition 集合。预定义这些集合的目的是希望它能够作为用户扩展自己 transition 的基础。

为了得到更多预定义 transition 的信息，可以[查看源码](https://github.com/ef4/liquid-fire/tree/master/app/transitions)

预定义的有 toLeft，toRight，toUp，toDown，fade，crossFade，explode，flyTo，scrollThen，scale，wait 等。

[查看 Demo](http://ember-animation.github.io/liquid-fire/#/transitions/predefined)

## explode transition

`explode` 将新旧模板分开并且分开给予它们动画。查看[Demo](http://ember-animation.github.io/liquid-fire/#/transitions/explode)

### API 详情

`explode` 接受任意数目的参数。每个参数都必须是 object。每个 object 描述该 transition 的一部分。

每个部分都有一个 `use` 属性，它的用法如下：

- 另一个 transition 的名称，如 "toLeft"
- 一个数组，第一个元素是另一个 transition 的名称，剩下的元素是第一个元素 transition 的参数。例如：`["toLeft", { duration: 100 }]`
- 一个直接实现了 transition 的函数，例如：`function() { return animate(this.newElement, { opacity: 0 });}`
- 一个数组，第一个参数是直接实现了 transition 的函数，剩余的参数是该函数的参数。例如：`[myTransitionFunction, { duration: 400 }]`

每个部分也可以包含以下选项之一：

- `pick` 属性：它的值是一个 CSS 选择器，用于匹配新旧元素。
- `pickOld` 属性：它时一个 CSS 选择器，用于匹配旧的元素。
- `pickNew` 属性：同 `pickOld`，用于匹配新的元素。
- `matchBy` 属性：它的值时一个 HTML 属性名，它将会为 pairewise transition 匹配新旧元素。

A piece that has only a `use` and no further options may be used to control everything else that doesn't match another section.

## 定义 transition 动画

通过创建一个类似于 `app/transitions/my-transition.js` 一样的模块并导出一个函数来创建一个 transition。 该函数必须返回一个 Promise，在完成的是否该 Promise 必须为 resolved 状态。

该函数可以通过 `this` 来获取当前 transition 的上下文。该上下文包含：

- `oldElement` : 即将离开视图的 jQuery 元素。如果从一个空的初始状态开始 transition，它可能会是 `undefined`，如果 transition 被中断，它也可能变成 `undefined`
- `newElement` ： 即将进入视图的 jQuery 元素。如果 transition 到一个空状态或者被中断，它可能是 `undefined`
- `oldValue, newValue` ： 新旧状态对应的值（如`{{liquid-bind}}`则是直接传给它的值）
- `oldView, newView` ： 新旧状态对应的 Ember View
- `older` : 如果 transition 在 finish 之前被打断，你可能同一时间在 DOM 中有两个活跃的变体。该属性是一个旧变体的列表，最新的在第一个，每一项都是具有如下属性的 object: `{ element, value, view}`
- `lookup` ： 该属性是一个函数，它允许你通过 transition 名去访问别的 transition。则使得基于现有的 transition 来写新的 transition 变得更加容易：`this.lookup('other').apply(this).then(...)`

transition 可以在 transition 规则中直接从 `use` 声明获取参数，例如：

``` js
/* app/transitions/my-animation.js */
export default function(color, opts) {
  //...
}

/* within app/transitions.js */
this.transition(
  this.toRoute('home'),
  this.use('myAnimation', 'red', { duration: 100 })
);
```

## 动画制作

Liquid Fire 导出了如下方法：

- `animate($elt, props, opts, label)`
  - 该方法操作给定的 jQuery 元素 `$elt`，并且总是返回一个 promise（即使 $elt 为 undefined）。 `props` 和 `opts` 直接传递给 [Velocity's animate 函数](http://julian.com/research/velocity/#arguments)。`label` 是一个可选的字符串，你可以使用它来在改动画执行的时候引用到它。

- `stop($elt)`
  - 停止给定元素 `$elt` 上的所有正在执行的动画

- `isAnimating($elt, label)`
  - 判断 $elt 是否正在执行 label 指定的动画，label 是动画名

- `timeSpent($elt, label)`
  - 返回动画已经运行了多少 ms，在动画过程中需要中断动画的时候比较有用。

- `timeRemaining($elt, label)`
  - 返回 $elt 上 label 动画还离执行完成还剩余多少 ms，在动画过程中需要中断动画的时候比较有用。

- `finish($elt, label)`
  - 当 $elt 上的 label 动画执行完成的时候，返回一个 resolves 的 promise

[Demo](http://ember-animation.github.io/liquid-fire/#/transitions/primitives)
