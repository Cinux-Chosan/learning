# React 源码

设计理念：快速响应
制约瓶颈：CPU 与 IO
解决办法：异步可中断更新

### Diff

React diff 会经历两次遍历

第一层会对新旧 children 逐一匹配，当遇到不匹配时（key 或 type 不同），则跳出第一层循环，进入第二次循环

第二次循环，会将所有未处理的旧 children 保存到一个 map 中，其键名为该元素对应的 `key`，然后按序处理剩下的新 children：

- 引入一个变量 `lastPlacedIndex` 来记录在旧 children 中最后可复用元素的位置索引
- 通过 key 从 map 中获取旧的 fiber，判断它在旧节点中的位置索引 `oldIndex` 是否 >= `lastPlacedIndex`：
  - 如果 `oldIndex` >= `lastPlacedIndex` 则说明该元素无需移动位置，继续处理下一个
  - 否则表示该元素需要移动位置，并将 `lastPlacedIndex` 设置为 `oldIndex`
  - 解释：由于是按照 newChildren 来按序遍历的，oldIndex 表示当前元素在 oldChildren 中的索引，`oldIndex >= lastPlacedIndex` 的意思就是说：如果我在 oldChildren 中的位置也是在前一个元素的后面，那我就不需要移动位置
