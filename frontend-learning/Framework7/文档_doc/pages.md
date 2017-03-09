# [Pages](http://framework7.io/docs/pages.html)

结构：

``` html
<body>
  ...
  <!-- Views -->
  <div class="views">
    <!-- Your main view -->
    <div class="view view-main">
      <!-- Pages -->
      <div class="pages">
        <div class="page" data-page="home">
          <div class="page-content">
            ... page content goes here ...
          </div>
        </div>
      </div>
    </div>
    <!-- Another view -->
    <div class="view another-view">
      <!-- Pages -->
      <div class="pages">
        <div class="page" data-page="home-another">
          <div class="page-content">
            ... page content goes here ...
          </div>
        </div>
      </div>
    </div>
  </div>
  ...
</body>
```

`<div class="pages">` 是单个 view 中所有页面的容器。所有的页面之间转换都在此发生。

在主要的 layout (index.html) 中，每个 page 应该在 pages `<div class="pages">` 里， pages 又应该是 view `<div class="view">` 的 child。

## data-page

每个页面都有唯一的 `data-page` 属性，虽然不是必须但是建议使用该属性。

该属性在处理 页面事件（page events） 或者 页面回调（page callbacks） 的时候非常有用，并且 framework7 会使用它来加载页面和执行必要的操作。

## Page Content

所有可见的内容（如 list views, forms, etc.）都应该放在 `<div class="page-content">` 中，而它又是 `<div class="page">` 的子元素，这些是为了页面的正常布局和滚动。

## Page Events

页面事件允许我们使用 javascript 来操作加载的页面。

[事件列表](http://framework7.io/docs/pages.html#page-events)

- page:beforeinit
- page:init
- page:reinit
- page:beforeanimation
- page:afteranimation
- page:beforeremove
- page:back
- page:afterback

可以通过以下两种方式为页面添加事件处理函数：

``` javascript
// 推荐
// Option 1. Using one 'page:init' handler for all pages (recommended way):
$$(document).on('page:init', function (e) {
  // Do something here when page loaded and initialized

})

// 不推荐
// Option 2. Using live 'page:init' event handlers for each page (not recommended)
$$(document).on('page:init', '.page[data-page="about"]', function (e) {
  // Do something here when page with data-page="about" attribute loaded and initialized
})
```

## Page Data

``` javascript
// In page callbacks:
myApp.onPageInit('about', function (page) {
  // "page" variable contains all required information about loaded and initialized page
})

// In page events:
$$(document).on('page:init', function (e) {
  // Page Data contains all required information about loaded and initialized page
  var page = e.detail.page;
})
```

在上例中，我们已经将 page data 放入 page 变量中，该变量是具有如下属性的对象：

- page.name
- page.url
- page.query
- page.view
- page.container
- page.from
- page.navbarInnerContainer
- page.swipeBack
- page.context
- page.fromPage

有了这些数据，我们就可以在同一个事件处理函数里面对不同的页面进行处理了：

``` javascript
$$(document).on('page:init', function (e) {
    var page = e.detail.page;
    // Code for About page
    if (page.name === 'about') {
        // We need to get count GET parameter from URL (about.html?count=10)
        var count = page.query.count;
        // Now we can generate some dummy list
        var listHTML = '<ul>';
        for (var i = 0; i < count; i++) {
            listHTML += '<li>' + i + '</li>';
        }
        listHTML += '</ul>';
        // And insert generated list to page content
        $$(page.container).find('.page-content').append(listHTML);
    }
    // Code for Services page
    if (page.name === 'services') {
        myApp.alert('Here comes our services!');
    }
});
```
