
# How jQuery Works

## document ready 时候执行代码

为了确保代码在浏览器将文档加载完成时执行代码, 许多的 JavaScript 程序员将他们的代码封装在 `onload` 函数中:

```js
window.onload = function() {
    alert( "welcome" );
};
```

遗憾的是, 这种代码在所有的图片都下载完成之前不会执行, 包括横幅广告图片. jQuery有一个称为 [ready 事件](http://api.jquery.com/ready/)的语句用来当文档准备好可以被操作时立即运行代码:

```js
$( document ).ready(function() {
    // Your code here.
});

```

**个人提醒:**

**注意**, jquery 3.0 以后, 移除了 on('ready', fn), 因为它仅仅调用 docuoment ready 之前添加的事件函数, jquery 3.0 使用 $(fn), 它改为异步执行, 即使在 document ready 之后, 也会执行. 相关内容参考:

- [Breaking change: .on("ready", fn) removed](https://jquery.com/upgrade-guide/3.0/#breaking-change-on-quot-ready-quot-fn-removed)
- [Breaking change: document-ready handlers are now asynchronous](https://jquery.com/upgrade-guide/3.0/#breaking-change-document-ready-handlers-are-now-asynchronous)

例如, 在 `ready` 事件中, 你可以给链接添加 click 事件处理器:

```js
$( document ).ready(function() {
    $( "a" ).click(function( event ) {
        alert( "Thanks for visiting!" );
    });
});
```

现在点击链接, 首先 alert 信息, 然后执行链接默认的行为.

可以在事件处理函数中使用 `event.preventDefault()` 来阻止默认行为:

```js
$( document ).ready(function() {
    $( "a" ).click(function( event ) {
        alert( "As you can see, the link no longer took you to jquery.com" );
        event.preventDefault();
    });
});
```

### [Special Effects](http://learn.jquery.com/about-jquery/how-jquery-works/#special-effects)

jQuery 提供了一些方便的效果来帮助你使你的网站脱颖而出, 例如:

```js
$( "a" ).click(function( event ) {
    event.preventDefault();
    $( this ).hide( "slow" );
});
```

现在点击过后, 该链接会慢慢消失.

## Callbacks and Functions
