# Understanding constraints

Constraints go down. Sizes go up. Parent sets position.

- 组件从父级那里获得约束。约束就是最大最小宽度，最大最小高度！
- 然后组件也会约束自己的子节点
- 然后组件定位其子节点
- 最后组件会告诉其父节点它自身的大小（在原始约束范围内）

## 限制

Flutter 布局引擎有以下限制规则：
- 一个组件只能在父级给定的约束内决定自身大小，也就意味着组件通常不能是它希望的任意大小。
- 组件不知道也不能决定自己在屏幕中的位置，因为这个是由父级来决定的
- 由于父级的大小和位置反过来也由其父级决定。因此必须要知道整个 tree 才能知道其中组件的大小和位置
- 如果子级想要的大小超出了父级，则它的大小可能被忽略。这和对齐方式有关。

---

- ConstrainedBox：相当于穿透盒子，它只是对父级传下来的约束基础上再加一些约束，然后将约束直接透传给 child，因此其 child 必须满足 ConstrainedBox 的约束，但最重要的时还要满足 ConstrainedBox 父级传下来的约束
- UnconstrainedBox：其子元素可以不受 UnconstrainedBox 的父级约束，但是如果 child 宽度为 double.infinity 则会抛出异常，因为 flutter 并不能渲染无限空间。
- OverflowBox：和 UnconstrainedBox 类似，不同之处在于如果 child 超出其空间，它也不会给与警告
- FittedBox：调整 child 大小以适配空间，如其中有 Text，则 Text 内容多则字体小，内容少则字体变大，但如果不是被要求达到屏幕大小，则它会收缩。