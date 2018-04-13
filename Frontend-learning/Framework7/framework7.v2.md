## navbar

Navbar is a fixed area at the top of a screen that contains Page title and navigation elements.

Navbar 是定位在屏幕顶部的区域， 它包含页面的标题和导航元素。

Navbar has 3 main parts: Left, Title and Right. Each part may contain any HTML content, but it is recommended to use them in the following way:

Navbar 有 3 个主要部分组成： Left， Title 和 Right。 每个部分可以包含任意 HTML 内容， 但是建议按照下面的方式来使用它们：

- Left part is designed to be used with "back link", icons or with single text link.

  Left 部分用于配合 “返回”链接， icon 或者单个文本链接一起使用

- Title part is used to display page title or tab links (buttons row/segmented controller).

  Title 部分用于显示页面 title 或者 tab 链接

- Right part is for the same as the Left part.

  Right 部分同 Left 部分


### Navbar HTML Layout

Navbar layout is pretty simple and self explaining:

Navbar 布局非常简单，一看即懂：

```html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">Left</div>
        <div class="title">Page Title</div>
        <div class="right">Right</div>
    </div>
</div>
```

Note that Navbar's Title element has lowest width priority, and when window screen will not fit all three elements Title part will be cut.

注意： Navbar 的 Title 元素宽度的优先级最低， 当屏幕不足以完全展示所有的这 3 个元素的时候 Title 部分会被剪断。

So if you use plain text in Title part it will have ellipsis (...) on the end when cuted. But you need to take care about it if you have some custom elements there.

因此如果 Title 部分是使用纯文本的话， 超出的时候就会以省略号(...)代替。 但是如果在这里使用一些自定义元素的话你就需要小心。

### Navbar With Links

To add links in Left or Right part you just need to add the plain `<a>` tag with additional `link` class:

你只需要使用 `<a>` 标签加上额外的 class `link` 就可以在 Left 和Right 部分添加链接了。

```html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <a href="#" class="link">Left Link</a>
        </div>
        <div class="title">Page Title</div>
        <div class="right">
            <a href="#" class="link">Right Link</a>
        </div>
    </div>
</div>
```

### Multiple Links

Nothing extraordinary. Just add more `<a class="link"` to the required part:

如果有多个链接只需要多几个 `<a class="link"` 标签即可：

```html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <a href="#" class="link">Left 1</a>
            <a href="#" class="link">Left 2</a>
        </div>
        <div class="title">Page Title</div>
        <div class="right">
            <a href="#" class="link">Right 1</a>
        </div>
    </div>
</div>
```

### Links With Icons + Text

Here comes a little difference. In this case we need to wrap link's text with `<span>` element. It is required for correct spacing between icon and "word", and for animation:

使用带有 ICON 和 文字的链接就有一点不同， 需要把文字放在 `<span>` 元素中。 用它(span)来控制 icon  和 文字之间的间隔， 并且还可以用于动画：

```html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <a href="#" class="link">
                <i class="icon icon-back"></i>
                <span>Back</span>
            </a>
        </div>
        <div class="title">Title</div>
        <div class="right">
            <a href="#" class="link">
                <i class="icon another-icon"></i>
                <span>Menu</span>
            </a>
        </div>
    </div>
</div>
```

### Links With Icons Only

If need links with icons and without text we need to additional `icon-only` class to links. With this class link will have fixed size so we can't miss it with finger:

如果只使用 icon 而不需要文字就需要给链接添加额外的 class `icon-only`。使用这个 class 可以给链接固定的大小，让我们的手指更加容易点到它（否则icon太小不容易点到）。

```html
<div class="navbar">
    <div class="navbar-inner">
        <div class="left">
            <a href="#" class="link icon-only">
                <i class="icon icon-back"></i>
            </a>
        </div>
        <div class="title">Title</div>
        <div class="right">
            <a href="#" class="link icon-only">
                <i class="icon another-icon"></i>
            </a>
        </div>
    </div>
</div>
```

### Theme-specific Styling

In iOS theme Navbar has thin border on the bottom. To disable this border you need to add `no-hairline` class to navbar element:

iOS 主题的 navbar 底部有一个细边框， 可以给 navbar 元素添加 class `no-hairline` 来去除该边框。

```html
<div class="navbar no-hairline">...</div>
```

In MD theme Navbar has shadow. To disable this shadow you need to add no-shadow class to navbar element:

在 MD 主题下， navbar 有一个阴影， 可以给 navbar 元素添加 class `no-shadow` 来去除该阴影。

```html
<div class="navbar no-shadow">...</div>
```

### navbar 类型

Now let's look where we can place our Navbar in DOM. There are several rules to place Navbar.

现在来看看 DOM 中哪些地方可以放置 Navbar。这里有几条规则如下。

#### Static Navbar

Static navbar position is the probably most rarely used layout type. In this case Navbar is just part of the scrollable page content:

Static navbar 是最少用到的类型。 这种 Navbar 作为 page content 的一部分， 会随着页面滚动而滚动。

（在 page-content 里面, 会随着页面滚动.）

```html
<div class="page">
  <!-- Scrollable page content -->
  <div class="page-content">
    <!-- Static navbar goes in the beginning inside of page-content -->
    <div class="navbar">...</div>
    ...
  </div>
</div>
```

#### Fixed Navbar

Fixed navbar is also part of the page but it is always visible on screen not depending on page scroll. In this case it must be a direct child of page and if page has also fixed toolbar then it must be BEFORE the toolbar:

Fixed navbar 也是 page 的一部分， 但是它在屏幕上总是可见的而不会随着页面的滚动而显示/隐藏。这种 Navbar 必须是 page 的直接子元素并且如果 page 也使用了 fixed toolbar，那么它必须在 fixed toolbar 之前。

（在 page 下面, 不会随着页面滚动. 它**必须**是 page 的直接子元素, 如果 page 没有 fixed toolebar 那么它必须在 toolbar 之前）

```html
<div class="page">
  <!-- Fixed navbar goes ALWAYS FIRST -->
  <div class="navbar">...</div>
  <!-- Fixed toolbar goes ALWAYS AFTER navbar -->
  <div class="toolbar">...</div>

  <!-- Scrollable page content -->
  <div class="page-content">
    ...
  </div>
</div>
```

Fixed Navbar must always be a direct child of a page and BEFORE the toolbar (if fixed toolbar is used on this page)

Fixed Navbar 必须总是 page 的直接子元素并且在 toobar 之前（如果该页面使用了fixed toolbar）

#### Common Navbar

If we need only one common navbar for all pages in View then it must be a direct child of this view and be BEFORE all pages in view:

如果所有页面只需要一个 navbar, 那就可以用 common navbar, 它必须是该 view 的直接子元素, 而且需要在该 view 的所有的 page 之前.

```html
<div class="view">
  <!-- View common navbar -->
  <div class="navbar">...</div>

  <!-- Pages -->
  <div class="page">...</div>
</div>
```

If we need only one common navbar / navbar for all views then it must be a direct child of Views element and be BEFORE all views.

如果所有的 views 都使用一个 common navbar/navbar, 那该 navbar 就必须是 views 的直接子元素, 并且在所有的 view 之前.

```html
<div class="views tabs">
  <!-- Views common navbar -->
  <div class="navbar">...</div>

  <div class="view tab tab-active" id="tab-1">...</div>
  <div class="view tab" id="tab-2">...</div>
  ...
</div>
```

**Common Navbar must always be a direct child of Views/View and BEFORE the navbar (if same common toolbar is used)**

common navbar 必须总是 views/view 的直接子元素, 并且在 toolbar(原文这里应该有问题, 此处应更是 toolbar) 之前(如果使用了相同的 toolbar).

### Dynamic Navbar

Dynamic Navbar is supported only in iOS Theme

Dynamic Navbar 仅在 iOS 主题中得到支持.

One of the iOS-theme awesome features is the dynamic navbar. Navbar's elements will slide and fade during pages transition and swipe back when dynamic navbar is enabled.

iOS 主题其中一个炫酷的特性就是 dynamic navbar. 当开启了 dynamic navbar 的时候, 页面的切换和返回时 navbar 的元素会 slide(滑动) 和 fade(渐隐).

It is enabled by default when you use `Fixed-positioned` navbars, when Navbar is a direct child of the page.

使用 `Fixed-positioned`(即 navbar 为 page 的直接子元素时) navbar 的时候默认开启了 dynamic navbar 效果.

If you want to disable it you need to pass `iosDynamicNavbar: false` for required View on its initialisation or in global [app parameters](http://framework7.io/docs/app.html#app-parameters) for all views. For example:

在 view 初始化或者全局 app 初始化的时候可以通过传入 `iosDynamicNavbar: false` 来禁止该效果.

```js
// Disable globally
var app = new Framework7({
  view: {
    iosDynamicNavbar: false,
  },
});

// Disable only for view on its initialisation
var mainView = app.views.create('.view-main', {
  iosDynamicNavbar: false,
});
```

**Note that when Dynamic Navbar (`iosDynamicNavbar`) is enabled and `iosSeparateDynamicNavbar` parameter is enabled (by default), Navbar HTML element will be detached from the page and moved under View HTML element. In this case to access page related dynamic navbar element use `app.navbar.getElByPage(pageEl)` [method](http://framework7.io/docs/navbar.html#navbar-app-methods)**

注意, 当 dynamic navbar(`iosDynamicNavbar`) 和 `iosSeparateDynamicNavbar` 参数开启的时候(默认情况), navbar HTML 元素将会从 page 元素移动到 view 元素下. 这种情况下如果想要取得页面相关的 dynamic navbar 元素可以使用 `app.navbar.getElByPage(pageEl)` 方法



### Dynamic Navbar Layout

Dynamic Navbar layout is the same as for usual Navbar, the only difference is that you can add additional classes to the Navbar parts (Left, Title, Right) to tell which type of transition effect you want on this part:

dynamic navbar 布局和常规布局一样, 唯一不同的地方就是你可以给 navbar 添加额外的 class(Left, Title, Right) 来表明你想使用哪种切换效果:

- By default (if there is no additional classes) each Navbar part has "Fade" transition effect

  默认情况(没有额外的样式) 每个 navbar 都带有 "Fade" (渐变) 的切换效果.

- If you add sliding class to any of Navbar parts then it will have "Sliding" effect

  如果添加了 class `sliding`(滑动) 给 navbar 的任意部分, 那么该部分就会有 sliding 效果

- If you add sliding class to the navbar-inner then all Navbar parts will have "Sliding" effect

  如果你给 navbar-inner 元素的 class 添加 sliding 那么整个 navbar 都会有 sliding 效果

- For better look you should keep identic transition type for the same Navbar parts through different pages.

  为了得到更好的视觉效果, 最好只在不同页面的 navbar 的相同部分添加切换效果.

```html
<!-- No additional classes, all elements will have "fade" effect on page transition -->
<div class="navbar">
  <div class="navbar-inner">
    <div class="left">
      <a href="#" class="link">Home Left</a>
    </div>
    <div class="title">Home</div>
    <div class="right">
      <a href="#" class="link">Home Right</a>
    </div>
  </div>
</div>

<!-- Title and Left will have "sliding" effect on page transition -->
<!-- 页面切换的时候 title 和 left 会有 sliding 效果 -->
<div class="navbar">
  <div class="navbar-inner">
    <!-- Additional "sliding" class -->
    <div class="left sliding">
      <a href="#" class="link">Home Left</a>
    </div>
    <!-- Additional "sliding" class -->
    <div class="title sliding">Home</div>
    <div class="right">
      <a href="#" class="link">Home Right</a>
    </div>
  </div>
</div>

<!-- All parts will have "sliding" effect on page transition -->
<!-- navbar 的所有部分都会有 sliding 效果 -->
<div class="navbar">
  <!-- Additional "sliding" class -->
  <div class="navbar-inner sliding">
    <div class="left">
      <a href="#" class="link">Home Left</a>
    </div>
    <div class="title">Home</div>
    <div class="right">
      <a href="#" class="link">Home Right</a>
    </div>
  </div>
</div>
```

### Navbar App Methods

[http://framework7.io/docs/navbar.html#navbar-app-methods](http://framework7.io/docs/navbar.html#navbar-app-methods)

### Navbar App Parameters

It is possible to control some default navbar behavior using global [app parameters](http://framework7.io/docs/app.html#app-parameters) by passing navbar related parameters under `navbar` parameter:

| Parameter | Type | Default | Description |
|----|----|----|----|
|`hideOnPageScroll`| boolean |`false`| 该选项使得页面滚动的时候会隐藏 navbar |
|`showOnPageScrollEnd` |boolean | `true` | 该项设置为 `true` 时会在页面滚动到底部时显示隐藏的 navbar|
|`showOnPageScrollTop` | boolean | `true` | 设置为 `false` 时, 当页面向顶部滚动时不会显示隐藏的 navbar. 只有在滚动到达页面最顶部时才可见 |
|`scrollTopOnTitleClick` | boolean | `true` | 当开启该选项后, 每次点击 navbar 中的 title 时都会将页面滚动到顶部 |
|`iosCenterTitle`	 | boolean | `true` | 当开启该选项后, 将会在 iOS 主题中尝试将 title 居中. 有时候(需要自定义设计的时候)可能不需要, 该选项仅在 iOS 主题中生效 |


例:

```js
var app = new Framework7({
  navbar: {
    hideOnPageScroll: true,
    iosCenterTitle: false,
  },
});
```

### Control Navbar With Page Classes

Framework7 allows you to hide/show Navbar on specific page or on specific page scoll by using additional classes.

Framework7 允许你在指定页面或在指定页面滚动的时候通过额外的 class 控制 navbar 显示/隐藏.

If you want to hide navbar on page scroll on some specific page use additional classes on this page's `<div class="page-content">` element:

如果你希望在某些指定页面滚动的时候隐藏 navbar, 可以在 page 的 `<div class="page-content">` 元素上添加额外的 class 来达到目的:

- `hide-bars-on-scroll` - to hide both Navbar and Toolbar on page scroll

  在页面滚动的时候将 navbar 和 toolbar 都隐藏

- `hide-navbar-on-scroll` - to hide Navbar on page scroll

  在页面滚动的时候隐藏 navbar

To disable this behavior on specific pages you may use the following additional classes:

在指定页面取消隐藏可以使用下面的 class:

- `keep-bars-on-scroll` - to keep Navbar and Toolbar on page scroll

  在页面滚动的时候不隐藏 navbar 和 toolbar

- `keep-navbar-on-scroll` - to keep Navbar on page scroll

  在页面滚动的时候不隐藏 navbar

例如:

```html
<div class="page">
  <div class="navbar">
    ...
  </div>
  <!-- "hide-navbar-on-scroll" class to hide Navbar -->
  <div class="page-content hide-navbar-on-scroll">
    <div class="content-block">
      <p>Scroll page down</p>
      ...
    </div>
  </div>
</div>
```

If you have common single Navbar across all pages/views of your app you can hide/show Navbar automatically for some pages where you don't need it.

如果只使用了一个 common navbar 贯穿了所有的 page/view, 可以在不需要它的页面自动 显示/隐藏.

To make it work all you need is to add `no-navbar` class to loaded page (`<div class="page no-navbar">`):

你需要做的就只是给已经加载 page 添加 class `no-navbar`

```html
<!-- Page has additional "no-navbar" class -->
<div class="page no-navbar">
  <div class="page-content">
      ...
  </div>
</div>
```

### 示例:

查看具体效果访问: [http://framework7.io/docs/navbar.html#examples](http://framework7.io/docs/navbar.html#examples)

#### Static Navbar

```html
<div class="page">
  <div class="page-content">
    <!-- Static Navbar -->
    <div class="navbar">
      <div class="navbar-inner">
        <div class="left">
          <a class="link back">
            <i class="icon icon-back"></i>
            <span class="ios-only">Back</span>
          </a>
        </div>
        <div class="title">Static Navbar</div>
        <div class="right"></div>
      </div>
    </div>
    <div class="block">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque quos asperiores ut, odio numquam ab, qui, alias adipisci in magni reiciendis reprehenderit. Labore esse quae ut tempore consequatur, reprehenderit similique!</p>
      ...
    </div>
  </div>
</div>
```

#### Fixed Navbar

```html
<div class="page">
  <!-- Fixed/Dynamic Navbar -->
  <div class="navbar">
    <div class="navbar-inner sliding">
      <div class="left">
        <a class="link back">
          <i class="icon icon-back"></i>
          <span class="ios-only">Back</span>
        </a>
      </div>
      <div class="title">Fixed Navbar</div>
    </div>
  </div>
  <div class="page-content">
    <div class="block">
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque quos asperiores ut, odio numquam ab, qui, alias adipisci in magni reiciendis reprehenderit. Labore esse quae ut tempore consequatur, reprehenderit similique!</p>
      ...
    </div>
  </div>
</div>
```

#### Navbar API

```html
<div class="page">
  <div class="navbar">
    <div class="navbar-inner sliding">
      <div class="left">
        <a class="link back">
          <i class="icon icon-back"></i>
          <span class="ios-only">Back</span>
        </a>
      </div>
      <div class="title">Navbar API</div>
    </div>
  </div>
  <div class="page-content">
    <div class="block">
      <p><a class="button button-raised hide-navbar">Hide Navbar</a></p>
      <p><a class="button button-raised show-navbar">Show Navbar</a></p>
      <p>Quis omnis, quam maiores voluptates vero atque porro? Soluta modi dolore eum dolor iste eos perspiciatis vero porro aliquam officia deleniti, cumque rem, consequatur, ea ipsa temporibus dicta architecto saepe.</p>
      ...
    </div>
  </div>
</div>
```

```js
var app = new Framework7();

var $$ = Dom7;

$$('.hide-navbar').on('click', function () {
  app.navbar.hide('.navbar');
});
$$('.show-navbar').on('click', function () {
  app.navbar.show('.navbar');
});
```

#### Hide On Scroll

```html
<div class="page">
  <div class="navbar">
    <div class="navbar-inner sliding">
      <div class="left">
        <a class="link back">
          <i class="icon icon-back"></i>
          <span class="ios-only">Back</span>
        </a>
      </div>
      <div class="title">Hide On Scroll</div>
    </div>
  </div>
  <!-- Additional "hide-navbar-on-scroll" class to hide navbar on scroll automatically -->
  <div class="page-content hide-navbar-on-scroll">
    <div class="block">
      <p>Quis omnis, quam maiores voluptates vero atque porro? Soluta modi dolore eum dolor iste eos perspiciatis vero porro aliquam officia deleniti, cumque rem, consequatur, ea ipsa temporibus dicta architecto saepe.</p>
      ...
    </div>
  </div>
</div>
```

--------
--------

## Page

Page is one of the main components (containers) used to display app content.

Page 用于展示 app 的内容, 是主要的组件(容器)之一.

### Page Layout

```html
<div class="page" data-name="home">
  <div class="page-content">
    ... scrollable page content goes here ...
  </div>
</div>
```

#### Page Name

As you may note, each page has a `data-name` attribute with a unique page name. It's not required but can be useful within "page events" or "page callbacks". It can help us to define which page is loaded and available so you can make required manipulations to the page.

正如你看的的那样, 每个 page 都有一个唯一的 `data-name` 属性. 虽然它并非必需, 但是在 "page 事件" 和 "page 回调函数" 中非常有用. 它可以帮助我们确定哪个页面已加载并可用，以便对页面进行一些必要的操作。

#### Page Content

All visual content (like list views, forms, etc.) should put inside of `<div class="page-content"> `which should be a child of `<div class="page">`. It's required for correct styling, layout and scrolling.

所有视觉内容都应该放到 `<div class="page-content">` 中, 它作为 `<div class="page">` 的直接子元素. 这样做才能得到正确的样式、布局、和页面滚动.

### Page Events

Now lets look at one of the most important parts of page navigation, "page events". **Page Events** allow us to manipulate just loaded pages by executing JavaScript for those specific pages:

现在来看看页面导航中最重要的部分之一的 "页面事件", 页面事件允许我们通过执行 JavaScript 代码来操纵那些已经加载的指定页面.

|Event|Target|Description|
|----|----|----|
|page:mounted|Page Element `<div class="page">`|当新 page 插入到 DOM 时触发该事件|
|page:init|Page Element `<div class="page">`| 当 Framework7 初始化必要页面的 components 和 navbar 时触发|
|page:reinit|Page Element `<div class="page">`|当导航到已经初始化过的页面时会触发该事件|
|page:beforein|Page Element `<div class="page">`| 当一切都初始化完成过后并且 page 已经准备好切换到 view 中时触发 (into active/current position)|
|page:afterin|Page Element `<div class="page">`| 在 page 被切换到 view 中之后触发|
|page:beforeout|Page Element `<div class="page">`| page 被从 view 切换出来之前触发 |
|page:afterout|Page Element `<div class="page">`| page 被切换到 view 之后触发 |
|page:beforeremove|Page Element `<div class="page">`| page 即将被移除 DOM 之前触发, 如果你需要解绑一些事件和销毁一些插件来释放内存的时候这个事件就特别有用|

Lets see how we can use these events. There are two ways to add page event handlers:

让我们看看如何使用这些事件, 有两种方式可以添加页面事件处理函数:

```js
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized
})

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
})
```

### Page Loading Sequence Classes

When a new page is loading and transitioned into the view (main visible part of the app) it has different classes on page element.

一个新的 page 被加载时和切换到 view(app 的主要可见部分) 中这个过程, page 元素会被赋予不同的 class.

When we load/open new page the following happens:

当 load/open 新页面时, 会发生下面的事情:

1. Currently active page has `page-current` class.

    当前活跃的页面会有一个 class `page-current`

2. If page we load not in DOM (e.g. loaded via Ajax or using template or from component) it will be added to DOM.

    如果我们加载的页面不存在与 DOM 中(如通过 Ajax 或使用 template 或来自 component)那么它就会被添加到 DOM 中去.

3. Page that we load/open will have additional `page-next`class set on its element.

    我们 加载/打开 的 page 会被赋予一个额外的 class `page-next`

4. Router element (`<div class="view">`) will have additional `router-transition-forward`class that does the following:

    Router 元素(`<div class="view">`) 会被赋予一个额外的 class `router-transition-forward`来做以下事情:

    - page with `page-next` (new page) class moves into the view

        带有 class `page-next` 的 page 移动到 view 中.

    - page with `page-current` (current page) class moves out of the view

        带有 class `page-current` 的元素移除 view

5. After transition completed, the new page that we loaded will have `page-current` class

    切换完成过后, 我们加载的这个新 page 会有一个 class `page-current`

6. And the page that was previously active will have `page-previous` class

    之前活跃的那个 page 会被添加 class `page-previous`

When we load/open previous page (go back) the following happens:

当我们 load/open 前一个 page 的时候(返回)会发生下面的事情:

1. Currently active page has `page-current` class.

    当前活跃的 page 被添加 class `page-current`

2. If page we go back to not in DOM (e.g. loaded via Ajax or using template or from component) it will be added to DOM.

    如果返回的页面不在 DOM 中(如: 通过 Ajax 加载或者使用 template 或者来自 component)那么它就会被添加到 DOM 中去

3. Page that we go back to will have additional page-previous class set on its element.

    我们即将到达的那个 page 会被添加额外的 class `page-previous`

4. Router element (<div class="view">) will have additional `router-transition-backward`class that does the following:

    Router 元素 (<div class="view">) 将会添加额外的 class `router-transition-backward` 来做以下事情:

    - page with `page-previous` (page that we go back to) class moves into the view

        带有 class `page-previous` 的 page(即返回的页面) 被移入 view 中

    - page with `page-current` (current page) class moves out of the view

        带有 class `page-current` 的 page 被移除 view

5. After transition completed, the new page that we returned to will have `page-current` class

    切换完成后, 新的页面会有 class `page-current`

6. And the page that was previously active will have `page-next` class. In case this page was added to DOM dynamically, it will be removed from DOM.

    之前活跃的页面有 class `page-next`. 如果此页面是动态添加到 DOM，那么它将从 DOM 中删除。

### Page Data

As you may see it is pretty easy, but how do you determine which page is loaded when we use only one handler? For this case we have Page Data in the event details:

所有的工作都如你看到的一样简单, 但是你如何在一个事件处理函数中知道是哪个页面被加载了呢? 这种情况下我们就需要使用 event detail 中的 page data:

```js
// In page events:
$$(document).on('page:init', function (e) {
  // Page Data contains all required information about loaded and initialized page
  var page = e.detail;
})
```

Or in case the event handler was assigned using Dom7 like in example above then it will be passed in second argument:

如果是像上面那样使用 Dom7 来添加的事件处理函数, 那么它还可以收到第二个参数:

```js
// In page events:
$$(document).on('page:init', function (e, page) {
  console.log(page);
})
```

Now, in the example above we have page data in **page** variable. It is an object with the following properties:

上面的例子中我们通过变量 page 得到 page data, 它是一个具有以下属性的对象:

||||
|---|---|---|
|page.app|object|初始化后的 app 实例|
|page.view|object| 包含当前 page 的 View 实例 (if this View was initialized)|
|page.router|object|包含当前 page 的 Router 实例 (if this View was initialized). 同 page.view.router|
|page.app|string|初始化后的 app 实例|
|page.name|string|page 的 `data-name` 属性的值|
|page.el|HTMLElement| Page 元素|
|page.$el|object|包含 page 元素的Dom7 实例|
|page.navbarEl|HTMLElement| 该 page 相关的 navbar 元素. 仅在开启了 dynamic navbar 的 iOS 主题中有效.|
|page.$navbarEl|object|包含该 page 相关的 navbar 元素的 Dom7 实例, 仅在开启了 dynamic navbar 的 iOS 主题中有效.|
|page.from|string|表示该 page 在切换之前的位置或该 page 来的方向. 如果是加载新 page 那么它就是 `next`, 如果是返回到当前页面那它就是 `previous`, 如果该 page 替换了当前活跃的 page 那么它就是 `current`.|
|page.to|string| 新 page 的位置或者改页面将会去到的位置. 也是 `next`, `previous`, `current`|
|page.position|string|同 page.from|
|page.direction|string|该 page 切换的方向(if applicable). 可以是 `forward` 或 `backward`|
|page.route|object|与该 page 相关联的 Route|
|page.pageFrom|object| 在新 page 来临之前, 当前正处于活跃状态的 page data.|
|page.context|object|当使用 Template7 page 的时候传入该 page 的 Template7 上下文|
|page.fromPage|object|前一个活跃 page 的 page data|

### Access To Page Data

If you don't use page events/callbacks and need to access to page data, it is possible via the `f7Page` property on its HTMLElement:

如果你没有使用页面 事件/回调 并且需要获取 page data, 可以通过它的 HTML元素的 `f7Page` 属性来得到page data:

```js
var $$ = Dom7;

var page = $$('.page[data-name="somepage"]')[0].f7Page;

// do something with page data
```

## Messages

Messages component will help you with visualisation of comments and messaging system in your app.

Messages 组件可以帮助你将 app 中的注释和消息系统可视化.

### Messages Layout

```html
<div class="page">
  <div class="page-content messages-content">
    <div class="messages">
      <!-- Date stamp -->
      <div class="messages-title"><b>Sunday, Feb 9</b> 12:58</div>

      <!-- Sent message (by default - green and on right side) -->
      <div class="message message-sent">
        <div class="message-content">
          <!-- Bubble with text -->
          <div class="message-bubble">
            <div class="message-text">Hi, Kate</div>
          </div>
        </div>
      </div>

      <!-- Another sent message -->
      <div class="message message-sent">
        <div class="message-content">
          <div class="message-bubble">
            <div class="message-text">How are you?</div>
          </div>
        </div>
      </div>

      <!-- Received message (by default - grey on left side) -->
      <div class="message message-with-avatar message-received">
        <!-- Sender name -->
        <div class="message-name">Kate</div>

        <!-- Bubble with text -->
        <div class="message-text">I am fine, thanks</div>

        <!-- Sender avatar -->
        <div style="background-image:url(http://lorempixel.com/output/people-q-c-100-100-9.jpg)" class="message-avatar"></div>
      </div>

      <div class="message message-received">
        <!-- Sender name -->
        <div class="message-avatar" style="background-image:url(http://lorempixel.com/100/100/people/7)"></div>
        <div class="message-content">
          <!-- Sender name -->
          <div class="message-name">Blue Ninja</div>
          <!-- Bubble with text -->
          <div class="message-bubble">
            <div class="message-text">Hi there, I am also fine, thanks! And how are you?</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Messages page layout:

- `messages-content` - required additional class for messages wrapper. Should be added to page-content

    添加到 page-content 上的附加的必要 class, 作为消息的包装

- `messages` - required additional wrapper for messages bubbles. Required element.

    messages 气泡的附加包装, 必须元素.

- `messages-title` - messages title

    消息标题

- `message` - single message

    单个消息

### Single Message Layout

Here is a full single message layout:

下面有一个完成的单个消息的布局:

```html
<div class="message">
  <div class="message-avatar" style="background-image:url(path/to/avatar)"></div>
  <div class="message-content">
    <div class="message-name">John Doe</div>
    <div class="message-header">Message header</div>
    <div class="message-bubble">
      <div class="message-text-header">Text header</div>
      <div class="message-image">
        <img src="path/to/image">
      </div>
      <div class="message-text">Hello world!</div>
      <div class="message-text-footer">Text footer</div>
    </div>
    <div class="message-footer">Message footer</div>
  </div>
</div>
```

- `message-avatar` - sender avatar, optional (发送方的头像, 可选)

- `message-name` - sender name, optional (发送方的名字, 可选)

- `message-header` - single message header, optional (单个消息的消息头, 可选)

- `message-text-header` - text header inside of bubble, optional (气泡里面的文本头, 可选)

- `message-image` - message image, optional (消息图片, 可选)

- `message-text` - message text, optional (消息文本, 可选)

- `message-text-footer` - text footer inside of bubble, optional (气泡里面的消息脚, 可选)

- `message-footer` - footer text after bubble, optional (气泡之外的文本脚, 可选)

Additional classes for single message container:

附加到单个消息容器上的 clsss:

- `message-sent` - additional class for single message which indicates that this message was sent by user. It stays on right side with green background color.

    用于表明来自用户的单个消息的附加 class, 它停在消息框右侧, 并且具有绿色的背景.

- `message-received` - additional class for single message which indicates that this message was received by user. It stays on left side with grey background color.

    用于表明用户接收消息的附加 class, 它停留在消息框左侧, 并且有灰色背景.

- `message-tail` - additional class for single message (received or sent) to add bubble "tail"

    单个消息(接收或发送)的气泡尾巴

- `message-same-name` - additional class for indicating that message has same sender name as previous message

    用于表明该消息与前一条消息的发送者同名的附加 class

- `message-same-avatar` - additional class for indicating that message has same avatar as previous message

    用于表明该消息与前一条消息的发送者具有相同头像的附加 class

- `message-same-header` - additional class for indicating that message has same message-header as previous message

    用于表明当前消息与前一条消息具有相同的消息头的附加 class

- `message-same-footer` - additional class for indicating that message has same message-footer as previous message

    用于表明该消息与前一条消息具有相同消息脚的附加 class

- `message-last` - additional class for single message (received or sent) to indicate last received or last sent message in current conversation by one sender

    用于表明该消息是当前的交谈中最后收到(或发送)消息的附加 class

- `message-first` - additional class for single message (received or sent) to indicate first received or first sent message in current conversation by one sender

    用于表明该消息是当前的交谈中第一条收到(或发送)消息的附加 class


### Messages App Methods

Let's look on list of all available parameters:


|Parameter|Type|Default|Description|
|----|----|----|----|
|`autoLayout`|`boolean`|`true`|根据传递的条件启用自动布局以自动添加所有必需的附加 class |
|`newMessagesFirst`|`boolean`|`false`|该选项使得新消息出现在上面(默认是下面)|
|`scrollMessages`|`boolean`|`true`|添加新消息的时候消息是否自动滚动|
|`scrollMessagesOnEdge`|`boolean`|`true`|如果开启该选项, 仅当用户在消息视图的顶部/底部的时候消息才会自动滚动|
|`messages`|`array`||消息的初始化数组, 数组中的每个元素代表一个包含单个消息参数的消息对象|
|`on`|`object`||包含事件处理函数的对象. 如:<br> var messages = app.messages.create({<br>&emsp;el: '.messages',<br>&emsp;on: {<br> &emsp;&emsp;change: function () {<br> &emsp;&emsp;&emsp;console.log('Textarea value changed')<br> &emsp;&emsp;}<br> &emsp;}<br> })<br>
|`renderMessage`|`function(message)`||渲染单个消息的函数, 必须返回整个消息的 HTML 字符串|

#### Autolayout Conditions

|Parameter|Type|Default|Description|
|----|----|----|----|
|`firstMessageRule`|`function(message, previousMessage, nextMessage)`||该函数基于当前消息、前一条、后一条消息来判断该消息是否是第一条消息, 返回 true 或 false, 如果匹配则会给该消息添加 class `message-first`|
|`lastMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 用于判断消息是否是最后一条消息, 会添加 class `message-last`|
|`tailMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 用于判断消息是否需要尾巴, 会添加 class `message-tail`|
|`sameNameMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 会添加 class `message-same-name`|
|`sameHeaderMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 会添加 class `message-same-header`|
|`sameFooterMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 会添加 class `message-same-footer`|
|`sameAvatarMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 会添加 class `message-same-avatar`|
|`customClassMessageRule`|`function(message, previousMessage, nextMessage)`||同`firstMessageRule`, 用于添加自定义 class|

### Single Message Parameters

Let's look on single message parameters object that we should use when we pass `messages` array:

现在来看看传入消息数组的单个消息对象所需要的参数:

| Parameter|Type|Default|Description|
|--|--|--|--|
|`text`|`string`||消息文本|
|`header`|`string`||单个消息头|
|`footer`|`string`||单个消息脚|
|`name`|`string`||发送人的名字|
|`avatar`|`string`||发送人的头像 url|
|`type`|`string`|`sent`|消息类型 - `sent` 或 `received`|
|`textHeader`|`string`||消息文本头|
|`textFooter`|`string`||消息文本脚|
|`image`|`string`||消息图片的 HTML , e.g. `<img src="path/to/image">`. 可以用来代替 `imageSrc` 参数|
|`imageSrc`|`string`||同 `image`, 可以用来代替 `image`|
|`isTitle`|`boolean`||定义应该呈现为消息还是所有消息的标题|

### Messages Methods & Properties

So to create Messages we have to call:

调用下面的方法来创建 Messages:

```js
var messages = app.messages.create({ /* parameters */ })
```

After we initialize Messages we have its initialized instance in variable (like `messages` variable in example above) with helpful methods and properties:

|Properties||
|--|--|
|`messages.params`|包含传入的初始化参数对象|
|`messages.el`| Messages 容器的 HTML 元素 (`<div class="messages">`)|
|`messages.$el`|Messages 容器的 Dom7 元素|
|`messages.messages`|消息数组|

|Methods||
|--|--|
|messages.showTyping(`message`)|显示消息光标 <br> `message` - `object` - 要添加的消息的参数|
|messages.hideTyping()|隐藏光标|
|messages.addMessage(message, method, animate)|根据方法的参数来将新消息添加到顶部或底部<br>&emsp;`message` - `object` - 要添加的消息的参数, `必须`<br>&emsp;`method` - `string` - (`append` or `prepend`) 决定在消息容器的末端或开始处添加新消息. `可选`, 如果没有指定, 则基于 `newMessagesFirst` 参数<br>&emsp;`animate` - `boolean` - (默认为 `true`) 如果为 false, 则消息会立即添加, 不会有切换和滚动的动画, `可选`. <br>&emsp;方法返回消息实例|
|messages.addMessages(`messages`, `method`, `animate`)|一次添加多个消息<br>&emsp;`messages` - `array` 包含需要添加的消息的数组. 每个消息都应该是一个包含消息参数的对象, `必须`.<br>&emsp;方法返回消息实例|
|messages.removeMessage(`message`)|移除消息<br>&emsp;`message` - `HTMLElement` 或 `string` (CSS 选择器) 或 数字 (指代消息数组的下标), 指代被移除的消息<br>&emsp;方法返回消息实例|
|messages.removeMessages(`messages`)|移除多个消息<br>&emsp;`messages` - `array` 包含待移除消息的数组<br>&emsp;方法返回消息实例|
|messages.scroll(`duration`, `position`)|根据 参数`newMessagesFirst` 指定的值, 将消息滚动到顶部/底部<br>&emsp;`duration` - `number` 滚动执行的毫秒数<br>&emsp; `position` - `number` 滚动的位置, 以像素(px)为单位|
|`messages.renderMessages()`|根据消息数组渲染消息|
|`messages.layout()`|强制消息自动布局|
|`messages.clear()`|清除所有的消息|
|`messages.destroy()`|销毁 messages 实例|

### Messages Events

Messages will fire the following DOM events on messages element and events on app and messages instance:

Messages 会在 messages 元素、app 和 messages 实例上触发以下 DOM 事件:

#### DOM Events

|Event|Target|Description|
|--|--|--|
|`messages:beforedestroy`|Messages Element `<div class="messages">`|事件将在 Messages 实例被销毁之前触发|

#### App and Messages Instance Events

Messages instance emits events on both self instance and app instance. App instance events has same names prefixed with messages.

Messages 实例在自己和 app实例 上触发以下事件。app 实例事件具有以 `message` 为前缀的相同事件名称.

|Event|Target|Arguments|Description|
|--|--|--|--|
|`beforeDestroy`|messages|(`messages`)|事件将在 Messages 实例被销毁之前触发|
|`messagesBeforeDestroy`|app|(`messages`)|事件将在 Messages 实例被销毁之前触发|

### Messages Auto Initialization

If you don't need to use Messages API and your Messages is inside of the page and presented in DOM on moment of page initialization then it can be auto initialized with just adding additional `messages-init` class to messages element, and all required parameters can be passed using `data-` attributes:

当 page 初始化的时候, 消息已经在 DOM 中, 并且你不希望使用 Messages API, 那么给 messages 元素添加 class `message-init`, 所有需要的参数可以通过 `data-` 属性来添加:

```html
<div class="messages messages-init" data-new-messages-first="true">
  ...
</div>
```

**Parameters that used in camelCase, for example newMessagesFirst, in data- attributes should be used in kebab-case as data-new-messages-first**

参数使用驼峰命名, 如 newMessagesFirst, 在 `data-` 属性中应该使用中划线命名法.

### [Examples](http://framework7.io/docs/messages.html#examples)

参考 [http://framework7.io/docs/messages.html#examples](http://framework7.io/docs/messages.html#examples)