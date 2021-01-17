# Enums

typescript 提供了数值和字符串枚举

## Numeric enums

```ts
enum Direction {
  Up, // 默认从 0 开始递增
  Down,
  Left,
  Right,
}
```

数值枚举可以和计算枚举成员一起混合使用。简而言之就是没有初始化的枚举成员要么是第一个，要么在使用数值、其它常量枚举成员初始化的成员之后。也就是不能有下面这种情况：

```ts
enum E {
  A = getSomeValue(),
  B, // Error: Enum member must have initializer.
}
```

## String enums

```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

## Heterogeneous enums

不同的枚举类型混合使用：

```ts
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

## Computed and constant members

每个枚举成员必须有关联的值，该值要么是常量，要么是计算所得。以下情况会被考虑为常量：

- 在枚举成员第一个位置并且没有进行初始化，这种情况下为 `0`

```ts
// E.X is constant:
enum E {
  X,
}
```

- 没有进行初始化但在它前面的成员是数值常量。这种情况下当前元素的初始值就是上一个成员初始值加 `1`

```ts
enum E2 {
  A = 1.1,
  B, // 2.1
  C, // 3.1
}
```

- 枚举成员用常量枚举表达式。常量枚举表达式是 typescript 表达式的子集，且其值在编译期间被计算出来。一个表达式如果要是常量表达式需要满足：
  1. 一个字面量枚举表达式（通常是一个字符或者一个数值）
  2. 引用之前定义的常量枚举成员
  3. 带圆括号的常量枚举表达式
  4. 使用 `+`、`-`、`~` 之一的一元运算符的常量枚举表达式
  5. 使用 `+`、`-`、`*`、`/`、`%`、`<<`、`>>`、`>>>`、`&`、`|`、`^` 二元操作符的常量枚举表达式

如果计算出来是 `NaN` 或者 `Infinity` 则会在编译期间抛出异常

所有其他情况枚举成员都会被当做计算所得。

```ts
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length,
}
```

## Union enums and enum member types

字面量枚举成员是指：要么它是没有初始化的常量枚举成员，要么它使用以下值进行初始化：

- 任何字符串字面量
- 任何数值字面量
- 对数值字面量运用 `-` 操作符，即负数

当一个枚举中所受成员都是字面量枚举值时，就有一些特殊的效果。

1. 首先就是，这种情况下枚举成员也变成类一种类型：

```ts
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square, // Error: Type 'ShapeKind.Square' is not assignable to type 'ShapeKind.Circle'.
  radius: 100,
};
```

这样能够将类型更加的细化。

2. 另一个变化是枚举类型本身代表了枚举成员的联合类型。

因此类型系统能够利用这一点进行一些错误判断。

```ts
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    // Error: This condition will always return 'true' since the types 'E.Foo' and 'E.Bar' have no overlap.
    //
  }
}
```

## Enums at runtime

在运行时，枚举是真正的 JavaScript 实体对象，能够通过参数传递：

```ts
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

## Enums at compile time

尽管枚举在运行时是真正的对象，但是使用 `keyof` 却不能像你想象中的那样正常工作，如果要得到一个枚举类型的键的类型，需要使用 `keyof typeof`：

```ts
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
```

## Reverse mappings

除了为每个成员创建具有属性名的对象之外，数值类枚举还会进行反向映射，即还会使用值映射会字段名，例如：

```ts
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

编译之后会得到：

```js
"use strict";
var Enum;
(function(Enum) {
  Enum[(Enum["A"] = 0)] = "A";
})(Enum || (Enum = {}));
let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

或者：

```ts
enum a {
  C,
  A = "1",
  B = "2",
}
```

编译之后得到：

```ts
var a;
(function(a) {
  a[(a["C"] = 0)] = "C"; // 只有 C 是数值枚举，因此它有反向映射
  a["A"] = "1";
  a["B"] = "2";
})(a || (a = {}));
```

> **只有数值枚举成员才会存在反向映射，字符串枚举成员是没有反向映射的！**

## const enums

在大多数情况下，枚举是一个完全有效的解决方案。但有时候为了避免引入额外的代码，可以使用 `const enum` 定义常量枚举：

```ts
const enum Enum {
  A = 1,
  B = A * 2,
}
```

常量枚举只能使用常量枚举类型表达式，并且和普通枚举不一样，它在编译之后将会被移除。因此只能使用内联的形式访问这些成员：

```ts
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [Direction.Up, Direction.Down, Direction.Left, Direction.Right];
```

编译之后：

```js
"use strict";
let directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

## Ambient enums

Ambient enums 用于描述**现有**枚举类型的结构：

```ts
declare enum Enum {
  A = 1,
  B,
  C = 2,
}

const a = Enum.B;
```

编译之后只剩下：

```js
var a = Enum.B; // 相当于为了使用其它地方定义的枚举类型，对该类型进行了一次声明
```

ambient 枚举和非 ambient 枚举的一个重要区别在于：常规枚举类型中，如果某个成员没有初始化且它前一个枚举成员是常量成员，则它也会被当做常量成员。相反，没有初始化的 ambient 枚举成员始终会被当做计算成员。
