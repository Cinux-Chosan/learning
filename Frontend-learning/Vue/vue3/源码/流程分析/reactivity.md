# Vue3 Reactivity 流程分析

## track 流程分析

```ts
// track 签名
function track(target: object, type: TrackOpTypes, key: unknown): void;

// 键名为属性名称，值为其依赖集合
type KeyToDepMap = Map<any, Dep>;
// 保存所有依赖关系的 weakmap，它的键是原始对象值，值是该对象上所有按属性名归类的依赖集合
const targetMap = new WeakMap<any, KeyToDepMap>();
```

依赖搜集简明流程：

- 调用 `effect` 方法，并传入一个监听函数
- `effect` 将监听函数包装到 `ReactiveEffect` 实例中，并调用 `ReactiveEffect` 实例的 `run` 方法
- `ReactiveEffect` 实例的 `run` 方法会将 `this` 赋值给模块全局变量 `activeEffect`，然后在 `run` 内部调用传入给 `effect` 的方法并返回其结果
- `effect` 传入的方法内部会去访问响应式对象上的属性，由于响应式对象已经通过 `Proxy` 进行了包装，其 `get` 方法会被触发并调用 `track` 方法进行依赖搜集
- `track` 内部会从全局依赖中查找源对象对应字段的依赖集合，并将 `activeEffect` 上的 `ReactiveEffect` 实例 push 到字段自己的依赖集合中，从而完成了对象对应字段的依赖搜集

```js
const data = reactive({ name: 1 });
// 内部会同步立即执行回调函数，从而触发依赖搜集（调用之前会创建一个 ReactiveEffect 实例并设置到 activeEffect 上，依赖搜集就从 activeEffect 上获取）
effect(() => console.log(data.name));
```

触发依赖简明流程：

- 当响应式对象上的字段被修改时，触发对应字段的 `set` 方法，该方法内部会调用 `trigger` 去触发对应字段的依赖
- `trigger` 内部会从保存依赖关系的 `targetMap` 中获取源对象对应字段的依赖集合，并逐个调用依赖
