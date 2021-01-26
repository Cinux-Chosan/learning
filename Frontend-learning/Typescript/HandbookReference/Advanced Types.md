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

类型别名为类型创建一个新的名字。类型别名类似于接口，但是可以用于命名原始类型、联合类型、元祖和其它任意类型：

```ts
type Second = number;

let timeInSecond: number = 10;
let time: Second = 10;
```

别名并不会创建一个新的类型，它只是对已有类型的一个引用。

和 interface 差不多，别名也可以是泛型的，我们可以添加类型参数：

```ts
type Container<T> = { value: T };
```

当然它内部属性也可以使用它自身的类型：

```ts
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};
```

与交叉类型结合：

```ts
type LinkedList<Type> = Type & { next: LinkedList<Type> };

interface Person {
  name: string;
}

let people = getDriversLicenseQueue();
people.name;
people.next.name;
people.next.next.name;
people.next.next.next.name;
//                  ^ = (property) next: LinkedList
```

## Interfaces vs. Type Aliases

虽然类型别名和 interface 很像，但也有细微差别。

大多数 interface 的特性都可以用于 `type`，主要的区别是类型不可以添加新的属性，但是 interface 可以继承：

```ts
// interface 继承
interface Animal {
  name: string;
}

interface Bear extends Animal {
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```

```ts
// 通过交叉类型来继承类型
type Animal = {
  name: string;
};

type Bear = Animal & {
  honey: Boolean;
};

const bear = getBear();
bear.name;
bear.honey;
```

但是面对添加新字段的时候：

```ts
// 给现有 interface 添加新字段
interface Window {
  title: string;
}

interface Window {
  ts: import("typescript");
}

const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
```

```ts
// 类型一旦创建不能修改
type Window = {
  title: string;
};

type Window = {
  ts: import("typescript");
};

// Error: Duplicate identifier 'Window'.
```

尽可能使用 interface 而不是类型别名。

如果不能使用 interface 而是要使用联合类型、元祖类型的时候，类型别名通常是更好的选择。

## Enum Member Types

略

## Polymorphic this types

略

## Index types

索引类型可以让编译器检查使用动态属性名的代码，下面是在 JavaScript 中获取对象子集的常用方式：

```ts
function pluck(o, propertyNames) {
  return propertyNames.map((n) => o[n]);
}
```

使用索引类型查询（index type query）和索引存取（indexed access）操作符使得你能够在 typescript 中使用这个函数：

```ts
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```

编译器会检查 `manufacturer` 和 `model` 是否真的是 `Car` 的属性。这个例子引入了一系列新的类型操作符：

1. 第一个就是 `keyof T`，它就是索引类型查询操作符。对于类型 `T` 而言，`keyof T` 是 `T` 中公有属性名的联合类型，例如：

```ts
let carProps: keyof Car;
//         ^ = let carProps: keyof Car
```

`keyof Car` 就是 `"manufacturer" | "model" | "year"`。不同点是如果你向 Car 中添加了其他属性，则 `keyof Car` 会自动包含新加入的属性。

```ts
// error, Type '"unknown"' is not assignable to type '"manufacturer" | "model" | "year"'
pluck(taxi, ["year", "unknown"]);
```

2. 第二个操作符是 `T[K]`，即索引存取操作符。它表示获取类型 `T` 中属性 `K` 的类型：

```ts
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
```

在上面的函数中，`o: T` 和 `propertyName: K` 得到的 `o[propertyName]: T[K]` 类型，它根据不同的属性名得到不同的类型：

```ts
let manufacturer: string = getProperty(taxi, "manufacturer");
let year: number = getProperty(taxi, "year");

let unknown = getProperty(taxi, "unknown");
// Error: Argument of type '"unknown"' is not assignable to parameter of type 'keyof Car'.
```

## Index types and index signatures

索引签名参数类型必须是 `string` 或者 `number`。对于一个字符串索引签名的类型，`keyof T` 是 `string | number`（因为在 JavaScript 中可以通过 `object["42"]` 或者 `object[42]` 来访问对象的属性）。`T[string]` 就是索引签名的类型：

```ts
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>;
//     ^ = let keys: string | number
let value: Dictionary<number>["foo"];
//      ^ = let value: number
```

对于数字索引签名的类型而言，`keyof T` 仅仅是 `number`：

```ts
interface Dictionary<T> {
  [key: number]: T;
}

let keys: keyof Dictionary<number>;
//     ^ = let keys: number
let numberValue: Dictionary<number>[42];
//     ^ = let numberValue: number
let value: Dictionary<number>["foo"];
// Error: Property 'foo' does not exist on type 'Dictionary<number>'.
```

## Mapped types

一种常见的场景是将已有类型的每个属性变成可选的：

```ts
interface PersonSubset {
  name?: string;
  age?: number;
}
```

也可能是想将它们转换成 `readonly`：

```ts
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```

typescript 提供了一种基于某个类型创建新类型的方式 —— 即 mapped 类型。在 mapped 类型中，新的类型会对原类型的每个属性进行转换。例如，你可以将它们转换成可选参数或者只读参数：

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

然后像下面这样使用它们：

```ts
type PersonPartial = Partial<Person>;
//   ^ = type PersonPartial = {
//       name?: string | undefined;
//       age?: number | undefined;
//   }
type ReadonlyPerson = Readonly<Person>;
//   ^ = type ReadonlyPerson = {
//       readonly name: string;
//       readonly age: number;
//   }
```

注意，该语法描述的是类型而非属性成员。你可以使用交叉类型来添加成员：

```ts
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// This is an error!
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean; // Error：'boolean' only refers to a type, but is being used as a value here.
'}' expected.
}
// Error：Declaration or statement expected.
```

来看一个简单的映射类型：

```ts
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```

这种语法类似于在索引签名类型中存在一个 `for .. in`，其中有三部分：

1. 类型变量 K 与每个属性绑定
2. 字符串字面量联合类型 `Keys` 包含了需要迭代的属性名
3. 属性的返回类型

上面的例子类型和属性名都是硬编码的，但是一般情况下都是基于已有类型，这就是需要 `keyof` 和 `索引存取类型` 的原因：

```ts
type NullablePerson = { [P in keyof Person]: Person[P] | null };
//   ^ = type NullablePerson = {
//       name: string | null;
//       age: number | null;
//   }
type PartialPerson = { [P in keyof Person]?: Person[P] };
//   ^ = type PartialPerson = {
//       name?: string | undefined;
//       age?: number | undefined;
//   }
```

泛型版本更加有用：

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
```

在这些例子中，属性列表是 `keyof T`，结果类型是 `T[P]` 的衍生。对于使用泛型类型的 mapped 类型来说是一个很好的模板。这是因为这种转换是[同形态](https://wikipedia.org/wiki/Homomorphism)的，意思就是仅对 `T` 的属性进行映射，没有其它依赖。编译器知道它能够拷贝所有已经存在的属性修饰符，如果 `Person.name` 是 readonly 的，`Partial<Person>.name` 也会包含 readonly 并且还是 optional 参数。

再来一个例子，`T[P]` 被包含在 `Proxy<T>` 中：

```ts
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  // ... wrap proxies ...
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
//  ^ = let proxyProps: Proxify<{
//      rooms: number;
//  }>
```

由于 `Readonly<T>` 和 `Partial<T>` 太过于通用，它们和 `Pcik`、`Record` 等直接被包含在 typescript 标准库中：

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

`Readonly`、`Partial` 和 `Pick` 都是同形态的，但是 `Record` 不是，因为 `Record` 并不是接收一个输入类型来拷贝属性：

```ts
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```

非同形态的类型实际上会创建新的属性，因此它们不能从任何地方拷贝属性修饰符。

注意 `keyof any` 代表任意可以作为索引的类型，简单说来就是 `string | number | symbol`。

## Inference from mapped types

现在你知道如何把一个类型的属性进行封装了，下一步就是如何将它们解封？

```ts
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originalProps = unproxify(proxyProps);
//  ^ = let originalProps: {
//      rooms: number;
//  }
```

注意，解封只对同形态的 mapped 类型生效。Record 不是同形态的 mapped 类型。如果某个 mapped 类型不是同形态的，则你不得不在解封函数中显示指定类型参数。

## Conditional Types

条件类型就是基于条件来决定采用何种类型：

```ts
T extends U ? X : Y
```

上面的代码表示：当 `T` 能够被赋值给 `U` 时类型是 `X`，否则类型是 `Y`

由于 `T extends U ? X : Y` 的条件依赖于一个或多个类型变量，因此它可能被解析为 X，也可能是 Y，还有可能延迟解析。解析为 `X` 或者 `Y` 还是说延迟解析取决于类型系统是否有足够的信息来推断 T 是否总是可以赋值给 U。

```ts
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number'
let x = f(Math.random() < 0.5);
//  ^ = let x: string | number
```

由于 `Math.random() < 0.5` 可能为 true，也可能为 false，因此 x 类型可能是 `string` 也可能是 `number`，所以为联合类型 `string | number`

另一个例子是 `TypeName` 类型别名，它使用嵌套的条件类型：

```ts
type TypeName<T> = T extends string ? "string" : T extends number ? "number" : T extends boolean ? "boolean" : T extends undefined ? "undefined" : T extends Function ? "function" : "object";

type T0 = TypeName<string>;
//   ^ = type T0 = "string"
type T1 = TypeName<"a">;
//   ^ = type T1 = "string"
type T2 = TypeName<true>;
//   ^ = type T2 = "boolean"
type T3 = TypeName<() => void>;
//   ^ = type T3 = "function"
type T4 = TypeName<string[]>;
//   ^ = type T4 = "object"
```

```ts
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // Has type 'U extends Foo ? string : number'
  let a = f(x);

  // This assignment is allowed though!
  let b: string | number = a;
}
```

在上面的例子中，变量 `a` 是一个条件类型，且并没有选中某一个条件分支。只有当调用 `foo` 的时候通过传入的参数 x 的类型才能决定 a 是何种类型。

只要条件类型的任意分支类型都满足目标类型，则可以将条件类型赋值给目标类型。

## Distributive conditional types

可分配条件类型。

可分配条件类型会自动运用到联合类型上，如条件类型是 `T extends U ? X : Y`，如果传给 `T` 的参数类型是 `A | B | C`，则最终类型是： `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`。

```ts
// TypeName 在上面定义过
type T5 = TypeName<string | (() => void)>;
//   ^ = type T5 = "string" | "function"
type T6 = TypeName<string | string[] | undefined>;
//   ^ = type T6 = "string" | "undefined" | "object"
type T7 = TypeName<string[] | number[]>;
//   ^ = type T7 = "object"
```

```ts
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T1 = Boxed<string>;
//   ^ = type T1 = {
//       value: string;
//   }
type T2 = Boxed<number[]>;
//   ^ = type T2 = {
//       array: number[];
//   }
type T3 = Boxed<string | number[]>;
//   ^ = type T3 = BoxedValue | BoxedArray
```

```ts
// Remove types from T that are assignable to U
// 从 T 类型中移除掉兼容类型 U 的类型
type Diff<T, U> = T extends U ? never : T;
// Remove types from T that are not assignable to U
// 从 T 类型中移除掉不兼容类型 U 的类型
type Filter<T, U> = T extends U ? T : never;

type T1 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;
//   ^ = type T1 = "b" | "d"
type T2 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
//   ^ = type T2 = "a" | "c"
type T3 = Diff<string | number | (() => void), Function>; // string | number
//   ^ = type T3 = string | number
type T4 = Filter<string | number | (() => void), Function>; // () => void
//   ^ = type T4 = () => void

// Remove null and undefined from T
type NotNullable<T> = Diff<T, null | undefined>;

type T5 = NotNullable<string | number | undefined>;
//   ^ = type T5 = string | number
type T6 = NotNullable<string | string[] | null | undefined>;
//   ^ = type T6 = string | string[]

function f1<T>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
  // Error: Type 'T' is not assignable to type 'Diff<T, null | undefined>'.
}

function f2<T extends string | undefined>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
  // Error: Type 'T' is not assignable to type 'Diff<T, null | undefined>'.
  //   Error: Type 'string | undefined' is not assignable to type 'Diff<T, null | undefined>'.
  //     Error: Type 'undefined' is not assignable to type 'Diff<T, null | undefined>'.
  let s1: string = x;
  // Error: Type 'T' is not assignable to type 'string'.
  //   Error: Type 'string | undefined' is not assignable to type 'string'.
  //     Error: Type 'undefined' is not assignable to type 'string'.
  let s2: string = y;
}
```

条件类型和 mapped 类型组合会非常有用：

```ts
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T1 = FunctionPropertyNames<Part>;
//   ^ = type T1 = "updatePart"
type T2 = NonFunctionPropertyNames<Part>;
//   ^ = type T2 = "id" | "name" | "subparts"
type T3 = FunctionProperties<Part>;
//   ^ = type T3 = {
//       updatePart: (newName: string) => void;
//   }
type T4 = NonFunctionProperties<Part>;
//   ^ = type T4 = {
//       id: number;
//       name: string;
//       subparts: Part[];
//   }
```

与联合和交叉类型相似，条件类型不允许递归引用自己。例如，以下是错误：

```ts
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // Error
```

## Type inference in conditional types

条件类型中的类型推断

在条件类型的 `extends` 语句中可以使用 `infer` 声明来表示某个类型需要被推断（个人理解为动态类型，相当于是从传入的类型中来获取类型。由于并不是所有的类型都能够硬编码出来，因此动态的去获取类型非常有用）。这种推断类型变量只能在条件类型的 `true` 分支被引用。

对于同一个类型变量可以有多个 `infer`。

```ts
// 从传入的类型中动态确定 R
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

可以嵌套条件类型以形成一系列按顺序求值的模式匹配：

```ts
// 不能确定传入的是什么类型数组类型，因此使用 infer 来获取 U 的类型，如果是 string[] 则 U 为 string，如果是 number[] 则 U 为 number
type Unpacked<T> = T extends (infer U)[] ? U : T extends (...args: any[]) => infer U ? U : T extends Promise<infer U> ? U : T;

type T0 = Unpacked<string>;
//   ^ = type T0 = string
type T1 = Unpacked<string[]>;
//   ^ = type T1 = string
type T2 = Unpacked<() => string>;
//   ^ = type T2 = string
type T3 = Unpacked<Promise<string>>;
//   ^ = type T3 = string
type T4 = Unpacked<Promise<string>[]>;
//   ^ = type T4 = Promise
type T5 = Unpacked<Unpacked<Promise<string>[]>>;
//   ^ = type T5 = string
```

下面展示同一个类型变量 `U` 被推断为**联合类型**的情况：

```ts
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
//   ^ = type T1 = string
type T2 = Foo<{ a: string; b: number }>;
//   ^ = type T2 = string | number
```

下面展示同一个类型变量 `U` 被推断为**交叉类型**的情况：

```ts
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;

type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;
//   ^ = type T1 = string
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
//   ^ = type T2 = never
```

当从多个调用签名（如函数重载）中推断类型的时候，从最后一个签名中获取引用（一般是重载的兜底方案）。无法根据参数列表分别对重载进行解析推断。

```ts
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: number): boolean;
declare function foo(x: string | number): string | number;

type T1 = ReturnType<typeof foo>;
//   ^ = type T1 = string | number
```

对于常规类型参数而言，不能使用 `infer` 声明：

```ts
type ReturnedType<T extends (...args: any[]) => infer R> = R;
// 'infer' declarations are only permitted in the 'extends' clause of a conditional type.
// Cannot find name 'R'.
```

但是可以采用曲线救国的思路，移除掉约束中的类型变量，使用条件类型来取代：

```ts
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R ? R : any;
```
