# Redux 原理

核心思想：

redux 提供了 `state`、`subscribe` 和 `reducer` + `action` 来进行状态管理：

- `state`：存储状态
- `action`（包含 `type` 和 `ƒ` 的对象）、dispatch（接收 `action` 作为参数）、`reducer`（根据 `action` 的 `type` 来执行对应的逻辑，返回新的 `state` 对象）来修改状态
- `subscribe`：监听对象的变化

但是如果直接用到 `react` 中，修改的数据并不会引起重新 `render`，因此需要配合 `react-redux`，它主要：

- 利用 `react` 的 `Provier` 对子组件提供数据
- 提供 `connect` 高阶组件，它会在内部获取 `redux` 的 `store`，并且利用 `subscribe` 监听数据变化，如果数据变化之后会根据 `store state` 和自身的 `props` 计算出新的 `props`，调用 `setState` 之类的方法修改自身的数据，从而引起重新 `render`

## 实现细节，面试可旁敲侧击的说

### 细节 1：redux 实现中存在两个 listeners

redux 实现中存在两个 listeners，即 `currentListeners` 和 `nextListeners`，每次操作都是在 `currentListeners` 上（每次有 `subscribe` 或者 `unsubscribe` 发生得时候，都会判断 `currentListeners === nextListeners`，如果不相等，则 `nextListeners = currentListeners.slice()`，并更新 `nextListeners`，然后再下一次`dispatch`中将 `nextListeners` 赋值给 `currentListeners`），实际上是为了避免中途调用 `unsubscribe` 取消订阅了某些方法造成循环异常。

---

### 细节 2：applyMiddleware 原理

            applyMiddleware 能重写 redux 暴露的方法。

`applyMiddleware` 返回的是一个接受 `createStore` 方法的函数，它会在内部通过 `createStore` 创建一个 `store` 对象，并将 `getState` 和 `dispatch` 进行重写，其中 `getState` 直接映射到 `store.getState`，而 `dispatch` 会重新组合 `middlewareAPI` 和 `store.dispatch`。

`createStore` 方法如果发现存在 `enhancer` 参数（即 `applyMiddleware` 生成的函数），则会将自己传入 `enhancer` 并执行，然后再传入 `reducer` 和 `preloadedState`。

先看一个 `middleware` 示例：

```js
const anotherExampleMiddleware = (storeAPI) => (next) => (action) => {
  // Do something in here, when each action is dispatched

  return next(action);
};
```

`applyMiddleware` 代码如下：

```ts
function applyMiddleware(...middlewares) {
  // 返回一个接受 createStore 方法的函数
  return (createStore) => (reducer, preloadedState?) => {
    const store = createStore(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareAPI = {
      // getState 重定向到 store.getState
      getState: store.getState,
      // dispatch 被重写
      dispatch: (action, ...args) => dispatch(action, ...args),
    };
    // 将 middlewareAPI 传递给 middleware 的第一层函数，并解开 middleware 的第一层
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    // chain 为数组 {next => action => unknow}[]
    // 重写 dispatch，最后的 middleware 最先执行，它的 next 为 store.dispatch，但是后面的函数会被包装进前面函数的 next 逻辑中，只有前面的函数执行 next 才会链式触发后面的函数先执行
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}
```

`compose` 源码：

```ts
function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  );
}
```

### 题外话

redux 背后的架构思想源自于 flux 架构，它的特征就是单向数据流，它包含：

- `view`：视图层，即用户界面，可以是任何形式展现出来
- `action`：动作，向视图发出“消息”，会触发应用状态的改变
- `dispatcher`：派发器，负责对 `action` 进行分发
- `store`：数据层，存储应用状态的数据仓库，此外还会定义修改状态的逻辑
