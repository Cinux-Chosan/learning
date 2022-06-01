# Vue3 Reactive

```js
const o = reactive({
  num: 0,
});

effect(() => o.num);
```

这段代码中，需要让 `effect` 中的函数能够响应 `o.num` 的变化，就需要把该函数加入到 `o.num` 的依赖中，大致思路如下：

- 执行一次传给 `effect` 的函数，函数执行时就会去获取 `o.num` 值，从而触发 `o.num` 的依赖搜集
- 因此我们需要拦截 `o.num` 的访问器，一般是在 `getter` 或者 `Proxy#get` 中
- 搜集依赖的时候需要从某个位置拿到传给 `effect` 的函数（具体怎么拿都随你，只要能让访问 `o.num` 的时候能够获取到该函数就行，如果你愿意，你甚至可以将它挂载到全局，但是使用模块局部变量是一种更好的选择），将该函数放到 `o.num` 的依赖中去
- 当修改 `o.num` 值的时候（一般是 `setter` 或者 `Proxy#set`），触发依赖函数执行

```js
// 一个精简版的 reactive 实现，为了更加简单，没有重置 effectFn 或者使用栈来实现
// 由于所有代码在一起，执行 effect 函数时会用到 effectFn，但是为了逻辑的一致性，将 effectFn 放在后面，使用 setTimeout 保证 effectFn 和 targetMap 已经已经初始化
setTimeout(() => {
  // 1.
  const o = (window["o"] = reactive({
    num: 0,
  }));

  // 2.
  effect(() => console.log(`num changed to: ${o.num}`));

  // 7.
  o.num++;
});

// 实际上为了解决嵌套等问题，effectFn 应该采用栈结构，这里只是为了精简演示代码
let effectFn;
const targetMap = new Map();

function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      // 4. 搜集依赖
      track(target, key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);

      // 8. 触发更新
      trigger(target, key);
      return result;
    },
  });
}

function effect(fn) {
  // 3.
  effectFn = fn;
  // 执行一遍，触发依赖搜集
  fn();
}

function track(target, key) {
  // 5. 通过 target 和 key 这种层级解构找到 target.key 这个属性的依赖
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }
  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }

  // 6. 添加依赖函数 effectFn 到 target.key 的依赖集合中
  dep.add(effectFn);
}

function trigger(target, key) {
  const dep = targetMap.get(target).get(key);
  for (const fn of dep) {
    // 9. 触发依赖函数执行
    fn();
  }
}
```

在 Vue3 中，对象直接使用 reactive，其内部使用 Proxy 进行属性劫持。对于普通类型的属性使用 ref 对其进行包裹（如果是对象则会自动调用 reactive 对其进行包装一层），ref 内部实现是 `RefImpl` 类，不过它也主要是基于 effect 来进行依赖搜集。

`RefImpl`：内部包含了 `get value() {...}` 和 `set value(v) { ... }` 调用 effect 进行依赖劫持，因此对于 ref 我们一般要使用 `someRef.value` 的方式来获取值

`ComputedImpl` 也是在内部包含了 `get value() { ... }` 和 `set value(v) { ... }` 调用 effect 进行依赖劫持，其中有一个 `_dirty` 参数表示是否需要重新计算最新值，只不过使用 `scheduler` 来修改 `_dirty` 进行 `懒` 计算。

## 几个问题：

### 依赖保存在哪里，怎么保存的？

在 Vue 源码中，使用 `WeakMap` 数据结构 [`targetMap`](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/reactivity/src/effect.ts#L19) 来集中保存所有元素的依赖，其保存的数据格式如下：

```js
// {} 在源码中为 Map 或 WeakMap 结构，[] 在源码中为 Set 结构
{
  [target]: {
    [key]: [ ... ]
  }
}
```

---

疑问： 源码 [这个地方](https://github.com/vuejs/core/blob/3538f17a07d586a363cffa00af7cd220aff79710/packages/reactivity/src/ref.ts#L33) 的 `activeEffect` 只是其它模块的一个变量，应该永远都是 `import` 时候的值啊 ... 如果一开始为 `undefined` 那永远都是 `undefined` 吧

## `h` 和 `render`

`h` 负责创建 VNode，`render` 负责将 VNode 转换成 DOM

- `h(type, propsOrChildren, chilren): VNode;`
- `render(vnode: VNode | null, container: HostElement, isSVG?: boolean ): void`
