
# [$ vs $()](http://learn.jquery.com/using-jquery-core/dollar-object-vs-function/)

我们之前一直在向下面这样使用 jQuery 对象上的方法:

```js
$( "h1" ).remove();
```

大多数 jQuery 方法像上面那样进行调用, 这些方法作为 `$.fn` 名字空间的一部分, 或者说是 jQuery 原型. 这是作为 jQuery 对象方法的最佳思想.

然而, 还有一部分方法并不用于某个元素.这些方法作为 jQuery 名字空间的一部分, 这是 jQuery 核心方法的最佳思想.

这种区别对于新的jQuery用户来说是非常令人困惑的。以下是你需要记住的：

- 在 jQuery 选取元素上调用的方法在 `$.fn` 名字空间, 自动检索和返回选中的元素作为 `this`
- 在 `$` 名字空间上调用的方法通常是通用方法. 它不需要选中元素.它们不会自动传递任何参数，它们的返回值也会有所不同。

在一些情况下，对象方法和核心方法具有相同的名称，如 `$.each()` 和 `.each()`. 在这种情况下，当你在阅读正确的方法的文档时，要格外小心。

# [$( document ).ready()](http://learn.jquery.com/using-jquery-core/document-ready/)

页面在 document ready 之前进行操作并不安全. jQuery 可以为你检测是否处于就绪状态. 包含在 `$(document).ready()` 的代码在页面 Document Object Model (DOM) 已经准备好可以让 JavaScript 代码执行的时候运行. 包含在 `$( window ).on( "load", function() { ... })` 会在整个页面(图片和 iframes)而不仅仅是 DOM 变为 ready的时候执行.

```js
// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
});
```

有经验的开发者可能会使用 `$()` 代替 `$( document ).ready()`

```js
// Shorthand for $( document ).ready()
$(function() {
    console.log( "ready!" );
});
```

下面的代码展示了 `$( document ).ready()` 和 `$( window ).on( "load" )` 的不同. 它将一个网页加载到 `<iframe>` 并且检测这两个事件:

```html
<html>
<head>
    <script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
    <script>
    $( document ).ready(function() {
        console.log( "document loaded" );
    });

    $( window ).on( "load", function() {
        console.log( "window loaded" );
    });
    </script>
</head>
<body>
    <iframe src="http://techcrunch.com"></iframe>
</body>
</html>
```

# [Avoiding Conflicts with Other Libraries ](http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/)

jQuery 和所有的插件都包含在 `jQuery` 名字空间中. 通常, 全局对象也放在这里, 所以你应该保证 jQuery 和其他库之间不发生冲突(如prototype.js, MooTools, 或者 YUI).

默认情况下, jQuery 使用 `$` 作为简写, 因此可能和其它也使用 `$` 的库发生冲突, 为了避免这样的冲突发生, 你需要在 jQuery 加载到页面之后和在使用 jQuery 之前立即将 jQuery 设置为 no-conflict 模式.

## Putting jQuery Into No-Conflict Mode

当你将 jQuery 设置为 no-conflict 模式的时候, 你可以将它赋值给另一个变量来替代 `$`

```html
<!-- Putting jQuery into no-conflict mode. -->
<script src="prototype.js"></script>
<script src="jquery.js"></script>
<script>

var $j = jQuery.noConflict();
// $j is now an alias to the jQuery function; creating the new alias is optional.

$j(document).ready(function() {
    $j( "div" ).hide();
});

// The $ variable now has the prototype meaning, which is a shortcut for
// document.getElementById(). mainDiv below is a DOM element, not a jQuery object.
window.onload = function() {
    var mainDiv = $( "main" );
}

</script>
```

上面的代码会将 `$` 回退到它之前的意思. 你任然可以使用 `jQuery` 作为 `$j` 的引用.

最后, 如果你确实想用 `$` 作为 jQuery 的引用, 并且不关心需要使用其他库的 `$` 方法, 你可以使用 `$` 作为参数传入函数中, 在 `jQuery( document ).ready()` 中你可以给传入 ready 的方法添加一个 `$` 参数.

```html
<!-- Another way to put jQuery into no-conflict mode. -->
<script src="prototype.js"></script>
<script src="jquery.js"></script>
<script>

jQuery.noConflict();

jQuery( document ).ready(function( $ ) { // 作为参数传入
    // You can use the locally-scoped $ in here as an alias to jQuery.
    $( "div" ).hide();
});

// The $ variable in the global scope has the prototype.js meaning.
window.onload = function(){
    var mainDiv = $( "main" );
}

</script>
```

这可能是大多数代码的理想解决方案，你需要更改的代码更少来实现兼容。
