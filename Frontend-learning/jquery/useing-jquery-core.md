
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




