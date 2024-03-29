

# Vue 源码

Vue 源码中主要涉及到以下部分比较重要：
- 响应式原理
- 模板编译
- diff 原理
- scheduler

- 带有 `g` 标志的正则表达式，在执行一次 exec 之后，会保留 lastIndex，下次匹配会从 lastIndex 开始查找，不带 `g` 标志的则 `lastIndex` 始终为 0

```js
var text = '\n        {{a + b}}\n        ';
var reg = /\{\{((?:.|\r?\n)+?)\}\}/g;
reg.exec(text); // ['{{a + b}}', 'a + b', index: 9, input: '\n        {{a + b}}\n        ', groups: undefined]
reg.exec(text); // null
// 重复
reg.exec(text); // ['{{a + b}}', 'a + b', index: 9, input: '\n        {{a + b}}\n        ', groups: undefined]
reg.exec(text); // null
```

## 模板部分

在 Vue 中，模板代码主要会经过两个部分，分别是对模板的编译，以及将编译后的 AST 转换为 js 代码，即代码生成。

### 模板编译

Vue 的模板编译的入口在 [`vue/src/compiler/index.js`](https://github.com/vuejs/vue/blob/0368ba4f37ef1ef28eb785261ab76a68f7fa03dd/src/compiler/index.js#L15) 中。


## 