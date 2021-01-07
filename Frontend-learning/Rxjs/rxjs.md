# Rxjs

## Creation Operators

- `ajax`
- bindCallback
- bindNodeCallback
- `defer`：创建一个 Observable，在订阅时会通过工厂函数创建另一个 Observable，主要用于惰性创建 Observable

```js
defer(() => of("a"));
```

- empty：创建一个直接 complete 的 Observable

```js
interval(1000)
  .pipe(mergeMap((x) => (x % 2 === 1 ? of("a", "b", "c") : empty())))
  .subscribe((x) => console.log(x)); // 每两秒输出一次 a,b,c
```

类似于：

```js
function empty() {}
```

- from：将数组、类数组对象、Promise、可迭代对象或者类 Observable 对象转换成 Observable

```js
from([1, 2, 3]).subscribe(console.log); // 1,2,3
from(Promise.resolve("I am promise")).subscribe(console.log); // I am promise
from({
  [observable]: () => of(1, 2, 3),
}).subscribe(console.log); // 1,2,3
```

```js
function* gen(max) {
  let init = 0;
  while (max--) yield init++;
}
from(gen(3)).subscribe(console.log); // 0,1,2
```

类似于：

```js
async function from(input) {
  input = input instanceof Promise ? [input] : input;
  for await (const i of input) {
    console.log(i);
  }
}
```

- fromEvent
- fromEventPattern
- `generate`：类似于 for 循环，其三个参数和 for 循环中三个部分一样的功能，传递给下游的数据就类似于 for 循环体中的功能：

```js
for (let x = 1; x < 3; x++) {
  console.log(x);
}
```

```js
generate(
  1,
  (x) => x < 3,
  (x) => x + 1
).subscribe(console.log);

// 1
// 2
```

- interval：定时触发一个整数值，从 0 开始递增，类似于 setInterval：

```js
let i = 0;
setInterval(() => {
  console.log(i++);
}, 1000);
```

```js
interval(1000).subscribe(console.log); // 从 0 开始每秒钟输出一个值
```

- of：吐出所有参数值

```js
of(1, 2, 3).subscribe(console.log);
```

类似于：

```js
function of(...args) {
  args.forEach((arg) => console.log(arg));
}
```

- range：根据初始值创建一系列递增数据

```js
range(1, 2).subscribe(console.log);
```

类似于：

```js
function range(start = 0, count) {
  while (count--) console.log(start++);
}
```

- throwError
- timer：

```js
timer(1000).subscribe(console.log); // 一秒后吐出 0
timer(1000, 200).subscribe(console.log); // 在 1 秒后首次吐出 0，然后每 200 毫秒吐出一个递增数据
```

类似于：

```js
function timer(dueTime, interval) {
  let i = 0;
  setTimeout(() => {
    console.log(i++);
    if (typeof interval === "number" && !isNaN(interval)) {
      setInterval(() => console.log(i++), interval);
    }
  }, dueTime);
}
```

- iif：接收一个函数和两个 Observable，每次 subscribe 的时候根据函数返回值动态决定使用哪个 Observable，类似于三元表达式。如果返回的不是 Observable 而是 undefined 则直接 complete。

> iif 的功能可以通过 defer 完成，不过 iif 对于简单的情况更方便

```js
let flag = true;
const ob = iif(() => flag, of("I am true"), of("I am false"));

ob.subscribe(console.log); // I am true

flag = false;
ob.subscribe(console.log); // I am false
```

类似于：

```js
function iif(con, trueResult, falseResult) {
  return con() ? trueResult : falseResult;
}
```
