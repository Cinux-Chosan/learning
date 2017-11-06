
IE8 以下的浏览器不支持 HTML5 的新标签，所以为了让这些浏览器接受 HTML5 标签，使用了一种叫做 “IE条件注释（简称IECC）”的东西，嵌入了一些只有 IE9 之前的版本可见的 JavaScript 代码，其它浏览器则会忽略这段代码：

```html
<!--[if lt IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

这段代码只是影响了该浏览器显示和输出 HTML5 标签的方式，并没有使浏览器 “理解” 具体某个 HTML5 标签实际起什么作用的，如 IE8 以前的版本并不能理解 `<video>`，即使添加了上述 JavaScript 代码也不能播放 HTML5 视频。

`<cite>` 标签可以将网页标题显示为斜体，还给标题做上标记，以便搜索引擎检索。
