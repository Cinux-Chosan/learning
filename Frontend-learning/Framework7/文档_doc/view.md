# [Views](http://framework7.io/docs/views.html)

**view** (<div class="view">) ：app中独立的可视区域，拥有自己的配置、导航、历史纪录。每个 veiw 也可以有不同风格的 navbar 和　toolbar 布局。所以它在某种意义上被称为 app 中的 app。这种功能允许你轻松的操作 app 的每一个部分。

**views** (<div class="views">) ：所有可视 view 的容器，大多数时间是保持可见的（不再 moddal、panel 中的时候）。可以说 views 是 app 中 body 部分的主要包装。 views 只允许有一个。

views 的 HTML 结构：

``` HTML
<body>
  ...
  <div class="panel panel-left panel-cover">
    <div class="view panel-view"> ... </div>
  </div>
  <!-- Views -->
  <div class="views">
    <!-- Your main view -->
    <div class="view view-main">
      <!-- Navbar-->
      <!-- Pages -->
      <!-- Toolbar-->
    </div>
    <!-- Another view -->
    <div class="view another-view">
      <!-- Navbar-->
      <!-- Pages -->
      <!-- Toolbar-->
    </div>          
  </div>
  <div class="popup">
    <div class="view popup-view"> ... </div>
  </div>
  ...
</body>
```

view 可以在 app 的任何部分，但是有一个重要的原则 —— 所有可见的 view 都需要在 views(<div class="views">)里面。

## Main View

main view 需要有一个额外的 view-main 类。默认情况下通过所有不在已初始化 view 中的链接加载的页面会放在 main view 中。另外如果使用了 pushState hash navigation，它也只在 main view 的 navigation 上起作用。

## 初始化 view

如果在 HTML 中已经有了 view 的布局，并且 app 已经初始化完成，现在我们需要初始化 HTML 中的 view。

**注意** ：并不是所有的 view 都需要初始化，仅初始化那些需要导航的 view 。其他的 view (如 popup 中的 view) 可以保持未初始化状态，我们仅仅使用它们来正确的布局导航、页面、工具栏。

之前初始化的实例变量 myApp 有许多可以操作 app 的方法，其中有一个叫 addView 的方法用于初始化 view :

myApp.addView(selector, parameters) - initialize View.
 - container - string or HTMLElement. If string - CSS selector of View element
 - parameters - object. Object with View parameters
This method returns object with just created View instance.

## [View 的初始化参数](http://framework7.io/docs/views.html#view-initialization-parameters)

现在我们已经知道了所有初始化 view 的参数，我们可以初始化上面提到的 HTML ：

``` js
var myApp = new Framework7({
  // ...
});   

/* Initialize views */
var mainView = myApp.addView('.view-main', {
  dynamicNavbar: true
})
var anotherView = myApp.addView('.another-view');
```

在此示例中，我们没有初始化在 panel 和 popup 中的 view，因为我们不使用它们来导航，仅作为可视样式和正确布局。但是如果你需要这些 view 中的导航，你仍可以初始化它们。

## [View Methods & Properties](http://framework7.io/docs/views.html#view-methods-properties)

如上所示，我们初始化 view 并将它们初始化过后的实例存入 `mainView` 和 `anotherView` 变量中。 View 的实例是一个有很多操作 View 的方法和变量的对象。

[view 的属性和方法列表](http://framework7.io/docs/views.html#view-methods-properties)

## [View Events](http://framework7.io/docs/views.html#view-events)

view 的事件列表，只在 IOS theme 可用。

- swipeback:move
- swipeback:beforechange
- swipeback:afterchange
- swipeback:beforereset
- swipeback:afterreset

## [Default View URL](http://framework7.io/docs/views.html#default-view-url)

如果你认为由于某些原因 Framework7 检测到错误的默认 View URL (用于历史导航) 或者如果你希望定义一个默认的 View URL，你可以在 View 上使用 `data-url` 属性或者在初始化的时候使用 `url` 参数来指定：

``` html
<div class="view" data-url="index2.html">
```

## 获得当前 View

在某些场合我们需要获得当前的 View，因为并非一直都是 main view，某些 view 在打开的 popup、popover、打开的 panel、tab 等中。该方法可以获得当前 active/visible/most-top 的 view 的实例。

例如，如果在 panel 中有一个初始化过后的 view，并且 panel 处于打开状态，则该方法会得到 panel 里面的 view。又或者你使用了 tab bar，每个 tab 都是一个 view，则该方法会返回当前 active/visible tab-view。

myApp.getCurrentView(index) - get currently active/visible View instance

 - index - number - If there are few currently active views (as in Split View layout), then you need to specify index number of View. Optional
 - Method returns initialized View instance or array with View instances if there are few currently active views

## 访问 view 的实例

如果初始化了试图，但是没有赋值给某个变量保存，但是在初始化的时候给定了 name 属性，则仍然可以使用 app 实例进行访问： `myApp.views.[name]` 或者 `myApp.[name]View`：

``` javascript
myApp = new Framework7();
// Main view
myApp.addView('.view-main', {
    main: true,
    //...
});
// Another view
myApp.addView('.view-left', {
    name: 'left',
    //...
});
// One more view
myApp.addView('.view-right', {
    name: 'right',
    //...
});
// Access left view
myApp.views.left /* or */ myApp.leftView

// Access right view
myApp.views.right /* or */ myApp.rightView

// Access main view
myApp.views.main /* or */ myApp.mainView
```

**注意**： name 参数不会对 main view 起作用，但是仍然可以通过 `myApp.views.main` 或者 `myApp.mainView` 进行访问。

## 从 DOM 访问 view 的实例

在视图初始化之后， Framework7 会给 `<div class="view">` 添加特定的属性链接以便我们可以在 javascript 中随时访问试图实例：

``` javascript
var viewsElement = $$('.view-main')[0];
var viewInstance = viewsElement.f7View;    // f7View
```

另外，如果需要获得 main view，可以通过如下方式：

``` javascript
for (var i = 0; i < myApp.views.length; i ++) {
  var view = myApp.views[i];
  if (view.main) myApp.alert('I found main View!')
}
```
