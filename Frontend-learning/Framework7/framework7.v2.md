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