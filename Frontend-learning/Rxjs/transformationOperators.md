# Transformation Operators

- `buffer`：

  [弹珠图](https://rxjs.dev/assets/images/marble-diagrams/buffer.png)

---

- `bufferCount`：缓存上游 Observable，当缓存数量达到第一个参数时吐出缓存值。第二个参数指定两次 buffer 起始值的间隔数量。

这里尤其要说一下第二个参数：

- 如果未指定或者为 null 或者 0，则相当于等于第一个参数
- 如果指定了 >= 1 的数字，则两次 buffer 的初始值之间差 1

```js
interval(1000).pipe(bufferCount(3)).subscribe(console.log);

// [ 0, 1, 2 ]
// [ 3, 4, 5 ]
// [ 6, 7, 8 ]
// ...
```

```js
interval(1000).pipe(bufferCount(3, 1)).subscribe(console.log);

// [ 0, 1, 2 ]
// [ 1, 2, 3 ]
// [ 2, 3, 4 ]
// ...
```

```js
interval(1000).pipe(bufferCount(3, 5)).subscribe(console.log);

// [ 0, 1, 2 ]
// [ 5, 6, 7 ]
// [ 10, 11, 12 ]
```

---

- `bufferTime`：

  [弹珠图](https://rxjs.dev/assets/images/marble-diagrams/bufferTime.png)

---

- `bufferToggle`

  [弹珠图](https://rxjs.dev/assets/images/marble-diagrams/bufferToggle.png)

---

- `bufferWhen`

[弹珠图](https://rxjs.dev/assets/images/marble-diagrams/bufferWhen.png)

---

- `concatMap`

---

- `concatMapTo`

---

- [`exhaust`](https://rxjs.dev/api/operators/exhaust)：将高阶 Observable 转换成一阶 Observable，并且前面的 Observable 完成之前会忽略期间产生的其它 Observable

---

- `exhaustMap`

---

- `expand`

---

- `groupBy`

---

- `map`：对上游吐出的每个值都通过函数转换一遍，返回转换后的值

---

- `mapTo`：将上游值映射为相同值

---

- `mergeMap`

---

- `mergeMapTo`

---

- `mergeScan`

---

- `pairwise`

---

- `partition`

---

- `pluck`：类似 map，但是只从上游吐出的对象数据中提取一个值传递给下游

---

- `scan`：类似于 reduce，对上游 Observable 吐出的每个数据执行一遍累加器函数并向下游吐出本次累加结果

---

- `switchMap`

---

- `switchMapTo`

---

- `window`

---

- `windowCount`

---

- `windowTime`

---

- `windowToggle`

---

- `windowWhen`

---
