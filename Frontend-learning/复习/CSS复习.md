# CSS 复习资料

## Flex

## Grid

参考资料：

- [一文搞懂 grid 布局 和 flex 布局及其区别](https://juejin.cn/post/6940627375537258527)
- ## [谈谈一些有趣的 CSS 题目（三）-- 层叠顺序与堆栈上下文知多少](https://www.cnblogs.com/coco1s/p/5899089.html)
- [不受控制的 position:fixed](https://www.cnblogs.com/coco1s/p/7358830.html)：阐述了在哪些情况下 `position:fixed` 不是相对于视窗进行定位，大致包括（不同浏览器差异很大）：

  - `transform` 属性值不为 `none` 的元素
  - `perspective` 值不为 `none` 的元素（Safari 下不影响）
  - `filter` 值不为 `none` 的元素（Safari 下不影响）
  - 在 `will-change` 中指定了任意 CSS 属性（Safari 下不影响）
  - `contain` 部分属性（layout、paint、content、strict）

- [CSS `contain`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain)：属性允许开发者声明当前元素和它的内容尽可能的独立于 DOM 树的其他部分。这使得浏览器在重新计算布局、样式、绘图、大小或这四项的组合时，只影响到有限的 DOM 区域，而不是整个页面，可以有效改善性能。
- [布局和包含块](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block)
  - 要计算 height top 及 bottom 中的百分值，是通过包含块的 height 的值。如果包含块的 height 值会根据它的内容变化，而且包含块的 position 属性的值被赋予 relative 或 static ，那么，这些值的计算值为 auto。
  - 要计算 width, left, right, padding, margin 这些属性由包含块的 width 属性的值来计算它的百分值。（需要注意，上下 padding、margin 也是基于包含块的 width 来计算，而非 height）
