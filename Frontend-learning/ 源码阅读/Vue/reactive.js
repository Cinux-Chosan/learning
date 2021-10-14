class Vue {
  constructor(options) {
    this.$options = options;
    initData(this);
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
    this.subs.forEach((sub) => sub.update());
  }
}

class Watcher {
  constructor(vm, prop, cb) {
    this.vm = vm;
    this.getter = () => prop.split(".").reduce((o, k) => o[k], vm);
    this.cb = cb;
    this.get();
  }

  get() {
    Dep.target = this;
    this.getter();
    Dep.target = null;
  }

  update() {
    this.cb();
  }
}

function initData(vm) {
  const options = vm.$options;
  const data = (vm._data = options.data());
  proxy(vm, "_data"); // 为了能够直接通过 vue 实例访问属性，我们需要将 vm._data 中的字段逐个代理到 vue 实例上，因此使用 proxy 进行数据代理，但这一步与响应式的实现并没有必然关系
  observe(data);
}

function observe(obj) {
  if (!isObject(obj)) return;

  // 添加对数组的处理
  if (Array.isArray(obj)) {
    obj.__proto__ = arrayMethods;
    observeArray(obj);
  } else {
    for (let k in obj) {
      const value = obj[k];
      // value 可能是嵌套对象，因此也需要 observe 一下
      observe(value);
      defineReactive(obj, k, value);
    }
  }
}

function observeArray(items) {
  for (let i = 0; i < items.length; i++) {
    observe(items[i]);
  }
}

function defineReactive(obj, key, value) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      mountDep(value, dep);
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

function mountDep(o, dep) {
  o.__dep__ = o.__dep__ || dep;
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

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}
// 数组

const arrayMethods = Object.create(Array.prototype);
const methodsToPatch = ["push", "pop", "shift", "unshift", "splice", "sort", "reverse"];

methodsToPatch.forEach((method) => {
  arrayMethods[method] = function mutator(...args) {
    const original = arrayMethods.__proto__[method];
    const result = original.apply(this, args);
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    if (inserted) observeArray(inserted);
    // 通知数组依赖
    notifyArrayDeps(this);
    return result;
  };
});

function observeArray(items) {
  for (let i = 0; i < items.length; i++) {
    observe(items[i]);
  }
}

function notifyArrayDeps(array) {
  array.__dep__?.notify();
}

// ---------- 测试 ----------

const comp = new Vue({
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

const watcher1 = new Watcher(comp, 'firstName', () => console.log(`firstNae 发生了变化，最新值为${comp.firstName}，我可以在这里更新 DOM`))
const watcher2 = new Watcher(comp, 'firstName', () => console.log(`firstNae 发生了变化，最新值为${comp.firstName}，我可以在这里更新 DOM`))
comp.firstName = 'Sanfeng';
const watcher3 = new Watcher(comp, 'otherInfo.hometown', () => console.log(`otherInfo.hometown 发生了变化，最新值为${comp.otherInfo.hometown}，我可以在这里更新 DOM`))
comp.otherInfo = { street: 'xx street' };
const watcher4 = new Watcher(comp, 'otherInfo.street', () => console.log(`otherInfo.street 发生了变化，最新值为${comp.otherInfo.street}，我可以在这里更新 DOM`))
comp.otherInfo.street = 'Wall Street';
const watcher5 = new Watcher(comp, 'hobbies', () => console.log(`hobbies 发生了改变`));
comp.hobbies.push("music");
comp.hobbies = [];