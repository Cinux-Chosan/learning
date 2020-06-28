# Vue 的响应式原理

Vue 的响应式代码主要在 `src/core/observer` 目录中。其思路大概如下：

`输入一个对象` => `如果对象是数组，则递归每一项；否则遍历该对象的每一个属性` => `将对象上的每个属性转换成 getter/setter 的格式，在 getter 中收集依赖，在 setter 中通知依赖` => `产出对象`

在 Vue 中，抽象出一个类来实现上面所描述的功能，这个类叫 Observer，在上面的每一步会对应到 Observer 中的代码逻辑。简单来说它们的对应关系如下：

- `输入一个对象` => 通过 Observer 构造函数传入这个对象
- `如果对象是数组，则递归每一项；否则遍历该对象的每一个属性`，这里会拆分成如下两个部分：
  - `如果对象是数组，则递归每一项；` => 实际上就是一个遍历操作，并对每一项递归调用 Observer，对应的代码放在 `this.observeArray(value)` 中
  - `否则遍历该对象的每一个属性` => 对应的代码是 `this.walk(value)`
- `将对象上的每个属性转换成 getter/setter 的格式，在 getter 中收集依赖，在 setter 中通知依赖`，这个部分是在 `this.walk(value)` 中调用 `defineReactive` 将单个属性转换成 `getter/setter` 形式的访问器属性
- `产出对象` => 这里并不是说 Observer 会返回该对象，而是经过上面的转换之后，传入的对象就已经被附加了响应式的相关能力。

上面只是一个大概的逻辑，如果你看着如 `this.observeArray(value)` 这样的代码感觉不知所措，那到目前为止你只需要关注文字部分即可，忽略其中的代码就好了。接下来我们从 Observer 开始走一遍。

## Observer

`Observer` 类用于被附加到需要被观察的对象上。它会把它所依附的对象的所有属性转换成 `getter/setter` 的访问器属性，并在 `getter` 中收集依赖，在 `setter` 中通知依赖。

我们先看看源码：

```ts
/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, "__ob__", this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

我们以一个实际的例子来讲解，这个例子的代码如下：

```ts
const data = {
  name: "Chosan",
  children: [
    {
      name: "Mike"
    }
  ]
};
const ob = new Observer(data);
```

参照 Observer 的源码，它做了下面的事情：

- 将 data 保存到 `this.value` 中以便任何时候可能使用到 data 值。
- 创建管理依赖的对象 Dep 的实例，保存在 `this.dep` 中（为了将关注点放到响应式的原理上，因此没有引入对 Dep 的讲解，可以简单理解为是一个数组，专门用来存放用到 data 的那些依赖，方便后续 data 发生变化的时候通知到它们。）
- 将 observer 实例保存到 data 上，方便以后任何时候可能需要直接访问该实例。（此时可以通过 `data.__ob__` 访问到 observer 实例，且可以通过 `ob.value` 访问到 data）
- 由于 data 是对象类型，则直接进入 `this.walk(value)` 分支
  - 在 walk 中循环对每个属性执行 `defineReactive` 进行 `getter/setter` 转换

执行完上面的函数之后，我们会发现 `data` 和 `children` 以及 `children[0]` 都被添加了 `__ob__` 属性（每个 `__ob__` 都是一个 Observer 的实例），并且其每个属性都变成了 `getter/setter` 这种访问器的形式。

目前为止，我们只知道 `defineReactive` 的作用是将属性转换成 `getter/setter`，并在 `getter` 中收集依赖，在 `setter` 中通知依赖该属性值发生了变化，那 `defineReactive` 到底是如何做到的呢，我们接下来就看看它是怎么实现的。

## defineReactive

将对象属性转换为 `getter/setter` 的属性访问器格式。如果属性值为对象或数组，则递归转换。

我先来简单说一下 defineReactive 的思路。

`首先确定好需要转换对象上的哪个字段` => `如果该字段是可配置的，则进入下一步，否则退出` => `获取该属性的 getter/setter，以便后续做函数劫持使用` => `使用函数劫持重新定义 getter/setter` => `Ok，已经具有依赖收集的功能了`

这段逻辑通用和源码有一一对应的关系：

- `首先确定好需要转换对象上的哪个字段` => 通过参数指定需要转换的对象以及一个要转换 `getter/setter` 的字段
- `如果该字段是可配置的，则进入下一步，否则退出` => `if (property && property.configurable === false) { return }`
- `获取该属性的 getter/setter，以便后续做函数劫持使用` =>
  - 获取 `getter` => `const getter = property && property.get`
  - 获取 `setter` => `const setter = property && property.set`
- `使用函数劫持重新定义 getter/setter` => `Object.defineProperty(obj, key, { ... })`

上面是 defineReactive 的核心流程。下面是源码：

```ts
/**
 * Define a reactive property on an Object.
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  let childOb = !shallow && observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)
      dep.notify()
    }
  })
}
```

我们还是以实例来讲解：

```ts
const data = {
  name: "Chosan",
  children: [
    {
      name: "Mike"
    }
  ]
};
defineReactive(data, "name"); // 1
defineReactive(data, "children"); // 2
```

先看 `defineReactive(data, "name")`，它会经历如下步骤：

- 创建依赖管理对象 dep 用于管理 `data.name` 的依赖，和上面一样，你先假定 `dep` 就是一个数组，里面存放了依赖于 `data.name` 的属性
-

## observe

```

```
