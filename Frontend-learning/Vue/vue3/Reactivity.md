## Reactivity in Depth

## Reactivity Fundamentals

使用 reactive 函数来将 JavaScript 对象转换成响应式的。

```js
import { reactive } from "vue";

// reactive state
const state = reactive({
  count: 0,
});
```

`reactive` 等价于 Vue 2.x 中的 `Vue.observable`。其返回值是一个响应式对象。这种响应式转换是深度转换的 —— 即嵌套在传入对象中的子对象也会被转换。

组件中的 `data()` 返回的对象也会通过 `reactive()` 转换。

### Creating Standalone Reactive Values as `refs`

假如我们想把一个原始值（假设是一个字符串）转换为响应式的，我们可以创建一个对象，这个对象只有一个属性，那就是我们的原始值，然后我们将这个对象传递给 reactive。但是在 Vue 中有一个方法来完成这件事情 —— `ref`：

```js
import { ref } from "vue";

const count = ref(0);
```

`ref` 会返回一个响应式对象，该对象作为其内部值的响应式引用 —— 该对象内部只有一个 `value` 属性：

```js
import { ref } from "vue";

const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

### Ref Unwrapping

在 template 中访问 ref 会自动将其内部的值解开。因此在 template 我们没有必要自己使用 `.value` 来访问。

```js
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count
      }
    }
  }
</script>
```

### Access in Reactive Objects

当一个 ref 作为 reactive 对象的属性被访问或者修改时，也会自动解开其内部的值，因此就像普通用法一样：

```js
const count = ref(0);
const state = reactive({
  count,
});

console.log(state.count); // 0

state.count = 1;
console.log(count.value); // 1
```

自动解开 ref 内部值的操作仅仅发生在其作为 reactive 对象内部属性的情况下。当通过数组或者像 Map 这样的原生集合类型来访问 ref 也不会自动解开内部值：

```js
const books = reactive([ref("Vue 3 Guide")]);
// need .value here
console.log(books[0].value);

const map = reactive(new Map([["count", ref(0)]]));
// need .value here
console.log(map.get("count").value);
```

### Destructuring Reactive State

当我们只想使用一个大对象中的某几个属性时，通常我们会使用 ES6 的解构来完成：

```js
import { reactive } from "vue";

const book = reactive({
  author: "Vue Team",
  year: "2020",
  title: "Vue 3 Guide",
  description: "You are reading this book right now ;)",
  price: "free",
});

let { author, title } = book;
```

但很不幸的是，这种方式会使得属性的响应式丢失。因此为了保留字段的响应式，我们需要将响应式对象转换成一组 ref 的集合。该 ref 的集合中保留了和源对象的响应式关联：

```js
import { reactive, toRefs } from "vue";

const book = reactive({
  author: "Vue Team",
  year: "2020",
  title: "Vue 3 Guide",
  description: "You are reading this book right now ;)",
  price: "free",
});

let { author, title } = toRefs(book);

title.value = "Vue 3 Detailed Guide"; // we need to use .value as title is a ref now
console.log(book.title); // 'Vue 3 Detailed Guide'
```

### Prevent Mutating Reactive Objects with `readonly`

有些时候我们只是希望追踪响应式对象（ref 或者 reactive）的改变但是并不希望对它门进行修改。例如我们有一个 provide 响应式对象，我们希望阻止在 inject 的地方修改它，因此我们需要将它转换成只读对象：

```js
import { reactive, readonly } from "vue";

const original = reactive({ count: 0 });

const copy = readonly(original);

// mutating original will trigger watchers relying on the copy
original.count++;

// mutating the copy will fail and result in a warning
copy.count++; // warning: "Set operation on key 'count' failed: target is readonly."
```

## Computed and Watch

### Computed values

我们可以使用 computed 函数来直接创建计算属性，它接收一个 getter 函数并返回一个不可修改的基于 getter 返回值的 reactive ref 对象。

```js
const count = ref(1);
const plusOne = computed(() => count.value + 1);

console.log(plusOne.value); // 2

plusOne.value++; // error
```

或者，传入一个包含 get 和 set 方法的对象来创建一个可以修改的 ref 对象：

```js
const count = ref(1);
const plusOne = computed({
  get: () => count.value + 1,
  set: (val) => {
    count.value = val - 1;
  },
});

plusOne.value = 1;
console.log(count.value); // 0
```

### watchEffect

使用 watchEffect 可以基于 reactive 对象自动应用和重新执行 side effect。它会立即执行传入的函数并收集依赖，在依赖发生改变的时候自动重新执行函数：

```js
const count = ref(0);

watchEffect(() => console.log(count.value));
// -> logs 0

setTimeout(() => {
  count.value++;
  // -> logs 1
}, 100);
```

### Stopping the Watcher

当在组件的 setup 方法或者生命周期钩子中调用 watchEffect 时，watcher 会和组件的生命周期关联在一起，并在组件卸载的时候自动停止观察。

其他情况下，它返回一个函数用于显式停止观察：

```js
const stop = watchEffect(() => {
  /* ... */
});

// later
stop();
```

### Side Effect Invalidation

有时候观察的 effect 函数会执行一些异步 effect，当它们失效的时候应该被清理（如在 effect 完成之前状态发生了变化使得该 effect 继续执行下去也没有任何意义，这时候就需要清除该 effect）。effect 函数接收一个 `onInvalidate` 函数，它可以用来注册一个 "取消" 回调函数。这个回调函数在以下情况会被调用：

- effect 重新执行时
- watcher 被停止时（如当组件卸载并且 watchEffect 是在 setup 或其他生命周期钩子中调用时）

```js
watchEffect((onInvalidate) => {
  const token = performAsyncOperation(id.value);
  onInvalidate(() => {
    // id has changed or watcher is stopped.
    // invalidate previously pending async operation
    token.cancel();
  });
});
```

我们通过传入 invalidation 来注册回调函数的方式而非从函数中返回它，这是因为 watchEffect 参数中函数的返回值对异步错误处理非常重要。当 effect 函数需要获取数据的情况下通常会被写成异步函数的形式：

```js
const data = ref(null);
watchEffect(async (onInvalidate) => {
  onInvalidate(() => {
    /* ... */
  }); // we register cleanup function before Promise resolves
  data.value = await fetchData(props.id);
});
```

异步函数隐式返回一个 Promise，但是清理操作需要在 Promise resolve 之前立即被注册上。此外，Vue 还基于返回的 Promise 来自动处理错误情况。

### Effect Flush Timing

Vue 的响应式系统将无效 effect 缓存起来并在之后异步一次性执行它们，这样做是为了避免在同一 tick 对状态进行多次修改造成不必要的重复执行。

但是在内部，组件的 `update` 函数也是一个 effect 函数。当用户的 effect 加入队列后，默认情况下会优先于所有组件的 update effect 执行：

```js
<template>
  <div>{{ count }}</div>
</template>

<script>
  export default {
    setup() {
      const count = ref(0)

      watchEffect(() => {
        console.log(count.value)
      })

      return {
        count
      }
    }
  }
</script>
```

在这个例子中：

- count 会在初始化的时候同步打印
- 当 `count` 发生改变，回调函数会在组件更新之前被调用

如果希望 watch effect 在组件更新之后被调用，需要传递一个配置项 `flush`（默认为 `pre`）：

```js
// fire after component updates so you can access the updated DOM
// Note: this will also defer the initial run of the effect until the
// component's first render is finished.
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: "post",
  }
);
```

`flush` 选项也接收 `sync`，该选项会强制 effect 同步执行。但这样效率不高，不要过多使用。

### Watcher Debugging

`onTrack` 和 `onTrigger` 选项可以用来调试 watcher 的行为：

- `onTrack` 在响应式属性或者 ref 作为依赖被追踪时调用
- `onTrigger` 会在依赖发生改变并调用 watcher 回调函数时调用

两个回调函数都会接收一个 debugger 事件，该事件对象包含依赖项信息。

```js
watchEffect(
  () => {
    /* side effect */
  },
  {
    onTrigger(e) {
      debugger;
    },
  }
);
```

`onTrack` 和 `onTrigger` 仅会在开发模式下生效

### `watch`

`watch` API 和组件的 watch 属性一样。`watch` 函数将特定的数据源作为观察对象，并应用于单独的回调函数中。默认情况下也是 `lazy` 模式 —— 即回调函数只会在被观测的数据源发生改变时调用。

- 与 watchEffect 相比，watch 允许我们：
  - 以 `lazy` （惰性）方式执行 effect
  - 更具体的控制什么样的状态才可以重新执行 watcher
  - 可以分别获取到改变前后的值

### Watching a Single Source

watch 的数据源可以是一个具有返回值的 getter 函数或者直接是一个 ref：

```js
// watching a getter
const state = reactive({ count: 0 });
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
);

// directly watching a ref
const count = ref(0);
watch(count, (count, prevCount) => {
  /* ... */
});
```

### Watching Multiple Sources

可以使用数组来同时观察多个数据源：

```js
const firstName = ref("");
const lastName = ref("");

watch([firstName, lastName], (newValues, prevValues) => {
  console.log(newValues, prevValues);
});

firstName.value = "John"; // logs: ["John",""] ["", ""]
lastName.value = "Smith"; // logs: ["John", "Smith"] ["John", ""]
```

### Shared Behavior with watchEffect

`watch` 在停止观察、无效化（`onInvalidate` 作为第三个参数传入）、刷新缓冲区（执行）和调试方面都与 `watchEffect` 行为一致。
