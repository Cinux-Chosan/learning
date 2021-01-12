# Functions

- 可选参数放在其他参数最后，且它们共享相同的函数类型

```ts
function buildName(firstName: string, lastName?: string) {
  // ...
}

function buildName(firstName: string, lastName = "Smith") {
  // ...
}
```

上面两个函数的函数签名都是：`(firstName: string, lastName?: string) => string`

- 默认参数不一定要放在最后，只要该位置的参数为`undefined` 就会触发默认参数赋值，如果默认参数不在最后就需要显式传入 `undefined`：

```ts
function buildName(firstName = "Will", lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
// Error: Expected 2 arguments, but got 1.
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
// Error: Expected 2 arguments, but got 3.
let result3 = buildName("Bob", "Adams"); // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams"); // okay and returns "Will Adams"
```

- 剩余参数使用 `...` 声明变量，它相当于是一组可选参数的集合，且 `...` 也会出现在类型中：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

