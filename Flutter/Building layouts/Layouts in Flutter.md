

- Container 允许你自定义子组件。当你希望添加 padding、margin、border 或者背景颜色等，就可以考虑使用 Container
- 横向布局用 Row，纵向布局用 Column
- 当 layout 超过太大超出设备时，会在超出的边显示黄黑相间的条纹
- 使用 Expanded 可以调整组件大小以适应行和列，如果希望某一项更宽或更窄，可以配合 flex 属性，其默认值是 1

```dart
Row(
  crossAxisAlignment: CrossAxisAlignment.center,
  children: [
    Expanded(
      child: Image.asset('images/pic1.jpg'),
    ),
    Expanded(
      flex: 2, // 2倍宽
      child: Image.asset('images/pic2.jpg'),
    ),
    Expanded(
      child: Image.asset('images/pic3.jpg'),
    ),
  ],
);
```

- 组件打包：默认情况下 Row 或者 Column 会占据主轴上尽可能多的空间，如果你希望子组件更加紧凑，将 mainAxisSize 设置为 MainAxisSize.min

- DefaultTextStyle.merge() 允许将一个默认文本样式用于所有后代组件继承

## 常用布局组件

### 标准组件

- Container：用于添加 padding、margin、border、background color 或者其他装饰
- GridView：将组件布局为可滚动的网格
- ListView：将组件布局为可滚动的列表
- Stack：将组件一个一个重叠

### Material 组件

- Card：将相关信息放到一个 box 中，具有圆角和阴影
- ListTile：将最多三行文本和一个可选的前置Icon和一个可选的后置 Icon 布局到一行