# Chrome 调试技巧

- 一键重新发起请求：选中控制台中的 Fetch/XHR，点击 `Replay XHR` 自动重新发起请求
- 在控制台快速发起请求：选中控制台中的 Fetch/XHR，点击 `Copy as fetch`，然后再粘贴到控制台中
- 复制 JavaScript 变量：几乎所有地方都可以对某个值点击右键选择 `copy value` 将值复制到剪切板
- 控制台获取 Elements 面板选中的元素：先选择对应的元素，然后在控制台中通过 `$0` 引用当前选中的元素
- 截取网页：`cmd + shift + p` 然后输入指令，如 `screenshot`
- 一键展开 DOM 元素：按住 `opt键` + `click`
- 控制台引用上一次执行的结果：`$_` 引用上一次操作的结果
- `$` 和 `$$` 代替 `document.querySelector` 和 `document.querySelectorAll`
- 控制台快速安装 npm 包：需要安装 [Console Importer](https://link.juejin.cn/?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fconsole-importer%2Fhgajpakhafplebkdljleajgbpdmplhie%2Frelated)，然后使用 `$i('name')` 安装对应的 npm 包
- 添加条件断点：对添加断点的地方右键可以选择添加条件断点，输入条件表达式，如果为 `true` 则会自动暂停

参考资料：

- [11+ chrome 高级调试技巧，学会效率直接提升 666%](https://juejin.cn/post/7085135692568723492#heading-4)
