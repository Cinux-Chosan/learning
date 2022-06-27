# 做了哪些 Vue 优化

- `computed` 缓存
- `keep-alive` 缓存组件
- `v-if` 和 `v-show`
- 路由懒加载
- 组件较大采用异步加载
- SSR

## Vue 遇到哪些坑

- 内存泄漏：全局变量、事件以及定时器未清除
- `Vue.set` 增加属性、`Vue.delete` 删除属性（vue2）
- SPA 路由切换导致 scroll 滚动到页面顶部
  - 解决方案：跳转记录 scrollTop 值，返回时重新应用 scrollTop

## 错误监控

- `window.onerror` 或者 `window.addEventListener('error', evt => { ... })`，监听全局未捕获的错误
- `window.onunhandledrejection` 监听 Promise 错误
- `errorCaptured(err, vm, info)` 监听下层错误，如果返回 `false` 则不会继续传播错误
- `app.config.errorHandler(err, vm, info)` 全局监听错误
