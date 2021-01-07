# Rxjs

下文“道理类似于”相关的代码只是个人用 js 大概表达了一下 rxjs 中对应操作符的意思，并不是实现，仅简单的逻辑对应关系。

## Creation Operators

- `ajax`

---

- bindCallback：将回调函数 API 转换成返回 Observable 的函数，该 Observable 吐出一个值后立即 complete

> 入参为函数且函数最后一个参数应该是一个回调函数，函数执行完成会用执行结果为入参调用该函数。

> 返回值也是一个函数，调用该函数会以相同的参数调用传给 bindCallback 的函数，并返回一个 Observable，**在每次 Observable 被 subscribe 的时候会执行传入的函数**

> `bindCallback` 并不是 operator，因为它的输入和输出都不是 Observable。入参为最后一个参数为回调函数的函数，在函数执行完成时会调用该回调函数。

> 除了最后一个参数，`bindCallback` 返回的函数和传入的函数参数相同。

```js
const getJSONAsObservable = bindCallback(jQuery.getJSON);
const result = getJSONAsObservable("/my/url");
result.subscribe(
  (x) => console.log(x),
  (e) => console.error(e)
);
```

道理类似于：

```js
function bindCallback(fn) {
  return function (...args) {
    return {
      subscribe: fn.bind(this, ...args),
    };
  };
}

// use case
const fn = function (name, callback) {
  setTimeout(() => {
    callback(`My name is ${name}`);
  }, 600);
};
const bound = bindCallback(fn);
bound("Chosan").subscribe(console.log); // My name is Chosan
```

---

- bindNodeCallback：同 `bindCallback`，但入参函数格式需要为 `callback(error, result)`。如果 `error` 不为 `null` 则会导致 Observable 执行 `error`，否则执行 `next` 并立即 `complete`

---

- `defer`：创建一个 Observable，在订阅时会通过工厂函数创建另一个 Observable，主要用于惰性创建 Observable

```js
defer(() => of("a"));
```

道理类似于：

```js
const defer = (factor) => factor();
```

---

- empty：创建一个直接 complete 的 Observable

```js
interval(1000)
  .pipe(mergeMap((x) => (x % 2 === 1 ? of("a", "b", "c") : empty())))
  .subscribe((x) => console.log(x)); // 每两秒输出一次 a,b,c
```

道理类似于：

```js
function empty() {}
```

---

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

道理类似于：

```js
async function from(input) {
  input = input instanceof Promise ? [input] : input;
  for await (const i of input) {
    console.log(i);
  }
}
```

---

- fromEvent

---

- fromEventPattern

---

- `generate`：类似于 for 循环，其三个参数和 for 循环中三个部分一样的功能，传递给下游的数据就类似于 for 循环体中的功能：

```js
generate(
  1,
  (x) => x < 3,
  (x) => x + 1
).subscribe(console.log);

// 1
// 2
```

类似于：

```js
for (let x = 1; x < 3; x++) {
  console.log(x);
}
```

道理类似于：

```js
function generate(init, condition, iterate) {
  for (; condition(init); init = iterate(init)) {
    console.log(init);
  }
}
```

---

- interval：定时触发一个整数值，从 0 开始递增，类似于 setInterval：

```js
interval(1000).subscribe(console.log); // 从 0 开始每秒钟输出一个值
```

道理类似于：

```js
let i = 0;
setInterval(() => {
  console.log(i++);
}, 1000);
```

---

- of：吐出所有参数值

```js
of(1, 2, 3).subscribe(console.log);
```

道理类似于：

```js
function of(...args) {
  args.forEach((arg) => console.log(arg));
}
```

---

- range：根据初始值创建一系列递增数据

```js
range(1, 2).subscribe(console.log);
```

道理类似于：

```js
function range(start = 0, count) {
  while (count--) console.log(start++);
}
```

---

- throwError

---

- timer：

```js
timer(1000).subscribe(console.log); // 一秒后吐出 0
timer(1000, 200).subscribe(console.log); // 在 1 秒后首次吐出 0，然后每 200 毫秒吐出一个递增数据
```

道理类似于：

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

---

- iif：接收一个函数和两个 Observable，每次 subscribe 的时候根据函数返回值动态决定使用哪个 Observable，类似于三元表达式。如果返回的不是 Observable 而是 undefined 则直接 complete。

> iif 的功能可以通过 defer 完成，不过 iif 对于简单的情况更方便

```js
let flag = true;
const ob = iif(() => flag, of("I am true"), of("I am false"));

ob.subscribe(console.log); // I am true

flag = false;
ob.subscribe(console.log); // I am false
```

道理类似于：

```js
const iif = (con, trueResult, falseResult) => (con() ? trueResult : falseResult);
```
