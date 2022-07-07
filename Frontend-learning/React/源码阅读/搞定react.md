#

updateContainer:

- 请求当前 fiber 节点的 lane
- 创建当前 fiber 节点的 update 对象并入队
- 调度当前 fiber 节点（rootFiber）

fiber 上的 mode 属性决定了是同步还是异步渲染
