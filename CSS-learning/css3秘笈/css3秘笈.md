
IE8 以下的浏览器不支持 HTML5 的新标签，所以为了让这些浏览器接受 HTML5 标签，使用了一种叫做 “IE条件注释（简称IECC）”的东西，嵌入了一些只有 IE9 之前的版本可见的 JavaScript 代码，其它浏览器则会忽略这段代码：

```html
<!--[if lt IE 9]>
<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->
```

这段代码只是影响了该浏览器显示和输出 HTML5 标签的方式，并没有使浏览器 “理解” 具体某个 HTML5 标签实际起什么作用的，如 IE8 以前的版本并不能理解 `<video>`，即使添加了上述 JavaScript 代码也不能播放 HTML5 视频。

`<cite>` 标签可以将网页标题显示为斜体，还给标题做上标记，以便搜索引擎检索。

如果在 IE8 中单击了“兼容性视图”，则 IE8 会进入 IE7 模式，导致无法显示它本来能够显示的 CSS2.1 的设置，可以通过下面的`<meta>`标签（最好放在head下面）来告诉 IE8 不要那么做：

`<meta http-equiv="X-UA-Compatible" content="IE=edge" />`

"IE=edge" 部分命令 IE8 之后的版本也要以这样的标准来显示网页（edge正好是win10上面的自带默认浏览器）。

清除浏览器缓存：
- 按住 Ctrl（command）键然后点击浏览器刷新
- IE：Ctrl + F5
- Firefox：Ctrl（command） + Shift + R
- Safari 或 Chrome：Ctrl（command） + R

HTML5 只要求内部样式标签为 `<style>`，HTML和XHTML 的早期版本要求为 `<style type="text/css">`，如果没有type则会报错！style 标签在 HTML 4.01 或者 XHTML中则需要添加 `type="text/css"` 属性。

引入外部样式表有 `<link>` 标签和 CSS 自带的 `@import` 两种方式，而 `@import` 可以将多个外部样式表附到一个外部样式表上，`@import` 的使用如下：
```html
<style>
  @import url(css/style1.css);
  @import url(css/style2.css);
  p { color: red }  /* 如果CSS规则出现在 import 前，则 import 会被忽略*/
</style>
```
