# Vue 的响应式原理

Vue 的响应式代码主要在 `src/core/observer` 目录中

流程：

`observe(val)` => `调用 new Observer(val)` => `如果 val 是数组，则对每一项调用 observe(item)，如果 val 是对象，则遍历每一项`
