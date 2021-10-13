# Vue 响应式原理

在 Vue 中，当我们修改属性值时，页面会自动更新，这是一个 “_数据驱动_” 的过程，它得益于 Vue 中的一套发布订阅机制。

在 Vue 2.x 中，这套机制是通过 `Object.defineProperty` 来实现的（本章不涉及模板编译）。

实现思路：

1. 当我们修改值时，需要知道哪些地方依赖该值
2. 在值发生变化的时候通知依赖进行更新

以一个最简单的例子为例，假如有如下代码：

```js
const comp = new Vue({
  template: `
    <div>
      Hello, my name is {{ firstName + lastName }}. I am {{age}} years old, and my hobbies is ...
    </div>
  `,
  data() {
    return {
      firstName: "Jianjun",
      lastName: "Zhang",
      age: 18,
      hobbies: ["games", "sports"],
      otherInfo: {
        hometown: 'CQ',
        lang: 'zh-CN'
      }
    };
  },
});
```

针对上面的代码，我们需要如何收集每个变量的依赖呢？其实只需要拿到依赖中的数据，对每个属性使用 `Object.defineProperty` 进行拦截，举个简单的例子，例如要拦截对象上的 `firstName` 属性，我们可以：

```js
const o = {
  firstName: "Jianjun",
};

let firstName = o.firstName;

Object.defineProperty(o, "firstName", {
  get() {
    console.log("正在获取 firstName，可以在这里搜集哪些地方依赖于我");
    return firstName;
  },
  set(newValue) {
    console.log(`正在修改 firstName，新值是 ${newValue}，可以在这里通知我的依赖`);
    firstName = newValue;
  },
});

o.firstName; // 正在获取 firstName，可以在这里搜集哪些地方依赖于我
o.firstName = "Sanfeng"; // 正在修改 firstName，新值是 Sanfeng，可以在这里通知我的依赖
```

为了能让上面的功能更通用，我们将它封装为函数：

```js
function defineReactive(obj, key, value) {
  Object.defineProperty(obj, key, {
    get() {
      console.log(`正在获取 ${key}，可以在这里搜集哪些地方依赖于我`);
      return value;
    },
    set(newValue) {
      console.log(`正在修改 ${key}，新值是 ${newValue}，可以在这里通知我的依赖`);
      value = newValue;
    },
  });
}
```

然后我们可以直接使用 `defineReactive` 来拦截属性：

```js
const o = {
  firstName: "Jianjun",
};
defineReactive(o, "firstName", o.firstName);
o.firstName; // 正在获取 firstName，可以在这里搜集哪些地方依赖于我
o.firstName = "Sanfeng"; // 正在修改 firstName，新值是 Sanfeng，可以在这里通知我的依赖
```

对 Vue 中拦截有了基本的认识，我们放到 Vue 中来实现：

```js
class Vue {
  constructor(options) {
    this.$options = options;
    initData(this);
  }
}

function initData(vm) {
  // ...
}
```

此时，我们需要对 Vue 实例中的数据进行拦截，需要实现 `initData` 函数：

- 获取并保存 `data` 中的值
- 遍历 `data` 中的数据，对每个属性使用 `defineReactive` 进行拦截

```js
function initData(vm) {
  const options = vm.$options;
  const data = (vm._data = options.data());
  proxy(vm, "_data"); // 为了能够直接通过 vue 实例访问属性，我们需要将 vm._data 中的字段逐个代理到 vue 实例上，因此使用 proxy 进行数据代理，但这一步与响应式的实现并没有必然关系

  observe(data);
}

function observe(obj) {
  // ...
}

function proxy(target, sourceKey) {
  for (let key in target[sourceKey]) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get() {
        return target[sourceKey][key];
      },
      set(val) {
        target[sourceKey][key] = val;
      },
    });
  }
}
```

由于 `data` 返回的数据可能嵌套对象，因此会涉及到递归，为了更加通用，所以我们将它的逻辑抽到 `observe` 中来实现：

- 对传入的对象中每个属性调用 `defineReactive` 进行拦截
- 如果某个属性值时对象，则递归调用

```js
function observe(obj) {
  if (!isObject(obj)) return;

  for (let k in obj) {
    const value = obj[k];
    // value 可能是嵌套对象，因此也需要 observe 一下
    observe(value);
    defineReactive(obj, k, value);
  }
}

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
```

此时我们已经对 Vue 中的 `data` 全部进行了拦截，但是并没有完成依赖搜集（我们只是简单的在 `defineReactive` 的 `get` 中打印了一段文字），现在我们来完善依赖搜集的部分，我们需要对 `defineReactive` 进行修改：

- 需要记录所有依赖

为了逻辑更加独立，我们抽象一个 `Dep` 类来专门负责管理依赖。

另外，我们还没有明确什么是依赖，它长什么样子，它是一个回调函数还是什么？不管它是什么，我们也抽象一个 `Watcher` 类来当做依赖，我们假定它有一个 `update` 方法，只要调用这个方法，就说明数据更新了，具体执行什么逻辑，每个 `Watcher` 可以自己管理。

```js
class Watcher {
  update() {
    // 数据有更新
    // ...
  }
}

class Dep {
  constructor() {
    // 保存所有的依赖（即 Watcher 实例）
    this.subs = [];
  }

  addSub(sub) {
    // 避免重复挂载
    if (!this.subs.includes(sub)) {
      this.subs.push(sub);
    }
  }

  // 将自己添加到其它依赖中
  depend() {
    Dep.target?.addDep(this);
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }
}
```

尽管我们目前可以在 `defineReactive` 的 `get` 中搜集对应字段的依赖，但是怎么搜集呢？依赖在哪里呢？

其实当前我们并不知道依赖在哪里，我们只是知道 _“什么时候访问了该属性”_，但是谁访问的，我们并不清楚。

由于 `defineReactive` 和访问者之间都是独立的逻辑，没有任何关系，因此我们需要约定好一条规则：

- 当访问经过 `defineReactive` 处理过后的响应式数据时，需要访问者主动将自己暴露给 `defineReactive` 以便 `defineReactive` 能够清楚知道当前是谁在访问这个属性，从而进行依赖搜集。

这个暴露的过程可以看做是一个属性的挂载，这个挂载点需要 `defineReactive` 和访问者都能访问到。选择 window 这种全局作用域属性肯定是不好的，既然是和依赖相关，我们就将它挂载到 `Dep.target` 属性上。

```js
class Watcher {
  // 假定 prop 是属性路径，如 vm.otherInfo.lang，则 prop 是 'otherInfo.lang'
  // 此处只是演示基本逻辑，不处理数组以及
  constructor(vm, prop, cb) {
    this.vm = vm;
    this.getter = () => prop.split('.').reduce((o, k) => o[k], vm);
    this.cb = cb;
    this.get();
  }

  get () {
    // 将自己挂载到 Dep.target，以便 defineReactive 可以将自己纳入依赖中
    // 但是在真实实现中，由于可能存在嵌套访问的情况，会使用数组保存 target，并在下面的 getter 调用完成之后将当前 target 弹出，并将 Dep.target 设置为数组最后一项
    Dep.target = this;
    // 挂载之后，访问属性则可以将自己加入到该属性依赖中去，即触发依赖搜集
    this.getter();

    Dep.target = null;
  }

  update() {
    // 数据有更新
    // cb 为数据发生变化后的回调函数，因此可以在回调函数中做任意操作，例如修改 DOM
    this.cb();
  }
}
```

修改 `defineReactive`，使其能够搜集和触发依赖：

```js
function defineReactive(obj, key, value) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      // 如果挂载点上有数据，那就将它搜集为依赖
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set(newValue) {
      value = newValue;
      // 由于新值可能是对象，也需要添加响应式。因此执行 observe
      observe(newValue);
      // 通知数据发生变化
      dep.notify();
    },
  });
}
```

至此，我们有了一个 Vue 中响应式的基本模型：

```js
const watcher1 = new Watcher(comp, 'firstName', () => console.log(`firstNae 发生了变化，最新值为${comp.firstName}，我可以在这里更新 DOM`))
const watcher2 = new Watcher(comp, 'firstName', () => console.log(`firstNae 发生了变化，最新值为${comp.firstName}，我可以在这里更新 DOM`))
const watcher3 = new Watcher(comp, 'otherInfo.hometown', () => console.log(`otherInfo.hometown 发生了变化，最新值为${comp.otherInfo.hometown}，我可以在这里更新 DOM`))

comp.firstName = 'Sanfeng'; 
// firstNae 发生了变化，最新值为Sanfeng
// firstNae 发生了变化，最新值为Sanfeng
comp.otherInfo.hometown = 'TL'
// otherInfo.hometown 发生了变化，最新值为TL
```

## 其它说明

- 本文只是一步一步引导并对 Vue 中的响应式做了基本实现，为了简化逻辑，很多对演示无关紧要的特殊情况并未处理，如对同一个对象多次调用 `observe` 等。
- 本文不涉及模板编译，模板编译的内容将在后续推出。
- 暂时由于时间关系未处理数组部分，后期可能会添加，感兴趣的小伙伴可以自己查看源码，大致思路就是拦截数组的几个 `mutation` 方法。
- 完整代码参考[这里](./reactive.js)