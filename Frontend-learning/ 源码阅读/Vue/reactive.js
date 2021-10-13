class Vue {
  constructor(options) {
    this.$options = options;
    initData(this);
  }
}

const targets = [];

class Watcher {
  constructor(vm, prop, cb) {
    this.vm = vm;
    this.getter = () => prop.split('.').reduce((o, k) => o[k], vm);
    this.cb = cb;
    this.get();
  }

  get() {
    targets.push(this);
    Dep.target = this;
    this.getter();
    targets.pop();
    Dep.target = targets[targets.length - 1];
  }

  update() {
    this.cb();
  }
}

class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach(sub => sub.update());
  }
}

function defineReactive(obj, key, value) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return value;
    },
    set(newValue) {
      value = newValue;
      observe(newValue);
      dep.notify();
    },
  });
}

function observe(obj) {
  if (!isObject(obj)) return;

  for (let k in obj) {
    const value = obj[k];
    observe(value);
    defineReactive(obj, k, value);
  }
}

function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

function initData(vm) {
  const options = vm.$options;
  const data = vm._data = options.data();
  proxy(vm, "_data");
  observe(data);
}

function proxy(target, sourceKey) {
  for (let key in target[sourceKey]) {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: () => target[sourceKey][key],
      set: (val) => target[sourceKey][key] = val
    });
  }
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
const watcher3 = new Watcher(comp, 'otherInfo.hometown', () => console.log(`otherInfo.hometown 发生了变化，最新值为${comp.otherInfo.hometown}，我可以在这里更新 DOM`))
comp.otherInfo = { street: 'xx street' }
const watcher4 = new Watcher(comp, 'otherInfo.street', () => console.log(`otherInfo.street 发生了变化，最新值为${comp.otherInfo.street}，我可以在这里更新 DOM`))