# Transformation Operators

- `buffer`：

  [弹珠图](https://rxjs.dev/assets/images/marble-diagrams/buffer.png)

---

- `bufferCount`：缓存上游 Observable，当缓存数量达到第一个参数时吐出缓存值。第二个参数指定新开缓存的间隔。

这里尤其要说一下第二个参数：

- 如果未指定或者为 null 或者 0，则相当于等于第一个参数
- 如果指定了 >= 1 的数字，则两次 buffer 的初始值之间差 1

```js
interval(1000)
  .pipe(bufferCount(3))
  .subscribe(console.log);

// [ 0, 1, 2 ]
// [ 3, 4, 5 ]
// [ 6, 7, 8 ]
// ...
```

```js
interval(1000)
  .pipe(bufferCount(3, 1))
  .subscribe(console.log);

// [ 0, 1, 2 ]
// [ 1, 2, 3 ]
// [ 2, 3, 4 ]
// ...
```

```js
interval(1000)
  .pipe(bufferCount(3, 5))
  .subscribe(console.log);

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

- `pairwise`：将前后两次值合并吐出，可以用于计算两次间隔的差距，如：

```js
// 每次点击计算与上一次点击的鼠标距离：
const clicks = fromEvent(document, "click");
const pairs = clicks.pipe(pairwise());
const distance = pairs.pipe(
  map((pair) => {
    const x0 = pair[0].clientX;
    const y0 = pair[0].clientY;
    const x1 = pair[1].clientX;
    const y1 = pair[1].clientY;
    return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
  })
);
distance.subscribe((x) => console.log(x));
```

[弹珠图](https://rxjs.dev/assets/images/marble-diagrams/pairwise.png)

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

- `windowTime`：类似于 bufferTime，不同之处在于 bufferTime 将时间段内上游数据缓存到数组中一次性吐出，windowTime 会在每个时间段开始的时候创建一个 Observable，然后将 Observable 传递给下游，时间段内的数据都通过该 Observable 向下传递：

[弹珠图](https://rxjs.dev/assets/images/marble-diagrams/windowTime.png)

```js
interval(1000)
  .pipe(
    windowTime(5000),
    map((win) => win.pipe(take(2))),
    mergeAll()
  )
  .subscribe(console.log);

// 0 // 时间段内开始，创建 Observable 传递给下游，即 map 中的 win，并通过 win 并吐出第一个数据
// 1 // 一秒后将上游数据直接通过 win 传递给下游，由于只 take(2)，因此后续的数据不会继续传递
// 4 // 新的时间段开始，再创建一个 Observable 传递给 map，数据通过该 Observable 继续传递
// 5
// 9
// 10
```

---

- `windowToggle`

---

- `windowWhen`

---
