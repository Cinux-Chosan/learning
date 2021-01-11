## Basic Types

- `unknown`：在我们编写程序的时候不确定的类型用 unknown，这些值可能在运行时来自用户，但我们希望可以接受这些值。这种情况下，我们希望提供一种类型告诉编译器和以后的读者该变量可能为任意类型，因此使用 `unknonw`。它需要使用者去确定具体类型。

如果希望缩小 `unknown` 的范围，可以使用 `typeof` 检查，比较符检查等 type guard 手段：

```ts
declare const maybe: unknown;
// 'maybe' could be a string, object, boolean, undefined, or other types
const aNumber: number = maybe;
// Error: Type 'unknown' is not assignable to type 'number'.

if (maybe === true) {
  // TypeScript knows that maybe is a boolean now
  const aBoolean: boolean = maybe;
  // So, it cannot be a string
  const aString: string = maybe;
  // Error: Type 'boolean' is not assignable to type 'string'.
}

if (typeof maybe === "string") {
  // TypeScript knows that maybe is a string
  const aString: string = maybe;
  // So, it cannot be a boolean
  const aBoolean: boolean = maybe;
  // Error: Type 'string' is not assignable to type 'boolean'.
}
```

---

- `any`：某些情况下，并非所有类型信息都可用，或者声明其类型将花费很多不必要的经历。这些情况通常会出现在前期不是使用 typescript 编写的代码或者一些第三方库中。这种情况我们希望不进行类型检查，因此使用 `any`

> 和 `unknown` 不同，`any` 允许你访问任意属性，即使这些属性不存在也能访问，如访问某个 `any` 类型变量上的方法，typescript 不会做任何存在性检查，也不会检查类型：

```ts
let looselyTyped: any = 4;
// OK, ifItExists might exist at runtime
looselyTyped.ifItExists();
// OK, toFixed exists (but the compiler doesn't check)
looselyTyped.toFixed();

let strictlyTyped: unknown = 4;
strictlyTyped.toFixed();
// Error: Object is of type 'unknown'.
```

并且 `any` 会通过对象传播，如下，`d` 也是 `any` 类型：

```ts
let looselyTyped: any = {};
let d = looselyTyped.a.b.c.d;
//  ^ = let d: any
```

---

- `void`：`void` 有点像 `any` 的反面：没有任何类型。例如没有返回值的函数的返回类型就是 `void`

声明 `void` 类型的变量没啥用，因为你只能将 `null`（未指定`--strictNullChecks` 的情况下）或者 `undefined` 赋值给它：

```ts
let unusable: void = undefined;
// OK if `--strictNullChecks` is not given
unusable = null;
```

---

- `null` 和 `undefined`：在 typescript 中，`undefined` 和 `null` 类型就是它们自身。

默认情况下，`null` 和 `undefined` 是所有其它类型的子类型。这意味着你可以将它们赋值给任意类型，如 `number`，如果指定了 `--strictNullChecks`，则 `null` 和 `undefined` 只能赋值给 `unknown`、`any` 和它们自身（有一个例外是 `undefined` 也能赋值给 `void`）。

---

- `never`：`never` 类型的值表示永远不会发生，如函数总是抛出异常或者永远不会返回。

`never` 是任意类型的子类型，但没有任何类型是 `never` 的子类型，包括它自己。即使是 `any` 也不能赋值给 `never`

---

- `object`：该类型代表非原始值类型，即不是 `number`、`string`、`boolean`、`bigint`、`symbol`、`null`、`undefined` 的值。

---

### 类型断言

有时候你比 typescript 更了解某个变量的具体类型。

类型断言相当于告诉编译器：“相信我，我明白自己在做什么”。

类型断言类似于其它语言中的类型转换，但是它不执行特殊的检查或者对数据产生任何影响，即不会重构数据。仅用于编译器使用。

类型断言有两种方式：

- `as` 语法：

```ts
let someValue: unknown = "this is a string";

let strLength: number = (someValue as string).length;
```

- 尖括号语法：

```ts
let someValue: unknown = "this is a string";

let strLength: number = (<string>someValue).length;
```

使用哪一个取决于你的个人喜好，不过在 JSX 中使用 typescript 时只能用 `as` 语法。

### Number, String, Boolean, Symbol 和 Object 不应该作为类型
