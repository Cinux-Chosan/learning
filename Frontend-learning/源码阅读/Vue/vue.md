## Src/Core

### instance.js

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
```

一开始 Vue 会检测是否通过 new 操作符来创建 Vue 对象，如果不是会给出提示，否则执行初始化操作。

------

## Functions

### defineReactive

#### 函数签名：

```ts
defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) : void
```

#### 作用：

将对象 obj 上的指定属性 key 转换成 `getter`/`setter` 的访问器属性。

------

### observe

#### 函数签名

```ts
observe (value: any, asRootData: ?boolean): Observer | void
```

#### 作用

为 `value` 创建一个 `Observer` 实例。并返回该 `Observer` 实例。要求 `value` 是一个非 `VNode` 和 `null` 的 `object`。

## Classes

### Observer

`Observer` 类会遍历所传入的对象或数组的所有属性并全部（使用 `defineReactive()`）转换成 `getter` 或 `setter` 的方式。

在 `getter` 中添加了收集依赖的逻辑，在 `setter` 中添加了通知依赖更新的逻辑。

### Watcher

### Dep

`Dep` 用于管理依赖，可以向它添加或删除依赖，也可以用它来通知依赖执行更新操作。