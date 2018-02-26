
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

## [Including jQuery Before Other Libraries](http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/#including-jquery-before-other-libraries)

上面的代码片段基于 jQuery 在 prototype.js 加载完成之后加载. 如果 jQuery 在其它库之前, `$` 可能就是其它库定义的变量了, 但是还可以使用 `jQuery`. 并不以一定需要使用 `jQuery.noConflict()` 来放弃`$`别名:

```html
<!-- Loading jQuery before other libraries. -->
<script src="jquery.js"></script>
<script src="prototype.js"></script>
<script>

// Use full jQuery function name to reference jQuery.
jQuery( document ).ready(function() {
    jQuery( "div" ).hide();
});

// Use the $ variable as defined in prototype.js
window.onload = function() {
    var mainDiv = $( "main" );
};

</script>
```

## Summary of Ways to Reference the jQuery Function

### Create a New Alias(创建一个新的别名)

`jQuery.noConflict()` 返回 jQuery 的引用.

```html
<script src="prototype.js"></script>
<script src="jquery.js"></script>
<script>

// Give $ back to prototype.js; create new alias to jQuery.
var $jq = jQuery.noConflict();

</script>
```

### Use an Immediately Invoked Function Expression(使用立即执行函数表达式)

```html
<!-- Using the $ inside an immediately-invoked function expression. -->
<script src="prototype.js"></script>
<script src="jquery.js"></script>
<script>

jQuery.noConflict();

(function( $ ) {
    // Your jQuery code here, using the $
})( jQuery );

</script>
```

### Use the Argument That's Passed to the jQuery( document ).ready() Function(使用传递给`jQuery( document ).ready()` 方法的参数)

```html
<script src="jquery.js"></script>
<script src="prototype.js"></script>
<script>

jQuery(document).ready(function( $ ) {
    // Your jQuery code here, using $ to refer to jQuery.
});

</script>
```

或者

```html
<script src="jquery.js"></script>
<script src="prototype.js"></script>
<script>

jQuery(function($){
    // Your jQuery code here, using the $
});

</script>
```

# [Attributes](http://learn.jquery.com/using-jquery-core/attributes/)

元素的属性可能包含有用的信息, 可以使用 `.attr()` 来取得和设置它们的值:

设置:

```js
$( "a" ).attr( "href", "allMyHrefsAreTheSameNow.html" );

$( "a" ).attr({
    title: "all titles are the same too!",
    href: "somethingNew.html"
});
```

取值:

```js
$( "a" ).attr( "href" ); // Returns the href for the first a element in the document
```

# [Selecting Elements](http://learn.jquery.com/using-jquery-core/selecting-elements/)

jQuery 最基础的就是对选中元素进行操作. jQuery 支持 CSS3 选择器, 同时还支持一些非标准选择器. 可以访问 [Selectors documentation on api.jquery.com](http://api.jquery.com/category/selectors/) 查看完整的选择器参考.

## Selecting Elements by ID

```js
$( "#myId" ); // Note IDs must be unique per page.
```

## Selecting Elements by Class Name

```js
$( ".myClass" );
```

## Selecting Elements by Attribute

```js
$( "input[name='first_name']" );
```

## Selecting Elements by Compound CSS Selector

```js
$( "#contents ul.people li" );
```

## Selecting Elements with a Comma-separated List of Selectors

```js
$( "div.myClass, ul.people" );
```

## Pseudo-Selectors(伪选择器)

```js
$( "a.external:first" );
$( "tr:odd" );

// Select all input-like elements in a form (more on this below).
$( "#myForm :input" );
$( "div:visible" );

// All except the first three divs.
$( "div:gt(2)" );

// All currently animated divs.
$( "div:animated" );
```

**注意**: 当使用`:visible` 和 `:hidden` 伪选择器的时候, jQuery 会检查元素实际上是否可见, 而不是仅仅根据它的 CSS `visibility` 或者 `display` 属性来判断. jQuery查看页面上元素的物理高度和宽度是否大于零。

然而, 该检测对 `<tr>` 元素不起作用, 这种情况下 jQuery 检测 CSS 的 `display` 属性, 当 `display` 设置为 `none` 的时候会被当做 hidden.

没有加入 DOM 的元素总是被当做 hidden, 即使它们的 CSS 效果是可见的.

**个人提醒**:

**特别提醒**:在 jQuery 3.0 之后判断元素是否可见的依据是 DOM 的 `getClientRects()` 方法是否会返回一个 layout box, 即使该 box 宽高为 0, 也就是说如 `<br />` 或者空 `<span>`元素这种没有宽高的也会被当做可见元素, 参考 [Breaking change: Behavior of :hidden and :visible ](https://jquery.com/upgrade-guide/3.0/#breaking-change-behavior-of-hidden-and-visible)

## Choosing Selectors

写一个优秀的选择器可以提高 JavaScript 的性能. 指定太多的条件是一件非常糟糕的事情. 如 `#myTable th.special` 就要比 `#myTable thead tr th.special` 好得多.

### Does My Selection Contain Any Elements?

当你已经使用选择器选择元素过后, 你可能希望知道它是否有用, 但是下面却是一个常见的错误:

```js
// Doesn't work!
if ( $( "div.foo" ) ) {
    ...
}
```

当使用 `$()` 选择元素过后, 总是会返回一个对象, 对象总是被当做 `true`. 即使是该选项没有包含任何元素, `if` 语句也会执行条件为 true 的部分.

检查选择器是否选中元素最好的办法是检测它的 `.length` 属性, 它可以告诉你有多少元素被选中了. 如果是 0, 它就相当于 false:

```js
// Testing whether a selection contains elements.
if ( $( "div.foo" ).length ) {
    ...
}
```

### Saving Selections

jQuery 不会为你缓存元素, 如果你后续还会使用这个选择器选中元素, 你可以将这个元素保存起来:

```js
var divs = $( "div" );
```

一旦保存起来, 就可以在变量上调用jQuery方法，就像在原始选择器中调用它们一样。

选择器只会选中它执行时页面中已经存在的元素. 如果元素之后添加的页面, 你必须重新选择它们, 保存选中结果的变量不会随着 DOM 的改变而自动更新.

### Refining & Filtering Selections(提取和过滤选项)

有时候选择器返回的元素多于我们需要的元素, jQuery 提供了一系列方法来提取和过滤它们:

```js
// Refining selections.
$( "div.foo" ).has( "p" );         // div.foo elements that contain <p> tags
$( "h1" ).not( ".bar" );           // h1 elements that don't have a class of bar
$( "ul li" ).filter( ".current" ); // unordered list items with class of current
$( "ul li" ).first();              // just the first unordered list item
$( "ul li" ).eq( 5 );              // the sixth
```

### Selecting Form Elements

jQuery 提供了一系列伪选择器来帮助找到表单元素. 这些特别有用，因为使用标准的CSS选择器很难根据它们的状态或类型区分表单元素。

#### :checked

`:checked` 能够选择出选中的(checked)复选框, 但是记住它也可以用于单选按钮 和`<select>` 元素(`<select>` 中的元素使用 `:selected`选择器)

```js
$( "form :checked" );
```

当使用 复选框,单选按钮和 select 的时候 `:checked` 伪选择器有用.

#### :disabled

选中任何有 `disabled` 属性的 `<input>` 元素.

```js
$( "form :disabled" );
```

为了使用 `:disabled` 的时候得到最好的性能, 先使用常规的 jQuery 选择器选中元素,然后使用 `.filter(":disabled")` 或者在伪选择器前面加上标签名或者其他选择器.

#### :enabled

与`:disabled` 相反, 选中没有 `disabled` 属性的元素.

```js
$( "form :enabled" );
```

同 `:disabled` 一样, 为了得到更好的性能, 先使用常规的 jQuery 选择器选中元素,然后使用 `.filter(":enabled")` 或者在伪选择器前面加上标签名或者其他选择器.

#### input

选择所有 `<input>` `<textarea>` `<select>` 和 `<button>` 元素.

```js
$( "form :input" );
```

#### selected

选中 `<option>` 元素中被选中的元素.

```js
$( "form :selected" );
```

同 `:disabled` , 使用 `filter(":selected")` 或者在前面添加具体的标签名或者其他原则器有助于提升选中元素的性能.

#### Selecting by type

- [:password](http://api.jquery.com/password-selector/)
- [:reset](http://api.jquery.com/reset-selector/)
- [:radio](http://api.jquery.com/radio-selector/)
- [:text](http://api.jquery.com/text-selector/)
- [:submit](http://api.jquery.com/submit-selector/)
- [:checkbox](http://api.jquery.com/checkbox-selector/)
- [:button](http://api.jquery.com/button-selector/)
- [:image](http://api.jquery.com/image-selector/)
- [:file](http://api.jquery.com/file-selector/)

所有以上类型都会有关于性能的标注, 更深入的信息请查看 [API 文档](http://api.jquery.com/category/selectors/form-selectors/)