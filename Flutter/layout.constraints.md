## Understanding constraints

            原则：Constraints go down. Sizes go up. Parent sets position.

- 组件的约束从其父级获得，约束就是 4 个 double 值：最大高度、最小高度、最大宽度、最小宽度
- 组件一个一个的告诉其子元素它们应该满足的约束，并让子元素反馈自己的大小
- 然后组件在水平和垂直方向上一个一个的定位其子元素的位置
- 最后，组件将自己的大小反馈给它的父级


因此会出现一些限制：

- 组件只能在父级给定的约束内决定自身大小，因此并不是任意大小都能够满足
- 组件无法知道自身的位置。它在屏幕中的位置由其父级决定
- 由于组件也依赖于其父级，因此必须要知道整棵树才能定位到每个界定的大小和位置
- 组件的大小如果超出了父级给定的条件，则通常会被忽略。

----
## Tight vs. loose constraints

- loose（宽松）约束：当一个组件允许其子元素小于某个特定大小时，我们称该组件提供 loose constraints。
- tight（严格）约束：当一个组件强制子元素为特定大小时，我们称该组件提供 tight constraints。如 `SizedBox.expand`


tight 约束只有一种可能，那就是最大宽度等于最小宽度，最大高度等于最小高度，如果查看 `box.dart` 中关于 `BoxConstraints` 的定义，你会发现：
```dart
BoxConstraints.tight(Size size)
   : minWidth = size.width,
     maxWidth = size.width,
     minHeight = size.height,
     maxHeight = size.height;
```

loose 约束只设置最大宽度和最大高度，但是可以使组件任意小，换句话说， loose 约束最小宽高为 0：

```dart
BoxConstraints.loose(Size size)
   : minWidth = 0.0,
     maxWidth = size.width,
     minHeight = 0.0,
     maxHeight = size.height;
```
  
----


- Container: 如果没有子元素，则会尽可能大。如果有子元素，则大小同子元素大小，但最大不会超过其父级给定的约束。
- Center: 将子元素居中，并使得子元素可以是任意大小，超出部分会被忽略，Center 将父级传递过来的 tight 约束转换为 loose 约束并传递给子节点。
- ConstrainedBox: 继承父级约束，并添加除了从父级继承之外的其它约束。它不能覆盖父级同名的约束。
- UnconstrainedBox: 移除父级传递过来的约束，并使得子元素可以是任意大小，如果子元素大小溢出，则会在边缘显示黄黑斜线，如果移除了父级约束但是子元素需要无穷大，则会报错
- OverflowBox: child 大小超出之后不会显示提醒。它只能展示它自己能够展示的大小
- LimitedBox: 在其父级不施加约束时其效果，它将用自己的约束对子组件进行约束，如果父级本身有施加约束，则它不起任何效果
- FittedBox: 将内容缩放到父级给定的约束宽度内，如果内容未达到父级宽度则它等于内容宽度，如果内容超出父级宽度则会缩放以刚好满足父级给定的宽度约束。由于存在缩放，因此内容不能是无限大，无限大的内容无法缩放到指定宽度。
- Expanded: 强制子元素宽度和自身一样
- Flexible: 允许子元素宽度小于自身，如 [Example 27](https://flutter.dev/docs/development/ui/layout/constraints)，右边的 `Goodbye!` 没有撑满该 `Flexible`，如果是 `Expanded` 则会强制它撑满自身。这就是 Flexible 和 Expanded 唯一的不同

---

## Dealing with box constraints

在 flutter 中，widget 通过底层的 RenderBox 对象进行渲染。Render box 从父级获得约束，并在约束范围内调整自身大小。约束由最大最小宽高组成。大小则是指特定的宽高。

通常，根据如何处理约束可以分成三种 box：

- 尽可能大：例如 [Center](https://api.flutter.dev/flutter/widgets/Center-class.html)、[ListView](https://api.flutter.dev/flutter/widgets/ListView-class.html) 的 Render box
- 尽可能和子元素一样大小：例如 [Transform](https://api.flutter.dev/flutter/widgets/Transform-class.html)、[Opacity](https://api.flutter.dev/flutter/widgets/Opacity-class.html) 的 Render box
- 特定大小：例如 [Image](https://api.flutter.dev/flutter/dart-ui/Image-class.html) 和 [Text](https://api.flutter.dev/flutter/widgets/Text-class.html)

### 无限制约束 Unbounded constraints

某些特殊情况下，给定 box 的约束是无边界的（unbounded or infinite），这意味着最大宽高都是 `double.INFINITY`。

一个本身就尽可能大的 box 如果给与 unbounded 约束是没什么用的。并且在调试模式下会报错。

大多数 render box 为 unbounded 约束的情况发生在 flex box （Row 和 Column）以及 可滚动区域（ListView 或者其他 SrollView 的子类）中。

特别是 ListView 会在交叉轴上尽可能的扩展空间。如果将一个垂直方向上的 ListView 嵌套在一个水平方向上的 ListView 中，则内部的 ListView 会尽可能的宽，因为外部的 ListView 可以在该方向上滚动，因此认为是无限宽，会导致报错。

### Flex

Flex 盒子本身（Row 和 Column）的行为会基于它们在给定方向上是有界约束还是无界约束而有所不同。

在有界约束中，它们会尝试在该方向上尽可能宽。

在无界约束中，他们会在该方向尽可能尝试和子元素一样宽。这种情况你只能将子元素的 flex 设置为 0（默认也是 0）。这也意味着你不能在一个嵌套在另一个 flex box 或者 scrollable 元素中的 flex box 中使用 Expanded，否则会得到错误。

在交叉方向上，例如 Column 的水平 flex 或者 Row 的垂直 flex 上，永远不要是无界约束，否则他们无法合理的布局子元素。


### 总结

ListView 会在交叉轴上尽可能占用更多空间，即水平 ListView 会在垂直方向上占用更多空间，垂直 ListView 会在水平方向上占用更多空间。

Flex 盒子在有约束的情况下会在其主方向上尽可能宽，如 Row 会在水平方向上尽可能宽，Column 会在垂直方向上尽可能宽。但在无约束的情况下，它默认会收缩到子元素的大小，此时由于没有约束，不能使用 flex 为 **非0** 的Expanded，因为它会占用尽可能多的可用空间，由于本身 flex 处在无约束情况下，因此会占用无穷空间，这样会报错。