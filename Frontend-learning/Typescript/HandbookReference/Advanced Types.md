# Advanced Types

## Type Guards and Differentiating Types

类型守卫和类型区分

联合类型虽然在可用类型出现重叠的时候非常有用，但是我们只能访问联合类型中所有成员都必须有的公有成员：

```ts
let pet = getSmallPet();

// You can use the 'in' operator to check
if ("swim" in pet) {
  pet.swim();
}
// However, you cannot use property access
if (pet.fly) {
  // Error: Property 'fly' does not exist on type 'Fish | Bird'.
  //   Error: Property 'fly' does not exist on type 'Fish'.
  pet.fly();
  // Error: Property 'fly' does not exist on type 'Fish | Bird'.
  //   Error: Property 'fly' does not exist on type 'Fish'.
}
```

为了让上面的代码能够工作，我们需要用到类型断言：

```ts
let pet = getSmallPet();
let fishPet = pet as Fish;
let birdPet = pet as Bird;

if (fishPet.swim) {
  fishPet.swim();
} else if (birdPet.fly) {
  birdPet.fly();
}
```

但是这种代码并不是我们希望的样子。

## User-Defined Type Guards

如果我们执行检查之后就能在对应的分支知道 `pet` 的类型就好了。

这就是 typescript 中的类型守卫(type guard)。类型守卫就是一些用于在某些作用域内确保类型正确的运行时检查的表达式。

### Using type predicates

我们可以简单的定义一个返回类型为 `类型断言` 的函数来定义类型守卫：

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` 就是这个例子中的类型断言。断言的格式为 `parameterName is Type`，其中 `parameterName` 必须是函数签名中的参数。

任何时候使用某个变量调用 `isFish`，typescript 都会在类型兼容的情况下缩小该变量的类型。

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

typescript 不仅知道在 `if` 分支中 `pet` 是 `Fish` 类型，并且还知道在 `else` 分支中 `pet` 不是 `Fish` 类型，因此它肯定是 `Bird` 类型。

你可能会用 `isFish` 来过滤一个 `Fish | Bird` 类型的数组：

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter<Fish>(isFish);
const underWater3: Fish[] = zoo.filter<Fish>((pet) => isFish(pet));
// Error: Argument of type '(pet: Fish | Bird) => boolean' is not assignable to parameter of type '(value: Fish | Bird, index: number, array: (Fish | Bird)[]) => value is Fish'.
// Error: Signature '(pet: Fish | Bird): boolean' must be a type predicate.
```

其中用于 filter 的回调函数需要是 `类型断言` 的格式，即返回类型是 `parameterName is Type`。因此上面第三种写法无法通过。

### Using the in operator

`in` 操作符也充当了作为缩小类型的表达式。

对于 `n in x` 这个表达式，`n` 是一个字符串类型，`x` 是一个联合类型。在该条件为 `true` 的分支中类型会缩小为那些具有 `n` 的类型，`false` 条件分支中类型会缩小为没有 `n` 的类型，对于可能存在 `n` 的类型，则在运行时会决定：

```ts
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

## typeof type guards

用类型断言来写一个使用联合类型的 `padLeft` 方法：

```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

然而，如果需要定义一个函数来缩小类型其实显得很冗余。并不需要将 `typeof x === 'number'` 封装到一个方法中来调用，因为在 typescript 中它本身就是一种类型守卫，因此可以下面这样写：

```ts
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

这些 `typeof` 类型守卫可以用于 `"undefined"`, `"number"`, `"string"`, `"boolean"`, `"bigint"`, `"symbol"`, `"object"`, `"function"` 类型，其他类型不会被识别。

## instanceof type guards

`instanceof` 和 `typeof` 类似。`instanceof` 类型守卫使用构造函数来缩小类型范围。

```ts
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();
//       ^ = let padder: Padder

if (padder instanceof SpaceRepeatingPadder) {
  padder;
  //       ^ = Could not get LSP result: er;>
  //       <  /
}
if (padder instanceof StringPadder) {
  padder;
  //       ^ = Could not get LSP result: er;>
  //       <  /
}
```

`instanceof` 右边需要一个构造函数，typescript 将会按照下面的顺序将其类型范围缩小为:

1. 如果构造函数的 `prototype` 类型不是 `any`，则为其 `prototype` 的类型
2. 该类型的构造函数签名返回的所有类型的联合类型

## Nullable types

typescript 有两个特殊类型：`null` 和 `undefined`，它们可以赋值给任意类型，你也无法阻止它们被赋值给其他类型。

[`--strictNullChecks`](https://www.typescriptlang.org/tsconfig#strictNullChecks) 解决了这个问题：当你声明一个变量的时候，它不会自动包含 `null` 和 `undefined`，你可以通过显式使用联合类型来包含它们：

```ts
let exampleString = "foo";
exampleString = null;
// Error: Type 'null' is not assignable to type 'string'.

let stringOrNull: string | null = "bar";
stringOrNull = null;

stringOrNull = undefined;
// Error: Type 'undefined' is not assignable to type 'string | null'.
```

注意，为了满足 JavaScript 语义，typescript 对待 `null` 和 `undefined` 是有区别的。`string | null` 和 `string | undefined` 以及 `string | undefined | null` 都是不一样的。

自从 typescript 3.7 开始，你可以使用[可选链](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining)

### Optional parameters and properties

如果指定了 [--strictNullChecks](https://www.typescriptlang.org/tsconfig#strictNullChecks)，可选参数还是会自动添加 `| undefined`：

```ts
function f(x: number, y?: number) {
  return x + (y ?? 0);
}

f(1, 2);
f(1);
f(1, undefined);
f(1, null);
// Error: Argument of type 'null' is not assignable to parameter of type 'number | undefined'.
```

对于可选属性也是一样的：

```ts
class C {
  a: number;
  b?: number;
}

let c = new C();

c.a = 12;
c.a = undefined;
// Error: Type 'undefined' is not assignable to type 'number'.
c.b = 13;
c.b = undefined;
c.b = null;
// Error: Type 'null' is not assignable to type 'number | undefined'.
```

### Type guards and type assertions

由于空类型使用联合类型来实现，因此你需要使用类型守卫来移除 `null`：

```ts
function f(stringOrNull: string | null): string {
  if (stringOrNull === null) {
    return "default";
  } else {
    return stringOrNull;
  }
}
```

由于这样消除 `null` 显得有些多余，你可以使用 terser 操作符来完成：

```ts
function f(stringOrNull: string | null): string {
  return stringOrNull ?? "default"; // 同 stringOrNull !== null && stringOrNull !== void 0 ? stringOrNull : "default";
}
```

在编译器不能移除 `null` 或者 `undefined` 的情况下你可以使用类型断言操作符来手动移除它们，语法就是加上 `!` 后缀：`identifier!` 表示从 `identifier` 的类型中移除 `null` 和 `undefined`：

```ts
interface UserAccount {
  id: number;
  email?: string;
}

const user = getUser("admin");
user.id;
// Error: Object is possibly 'undefined'.

if (user) {
  user.email.length;
  // Error: Object is possibly 'undefined'.
}

// Instead if you are sure that these objects or fields exist, the
// postfix ! lets you short circuit the nullability
user!.email!.length;
```

## Type Aliases
