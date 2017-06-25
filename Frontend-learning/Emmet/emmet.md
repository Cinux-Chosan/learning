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

所有的元素都采用下面的格式定义在 [`snippets.json`](https://github.com/emmetio/emmet/blob/master/lib/snippets.json) 文件中。

```json
{
    "html": {
        "abbreviations": {
            "a": "<a href=\"\">",
            "link": "<link rel=\"stylesheet\" href=\"\" />"
            ...
        },
        "snippets": {
            "cc:ie6": "<!--[if lte IE 6]>\n\t${child}|\n<![endif]-->"
            ...
        }
    },

    "css": {
        ...
    }
}
```

第一层级为所定义元素的语法名称，可以理解为文件的类型（扩展名，如上面的"html" 实际上指下面的约束被约束在html文件中）。在它下面的语法部分，元素的定义被分为两部分：片段和缩写（snippets and abbreviations.）

### 片段（Snippets）

片段就是纯代码块，怎么定义，就怎么生成代码，不会经过任何的加工。

### 缩写（Abbreviations）

缩写实际上是带有一些数据提示的块。因为 Emmet 常用于编写 HTML/XML 标签，缩写使用 XML 格式的定义来描述一个元素该如何生成。

Emmet 解析缩写语的定义，然后检索以下数据：

- 元素名
- 默认属性
- 属性顺序
- 属性默认值
- 是否包含闭合标签

上面示例中 link 元素定义为 `<link rel="stylesheet" href="" />` （在JSON中双引号需要转义，或者使用单引号代替）。这样的定义就代表它是给 link 元素定义个缩写，包含两个属性，`rel` 有默认值 stylesheet，`href` 有个空的初始值，并且该元素没有闭标签。

你可以覆盖默认的属性值，也可以添加新的属性值：

`link[rel=prefetch title="hello"]` 生成：

```html
<link rel="prefetch" href="" title="hello">
```

你可以添加子元素来强制元素生成闭标签：

`link>xsl:apply-templates` 生成：

```html
<link rel="stylesheet" href="">
  <xsl:apply-templates></xsl:apply-templates>
</link>
```

### Aliases

你可以在 snippets.json 的 abbreviations 部分定义 *aliases* 字段，它是其他常用缩写的简写方式。它可以定义：
- 为名字比较长的标签定义短名
- 引用常用的缩写

你可以在 snippets.json 中找到下面这样的代码：

```json
"html": {
    "abbreviations": {
        "bq": "blockquote",
        "ol+": "ol>li"
    }
}
```

在上面的例子中，当你展开 `bq` 缩写的时候， Emmet 将会查找 `blockquote` 的定义。如果不存在，它将会直接输出 `<blockquote></blockquote>` 元素。 `ol+` 缩写将会输出和 ol>li 一样的结果。

`ol+` 这样的定义看起来模棱两可，因为它以 `+` 操作符结尾。由于历史原因，Emmet 将会正确的展开这样的缩写定义，加号被留在这儿。但是记住，没有必要在缩写 alias 中使用 `+` 操作符。

## 隐式标签名

在一些情况下，你可以跳过标签名，如 `div.content` 可以写作 `.content`，它们都被解析为： `<div class="content"></div>`

### 它是怎么工作的

当将缩写展开的时候， Emmet 会尝试获取父级的上下文，如果获取父级的上下文成功，则 Emmet 会使用它的标签名作为隐式标签名。

Here’s how it resolves the names for some parent elements:

- li for ul and ol
- tr for table, tbody, thead and tfoot
- td for tr
- option for select and optgroup

如下面的例子：


- `.wrap>.content` => `div.wrap>div.content`
- `em>.info` => `em>span.info`
- `ul>.item*3` => `ul>li.item*3`
- `table>#row$*4>[colspan=2]` => `table>tr#row$*4>td[colspan=2]`

## “Lorem Ipsum” generator（生成测试的虚假数据）

[“Lorem ipsum”](http://www.lipsum.com/) dummy text 被很多 web 开发者用来测试网页模板在真实数据下的显示情况。通常情况下，开发者使用第三方服务来生成 “lorem ipsum” 文字，但是现在你马上就可以在你的编辑器里面就可以使用了。展开 lorem 或者 lipsum 缩写来得到下面的片段：

      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi non quis exercitationem culpa nesciunt nihil aut nostrum explicabo reprehenderit optio amet ab temporibus asperiores quasi cupiditate. Voluptatum ducimus voluptates voluptas?

lorem 不是常规的片段，它实际上是一个生成器。每次你展开它，会生成 30 个单词的文本，它们被分成多个片段。

你可以在缩写中指定生成多少个单词。例如， lorem100 会生成 100 个文字的虚假文字。

### Repeated “Lorem ipsum”

你可以使用 lorem 生成器来为重复的标签生成不同的随机段落。例如 `p*4>lorem` 缩写将会得到如下面的代码：

```html
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus perferendis ipsa expedita optio a quae quo officiis veritatis assumenda magni, excepturi nemo dolorum, minima vitae eum facilis praesentium reiciendis error.</p>
<p>Assumenda iusto placeat dolore maiores, ad nobis iure doloribus! Dignissimos excepturi nihil dolor doloremque ullam deserunt sunt temporibus odio, voluptates molestiae aliquam illo a, esse! Corporis laborum ullam nostrum. Quibusdam.</p>
<p>Nesciunt quos facilis dolores at voluptatum, quis, quam est blanditiis neque saepe quasi perferendis odit laboriosam repudiandae voluptate labore aliquid asperiores maiores. Recusandae, at, dolorum! Non est, architecto ipsam voluptate.</p>
<p>Aliquid quia, consectetur labore doloribus asperiores modi minima cupiditate laboriosam ea quis pariatur, temporibus voluptas aut, sapiente praesentium cumque! Nihil alias aliquid aspernatur placeat, amet ad quas! Earum, impedit, laboriosam!</p>
```

当 lorem 元素重复的时候 生成器利用 [implicit tag name resolver](https://docs.emmet.io/abbreviations/implicit-names/)

`ul.generic-list>lorem10.item*4` 生成

```html
<ul class="generic-list">
  <li class="item">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut, consectetur.</li>
  <li class="item">Aliquam quidem laborum accusamus fugit eius voluptatibus rem sit unde?</li>
  <li class="item">Temporibus necessitatibus architecto ullam maxime numquam minima dicta, est iusto.</li>
  <li class="item">Laborum facilis repellendus dignissimos ad, vel doloribus repudiandae veniam enim.</li>
</ul>
```

## CSS 缩写

尽管Emmet 缩写在生成 HTML/XML 或者其他结构化标记的时候非常有用，在CSS方便看起来好像很无力。你是不是也不想写 CSS 选择器，或者把它们转换成CSS选择器。Emmet 唯一能为你做的就是给 CSS 属性提供一些简写，但是编辑器的一些原生的片段和自动补全功能可以帮你做得更好。

实际上，Emmet 提供了一些东西。

Emmet 有一些 CSS 属性的预定义片段。例如，你可以将 `m` 缩写展开为 `margin:;`，然后你想给属性指定一个值，这时你就手动输入值，如 10px。

Emmet 可以大大的优化你的工作流程：你可以直接给缩写注入值。如果希望得到 `margin:10px;`，你可以缩写为 `m10`。 希望赋予多个值？使用连字符（中划线）来分隔它们：`m10-20` 得到 `margin: 10px 20px;`，那如果希望得到负的值呢？加一个连字符（中划线）即可，即第一个值使用一个连字符（中划线），后面的值使用两个连字符（中划线）。`m-10--20` 展开得到 `margin: -10px -20px;`

#### 它是如何工作的？

Emmet 有一个特别的 CSS 转换器来将这种缩写转换成 CSS 属性。

接下来讲述当你展开 m10 缩写的时候发生了什么。

第一，它在 `snippets.json` 中查找 `m10` 片段。如果找到了，它就将它当做常规的片段输出。否则，它从缩写中提取值。

为了提供最佳体验，解释器不引入任何特殊的分隔符：因为输入 `m5` 比 `m:5`更快，它将第一个数字或者连字符当做属性的值。在 `m10` 中， m 是属性， 10 是值。

当解析器找到属性的时候，它搜索 snippets.json 中 snippet 的定义。如`m`会与定义中的 `"m": "margin:|;"` 匹配。`|` 字符被当做片段扩展后的插入符号的位置引用，属性值会被放到符号的这个位置，如果没有在缩写中指定值，则光标会自动指到这里。

片段的定义看起来很像 CSS 属性，所以 Emmet 能够将它分成属性和值，并且将值放在插入符号的位置（`|`的位置）。

#### 为值提供单位

数值的单位默认是 `px`，如果使用的是浮点数，则单位是 `em`。但是你可以在值后面显式提供单位名称， `m1.5ex` 得到`margin: 1.5ex;` ， `m10foo` 得到 `margin: 10foo;`

如果你明确地定义了单位，就不需要使用连字符来分隔多个值。`m10ex20em` 得到 `margin: 10ex 20em;` `m10ex-5` 得到 `margin:10ex -5px;`

#### Value aliases（别名）

Emmet 为一些常用的单位定义了别名：

- p -> %
- e -> em
- x -> ex

可以使用别名来代替完整的单位：

- w100p -> width: 100%;
- m10p30e5x -> margin: 10% 30em 5ex;

#### 颜色的值（color values）

Emmet 支持十六进制的颜色值，如 `c#3` -> `color: #333;`，`#`号作为值的分隔符。例如，`bd5#0s` 展开成 `5px #000 solid;`：`#` 号将5和颜色值分开，`s` 不是十六进制的值，所以用不着连字符来分隔。

你可以使用 1、2、3或者6个字符作为颜色值：

- #1 -> #111111
- #e0 -> #e0e0e0
- #fc0 -> #ffcc00

当 css.color.short [偏好](https://docs.emmet.io/customization/preferences/)设置被开启（默认），则如 #ffcc00 这样的颜色值自动被缩写为 #fc0。你也可以通过设置 css.color.case 自动改变字符的大小写。

#### Unit-less 属性

一些 CSS 属性被定义为 `unit-less`（没有单位的）。没有单位后缀的将会输出如 `lh2` -> `line-height: 2;` `fw400` -> `font-weight: 400;` 这样的属性有 `z-index`,`line-height`, `opacity` 和 `font-weight` 但是你可以通过设置 css.unitlessProperties 偏好来覆盖默认设置。

#### !important modifier

你可以在CSS 缩写后面添加 `!` 后缀来得到 `!important;`：

`p!+m10e!` 得到

``` less
padding:  !important;
margin: 10em !important;
```

### Vendor prefixes（供应商前缀）

新的 CSS3 特性给众多的开发者带来了福音： 相比以前可以使用更少的代码来写出更好的效果。但是这些特性也给我们带来了一些痛苦：我们不得不给相同的属性添加不同的前缀以适应不同的浏览器。

Emmet 的CSS 解析器有有一个漂亮的特性可以改善你写 CSS3 的体验。每次在 CSS 属性或者缩写前面加上一个连字符， Emmet 自动为你添加浏览器前缀。例如 `-bdrs` 缩写将会展开成

``` less
-webkit-border-radius: ;
-moz-border-radius: ;
-ms-border-radius: ;
-o-border-radius: ;
border-radius: ;
```

#### 它是如何工作的？
