# Join Creation Operators

- [`combineLatest`](https://rxjs.dev/api/index/function/combineLatest)：每次收到上游吐出的值，就将每个上游最新值合并吐出。

[弹珠图](https://rxjs.dev/assets/images/marble-diagrams/combineLatest.png)

```js
import { combineLatest, timer } from "rxjs";

const firstTimer = timer(0, 1000); // emit 0, 1, 2... after every second, starting from now
const secondTimer = timer(500, 1000); // emit 0, 1, 2... after every second, starting 0,5s from now
const combinedTimers = combineLatest(firstTimer, secondTimer);
combinedTimers.subscribe((value) => console.log(value));
// Logs
// [0, 0] after 0.5s
// [1, 0] after 1s
// [1, 1] after 1.5s
// [2, 1] after 2s
```

---

- [`concat`](https://rxjs.dev/api/index/function/concat)：返回一个新的 Observable，按顺序依次对多个上游 Observable 进行订阅，每完成一个才会再订阅下一个，直到所有完成。

  [弹珠图](https://rxjs.dev/assets/images/marble-diagrams/concat.png)

```js
import { concat, interval, range } from "rxjs";
import { take } from "rxjs/operators";

const timer = interval(1000).pipe(take(4));
const sequence = range(1, 10);
const result = concat(timer, sequence);
result.subscribe((x) => console.log(x));

// results in:
// 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
```

---

- `forkJoin`：类似于 `Promise.all`，但是支持的参数不仅可以是数组，还可以是对象或者直接通过参数列表传递。等待所有 Observable 完成并按照输入的格式输出最终值。

---

- [`merge`](https://rxjs.dev/api/index/function/merge)：返回一个新的 Observable 用于将多个上游 Observable 数据合并，该 Observable 会同时订阅所有上游，并在收到上游数据时立即向下游传递

---

- [`partition`](https://rxjs.dev/api/index/function/partition)：将上游 Observable 吐出的值分成两个 Observable，第一个是满足条件的 Observable，第二个是不满足条件的 Observable

```js
const observableValues = of(1, 2, 3, 4, 5, 6);
const [evens$, odds$] = partition(observableValues, (value, index) => value % 2 === 0);

odds$.subscribe((x) => console.log("odds", x));
evens$.subscribe((x) => console.log("evens", x));

// Logs:
// odds 1
// odds 3
// odds 5
// evens 2
// evens 4
// evens 6
```

---

- [`race`](https://rxjs.dev/api/index/function/race)：类似于 `Promise.race`，同时订阅多个上游 Observable，使用最先吐出数据的 Observable 作为数据源，并退订其它所有上游，只保留最新吐出数据的上游 Observable 作为数据源。

---

- [`zip`](https://rxjs.dev/api/index/function/zip)：将多个上游 Observable 数据合并到一个数组中，数组对应项为上游对应位置 Observable 吐出的值，每次一定会等待对应位置的上游吐出一项数据，否则会一直等待。

> 如果传入的最后一个参数为函数，则用于将数据在吐出之前预处理，返回值才为最终吐出的值

---
