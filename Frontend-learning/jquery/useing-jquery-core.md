
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

# [Working with Selections](http://learn.jquery.com/using-jquery-core/working-with-selections/)

## Getters & Setters

一些 jQuery 方法可以用来读取或设置选中元素的值. 如果带参数, 那么它就将参数的值设置到该元素上, 此时当做 setter 使用. 如果不带参数, 就从元素中读取值, 此时当做 getter 使用. setter 对所有的选中的元素起作用, 而 getter 只返回所有选中的元素中第一个的值. 只有一个例外, `.text()` 返回所有元素的值.

```js
// The .html() method sets all the h1 elements' html to be "hello world":
$( "h1" ).html( "hello world" );
```

```js
// The .html() method returns the html of the first h1 element:
$( "h1" ).html();
// > "hello world"
```

setter 返回 jQuery 对象用于链式调用, getter 返回你期望得到的值. 所以 getter 上不能进行链式调用.

```js
// Attempting to call a jQuery method after calling a getter.
// This will NOT work:
$( "h1" ).html().addClass( "test" );
```

## Chaining

如果你调用的方法返回 jQuery 对象, 你可以连续调用, 这就是链式调用 "chaining"

```js
$( "#content" ).find( "h3" ).eq( 2 ).html( "new text for the third h3!" );
```

多行可以提升可读性:

```js
$( "#content" )
    .find( "h3" )
    .eq( 2 )
    .html( "new text for the third h3!" );
```

如果在链式中间修改了选择元素, jQuery 也提供 `.end()` 方法来回到最初的所选择的元素上:

```js
$( "#content" )
    .find( "h3" )
    .eq( 2 )
        .html( "new text for the third h3!" )
        .end() // Restores the selection to all h3s in #content
    .eq( 0 )
        .html( "new text for the first h3!" );
```

链式调用非常有用, 这个特性自从在 jQuery 中流行起来过后, 已经在很多其它库中也得到了支持. 但是需要注意的是, 太长的链式调用会非常难以修改和调试, 也没有硬性规定需要写多长.

# [Manipulating Elements ](http://learn.jquery.com/using-jquery-core/manipulating-elements/)

完整的 jQuery 操纵方法文档参考 [jQuery 操作 DOM API 文档](http://api.jquery.com/category/manipulation/)

## Getting and Setting Information About Elements

有很多方法可以修改已经存在的元素. 最常见的就是改变元素中的 HTML 或者元素的属性. jQuery 为这些功能提供了简单易用,跨浏览器的支持. 你也可以使用这些方法获取这些属性. 这些方法你可以用来读取和设置元素:

- `.HTML()`: 读取或设置 HTML 内容
- `.text()`: 读取或设置文本内容, HTML 会被当作文本处理
- `.attr()`: 读取或设置属性值
- `.width()`: 以整数读取或设置元素的像素宽度
- `.height()`: 以整数读取或设置元素的像素高度
- `.position()`: 以一个对象的方式返回一个元素相对于它第一个定位祖先(position 不为 static)的定位信息, 只能读取不能用于设置值
- `.val()`: 读取或设置表单元素的值

再次提醒, 作为 setter 使用时是针对所有选中的元素. 如果只想对其中某个元素进行操作, 请确保在操作前提取或过滤出该元素.

```js
// Changing the HTML of an element.
$( "#myDiv p:first" ).html( "New <strong>first</strong> paragraph!" );
```

## Moving, Copying, and Removing Elements

虽然在DOM上移动元素的方法多种多样，但通常有两种方法：

- 相对于其他元素放置选中元素, insertAfter
- 相对于选中元素放置其他元素, after

例如, jQuery 提供 `.insertAfter` 和 `.after`. `.insertAfter` 方法将选中元素放置在参数所指定的元素后面, `.after()` 方法将参数所指定的元素放到选中元素后面. 其他几种方法遵循这种模式：`.insertBefore()` 和 `.before()`, `.appendTo()` 和 `.append()`, `.prependTo()` 和 `.prepend()`.

使用何种方法取决于你选择了什么元素, 以及是否需要存储添加到页面中的这些元素的引用. 如果你需要存储引用, 你总是希望使用第一种方式 - 即将选中的元素相对于其它元素进行放置 - 因为它会返回你放置的元素. 这种情况下应该使用的是 `.insertAfter()`, `.insertBefore()`, `.appendTo()`, 和 `.prependTo()`.

```js
// Moving elements using different approaches.

// Make the first list item the last list item:
var li = $( "#myList li:first" ).appendTo( "#myList" );

// Another approach to the same problem:
$( "#myList" ).append( $( "#myList li:first" ) );

// Note that there's no way to access the list item
// that we moved, as this returns the list itself.
```

## Cloning Elements

`.appendTo` 这些方法会移动元素, 有时候我们需要使用元素的副本, 此时首先需要使用 `.clone()`:

```js
// Making a copy of an element.

// Copy the first list item to the end of the list:
$( "#myList li:first" ).clone().appendTo( "#myList" );
```

如果希望复制相关的数据和事件, 需要给 `.clone()` 传递 `true` 作为参数.

## Removing Elements

有两种方式移除页面中的元素: `.remove()` 和 `.detach()`. 当你想要永久移除元素的时候使用 `.remove()`. `.remove` 会返回移除的元素, 如果再将元素放回到页面中时, 它不会再有与之关联的事件和数据.

如果你需要数据和事件, 使用 `.detach()`, 它也会返回选中的元素, 同时它会保持元素的数据和事件, 所以你可以在之后把它们放回到页面中.

如果对元素有大量操作的时候, 使用`.detach()` 方法会比较好. 这种情况下, 它可以从页面中移除元素, 然后在代码中修改, 再重新载入到页面中去. 它减少了昂贵的 "DOM touches" 同时保持了元素的数据和事件.

如果你是希望页面中保持元素, 只是移除它的内容, 可以使用 `.empty()` 移除元素内部的 HTML.

## Creating New Elements

jQuery 提供了一种简洁而优雅的方式来使用 `$()` 创建新的元素:

```js
// Creating new elements from an HTML string.
$( "<p>This is a new paragraph</p>" );
$( "<li class=\"new\">new list item</li>" );
```

```js
// Creating a new element with an attribute object.
$( "<a/>", {
    html: "This is a <strong>new</strong> link",
    "class": "new",
    href: "foo.html"
});
```

上面的 class 之所以带有引号, 是因为它是js中的[保留字](https://mathiasbynens.be/notes/reserved-keywords).

创建好新的元素之后, 有多种方法将它添加到页面中去:

```js
// Getting a new element on to the page.

var myNewElement = $( "<p>New element</p>" );

myNewElement.appendTo( "#content" );

myNewElement.insertAfter( "ul:last" ); // This will remove the p from #content!

$( "ul" ).last().after( myNewElement.clone() ); // Clone the p so now we have two.
```

新创建的元素并不需要存储到变量中去, 你可以在 `$()` 创建完成过后直接添加到页面中去. 然而, 大多数情况还是需要, 这样你就不需要在后续操作中去选取创建的元素了.

你也可以在添加到页面的时候创建该元素, 但是这样你就不能对它进行引用了.

```js
// Creating and adding an element to the page at the same time.
$( "ul" ).append( "<li>list item</li>" );
```

这种创建和添加元素的方法非常方便, 因此，很容易忘记反复添加 DOM 会带来巨大的性能代价。如果需要添加许多的元素到同一个容器元素中去, 你最好将它们连接成单个的 HTML 字符串, 然后再将这个字符串添加到页面中去而非每次添加一个元素. 使用数组将所有片段集合在一起，然后将它们追加到一个字符串中：

```js
var myItems = [];
var myList = $( "#myList" );

for ( var i = 0; i < 100; i++ ) {
    myItems.push( "<li>item " + i + "</li>" );
}

myList.append( myItems.join( "" ) );
```

## Manipulating Attributes

jQuery 的属性操作功能非常广泛。根本的修改是简单的，但是，attr()方法还允许更复杂的操作. 它可以设置一个显式值，也可以使用函数的返回值设置一个值。当使用函数返回值时，函数会收到两个参数：属性改变的元素的基于零的索引，以及属性的当前值被更改。

```js
// Manipulating a single attribute.
$( "#myDiv a:first" ).attr( "href", "newDestination.html" );
```

```js
// Manipulating multiple attributes.
$( "#myDiv a:first" ).attr({
    href: "newDestination.html",
    rel: "nofollow"
});
```

```js
// Using a function to determine an attribute's new value.
$( "#myDiv a:first" ).attr({
    rel: "nofollow",
    href: function( idx, href ) {
        return "/new/" + href;
    }
});

$( "#myDiv a:first" ).attr( "href", function( idx, href ) {
    return "/new/" + href;
});
```

# [The jQuery Object](http://learn.jquery.com/using-jquery-core/jquery-object/)

当创建或选中已经存在的元素的时候, jQuery 返回一个包含元素的集合. 许多 jQuery 新手会假定这个集合是一个数组. 毕竟它有 基于0 的 DOM 元素序列, 一些类似数组的方法, 和`.length` 属性. 实际上, jQuery 对象比数组更复杂.

## DOM and DOM Elements

DOM 代表 HTML 文档. 它包含许多 DOM 元素. 在高层次上，DOM元素可以被认为是Web页面的“一块”, 它可能包含文本和/或其他DOM元素。DOM元素由类型描述, 如 `<div>` `<a>` `<p>`, 还有一些属性, 如 `src` `href` `class`. 更详细的描述可以参考 [the official DOM specification from the W3C](http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-745549614)

元素有像任何 JavaScript 对象的属性. 这些对象属性(property)中有的是像 `.tagName` 这样的属性(attribute) 和 `.appendChild()` 这样的方法. 这些属性是通过 JavaScript 与页面交互的唯一途径.

## The jQuery Object

结果表明, 直接使用 DOM 元素可能会非常麻烦. jQuery 对象定义了许多方法来为开发人员提供更加平滑的过渡. jQuery 对象的好处包括:

- 兼容性: 元素方法的实现因浏览器供应商和版本而异,下面的代码片段期望设置一个保存在 `target` 中 `<tr>` 元素的内部 HTML:

```js
var target = document.getElementById( "target" );

target.innerHTML = "<td>Hello <b>World</b>!</td>";
```

这种方法在多数情况下会有效, 但是在大多数 IE 中却会失败. 这种情况下, [建议的方法](http://www.quirksmode.org/dom/w3c_html.html)是使用纯DOM方法替代。通过将 target 元素封装成一个 jQuery 对象, 这些边缘情况将得到处理, 并且在所有支持的浏览器中得到预期的实现:

```js
// Setting the inner HTML with jQuery.

var target = document.getElementById( "target" );

$( target ).html( "<td>Hello <b>World</b>!</td>" );
```

- 方便: 还有许多常见的DOM操作用例，用纯DOM方法很难完成。例如, 将 `newElement` 插入到 `target` 元素后面需要相当冗长的 DOM 方法:

```js
// Inserting a new element after another with the native DOM API.

var target = document.getElementById( "target" );

var newElement = document.createElement( "div" );

target.parentNode.insertBefore( newElement, target.nextSibling );
```

通过将`target`元素封装在jQuery对象中，同样的任务变得简单得多：

```js
// Inserting a new element after another with jQuery.

var target = document.getElementById( "target" );

var newElement = document.createElement( "div" );

$( target ).after( newElement );
```

在大多数情况下，这些细节都是你和你的目标之间简单的“陷阱”。

## Getting Elements Into the jQuery Object

当使用CSS选择器调用jQuery函数时，它将返回一个jQuery对象，包装与此选择器匹配的任何元素。例如：

```js
// Selecting all <h1> tags.

var headings = $( "h1" );
```

此时 `headings` 是一个包含页面中所有 `<h1>` 标签的 jQuery 元素. 可以通过检查`headings`的`.length`属性来验证这一点。

```js
// Viewing the number of <h1> tags on the page.

var headings = $( "h1" );

alert( headings.length );
```

检查`.length`属性是确保选择器成功匹配一个或多个元素的常用方法。

如果仅仅需要选择第一个 heading 元素, 最简单的方法是使用 `.eq()` 方法:

```js
// Selecting only the first <h1> element on the page (in a jQuery object)

var headings = $( "h1" );

var firstHeading = headings.eq( 0 );
```

现在 firstHeading 就是包含页面中第一个 `<h1>` 元素的jQuery 对象, 它有 `.html()` 和 `.after()` 方法. jQuery 也有一个名叫 `.get()` 的方法提供了相关功能, 它返回的是 DOM 元素而非封装过后的 jQuery DOM 元素.

```js
// Selecting only the first <h1> element on the page.

var firstHeadingElem = $( "h1" ).get( 0 );
```

另外，因为jQuery对象是类数组的，所有它支持通过数组下标进行索引：

```js
// Selecting only the first <h1> element on the page (alternate approach).

var firstHeadingElem = $( "h1" )[ 0 ];
```

无论哪种情况，`firstHeadingElem` 包含原生 DOM 元素, 也就意味着它有类似于 `.innerHTML` 的 DOM 属性 和 `.appendChild()` 方法. 但没有 `.html()` 或者 `.after()` 这样的 jQuery 方法. 尽管 `firstHeadingElem` 元素使用起来更加困难, 但是有些情况下需要使用它, 比如说比较实例.

## Not All jQuery Objects are Created ===

一个关于 jQuery 封装重要的表现就是, 每个封装都是唯一的. 即使jQuery对象是用相同的选择器创建的，或者包含对完全相同的DOM元素的引用，也是如此。

```js
// Creating two jQuery objects for the same element.

var logo1 = $( "#logo" );
var logo2 = $( "#logo" );

// Comparing jQuery objects.

alert( $( "#logo" ) === $( "#logo" ) ); // alerts "false"
```

然而, 两个jQuery 对象包含相同的 DOM 元素. `.get()` 方法可以用于获取它们:

```js
// Comparing DOM elements.

var logo1 = $( "#logo" );
var logo1Elem = logo1.get( 0 );

var logo2 = $( "#logo" );
var logo2Elem = logo2.get( 0 );

alert( logo1Elem === logo2Elem ); // alerts "true"
```

许多开发人员对 jQuery对象的变量的名称习惯上加上一个 `$` , 它只是用于区分 jQuery 对象和一般变量。可以重新编写前面的示例以遵循此约定：

```js
// Comparing DOM elements (with more readable variable names).

var $logo1 = $( "#logo" );
var logo1 = $logo1.get( 0 );

var $logo2 = $( "#logo" );
var logo2 = $logo2.get( 0 );

alert( logo1 === logo2 ); // alerts "true"
```

这段代码和前一个一样, 但是更容易阅读.

不管使用什么命名约定，区分jQuery对象和原生 DOM元素 都是非常重要的。原生 DOM方法和属性不存在于jQuery对象上，反之亦然。

## jQuery Objects Are Not "Live"

给定页面上所有段落元素的jQuery对象：

```js
// Selecting all <p> elements on the page.

var allParagraphs = $( "p" );
```

当页面中的 `<p>` 元素从文档中被添加或删除之后, `allParagraphs` 代表的元素不会自动进行更新. 如果文档中相应的选中元素发生了变化, 可以重新进行元素选取以得到页面中最新的元素集合.

```js
// Updating the selection.

allParagraphs = $( "p" );
```

## Wrapping Up

尽管DOM元素提供了创建交互式Web页面所需的所有功能。jQuery对象包装这些元素以平滑这种体验并使普通任务变得轻松。在用jQuery创建或选择元素时，结果总是封装在一个新的jQuery对象中。需要使用原生 DOM 元素的情况可以使用 `.get()` 方法和数组下标的方式获取.

# [Traversing](http://learn.jquery.com/using-jquery-core/traversing/)

使用 jQuery 选择完元素过后, 你根据选择的元素进行遍历. 遍历可分为三个基本部分: parents, children, siblings. jQuery有很多易于使用的方法来处理所有这些部分。每个这些方法可以传入一个可选的字符串选择器, 还有一些可以使用其它的 jQuery 对象来过滤你的选项。注意并参考关于[遍历的API文档](http://api.jquery.com/category/traversing/)以了解有哪些参数的变化。

## Parents

根据选择的元素查找父级元素的方法包括: `.parent()`, `.parents()`, `.parentsUntil()`, 和 `.closest()`.

```html
<div class="grandparent">
    <div class="parent">
        <div class="child">
            <span class="subchild"></span>
        </div>
    </div>
    <div class="surrogateParent1"></div>
    <div class="surrogateParent2"></div>
</div>
```

```js
// Selecting an element's direct parent:

// returns [ div.child ]
$( "span.subchild" ).parent();

// Selecting all the parents of an element that match a given selector:

// returns [ div.parent ]
$( "span.subchild" ).parents( "div.parent" );

// returns [ div.child, div.parent, div.grandparent ]
$( "span.subchild" ).parents();

// Selecting all the parents of an element up to, but *not including* the selector:

// returns [ div.child, div.parent ]
$( "span.subchild" ).parentsUntil( "div.grandparent" );

// Selecting the closest parent, note that only one parent will be selected
// and that the initial element itself is included in the search:

// returns [ div.child ]
$( "span.subchild" ).closest( "div" );

// returns [ div.child ] as the selector is also included in the search:
$( "div.child" ).closest( "div" );
```

## Children

查找选中元素的子元素的方法包括`.children()` 和 `.find()`. 区别在于选择的子结构的层级有多深。 `.children()` 仅仅操作直接的子节点, `.find()` 可以递归查找它的后代节点.

```js
// Selecting an element's direct children:

// returns [ div.parent, div.surrogateParent1, div.surrogateParent2 ]
$( "div.grandparent" ).children( "div" );

// Finding all elements within a selection that match the selector:

// returns [ div.child, div.parent, div.surrogateParent1, div.surrogateParent2 ]
$( "div.grandparent" ).find( "div" );
```

## Siblings

除了前面的方法, 剩下的基本上就是查找兄弟节点的了. 就遍历的方向而言，有几个基本的方法。通过 `.prev()` 查找前一个元素, 通过 `.next()` 查找后一个元素, 通过 `.siblings()` 查找所有兄弟节点. 还有一些基于这几个的方法: `.nextAll()` `.nextUnitl()` `.prevAll()` `.prevUntil()`

```js
// Selecting a next sibling of the selectors:

// returns [ div.surrogateParent1 ]
$( "div.parent" ).next();

// Selecting a prev sibling of the selectors:

// returns [] as No sibling exists before div.parent
$( "div.parent" ).prev();

// Selecting all the next siblings of the selector:

// returns [ div.surrogateParent1, div.surrogateParent2 ]
$( "div.parent" ).nextAll();

// returns [ div.surrogateParent1 ]
$( "div.parent" ).nextAll().first();

// returns [ div.surrogateParent2 ]
$( "div.parent" ).nextAll().last();

// Selecting all the previous siblings of the selector:

// returns [ div.surrogateParent1, div.parent ]
$( "div.surrogateParent2" ).prevAll();

// returns [ div.surrogateParent1 ]
$( "div.surrogateParent2" ).prevAll().first();

// returns [ div.parent ]
$( "div.surrogateParent2" ).prevAll().last();
```

使用 `.siblings()` 选择所有兄弟节点:

```js
// Selecting an element's siblings in both directions that matches the given selector:

// returns [ div.surrogateParent1, div.surrogateParent2 ]
$( "div.parent" ).siblings();

// returns [ div.parent, div.surrogateParent2 ]
$( "div.surrogateParent1" ).siblings();
```

[Traversal documentation on api.jquery.com](http://api.jquery.com/category/traversing/tree-traversal/) 查看完整文档.

在遍历层级比较深的情况下需要小心, 即使你是编写整个项目前后端的人也很难保证在复杂的遍历过程中文档结构保持不变. 分一或两步遍历是好的，但最好避免从一个容器到另一个容器的遍历。

# [CSS, Styling, & Dimensions](http://learn.jquery.com/using-jquery-core/css-styling-dimensions/)

jQuery包含了获取和设置元素CSS属性的快捷方法：

```js
// Getting CSS properties.

$( "h1" ).css( "fontSize" ); // Returns a string such as "19px".

$( "h1" ).css( "font-size" ); // Also works.
```

```js
// Setting CSS properties.

$( "h1" ).css( "fontSize", "100px" ); // Setting an individual property.

// Setting multiple properties.
$( "h1" ).css({
    fontSize: "100px",
    color: "red"
});
```

注意第二行上的参数的样式 - 它是一个包含多个属性的对象. 用于一次性设置多个 CSS 属性.

通常包含 CSS 横线的属性在 JavaScript 中需要使用驼峰变量. 例如, `font-size` 在 JavaScript 中需要使用 `fontSize`. 但是在作为字符串参数传递给`.css()`方法的时候并不一定要这么做, 这种情况下带横线的形式和驼峰形式都可以.

It's not recommended to use `.css()` as a setter in production-ready code, but when passing in an object to set CSS, CSS properties will be camelCased instead of using a hyphen.

## Using CSS Classes for Styling

`.css()` 作为 getter 使用是非常有价值的, 但是不推荐作为 setter 使用, 因为通常最好的方式是不要将表象信息放到 JavaScript 代码里面, 而应该是用 CSS 规则编写相应的 class, 然后修改元素的 class.

```js
// Working with classes.

var h1 = $( "h1" );

h1.addClass( "big" );
h1.removeClass( "big" );
h1.toggleClass( "big" );

if ( h1.hasClass( "big" ) ) {
    ...
}
```

class 还可以用于存储关于某个元素的状态信息，比如指示一个元素是否被选中。

## Dimensions

jQuery提供了获取和修改元素的尺寸和位置信息的各种方法。

下面的例子展示了一个简单的示例, 详细信息请参考: [dimensions documentation on api.jquery.com](http://api.jquery.com/category/dimensions/)

```js
// Basic dimensions methods.

// Sets the width of all <h1> elements.
$( "h1" ).width( "50px" );

// Gets the width of the first <h1> element.
$( "h1" ).width();

// Sets the height of all <h1> elements.
$( "h1" ).height( "50px" );

// Gets the height of the first <h1> element.
$( "h1" ).height();


// Returns an object containing position information for
// the first <h1> relative to its "offset (positioned) parent".
$( "h1" ).position();
```

# [Data Methods](http://learn.jquery.com/using-jquery-core/data-methods/)

经常需要存储元素的数据信息。 在原生 JavaScript 中, 你可以通过给 DOM 元素添加属性来达到目的, 但是你必须处理一些浏览器中的内存泄漏。jQuery提供了一种直接存储与元素相关的数据的方法，它能为你管理内存问题。

```js
// Storing and retrieving data related to an element.

$( "#myDiv" ).data( "keyName", { foo: "bar" } );

$( "#myDiv" ).data( "keyName" ); // Returns { foo: "bar" }
```

任何数据都可以存储在元素上, 使用 `.data()` 来操作数据.

例如, 你希望在列表项和它内部的 `<div>` 之间建立一种关系. 这种关系可以在每次列表项目被需要时建立，但是更好的方法是只建立一次关系, 然后使用 `.data()` 将信息存放到 `<div>` 上

```js
// Storing a relationship between elements using .data()

$( "#myList li" ).each(function() {

    var li = $( this );
    var div = li.find( "div.content" );

    li.data( "contentDiv", div );

});

// Later, we don't have to find the div again;
// we can just read it from the list item's data
var firstLi = $( "#myList li:first" );

firstLi.data( "contentDiv" ).html( "new content" );
```

除了给 `.data()` 传递单个键值对来存储数据, 还可以传入包含多个键值对的对象.

# [Utility Methods](http://learn.jquery.com/using-jquery-core/utility-methods/)

jQuery 在 `$` 这个名字空间里面提供了许多工具方法, 它们可以用来完成常规任务. 有关jQuery实用方法的完整参考请访问[utilities documentation on api.jquery.com](http://api.jquery.com/category/utilities/)

下面是这些工具方法的一部分:

`$.trim()`

移除首尾空白字符:

```js
// Returns "lots of extra whitespace"
$.trim( "    lots of extra whitespace    " );
```

`$.each()`

基于数组和对象进行迭代:

```js
// 注意 jQuery 的 callback 中 索引在前面
$.each([ "foo", "bar", "baz" ], function( idx, val ) {
    console.log( "element " + idx + " is " + val );
});

$.each({ foo: "bar", baz: "bim" }, function( k, v ) {
    console.log( k + " : " + v );
});
```

`.each()` 可以基于选择器选中的元素进行迭代. 注意是 `.each()` 而非 `$.each()`

`$.inArray()`

返回元素在数组中的索引, 如果不存在数组中则返回 -1;

```js
var myArray = [ 1, 2, 3, 5 ];

if ( $.inArray( 4, myArray ) !== -1 ) {
    console.log( "found it!" );
}
```

`$.extend()`

使用后面的对象属性来改变第一个对象的属性

```js
var firstObject = { foo: "bar", a: "b" };
var secondObject = { foo: "baz" };

var newObject = $.extend( firstObject, secondObject );

console.log( firstObject.foo ); // "baz"
console.log( newObject.foo ); // "baz"
```

如果你不希望改变任何对象, 可以传入一个空对象作为第一个参数:

```js
var firstObject = { foo: "bar", a: "b" };
var secondObject = { foo: "baz" };

var newObject = $.extend( {}, firstObject, secondObject );

console.log( firstObject.foo ); // "bar"
console.log( newObject.foo ); // "baz"
```

`$.proxy()` (和 bind 一样, jquery 内部使用 apply)

返回一个将上下文设置在第二个参数对象上的函数 - 也就是说, 将 `this` 设置为第二个参数指定的对象:

```js
var myFunction = function() {
    console.log( this );
};
var myObject = {
    foo: "bar"
};

myFunction(); // window

var myProxyFunction = $.proxy( myFunction, myObject );

myProxyFunction(); // myObject
```

如果已经有一个带有方法的对象，又需要在其它对象上使用这个对象方法就可以用 `$.proxy()` 获得一个新的函数，该函数将始终在对象的作用域中运行。

```js
var myObject = {
    myFn: function() {
        console.log( this );
    }
};

$( "#foo" ).click( myObject.myFn ); // HTMLElement #foo
$( "#foo" ).click( $.proxy( myObject, "myFn" ) ); // myObject
```

## Testing Type

有时候 `typeof` 操作符会导致混淆, 所以jQuery 提供了一些方法来帮助检测值的类型.

首先, 可以使用方法来检测特定的类型:

```js
$.isArray([]); // true
$.isFunction(function() {}); // true
$.isNumeric(3.14); // true
```

此外, 有 `$.type()` 方法用于检查创建值的内部类, 它可以更好的替代 JavaScript 原生的 `typeof` 操作符

```js
$.type( true ); // "boolean"
$.type( 3 ); // "number"
$.type( "test" ); // "string"
$.type( function() {} ); // "function"

$.type( new Boolean() ); // "boolean"
$.type( new Number(3) ); // "number"
$.type( new String('test') ); // "string"
$.type( new Function() ); // "function"

$.type( [] ); // "array"
$.type( null ); // "null"
$.type( /test/ ); // "regexp"
$.type( new Date() ); // "date"
```

**个人提醒**

默认的 toString 方法(继承自 Object.prototype) 返回 `[object class]` 这种格式的字符串, 因此如果想要获得对象的类, 可以取该字符串的 8 到倒数第二个字符之间的字符串, 不过大多数对象都重新了 toString 方法, 所以只有如下调用:

```js
// P139
function type(o) {
  if (o === null) return 'Null';
  if (o === undefined) return 'Undefined';
  return Object.prototype.toString.call(o).slice(8, -1);
}
```

# [Iterating over jQuery and non-jQuery Objects](http://learn.jquery.com/using-jquery-core/iterating/)

jQuery 提供了一个对象迭代器的工具函数 `$.each()` 和 jQuery 集合迭代函数 `.each()`. 它们不可互换. 此外还有一组  `$.map()` 和 `.map()` 方法也是常见的用于迭代的快捷方法.

`$.each()`

[`$.each()`](http://api.jquery.com/jQuery.each/) 是一个在对象、数组和类数组对象上进行迭代的方法. 纯对象通过它们的命名属性进行迭代, 数组和类数组对象通过它们的索引迭代。

`$.each()` 实际上是 `for` 或者 `for-in` 降级替代品.

```js
var sum = 0;

var arr = [ 1, 2, 3, 4, 5 ];

for ( var i = 0, l = arr.length; i < l; i++ ) {
    sum += arr[ i ];
}

console.log( sum ); // 15
```

可以替代为:

```js
$.each( arr, function( index, value ){
    sum += value;
});

console.log( sum ); // 15
```

注意不需要访问 `arr[ index ]`, 因为它已经方便的传入了 `$.each()` 的回调函数.

```js
var sum = 0;
var obj = {
    foo: 1,
    bar: 2
}

for (var item in obj) {
    sum += obj[ item ];
}

console.log( sum ); // 3
```

可以替换为

```js
$.each( obj, function( key, value ) {
    sum += value;
});

console.log( sum ); // 3
```

注意, `$.each()` 用于纯对象、数组或类数组对象而非 jQuery 集合.下面的方式是不正确的

```js
// Incorrect:
$.each( $( "p" ), function() {
    // Do something
});
```

对于 jQuery 集合, 使用 `.each()`;

`.each()`

[`.each()`](http://api.jquery.com/each/) 用于 jQuery 集合. 它迭代集合中的所有元素. 当前元素的索引会被当做参数传入回调函数中, 值(DOM 元素)也会被传入, 但是回调函数的执行上下文会被设置为当前所匹配的元素, 即 `this` 关键字指向当前元素.

例如给点下面的 HTML 代码:

```html
<ul>
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
    <li><a href="#">Link 3</a></li>
</ul>
```

可以这样使用 `.each()`:

```js
$( "li" ).each( function( index, element ){
    console.log( $( this ).text() );
});

// Logs the following:
// Link 1
// Link 2
// Link 3
```

### The Second Argument

有一个经常被问到的问题: 如果`this` 就是这个元素, 那么为什么还需要给回调函数传入第二个 DOM 元素作为参数?

因为执行上下文可能被有意或者无意的更改. 如果一贯的使用 `this`, 即使上下文没有发生改变, 在我们或者别人阅读代码的时候都可能很容易陷入迷惑之中, 加入第二个参数是为了增强它的可读性, 例如:

```js
$( "li" ).each( function( index, listItem ) {

    this === listItem; // true

    // For example only. You probably shouldn't call $.ajax() in a loop.
    $.ajax({
        success: function( data ) {
            // The context has changed.
            // The "this" keyword no longer refers to listItem.
            this !== listItem; // true
        }
    });
});
```

### Sometimes `.each()` Isn't Necessary

许多 jQuery 方法会隐式迭代整个集合，将它们的行为应用于每个匹配的元素。例如, 下面这个就是不必要的:

```js
$( "li" ).each( function( index, el ) {
    $( el ).addClass( "newClass" );
});
```

因为下面这样写更好:

```js
$( "li" ).addClass( "newClass" );
```

另一方面, 有的方法不会基于集合进行迭代, 当我们需要在设置元素的信息之前获取信息时使用 `.each()` 就非常必要.

下面这样是错误的写法:

```js
// Doesn't work:
$( "input" ).val( $( this ).val() + "%" );

// .val() does not change the execution context, so this === window
```

下面这样是正确的写法:

```js
$( "input" ).each( function( i, el ) {
    var elem = $( el );
    elem.val( elem.val() + "%" );
});
```

下面是需要 `.each()` 的方法的列表:

- [.attr()](http://api.jquery.com/attr/#attr1) (getter)
- [.css()](http://api.jquery.com/css/#css1) (getter)
- [.data()](http://api.jquery.com/data/#data2) (getter)
- [.height()](http://api.jquery.com/height/#height1) (getter)
- [.html()](http://api.jquery.com/html/#html1) (getter)
- [.innerHeight()](http://api.jquery.com/innerHeight/)
- [.innerWidth()](http://api.jquery.com/innerWidth/)
- [.offset()](http://api.jquery.com/offset/#offset1) (getter)
- [.outerHeight()](http://api.jquery.com/outerHeight/)
- [.outerWidth()](http://api.jquery.com/outerWidth/)
- [.position()](http://api.jquery.com/position/)
- [.prop()](http://api.jquery.com/prop/#prop1) (getter)
- [.scrollLeft()](http://api.jquery.com/scrollLeft/#scrollLeft1) (getter)
- [.scrollTop()](http://api.jquery.com/scrollTop/#scrollTop1) (getter)
- [.val()](http://api.jquery.com/val/#val1) (getter)
- [.width()](http://api.jquery.com/width/#width1) (getter)

再次提醒, 一般情况下作为 "getter" 使用时返回集合第一个元素的结果, 作为 "setter" 使用时会作用于整个集合元素. 一个例外就是 `.text()`, 它作为 "getter" 使用时返回从所有匹配元素中连接起来的文本字符串。

除了直接给 setter 传入一个用于设置的值, 作为 "setter" 使用的attribute、 property、CSS setter 和 DOM 插入的方法(如 `.text()` 和 `.html()`) 可以接受匿名函数来操作集合上的每个元素. 传入回调的参数是元素的索引和该方法作为 "getter" 方式返回的结果.

例如, 下面两个是等价的:

```js
$( "input" ).each( function( i, el ) {
    var elem = $( el );
    elem.val( elem.val() + "%" );
});

$( "input" ).val(function( index, value ) { // 该处 value 就是 val 作为 getter 使用时的值
    return value + "%";
});
```

关于这种隐性迭代需要注意的就是像 `.children()` 或者 `.parent()` 这种遍历方法会基于集合中的每一个元素返回一个所有子节点或父节点的混合集合.

[`.map()`](http://api.jquery.com/map/)

通常一般的迭代情况可以使用 `.map()` 方法. 如果是希望得到一个数组或者一个基于所有jQuery 选中元素生成的字符串, 最好使用 `.map()`.

例如:

```js
var newArr = [];

$( "li" ).each( function() {
    newArr.push( this.id );
});
```

可以使用下面的方式替代它:

```js
$( "li" ).map( function(index, element) {
    return this.id;
}).get();
```

**注意**: `.map()` 返回一个 jQuery 封装过后的集合,
即使在这里 `.map()` 的回调函数里面是返回的一个字符串. 我们需要使用缺省参数的 `.get()` 来返回一个我们可以使用的基本 JavaScript 数组. 如果需要将返回值串联在一起, 可以使用JS 数组方法 `.join()`

[`$.map`](http://api.jquery.com/jQuery.map/)

如同 `$.each()` 和 `.each()`一样 , `.map` 也有 `$.map()`. 它们之间的不同点同 `$.each()` 和 `.each()`一样. `$.map()` 基于纯的 JavaScript 数组而 `.map()` 基于 jQuery 元素集合. 由于 `$.map()` 是用于原生 JavaScript 数组, 所以不需要在末尾加上一个 `.get()` 来获取原生 JavaScript 数组, 这样反而会报错.

值的注意的是: `$.map()` 调换了回调函数的参数顺序(本来 jQuery 的方法是将索引放在回调函数的第一个参数位置, 但是 `$.map()` 单独对它做了调换), 这是为了和 ECMAScipt5 的原生 JavaScript 的`.map()` 方法相匹配, 但是 `$.each()` 这种却没有作参数调换, 因为 JavaScript 数组没有 `.each()` 而是 `.forEach()`.

```html
<li id="a"></li>
<li id="b"></li>
<li id="c"></li>

<script>

var arr = [{
    id: "a",
    tagName: "li"
}, {
    id: "b",
    tagName: "li"
}, {
    id: "c",
    tagName: "li"
}];

// Returns [ "a", "b", "c" ]
$( "li" ).map( function( index, element ) {
    return element.id;
}).get();

// Also returns [ "a", "b", "c" ]
// Note that the value comes first with $.map
$.map( arr, function( value, index ) {
    return value.id;
});

</script>
```

# [Using jQuery’s .index() Function](http://learn.jquery.com/using-jquery-core/understanding-index/)

`.index()` 通常用于在调用它的 jQuery 对象中搜索给定的元素.

该方法有四种不同的用法, 这里讲解了每种情况下 `.index()` 是如何工作的.

## `.index()` with No Arguments

```html
<ul>
    <div></div>
    <li id="foo1">foo</li>
    <li id="bar1">bar</li>
    <li id="baz1">baz</li>
    <div></div>
</ul>

<script>
var foo = $( "#foo1" );

console.log( "Index: " + foo.index() ); // 1

var listItem = $( "li" );

// This implicitly calls .first()
console.log( "Index: " + listItem.index() ); // 1
console.log( "Index: " + listItem.first().index() ); // 1

var div = $( "div" );

// This implicitly calls .first()
console.log( "Index: " + div.index() ); // 0
console.log( "Index: " + div.first().index() ); // 0
</script>
```

第一个例子中, `.index()` 返回 `#foo1` 在其父元素中基于 0 的索引. 因为 `#foo1` 是父元素的第二个元素, 所以 `.index()` 返回 1

**注意**: jQuery 1.9 之前, `.index()` 只能在基于单个元素才能得到可靠的结果, 所以我们在每个例子上都使用了 `.first()`. jQuery 1.9及之后可以忽略这样的做法. 随着API的更新，定义它只在第一个元素上运行。

## `.index()` with a String Argument

```html
<ul>
    <div class="test"></div>
    <li id="foo1">foo</li>
    <li id="bar1" class="test">bar</li>
    <li id="baz1">baz</li>
    <div class="test"></div>
</ul>
<div id="last"></div>

<script>
var foo = $( "li" );

// This implicitly calls .first()
console.log( "Index: " + foo.index( "li" ) ); // 0
console.log( "Index: " + foo.first().index( "li" ) ); // 0

var baz = $( "#baz1" );
console.log( "Index: " + baz.index( "li" )); // 2

var listItem = $( "#bar1" );
console.log( "Index: " + listItem.index( ".test" ) ); // 1

var div = $( "#last" );
console.log( "Index: " + div.index( "div" ) ); // 2
</script>
```

