# Vue2 diff

`oldCh` 表示旧的子节点，`newCh` 表示新的子节点

初始化变量：

```js
let oldStartIdx = 0; // 指向旧列表的起始，会向后移动
let newStartIdx = 0; // 指向新列表的起始，会向后移动
let oldEndIdx = oldCh.length - 1; // 指向旧列表的末尾，会向前移动
let oldStartVnode = oldCh[0]; // 旧列表当前起始节点
let oldEndVnode = oldCh[oldEndIdx]; // 就列表当前末尾节点
let newEndIdx = newCh.length - 1; // 指向新列表的末尾，会向前移动
let newStartVnode = newCh[0]; // 新列表当前起始节点
let newEndVnode = newCh[newEndIdx]; // // 新列表当前末尾节点
let oldKeyToIdx, // { key => index } 结构保存的旧列表中未处理元素 key 对应的 index
  idxInOld, // 旧节点的索引
  // vnodeToMove, // 需要移动位置的节点
  refElm; // 使用 insertBefore 插入节点的相对位置
```

后面说的某个列表的 **首个** 元素（或起始节点）都是指 `xxxStartIdx` 指向的元素，**末尾** 元素都是值 `xxxEndIdx` 指向的元素

发生在 `patch` 后的节点移动都是发生在旧节点中，且相对位置也是从旧节点中获取，因为既然是 `patch` 则说明存在对应的旧节点，所以没有必要创建新节点的 DOM 元素

`while` 循环，直到某一方的子元素处理完成：

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  // ...
}
```

每次 `while` 循环内部执行如下操作：

- 比较两个列表起始节点是否是同一节点，如果是就执行 `patch`，并将两个起始指针向`后`移动 `1`（都是起始节点，不需要移动位置）
- 否则比较两个列表末尾节点是否是同一节点，如果是就执行 `patch`，并将两个末尾指针向`前`移动 `1`（都是末尾节点，也不需要移动位置）
- 否则比较旧列表起始节点和新列表末尾节点是否相同，如果是就执行 `patch`，并将节点移动到旧节点末尾元素之后，然后将 `oldStartIdx + 1`（即向后移动 1），`newEndIdx - 1`（即向前移动 1）
- 否则比较旧列表末尾节点和新列表起始节点是否相同，如果是就执行 `patch`，并将节点移动到旧起始节点之前，然后将 `oldEndIdx - 1`（即向前移动 1），`newStartIdx + 1`（即向后移动 1）
- 如果上面都不满足，则
  - 如果 _（该步骤目的为查找新节点在旧节点中的索引）_
    - 新列表首个元素存在 `key`，则从 `oldKeyToIdx` 中获取对应 `key` 在旧列表中的索引
    - 否则尝试从旧列表中找到一个同类节点，并记录其索引
    - 将索引位置保存到变量 `idxInOld`
  - 如果
    - `idxInOld` 不存在，说明旧列表中不存在该节点，则创建并插入到旧起始节点前
    - 否则说明存在对应的旧节点，如果
      - 新旧节点是同一节点，则 `patch` 并将旧列表中对应节点置为 `undefined`，并将节点插入到旧起始节点之前
      - 否则新旧节点不是同一类型节点，创建元素并插入到旧起始节点之前
  - 新起始索引向后移动 1

跳出循环后：

- 如果
  - 旧节点已经处理完，将新节点起始和结尾之间的元素插入到末尾索引元素之后
  - 否则如果新节点处理完，则将旧节点起始和末尾索引之间的元素删除