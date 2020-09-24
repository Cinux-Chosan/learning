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
