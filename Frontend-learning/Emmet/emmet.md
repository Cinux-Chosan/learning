# Emmet

提高 web 开发者的开发效率。

基本上，大多数编辑器都允许你存储和重用一些常用的代码块，这被称作“snippets”。虽然 snippets 可以提高工作效率，但是所有的 snippets 实现都有一个共同的缺点：你必须首先定义该代码片段，而且你不能在运行时扩展它们。

Emmet 采用了 snippet 的思路，并把它提升到一个新的境界：你可以书写类似 CSS 的表达式，并且动态解析成你想要的输出代码。Emmet 为基于 HTML/XML 和 CSS 的 web 开发者开发并且做了优化，也可以与编程语言一起使用。

开始学习  [缩写(Abbreviation)语法](https://docs.emmet.io/abbreviations/) 和 [actions](https://docs.emmet.io/actions/)

## Abbreviations

缩写是 Emmet 的灵魂：这些缩写的表达式能够在运行时解析，然后转换成已经结构化好的代码块。缩写语法看起来像添加了一些扩展的 CSS 选择器。

例如：

`#page>div.logo+ul#navigation>li*5>a{Item $}`

然后按 `tab` 键，它将会被转换成：

``` HTML
<div id="page">
    <div class="logo"></div>
    <ul id="navigation">
        <li><a href="">Item 1</a></li>
        <li><a href="">Item 2</a></li>
        <li><a href="">Item 3</a></li>
        <li><a href="">Item 4</a></li>
        <li><a href="">Item 5</a></li>
    </ul>
</div>
```

## 缩写语法

Emmet 使用类似于 CSS 选择器的语法来描述元素在生成树的位置和元素的属性。

### 元素

你可以使用如 `div` 或者 `p` 来生成 HTML 标签。 Emmet 没有预定义的标签名，你可以使用任何单词来转换成标签： `div` 会变成 `<div></div>`， `foo` 会变成 `<foo></foo>` 等等。

### 嵌套操作符

嵌套操作符用来给缩写语法中的元素指定在生成树中的位置。

#### 子节点： >

使用 `>` 符号来指定子节点：`div>ul>li` 生成

``` HTML
  <div>
    <ul>
      <li></li>
    </ul>
  </div>
```

#### 兄弟节点： +

使用 `+` 来指定兄弟节点，即它们的层级平行：

`div+p+bq` 生成：

```HTML
<div></div>
<p></p>
<blockquote></blockquote>
```

#### 上爬：^

使用 `>` 会在生成树中降级，即将当前上下文切换到子节点，此时所有的同级元素将会在最深层级中生成，使用 `^` 操作符，你可以将层级往上提升：

`div+div>p>span+em^bq` 生成：

```html
<div></div>
<div>
  <p><span></span><em></em></p>
  <blockquote></blockquote>
</div>
```

你可以使用多个 `^` 操作符，每个都会把当前上下文往上提升一级：

`div+div>p>span+em^^^bq` 生成：

```HTML
<div></div>
<div>
  <p><span></span><em></em></p>
</div>
<blockquote></blockquote>
```

#### 乘法： *

使用 `*` 操作符，你可以将同一个元素定义重复定义多次：

`ul>li*5` 生成：

```HTML
<ul>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

#### 分组： ()

使用 `()` 来在复杂的缩写语法中对子语法树进行分组：

`div>(header>ul>li*2>a)+footer>p` 生成：

```HTML
  <div>
    <header>
      <ul>
        <li><a href=""></a></li>
        <li><a href=""></a></li>
      </ul>
    </header>
    <footer>
      <p></p>
    </footer>
  </div>
```

如果对浏览器的 DOM 比较熟悉，在写代码的时候你可能需要用到一组文档片段（Document Fragments）：每个组包含子树的语法，所有接下来的元素会被插入在组中的第一个元素所在的层级，也可以在组中嵌套组并且结合 `*` 操作符：

`(div>dl>(dt+dd)*3)+footer>p` 生成：

```HTML
  <div>
    <dl>
      <dt></dt>
      <dd></dd>
      <dt></dt>
      <dd></dd>
      <dt></dt>
      <dd></dd>
    </dl>
  </div>
  <footer>
    <p></p>
  </footer>
```

### 属性操作符

属性操作符用于改变输出元素的属性。例如可以直接生成具有 class 属性的 HTML 和 XML 元素。

#### ID 和 CLASS 属性

在 CSS 中，你可以使用 `elem#id` 和 `elem.class` 来选中具有 `id` 和 `class` 属性的元素。在 Emmet 中，你也可以这样：

`div#header+div.page+div#footer.class1.class2.class3` 生成：

```HTML
<div id="header"></div>
<div class="page"></div>
<div id="footer" class="class1 class2 class3"></div>
```

#### 自定义属性

你可以使用像 CSS 那样的写法： `[attr]` 来给元素添加属性：

`td[title="Hello world!" colspan=3]` 生成：

```HTML
<td title="Hello world!" colspan="3"></td>    
```

- 你可以在方括号中指定多个属性
- 你可以不必指定属性的值： `td[colspan title]` 将会生成 `<td colspan="" title=""></td>`
- 你可以使用单引号`''`或者双引号`""`来引属性的值。
- 如果属性值中没有空格，你也可以不使用引号把值括起来。

#### 项编号： $

使用 `*` 你可以将同一个元素重复多次，使用 `$` 则可以给它们编号。将 `$` 行在元素的名字、属性名或者属性值中来输出当前重复元素的编号：

`ul>li.item$*5` 会生成：

```html
  <ul>
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
  </ul>
```

你可以在统一行多次使用 `$` 来填充 0：

`ul>li.item$$$*5` 生成：

```html
  <ul>
    <li class="item001"></li>
    <li class="item002"></li>
    <li class="item003"></li>
    <li class="item004"></li>
    <li class="item005"></li>
  </ul>
```

#### 修改基数（起始值）和值的改变方向（增或减）：

使用 `@` 修改器，你可以改变数字的基数变化方向，例如，编号递减，可以在 `$` 后添加 `@-`：

`ul>li.item$@-*5` 生成：

```html
  <ul>
    <li class="item5"></li>
    <li class="item4"></li>
    <li class="item3"></li>
    <li class="item2"></li>
    <li class="item1"></li>
  </ul>
```

可以在 `$` 后使用 `@N` 指定初始值：

`ul>li.item$@3*5` 生成：

```html

  <ul>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
    <li class="item6"></li>
    <li class="item7"></li>
  </ul>
```

将它们写在一起：`ul>li.item$$@-3*5` 生成：

```html
  <ul>
    <li class="item07"></li>
    <li class="item06"></li>
    <li class="item05"></li>
    <li class="item04"></li>
    <li class="item03"></li>
  </ul>
```

#### 文本： {}

使用大括号来给元素添加文本：
`a{Click Me}` 生成：

```html
<a href="">Click Me</a>
```

如 HTML 中一样，文本也会被当作一个节点，它与元素是分离的。
`a{click}` 和 `a>{click}` 会生成相同的输出，但是 `a{click}+b{here}` 和 `a>{click}+b{here}`不会得到相同的输出，因为 `>` 改变了层级，而文本不会改变层级：

```html
<!-- a{click}+b{here} -->
<a href="">click</a><b>here</b>

<!-- a>{click}+b{here} -->
<a href="">click<b>here</b></a>
```

注意：Emmet 将空格作为缩写语法的分隔符，并且只解析当前的缩写语法，空格之前的缩写语法不会被解析。

## 元素类型

在 HTML 和 XML 文档中，所有的缩写都会立即转换成 HTML/XML 标签。但是某些元素如 a 和 img 等会带一些预定义的参数， a 会转换成 `<a href=""></a>` `<img src="" alt="">`，为什么它们会带有一些参数呢？
