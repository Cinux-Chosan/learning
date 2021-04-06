

- 框架会强制根组件铺满屏幕
- StatefulWidget 和 State 分离，因为每次调用 `build()` 时 StatefulWidget 都会创建，它只是代表当前状态的 UI 展示，是一个临时对象。State 则是一个持久对象，并不会因为每次 `build()` 而重新创建
- 重新创建组件非常轻量，因为框架会比较前后两个组件的不同，并只在 [`RenderObject`](https://api.flutter.dev/flutter/rendering/RenderObject-class.html)中替换不同的地方
- 可以调用 `setState()` 来修改状态，`setState()` 将 widget 标记为 dirty 并将组建放入需要 rebuild 的任务中，rebuild 会在下次更新屏幕时执行。`build()` 会在每次 `setState()` 之后下一次更新屏幕被调用。
- 组件首次渲染的时候会调用 [`createState()`](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html#createState) 方法创建一个全新的 State 实例
- State 可以通过 widget 属性访问 StatefulWidget 对象，从而可以访问其从父级获得的数据。
- 可以覆盖 `didUpdateWidget()` 方法来在 widget 属性发生改变时获得通知，它会收到 oldWidget 作为参数，你可以与当前 widget 比较不同

## 响应 widget 生命周期

当调用 StatefulWidget 的 createState() 之后，框架会插入新的 state 对象到树中，然后调用 state 对象的 initState() 方法。State 类的子类可以覆盖 initState 来执行仅需要执行一次的操作，例如配置动画、订阅平台服务。实现 initState 需要在内部首先调用 super.initState

当不在需要 state 对象的时候，框架会调用 state 的 dispose() 方法。覆盖 dispose 方法可以执行一些扫尾工作，如取消定时器、取消订阅平台服务等。实现 dispose 方法需要在结束的时候调用 super.dispose

更多信息参考 [State](https://api.flutter.dev/flutter/widgets/State-class.html)

## Key

和 React 一样，key 用于新旧组件之间的 diff。当 key 和 runtimeType 都相同时才认为两个 widget 相同。参考[key](https://api.flutter.dev/flutter/foundation/Key-class.html)

## Global keys

local key 只需要兄弟之间不同，global key 需要全局不同，因为他们用于区分子组件，还会用于 state 和 widget 关联。参考[GlobalKey](https://api.flutter.dev/flutter/widgets/GlobalKey-class.html)