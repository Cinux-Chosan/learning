# lanes

在 root 中有一个 31 位长度的数组 eventTimes，其中保存了某个优先级对应的事件触发时间。

在 `markRootUpdated(root, updateLane, eventTime)` 方法中，会通过使用 `clz32` 方法计算 updateLane 的前导 0 个数，然后使用 31 减去该数，从而计算出 eventTime 参数在 eventTimes 中保存的索引，举例，假设 updateLane 为 16，eventTime 为 now 获取的当前时间：

- `clz32(updateLane)` 获得 16（即 `00000000000000000000000000010000`） 的二进制前导 0 个数 27，然后使用 31 - 27 = 4
- 将 eventTime 保存到 eventTimes 索引为 4 的位置，即 `root.eventTimes[4] = eventTime`

而在获取最近的 eventTime 时，使用`getMostRecentEventTime(root, lanes)`方法，根据 lane 获取对应的索引，然后根据索引获取到对应的 eventTime 进行比较，返回最后产生的 eventTime，由于时间是单调递增的，因此最后产生的 eventTime 也是最大的值。

```js
function getMostRecentEventTime(root, lanes) {
  const eventTimes = root.eventTimes;
  let mostRecentEventTime = NoTimestamp;

  while (lanes > 0) {
    const index = pickArbitraryLaneIndex(lanes);
    const lane = 1 << index;
    const eventTime = eventTimes[index];

    if (eventTime > mostRecentEventTime) {
      mostRecentEventTime = eventTime;
    }

    lanes &= ~lane;
  }

  return mostRecentEventTime;
}
```
