## 盒模型

- 不会影响 padding 的情况：

  > > 如果盒子没有指定 width 和 height，则 padding 不会撑开盒子大小

- 嵌套块元素垂直外边距塌陷、合并后会使用最大外边距，可通过以下方式解决：

  - 父元素设置 border
  - 父元素设置 padding
  - 父元素设置 overflow: hidden
  - 另外，浮动、固定、绝对定位的盒子不会有塌陷问题

- 浮动元素

  - 脱离标准流，不再保留原位置（浮动元素只影响其后面元素的排版）
  - 一行显示并且顶部对齐
  - 具有 inline-block 特性，iu 此之外元素添加 absolute 和 fixed 定位也会呈现 inline-block 特性
  - 浮动元素只会压住地下的盒子，不会压住盒子中的文字，因为浮动最初的目的就是为了实现文字的环绕效果（如环绕在图片周围）

- 清除浮动

  - 父元素添加 overflow，如 hidden, auto, scroll
  - 在父元素最后添加一个 clear: both 的块元素，也可以使用 :after 伪元素，但该元素必须为块元素。

- z-index

  - 只有定位盒子有 z-index，标准流和浮动元素没有！

- vertical-align:

  - 行内块元素默认和文字基线对齐（块元素不会有这个问题。因此如果给图片加个外层 div，图片与 div 下边缘有空白缝隙，解决方案：1，设置图片的 vertical-align 为 top、middle、bottom 都可以；2，将图片转换为块元素）

- position:

  - 定位元素会压住非定位元素。即在正常文档流中，如果同级元素压住了另一个元素，只需要设置其中某个元素的 position 定位即可在 z 轴高于另一个元素。（默认 z 轴是后来者居上，如果其它条件相同，则后面的元素默认会压住前面的元素）
  - fixed 盒子应该要有宽度

- filter: CSS3 滤镜

  - blur(5px): 图片模糊处理，数值越大模糊越明显

- calc: 计算

  - calc(100% - 30px): 比父元素宽度小 30 px

- transform：多个转换可以写在一起用空格分开，但是有先后顺序，最好是将位移放在旋转前面，否则旋转改变了坐标系将会导致位移错位
  - translate(x, y)：当 x 或 y 是百分比时，其相对于盒子自身的宽高。另外对于行内元素该属性无效
  - rotate(10deg)：旋转度数，正数表示顺时针，负数表示逆时针。可以通过 transform-origin 设置旋转的中心点
  - scale(x, y)：如果 x 和 y 是一样，可以只写一个。另外也可以通过 transform-origin 设置变化原点

### 居中

#### 水平居中：

- 行内元素： text-align: center
- 块元素：
  - 首先指定 width
  - 其次指定左右 margin 为 auto

### 移动端

- 禁用长按弹出来菜单：

```css
img,
a {
  -webkit-touch-callout: none;
}
```

- 禁用点击背景高亮

```css
a {
  -webkit-tap-highlight-color: transparent;
}
```

- 在 IOS 需要给按钮或者输入框自定义样式

```css
 {
  -webkit-appearance: none;
}
```

### Flex 布局

- 父元素设置 display: flex 之后，子元素的 float、vertical-align、clear 都将失效
- align-content 用于侧轴出现换行的情况（单行无效）。其效果类似于 justify-content，但它用于侧轴
- align-self 用于控制单个元素自己在侧轴上的对齐方式，其用于覆盖 align-items 属性
- order 用于调整元素顺序，默认为 0，可以为负数

### BFC

Block Formatting Context： 块级格式化上下文

它会形成独立的渲染区域，内外不相互影响。

触发条件：

- float 元素
- position 为 absolute 或 fixed 的定位元素
- display 为 flow-root, inline-block、flex、table-cell 等 （还有其它具有类似 inline-block 的属性，不一一列举）
- overflow 不为 visible
- contain 为 layout、content、paint 的元素
- 多列容器（元素的 column-count 或者 column-width 不为 auto，包括 column-count 为 1）
- HTML 元素

作用：

- 包含内部浮动：清除浮动
- 排除外部浮动：阻止元素被浮动元素覆盖：如两个 div，第一个浮动，则第二个会有部分被第一个覆盖。如果给第二个 div 设置 overflow: hidden 触发其 BFC 则不会被第一个浮动的 div 重叠覆盖，两者会独立开。
- 避免外边距重叠

参考：

- [BFC](https://www.bilibili.com/video/BV1aZ4y1M7gW?spm_id_from=333.337.search-card.all.click)
- [BFC MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Block_formatting_context)
