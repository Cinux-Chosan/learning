## 操作符

### 创建类

- `of(...args)`：`of(1, 2, 3)`
- `range(start: number = 0, count?: number, scheduler?: SchedulerLike): Observable<number>`：产生一个范围内的数字 `range(20.5, 10)` 表示从 20.5 开始，生成 10 个数字，即 `[20.5-30.5)`
- `generate<T, S>(initialStateOrOptions: S | GenerateOptions<T, S>, condition?: ConditionFunc<S>, iterate?: IterateFunc<S>, resultSelectorOrObservable?: SchedulerLike | ResultFunc<S, T>, scheduler?: SchedulerLike): Observable<T>`：

```ts
// 和 for(let i = 0; i < 10; i+=2) 一样
generate(
  0,
  x => x < 10,
  x => x + 2
);

generate(
  "", // 步骤 1
  value => value.length < 10, // 步骤 2
  value => value + "x", // 步骤 4， 相当于是 for 括号中的 final-expression，这里产出的值会传递给循环内其他使用 value 的地方
  value => value + "1" // 步骤 3， 相当于是 for 的循环体，这里产出的值会流到下游，不会影响循环中的值
);
```

- `repeat<T>(count: number = -1): MonoTypeOperatorFunction<T>`：当上游完成后，重复前面的流 count 次

```js
interval(1000)
  .pipe(take(3), repeat(2))
  .subscribe(console.log);
```

- `interval(period: number = 0, scheduler: SchedulerLike = async): Observable<number>`：没隔 period 毫秒生产一个数据

- `timer(dueTime: number | Date = 0, periodOrScheduler?: number | SchedulerLike, scheduler?: SchedulerLike): Observable<number>`：dueTime 毫秒之后产出一个值，无果没有 periodOrScheduler 则停止，否则每隔 periodOrScheduler 毫秒持续产出值。因此如果没有指定第二个参数，则相当于 setTimeout，如果指定了第二个参数，相当于 setTimeout 一次然后 setInterval

```js
const source$ = Observable.timer(2000, 1000); // 2 秒产出第一个值，之后每隔一秒产出一个值，所有值从 0 递增
```

- `from<T>(input: any, scheduler?: SchedulerLike): Observable<T>`：将任何像 Observable 的对象转换为 Observable：

  - 数组
  - 类数组
  - 字符串
  - Promise
  - generator
  - ...

- `fromEvent<T>(target: FromEventTarget<T>, eventName: string, options?: EventListenerOptions | ((...args: any[]) => T), resultSelector?: (...args: any[]) => T): Observable<T>`：从 DOM 事件或者 Node.js 事件触发器中创建 Observable

- `const ajax: any`：发送 ajax 请求，并将其转化为 Observable

- `defer<R extends ObservableInput<any> | void>(observableFactory: () => R): Observable<ObservedValueOf<R>>`：创建一个 Observable，但是只有当其被订阅的时候才会通过其参数函数去创建真正的 Observable

```js
const observableFactory = () => of(1, 2, 3);
const source$ = Observable.defer(observableFactory); // 此时并不会生成 1，2，3。只有当 source$ 被订阅的时候才会调用 observableFactory 去创建一个 Observable
```

## 流合并

| 操作符                                          | 功能描述                           |
| ----------------------------------------------- | ---------------------------------- |
| `concat`、`concatAll`                           | 将多个流首尾相连合并               |
| `merge`、`mergeAll`                             | 将多个流以先到先得方式合并         |
| `zip`、`zipAll`                                 | 将多个流一一对应的方式合并         |
| `combineLatest`、`combineAll`、`withLatestFrom` | 持续合并多个数据量中最新产生的数据 |
| `race`                                          | 从多个流中选取第一个产生数据的流   |
| `startWith`                                     | 在数据流前添加一个指定数据         |
| `forkJoin`                                      | 只获取多个数据流最后产生的那个数据 |
| `switch`、`exhaust`                             | 从高阶数据流中切换数据源           |

- `concat<O extends ObservableInput<any>, R>(...observables: (SchedulerLike | O)[]): Observable<ObservedValueOf<O> | R>`：一个一个的订阅所有 Observable，上一个 complete 之后订阅下一个直到最后一个完成。

- `merge<T, R>(...observables: any[]): Observable<R>`：第一时间订阅所有上游 Observable，每当某一个 Observable 产生数据就传递给下游。直到所有上游 Observable 完成。

merge 有一个可选参数 concurrent，用于指定同一时间合并的 Observable 个数。

- `zip<O extends ObservableInput<any>, R>(...observables: (O | ((...values: ObservedValueOf<O>[]) => R))[]): Observable<ObservedValueOf<O>[] | R>`：将多个 Observable 的值按序合并成一个 Observable 并传递给下游。由于能够处理异步的情况，因此每次每个上游 Observable 必须要吐出一个数据才会组装传递给下游，否则由于并不知道什么时候上游 Observable 会吐出数据，因此会一直等待。

- `combineLatest<O extends ObservableInput<any>, R>(...observables: (SchedulerLike | O | ((...values: ObservedValueOf<O>[]) => R))[]): Observable<R>`：每当上游有数据吐出，就将每个上游的最新数据组合起来作为参数传递给下游（每个上游必须要有一个数据，否则会等待其吐出第一个数据）

- `withLatestFrom<T, R>(...args: any[]): OperatorFunction<T, R>`：只使用一个源 Observable 控制吐出节奏，在解决多个上游同时依赖的 glitch 上有较大帮助

- `race<T>(...observables: any[]): Observable<T>`：类似于 Rxjs 界的 `Promise.race`，第一个吐出数据的上游 Observable 作为以后整个的 Observable

- `startWith<T, D>(...array: (SchedulerLike | T)[]): OperatorFunction<T, T | D>`：在上游 Observable 吐出数据之前先吐出 startWith 中的内容

- `forkJoin(...sources: any[]): Observable<any>`：传入 Observable 数组或者字段值为 Observable 的对象，它会将每个 Observable 的最后一个值组合传递给下游

### 高阶 Observable

Observable 管理数据，高阶 Observable 管理 Observable，即 Observable 作为高阶 Observable 的数据。

高阶合并类 Observable：

- `concatAll`
- `mergeAll`
- `zipAll`
- `combineAll`

#### concatAll<T>(): OperatorFunction<ObservableInput<T>, T>

将高阶 Observable 转换为一阶，它会订阅每个内部 Observable，当前面的 Observable 完成才会继续订阅后面的 Observable

```ts
const ho$ = interval(1000).pipe(
  take(2),
  map(x =>
    interval(1500).pipe(
      map(y => x + ":" + y),
      take(2)
    )
  ),
  concatAll()
);

ho$.subscribe(console.log);
// 0:0
// 0:1
// 1:0
// 1:1
```

### mergeAll<T>(concurrent: number = Number.POSITIVE_INFINITY): OperatorFunction<ObservableInput<T>, T>

只要发现上游产生一个 Observable 就会立即订阅，并抽取其数据

### zipAll<T, R>(project?: (...values: any[]) => R): OperatorFunction<T, R>

```ts
const ho$ = interval(1000).pipe(
  take(2),
  map(x =>
    interval(1500).pipe(
      map(y => x + ":" + y),
      take(2)
    )
  ),
  zipAll()
);

ho$.subscribe(console.log);
// [ '0:0', '1:0' ]
// [ '0:1', '1:1' ]
```

### combineAll<T, R>(project?: (...values: any[]) => R): OperatorFunction<T, R>

```ts
const ho$ = interval(1000).pipe(
  take(2),
  map(x =>
    interval(1500).pipe(
      map(y => x + ":" + y),
      take(2)
    )
  ),
  combineAll()
);

ho$.subscribe(console.log);
// [ '0:0', '1:0' ]
// [ '0:1', '1:0' ]
// [ '0:1', '1:1' ]
```

对于高阶 Observable 而言，就像是第一个 interval 产生了两个新的 Observable，然后通过高阶组件的合并操作符来执行对应的逻辑，就像上面的例子一样，实际上相当于是：

```ts
first$ = interval(1500).pipe(
  map(y => 0 + ":" + y),
  take(2)
);

setTimeout(() => {
  second$ = interval(1500).pipe(
    map(y => 1 + ":" + y),
    take(2)
  );

  combineLatest(first$, second$);
}, 1000);
```

### switchAll<T>(): OperatorFunction<ObservableInput<T>, T>

将高阶 Observable 转换为一阶 Observable。并且只取最新生成的 Observable。每当有新的 Observable 生成就会退订旧的 Observable 并订阅新的 Observable

### exhaust<T>(): OperatorFunction<any, T>

将高阶 Observable 转换为一阶 Observable。并且如果之前的 Observable 没有完成，中间产生的 Observable 将会被忽略。直到上一个 Observable 完成之后才会订阅后续产生的 Observable

## 辅助类操作符

| 操作符                | 功能描述                             |
| --------------------- | ------------------------------------ |
| `count`               | 统计数据流中所有数据个数             |
| `max` 和 `min`        | 获取流中最大或最小值                 |
| `reduce`              | 对数据进行规约                       |
| `every`               | 判断是否所有数据满足条件             |
| `find` 和 `findIndex` | 找到第一个满足条件的数据             |
| `isEmpty`             | 判断一个流是否不包含任何数据         |
| `defaultEmpty`        | 如果一个流为空就默认产生一个指定数据 |

`count`、`max`、`min`、`reduce` 等数据统计类操作符只有当上游数据完结时才会将唯一结果传递给下游

```ts
// count 函数签名
count<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean): OperatorFunction<T, number>

const numbers = range(1, 7);
const result = numbers.pipe(count(i => i % 2 === 1)); // 如果不传入判断条件的函数，则默认统计所有个数
result.subscribe(x => console.log(x));
// Results in:
// 4
```

min、max、reduce 等都和 JavaScript 中的函数使用方法一致

---

```ts
// every 函数签名
every<T>(predicate: (value: T, index: number, source: Observable<T>) => boolean, thisArg?: any): OperatorFunction<T, boolean>

// 用法
of(1, 2, 3, 4, 5, 6).pipe(
    every(x => x < 5),
)
.subscribe(x => console.log(x)); // -> false
```

find 和 findIndex 使用方式和 JavaScript 中一致

isEmpty 判断流是否为空，当流吐出第一个数据时返回 false，否则一直等待流结束返回 true

```ts
// 在当前版本 6 以上，defaultEmpty 改名为 defaultIfEmpty
// 如果上游为空，则吐出一个默认值。如果要吐出多个值是做不到的
defaultIfEmpty<T, R>(defaultValue: R = null): OperatorFunction<T, T | R>
```

## 数据过滤流

| 操作符                                              | 功能描述                                                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `filter`                                            | 过滤掉不满足条件的数据                                                                                                                       |
| `first`                                             | 获得满足条件的第一个数据                                                                                                                     |
| `last`                                              | 获得满足条件的最后一个数据                                                                                                                   |
| `take`                                              | 获取前 n 个数据                                                                                                                              |
| `takeLast`                                          | 获取后 n 个数据                                                                                                                              |
| `takeWhile` 和 `takeUntil`                          | 用于控制停止获取数据的时机，takeUntil 更形象的比喻是水龙头，打开的时候一直源源不断的从上游往下流数据，关闭的时候就再也不会继续流数据到下游了 |
| `skip`                                              | 忽略前 n 个数据                                                                                                                              |
| `skipWhile` 和 `skipUntil`                          | 用于控制获取数据的时机                                                                                                                       |
| `throttleTime`、`debounceTime`和 `auditTime`        | 基于时间的数据流量筛选                                                                                                                       |
| `throttle`、`debounce`、`audit`                     | 基于 Observable 的数据流量筛选，相当于使用 Observable 来控制筛选时机                                                                         |
| `sample` 和 `sampleTime`                            | 对数据进行采样，每隔一段时间获取一次最新数据                                                                                                 |
| `distinct`                                          | 去除重复数据                                                                                                                                 |
| `distinctUntilChanged` 和 `distinceUntilKeyChanged` | 当前元素与上一个元素去重处理，如 1,1,2,2,2,2,3,1,2 会得到 1,2,3,1,2                                                                          |
| `ignoreElements`                                    | 忽略流中的所有数据                                                                                                                           |
| `elementAt`                                         | 选取指定位置的数据                                                                                                                           |
| `single`                                            | 判断是否只有一个数据满足条件                                                                                                                 |

## 转化类

| 操作符                                                                  | 功能描述                           |
| ----------------------------------------------------------------------- | ---------------------------------- |
| `map`                                                                   | 将上游元素通过函数转换为新的元素   |
| `mapTo`                                                                 | 将每个元素映射为同一个元素         |
| `pluck`                                                                 | 提从上游数据中提取指定字段，可嵌套 |
| `window`、 `windowTime`、 `windowCount`、 `windowWhen`、 `windowToggle` |                                    |
| `buffer`、 `bufferTime`、 `bufferCount`、 `bufferWhen`、 `bufferToggle` |                                    |
| `concatMap`、 `mergeMap`、 `switchMap`、 `exhaustMap`                   |                                    |
| `scan`、`mergeScan`                                                     |                                    |

### 数据分组

groupBy

partition

## 异常处理

| 操作符                 | 功能描述                                         |
| ---------------------- | ------------------------------------------------ |
| `catchError`                | 捕获并处理上游产生的异常                         |
| `retry` 和 `retryWhen` | 上游产生异常时重试                               |
| `finally`              | 无论是否出错都要执行，同 JavaScript 中的 finally |
