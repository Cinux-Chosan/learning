# Vue3 Scheduler

我们称每一个任务为一个 `job`，它是一个附加了额外属性（如 `id`、`active` 等）的函数，使用 `queue` 队列来保存所有稍后需要执行的 `job`

`job` 的执行使用 `Promise` 微任务队列实现，这里有两个状态需要说明：

- `isFlushPending`：是否在等待任务执行，表示从 `创建 Promise` 到 `Promise 微任务启动` 这段时间
- `isFlushing`：是否正在执行任务，它表示从 `Promise 微任务启动` 到执行完所有 `queue` 中的任务

当需要将任务放入到微任务队列时，使用 [`queueJob(job)`](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/runtime-core/src/scheduler.ts#L84) 方法来完成：

- 判断 `job` 是否存在于 `queue` 中，如果不存在则使用下面的方式添加：
  - 如果 `job` 不存在 `id`，则直接插入到 `queue` 中
  - 如果 `job` 存在 `id`，则插入到对应顺序的位置中（说明：`id` 会用来排序 `job`，一般父组件优先于子组件创建，所以其 `id` 小于子组件的 `id`，其 `update` 优先执行，`update` 可能卸载子组件，它能够避免后面子组件的 `update` 执行）
- 如果当前未处于正在执行 `job` 状态（`isFlushing` 为 `false`），同时也没有处于等待微任务启动的状态（`isFlushPending` 为 `false`），则通过 [`Promise#then()`](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/runtime-core/src/scheduler.ts#L111) 启动一个微任务，执行 `flushJobs` 方法

- `flushJobs`
  - 首先根据 `id` 对 `queue` 进行排序
  - 按序执行所有 `job`（该过程会有 `flushPreFlushCbs` 和 `flushPostFlushCbs` 分别执行前置任务和后置任务，但和原理不太相关，不做详细介绍）

`flushJobs` 的过程和真正的微任务执行很类似，因为执行 `flushPostFlushCbs` 过程中可能动态添加了 `job`，所以 `flushJobs` 结束时会再次检测 `queue` 是否存在任务，如果存在任务会递归调用自身，直到 `queue` 被完全清空，这和 _**微任务需要全部被执行完才进入下一轮事件循环**_ 的行为表现一致。

## [nextTick](https://github.com/vuejs/core/blob/0cf9ae62be21a6180f909e03091f087254ae3e52/packages/runtime-core/src/scheduler.ts#L58)

Vue3 中的 `nextTick` 直接返回启动微任务的 `Promise`（即 currentFlushPromise），如果当前处于未启动状态则有一个默认的 `Promise`（即 `resolvedPromise`）返回，其代码相对简单，这里直接贴出来：

```ts
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise;
  return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
```
