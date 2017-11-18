# 第二章：选择器

伪类:

浏览器提供的能够区分元素不同状态的类。

- 如 `:link` `:visited` `:hover` `:active` `:chekced` `:focus` 等

伪元素:

能够在文档中插入假想的元素。

- 如 `:first-letter` `:first-line` `:before` `:after`

**提示：伪类和伪元素都是与当前选择的元素相关联，可能通常认为 `p:first-child` 之类的选择器会选择 p 元素的第一个子元素，然而并不是这样，伪类的实质是把某种假想的类关联到与伪类相关的元素 **

# 第三章：层叠和结构

选择器特殊性：

- ID > class|属性|伪类 > 元素|伪元素

通配符特殊性为 0，继承无特殊性。 所以通配符优先于继承的值:

```html
<style media="screen">
  * { color: red }
  h1#page-title{ color: blue }
</style>
<body>
  <!-- em 内的 Central 的颜色依然显示为通配符的 red -->
  <h1 id="page-title">Meerkat<em>Central</em></h1>
</body>
```

由于如果特殊性和权重等其他因素都相同的情况下，会按照出现的顺序来选择样式的优先级，所以建议按照 LVHA（link-visited-hover-active，现在改为 link-visited-focus-hover-active） 的顺序来什么链接样式：

```css
:link{ color: blue; }
:visited{ color: purple; }
:hover{ color: red; }
:active{ color: orange; }
```
因为如果按照下面的顺序，将永远不会显示 `:hover` 和 `:active`：

```css
:active{ color: orange; }
:hover{ color: red; }
:link{ color: blue; }
:visited{ color: purple; }
```
由于它们权重都相同，所以出现在后面的就会有较高的优先级。链接要么为未访问，那么就显示 `:link`，要么就为已访问，显示 `:visited`；`:active` 和 `:hover` 就被这两个属性给覆盖了。

**提示：除了按顺序，还可以增加特殊性，如 `:hover:link { color: red; }`**

# 第四章：值和单位

在CSS中，**相对 URL 要相对于样式表本身，而不是相对于使用该样式表的 HTML 文档**。

例如根目录有一个 index.html，它 link 了 css 目录下面的样式表文件，该样式表定义了一个元素背景图片位置，该图片位于根目录下的 pic 目录里，则这个 url 应该为 `../pic/图片名`， **道理很简单，如果我们是引用的公共 CDN 提供的样式表，那么撰写这个样式表的作者并不知道会被哪些人在什么地方的 HTML 文件中引用，他所能知道的仅仅是按照他当前的样式表文件来引用外部图片** ，否则不同的页面引用相同的外部样式，那么就完全无法预知图片的位置。（P97）

**提示：url 和开始括号 `(` 之间不能有空格，否则将导致整个声明都无效**

# 第五章：字体

字体系列：

它们并不是指定一种字体，而是指一类字体，这类字体有它们自己的共性：

- Serif：有上下短线
- Sans-serif：没有上下短线，感觉就像中文的黑体
- Monospace：字符间距相同，如 i 和 m 所占用的宽度一样
- Cursive：书上说是该字体试图模仿人的手写体，在 mac 上测试，和 Serif 没有什么差别，只是字体宽度要大一点。
- Fantasy：这一类字体无法用任何特征来定义

使用 `font-family` 指定字体顺序的时候，如果字体名带有空格和符号，应包含在引号内，通用字体系列名不能加引号，否则会被当做特定的字体而非字体系列对待。

字体加粗：

字体的粗细度从 100 ~ 900，梯度为 100，分别对应字体粗细的 9 个等级。但是一般字体可能只实现了其中的部分粗细等级，而没有完全实现 9 个等级，所以浏览器就会对它们进行映射：根据字体实现了的等级进行划分，`normal` 对应 400，`bold` 对应 700，**而 `bolder` 首先获取从父级继承的 `font-weight` 的值，然后取下一个对应的能看出加粗效果的等级，但无论如何都超不过 900** ，即便是计算下来的结果超过了 900 也会被替代为 900，因为它已经是最粗的等级，如果没有更粗的等级，则取下一级，如 700 已经达到该字体最粗等级，那么 `bolder` 将会是 800，`lighter` 与 `bolder` 相反。（具体规则参考 P107）

字体大小：

类似于 `bolder` `lighter`，字体大小也有 `larger` `smaller`，另外字体大小还有7个绝对大小关键字：`xx-small` `x-small` `small` `medium` `large` `x-large` `xx-large`，这些关键字并没有明确的定义，而是相对来定义的。另外，字体大小并没有限制，`larger` 完全可以大于 `xx-large`，这很明显，因为我们可以通过像素值来将字体指定为任意我们希望的值，Chrome 将最小值限制为 12px（可借助 CSS 的 transform 缩放将字体缩小到 12px 以下），其他浏览器则可能没有这种限制。

百分数值总是根据从父元素继承的大小来计算的，并且 **继承的值是计算过后得到的值，而非百分数值**，例如父元素是 24px，当前元素如果是 80% 那么就是 `24 * 80%` 得到 19.2px，它的子元素如果也是 80 % 那么得到的可能是 `19.2 * 80%` 也可能是 `19 * 80%`，这取决于不同的浏览器实现。

`font` 的声明必须包含 `font-size` 和 `font-family`，并且 font-size 必须在前面，font 规则的前三个属性（`font-style` `font-variant` `font-weight`）位置可以采用任意顺序。font 可以指定行高 `line-height`，它和 font-size 合并写在一起，并使用 `/` 分隔，并且 font-size 必须在前面。（个人建议如果不清楚 font 的规则应尽量避免直接使用 font）

一个 font 的例子：

```css
h2 { font: bold italic 200%/1.2 Verdana, Helvetica, Arial, sans-serif; }
```
