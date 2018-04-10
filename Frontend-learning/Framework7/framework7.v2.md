### navbar 类型

#### Static Navbar

在 page-content 里面, 会随着页面滚动.

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

在 page 下面, 不会随着页面滚动. 它**必须**是 page 的直接子元素, 如果 page 没有 fixed toolebar 那么它必须在 toolbar 之前.

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

如果所有的 views 都使用一个 common navbar/navbar, 它就必须是 views 的直接子元素, 并且在所有的 view 之前.

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

Dynamic Navbar 仅在 IOS 主题中支持.

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