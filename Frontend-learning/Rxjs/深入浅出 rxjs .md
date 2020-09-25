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
