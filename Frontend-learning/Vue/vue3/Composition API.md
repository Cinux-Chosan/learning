## Composition API Introduction

假如我们有这样一个 app：

- 有一个展示用于 repositories 的视图
- 在视图顶部可以搜索和过滤

大概有下面这个结构：

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // using `this.user` to fetch user repositories
    }, // 1
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

它主要拆分成三个功能：

1. 从 API 中获取用户的 repositories，并更新数据和视图
2. 使用 searchQuery 字符串来搜索 repositories
3. 使用 filters 对象来过滤 repositories

### setup

setup 在 props 完成之后，组件创建之前作为 composition API 的入口被执行。

> 由于 setup 执行的时候组件实例还未创建完成，因此不能在 setup 中访问 this，即除了 props，你不能访问组件中声明的其它属性，如：本地数据、计算属性和方法。

setup 是一个接收 props 和 context 的函数。从 setup 中返回的所有东西都将暴露给组件的其它部分使用 —— 计算属性、方法、生命周期钩子等。

```js
// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    console.log(props); // { user: '' }

    return {}; // anything returned here will be available for the rest of the component
  },
  // the "rest" of the component
};
```

先来实现最初提到的第一个功能点：

- 从 API 中获取用户的 repositories，并更新数据和视图

从下面这段代码开始：

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'

// inside our component
setup (props) {
  let repositories = []
  const getUserRepositories = async () => {
    repositories = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories // functions returned behave the same as methods
  }
}
```

这段代码作为我们的起点，但很明显它并不能正常工作，因为 `repositories` 目前还不是响应式的。

### Reactive Variables with `ref`

在 Vue 3.0 中，我们能够使用 `ref` 来让任意变量在任何地方成为响应式，就像下面这样：

```js
import { ref } from "vue";

const counter = ref(0);
```

ref 接收一个参数并将它包装到一个具有 value 属性的对象中并返回该对象，之后就可以使用该对象来访问或者改变变量的值。

```js
import { ref } from "vue";

const counter = ref(0);

console.log(counter); // { value: 0 }
console.log(counter.value); // 0

counter.value++;
console.log(counter.value); // 1
```

使用 ref 的目的是为了保持在 JavaScript 中不同数据类型在使用形式上的统一，因为在 JavaScript 中非引用数据类型实际上是值传递的方式进行。

将任意值包装到一个对象中使得我们可以在整个应用中传递数据而不用担心丢掉响应式特性。

换句话说， `ref` 创建了一个值的**响应式引用**。使用引用的概念在 composition API 中随处可见。

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

// in our component
setup (props) {
  // 之前是 const repositories = []
  const repositories = ref([])
  const getUserRepositories = async () => {
    // 之前是 repositories = await fetchUserRepositories(props.user)
    repositories.value = await fetchUserRepositories(props.user)
  }

  return {
    repositories,
    getUserRepositories
  }
}
```

这就完成了！现在无论何时调用 `getUserRepositories`,`repositories` 都会被更新并且视图也会随之更新。

目前组件应该长这样：

```js
// src/components/UserRepositories.vue
import { fetchUserRepositories } from '@/api/repositories'
import { ref } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const repositories = ref([])
    const getUserRepositories = async () => {
      repositories.value = await fetchUserRepositories(props.user)
    }

    return {
      repositories,
      getUserRepositories
    }
  },
  data () {
    return {
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

### Lifecycle Hook Registration Inside `setup`

如果要让 composition API 和 Options API 一样完整，我们还需要一种能在 setup 中注册生命周期钩子函数的方式。

Vue 中暴露了一些额外的函数来注册声明钩子，和 Options API 一样的名字，但是加了 `on` 前缀，如：`mounted` 在 composition API 中为 `onMounted`。

这类函数接受一个 callback，在适当的时候 callback 会作为生命钩子被调用。

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted } from 'vue'

// in our component
setup (props) {
  const repositories = ref([])
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(props.user)
  }

  onMounted(getUserRepositories) // on `mounted` call `getUserRepositories`

  return {
    repositories,
    getUserRepositories
  }
}
```

### Reacting to Changes with `watch`

和直接在组件中使用 watch 对象来对 `user` 属性设置 watch 一样，我们可以使用 Vue 中的 `watch` 函数来完成，它有三个参数：

- 一个响应式引用或者 getter 函数
- callback
- 选项配置

```js
import { ref, watch } from "vue";

const counter = ref(0);
watch(counter, (newValue, oldValue) => {
  console.log("The new counter value is: " + counter.value);
});
```

无论何时 `counter` 发生改变，watch 都会被触发并执行 callback。

上面的 composition API 等同于下面的 Options API：

```js
export default {
  data() {
    return {
      counter: 0,
    };
  },
  watch: {
    counter(newValue, oldValue) {
      console.log("The new counter value is: " + this.counter);
    },
  },
};
```

现在把它应用于我们的例子当中：

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of props
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
  watch(user, getUserRepositories)

  return {
    repositories,
    getUserRepositories
  }
}
```

你或许已经注意到了 setup 顶部的 toRefs。它是为了确保 watcher 能够对传入的 user 属性的改变做出响应。

至此，我们已经将第一个功能点放到了一起。现在需要对第二个功能点做同样的事情 —— 基于 searchQuery 的过滤，这次需要使用计算属性。

### Standalone `computed` properties

和 `ref` 以及 `watch` 一样，计算属性能够独立于 Vue 组件使用 Vue 提供的 computed 函数来创建。

```js
import { ref, computed } from "vue";

const counter = ref(0);
const twiceTheCounter = computed(() => counter.value * 2);

counter.value++;
console.log(counter.value); // 1
console.log(twiceTheCounter.value); // 2
```

`computed` 函数根据传入的第一个 getter 回调函数返回一个只读的响应式引用。为了访问到计算属性的值，需要像 `ref` 那样使用 `.value`。

现在把搜索功能加到 `setup` 中：

```js
// src/components/UserRepositories.vue `setup` function
import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs, computed } from 'vue'

// in our component
setup (props) {
  // using `toRefs` to create a Reactive Reference to the `user` property of props
  const { user } = toRefs(props)

  const repositories = ref([])
  const getUserRepositories = async () => {
    // update `props.user` to `user.value` to access the Reference value
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // set a watcher on the Reactive Reference to user prop
  watch(user, getUserRepositories)

  const searchQuery = ref('')
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter(
      repository => repository.name.includes(searchQuery.value)
    )
  })

  return {
    repositories,
    getUserRepositories,
    searchQuery,
    repositoriesMatchingSearchQuery
  }
}
```

难道仅仅是把所有的功能都放到 setup 中让它变得越来越大吗？目前是的，所以我们需要把它们各自的功能抽离到独立的函数中去，先来创建一个 `useUserRepositories`：

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from "@/api/repositories";
import { ref, onMounted, watch } from "vue";

export default function useUserRepositories(user) {
  const repositories = ref([]);
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value);
  };

  onMounted(getUserRepositories);
  watch(user, getUserRepositories);

  return {
    repositories,
    getUserRepositories,
  };
}
```

然后是搜索功能：

```js
// src/composables/useRepositoryNameSearch.js

import { ref, computed } from "vue";

export default function useRepositoryNameSearch(repositories) {
  const searchQuery = ref("");
  const repositoriesMatchingSearchQuery = computed(() => {
    return repositories.value.filter((repository) => {
      return repository.name.includes(searchQuery.value);
    });
  });

  return {
    searchQuery,
    repositoriesMatchingSearchQuery,
  };
}
```

现在两个独立的功能在各自的文件中，我们需要在组件中使用它们：

```js
// src/components/UserRepositories.vue
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import { toRefs } from 'vue'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the filtered results under the `repositories` name
      repositories: repositoriesMatchingSearchQuery,
      getUserRepositories,
      searchQuery,
    }
  },
  data () {
    return {
      filters: { ... }, // 3
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
  },
  methods: {
    updateFilters () { ... }, // 3
  }
}
```

到目前为止我们已经清楚了要怎么做，现在直接将剩下的功能也迁移进来，你可以不需要了解其中的细节：

```js
// src/components/UserRepositories.vue
import { toRefs } from "vue";
import useUserRepositories from "@/composables/useUserRepositories";
import useRepositoryNameSearch from "@/composables/useRepositoryNameSearch";
import useRepositoryFilters from "@/composables/useRepositoryFilters";

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { user } = toRefs(props);

    const { repositories, getUserRepositories } = useUserRepositories(user);

    const { searchQuery, repositoriesMatchingSearchQuery } = useRepositoryNameSearch(repositories);

    const { filters, updateFilters, filteredRepositories } = useRepositoryFilters(repositoriesMatchingSearchQuery);

    return {
      // Since we don’t really care about the unfiltered repositories
      // we can expose the end results under the `repositories` name
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters,
    };
  },
};
```

大功告成！

## Setup

setup 接收两个参数：

- props
- context

### Props

props 是响应式对象，并且在新属性加入的时候会被自动更新。

```js
// MyBook.vue

export default {
  props: {
    title: String,
  },
  setup(props) {
    console.log(props.title);
  },
};
```

> 由于 props 是响应式的，因此你不能使用 ES6 的解构，因为这样会丢失响应式

如果你希望解构 props，则需要在 setup 中使用 toRefs：

```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
	const { title } = toRefs(props)

	console.log(title.value)
}
```

如果 title 是可选参数，则可能不会出现在 props 中，这种情况下 `toRefs` 不会创建 title 的引用，因此你需要使用 `toRef`：

```js
// MyBook.vue

import { toRef } from 'vue'

setup(props) {
	const title = toRef(props, 'title')

	console.log(title.value)
}
```

### Context

`context` 是一个普通 JavaScript 对象，它暴露了三个属性：

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attributes (Non-reactive object)
    console.log(context.attrs);

    // Slots (Non-reactive object)
    console.log(context.slots);

    // Emit Events (Method)
    console.log(context.emit);
  },
};
```

context 只是普通 JavaScript 对象，因此不是响应式的。因此你可以使用 ES6 结构：

```js
// MyBook.vue
export default {
  setup(props, { attrs, slots, emit }) {
    ...
  }
}
```

`attrs` 和 `slots` 是有状态的对象，当组件更新时它们也会得到更新。这也就意味着你应该避免解构它们，而应该总是使用 `attrs.x` 或者 `slots.x` 的方式。另外注意不像 `props`，`attrs` 和 `slots` 是非响应式的。如果你希望基于 attrs 和 slots 的改变执行 effect，你应该在 `onUpdated` 生命钩子中完成。

### Accessing Component Properties

当 setup 被执行时，组件实例还没有被创建，因此你只能访问下面的属性：

- props
- attrs
- slots
- emit

换句话说，你不能访问：

- data
- computed
- methods

### Usage with Templates

如果 setup 返回一个对象，则该对象上的属性能够在组件的 template 中访问，包括传递给 setup 的 props 中的属性：

```js
<!-- MyBook.vue -->
<template>
  <div>{{ collectionName }}: {{ readersNumber }} {{ book.title }}</div>
</template>

<script>
  import { ref, reactive } from 'vue'

  export default {
    props: {
      collectionName: String
    },
    setup(props) {
      const readersNumber = ref(0)
      const book = reactive({ title: 'Vue 3 Guide' })

      // expose to template
      return {
        readersNumber,
        book
      }
    }
  }
</script>
```

需要注意的是 setup 中返回的 ref 在模板中会自动解开其 value 值，因此在 template 中不需要使用 `.value` 的方式了访问。

### Usage with Render Functions

setup 也可以直接返回一个 render 函数，其可以直接使用同作用域内的响应式数据：

```js
// MyBook.vue

import { h, ref, reactive } from "vue";

export default {
  setup() {
    const readersNumber = ref(0);
    const book = reactive({ title: "Vue 3 Guide" });
    // Please note that we need to explicitly expose ref value here
    return () => h("div", [readersNumber.value, book.title]);
  },
};
```

### `this` 的使用

在 `setup` 中， 由于组件实例还未创建完成，因此 setup 中的 this 并非组件实例的引用。

## Lifecycle Hooks

在原来 Options API 中加上 `on` 前缀来使用 Composition API 中的生命周期钩子：

| Options API       | Hook inside `setup`  |
| ----------------- | -------------------- |
| `beforeCreate`    | `Not needed* `       |
| `created`         | `Not needed* `       |
| `beforeMount`     | `onBeforeMount `     |
| `mounted`         | `onMounted `         |
| `beforeUpdate`    | `onBeforeUpdate `    |
| `updated`         | `onUpdated `         |
| `beforeUnmount`   | `onBeforeUnmount `   |
| `unmounted`       | `onUnmounted `       |
| `errorCaptured`   | `onErrorCaptured `   |
| `renderTracked`   | `onRenderTracked `   |
| `renderTriggered` | `onRenderTriggered ` |

> 由于 `setup` 是从 `beforeCreate` 到 `created`，因此你不需要显式定义它们。换句话说，任何在 `beforeCreate` 和 `created` 中的代码都应该直接写到 `setup` 函数中。

这些函数接收一个 callback，当到达对应的声明周期时这些 callback 将会被执行。

## [Provide / Inject](https://v3.vuejs.org/guide/composition-api-provide-inject.html#provide-inject)

暂时忽略

## Template Refs

当使用 Composition API 的时候，响应式 ref 和 template ref 的概念被统一了。如果希望获得 template 元素或者组件实例的引用，我们可以在 setup 中声明一个 ref 并返回它：

```js
<template>
  <div ref="root">This is a root element</div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)

      onMounted(() => {
        // the DOM element will be assigned to the ref after initial render
        console.log(root.value) // <div>This is a root element</div>
      })

      return {
        root
      }
    }
  }
</script>
```

上面的例子中，我们在 render 的上下文中暴露了一个 root 属性，并通过 `ref="root"` 将它作为 div 元素的 ref。在 Virtual DOM patch 算法中，如果一个 VNode 的 ref 对应 render 上下文中的 ref，则 VNode 的元素或者组件实例将会被赋值给该 ref 的 value 属性。这个操作是在 Virtual DOM mount/patch 过程中发生的，因此 template ref 只会在首次渲染之后才能获取到值。

用作 template 的 ref 和其它 ref 一样：它们是响应式的并且可以传入 composition 函数或者作为返回值。

### Usage with JSX

```js
export default {
  setup() {
    const root = ref(null);

    return () =>
      h("div", {
        ref: root,
      });

    // with JSX
    return () => <div ref={root} />;
  },
};
```

### Usage inside `v-for`

Composition API template ref 用在 `v-for` 中不会被特殊处理，因此需要使用函数 ref 来手动处理：

```js
<template>
  <div v-for="(item, i) in list" :ref="el => { if (el) divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, reactive, onBeforeUpdate } from 'vue'

  export default {
    setup() {
      const list = reactive([1, 2, 3])
      const divs = ref([])

      // make sure to reset the refs before each update
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        list,
        divs
      }
    }
  }
</script>
```

注意，上面需要在 `onBeforeUpdate` 中重置 refs。
