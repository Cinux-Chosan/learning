### Tree shaking

Tree Shaking 是两个步骤的合并结果，如下：

配置：

```js
const config = {
  // ...
  optimization: {
    usedExports: true, // 使得 es 模块仅导出外部使用了的成员，未使用的成员不导出，但代码依旧在模块中，成为【死代码】
    minimize: true, // 开启代码压缩，它会将死代码清除，从而完成 Tree Shaking
  },
};
```
