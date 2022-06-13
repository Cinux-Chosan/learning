# Vue 相关复习

Vue 相关复习还可以参考[当前项目这里](../Vue/)

## SSR 原理

每次浏览器通过 URL 访问服务器时，服务器收到请求后会：

- 服务器会创建一个全新的 `vue` 实例（避免串数据）
- 并会根据 URL 来匹配需要渲染的 `vue` 组件（通过在 `entry-server.js` 中执行 `router.getMatchedComponents()` 获取匹配的组件）
- 拿到匹配的组件之后会调用组件内部的 `asyncData` 方法获取数据，此过程是在 node 环境中发起请求。
- 拿到数据过后会调用 render 将数据渲染成 HTML 字符串，并发送给前端
- 前端收到后进行渲染，并且加载 `vue` 运行时接管整个前端页面
- 之后的页内跳转都在前端做，并且调用 `asyncData` 也是在浏览器完成。但是如果刷新页面，又会走服务器渲染，即又回到初始流程。

如果结合了 `vuex`，则首次渲染时服务器会将 `vuex` 的数据序列化并通过 `window.__INITIAL_STATE__ = 数据` 来挂载到 window 上（实际上是在后端通过 `context.state = store.state` 来挂载数据，它会自动把 `context.state` 的数据挂载到 `window.__INITIAL_STATE__` 上），当页面渲染完成 `vuex` 初始化时，首次会尝试通过 `window.__INITIAL_STATE__` 来加载初始数据。

参考资料：

- [SSR 数据预取和状态](https://github.com/vuejs/vue-ssr-docs/blob/52d454fec37ea2b3245e1ff7dbaf218e72e2d390/docs/zh/guide/data.md)
- [彻底理解服务端渲染 - SSR 原理](https://github.com/yacan8/blog/issues/30)
- [从原理上实现 Vue 的 ssr 渲染](https://zhuanlan.zhihu.com/p/346674458)

---
