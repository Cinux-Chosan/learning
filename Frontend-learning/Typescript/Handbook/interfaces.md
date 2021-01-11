# Interfaces

typescript 的类型检查是基于值的结构来完成的。有时候被称为“鸭子类型”

在 typescript 中，接口用于定义这些类型及其结构。

### 第一个接口

```ts
function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

在调用 printLabel 的时候， typescript 会校验传入的参数是否具有 label 为 `string` 类型的属性。

然后再以接口的方式来完成上面的例子：

```ts
interface LabeledValue {
  label: string;
}

function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);
```

### 可选属性

属性名后加 `?`

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}
```

### readonly 属性

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}
```

typescript 还提供了数组的 readonly 写法 `ReadonlyArray<T>`，它和 `Array<T>` 一样，只不过所有可以修改数组的方法都被移除掉了：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

ro[0] = 12; // error!
// Error: Index signature in type 'readonly number[]' only permits reading.
ro.push(5); // error!
// Error: Property 'push' does not exist on type 'readonly number[]'.
ro.length = 100; // error!
// Error: Cannot assign to 'length' because it is a read-only property.
a = ro; // error!
// Error: The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
```

从最后一行你可以看到，即使是将 `ReadonlyArray` 赋值回普通数组也是不可以的。需要通过类型断言：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

a = ro as number[];
```

#### readonly vs const

变量用 `const`，属性用 `readonly`

### Excess Property Checks

在前面我们看到过函数参数只需要 `{ label: string; }` 类型但是我们传入的参数是 `{ size: number; label: string; }` 的情况。也知道可选参数表示某些字段可以忽略，但是下面的代码会报错：

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
  return {
    color: config.color || "red",
    area: config.width ? config.width * config.width : 20,
  };
}

let mySquare = createSquare({ colour: "red", width: 100 });
// Error: Argument of type '{ colour: string; width: number; }' is not assignable to parameter of type 'SquareConfig'.
// Error: Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
```

typescript 在将对象字面量赋值给其它变量时存在特殊处理，会进行多余的属性检查。如果对象字面量中有的属性但是目标变量类型中不包含该属性，则会报错。

            即对象字面量在赋值的时候属性不能超过目标变量的类型

            对象字面量作为参数传递实际上也是赋值的一种操作，因此也会存在多余字段的校验。

消除该错误可以使用以下几种方式：

- 使用类型断言：

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

- 如果你确定对象具有额外的属性用于其他用途，则可以声明字符串索引签名：

```ts
interface SquareConfig {
  color?: string;
  width?: number;
  [propName: string]: any;
}
```

- 将对象字面量提取到变量中，这种做法只要有共同属性则会通过，下面由于没有共同属性，因此无法通过

```ts
let squareOptions = { colour: "red" };
let mySquare = createSquare(squareOptions);
// Error: Type '{ colour: string; }' has no properties in common with type 'SquareConfig'.
```

## Function Types

interface 也可以描述函数类型

要描述函数类型，我们需要给接口一个调用签名：就像函数声明一样，但只指定参数列表和返回值。参数列表中的每个参数都需要名字和类型：

```ts
interface SearchFunc {
  (source: string, subString: string): boolean;
}
```

## Indexable Types

索引类型定义属性和返回值的类型：

```ts
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray;
myArray = ["Bob", "Fred"];

let myStr: string = myArray[0];
```

上面的例子表示 `StringArray` 这个类型使用 `number` 作为索引，返回的属性值为 `string` 类型。

支持的索引签名中有两种：`number` 和 `string`，但是 `number` 索引的返回值需要是 `string` 返回值的子类型，因为在 JavaScript 中，使用数字作为索引访问对象属性的时候实际上也会被转换为字符串索引：

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Error: indexing with a numeric string might get you a completely separate type of Animal!
interface NotOkay {
  [x: number]: Animal;
  // Error: Numeric index type 'Animal' is not assignable to string index type 'Dog'.
  [x: string]: Dog;
}
```

尽管字符串索引在描述字典类型的时候非常强大，但是它同时也要求所有属性满足对应的类型：

```ts
interface NumberDictionary {
  [index: string]: number;
  length: number; // ok, length is a number
  name: string; // error, the type of 'name' is not a subtype of the indexer
  // Error: Property 'name' of type 'string' is not assignable to string index type 'number'.
}
```

使用联合类型可以解决这个问题：

```ts
interface NumberOrStringDictionary {
  [index: string]: number | string;
  length: number; // ok, length is a number
  name: string; // ok, name is a string
}
```

同时，索引类型也可以加 `readonly` 表示只读。

## Class Types

接口也能够用来定义 Class 的公有属性。类只需要实现该接口即可。

```ts
interface ClockInterface {
  currentTime: Date;
  setTime(d: Date): void;
}

class Clock implements ClockInterface {
  currentTime: Date = new Date();
  setTime(d: Date) {
    this.currentTime = d;
  }
  constructor(h: number, m: number) {}
}
```

### Difference between the static and instance sides of classes

class 有静态与实例态两种形态。

当你使用 interface 来创建一个构造函数签名并尝试使用一个 class 来实现该 interface 会报错：

```ts
interface ClockConstructor {
  new (hour: number, minute: number);
}

class Clock implements ClockConstructor {
  // Error: Class 'Clock' incorrectly implements interface 'ClockConstructor'.
  // Error: Type 'Clock' provides no match for the signature 'new (hour: number, minute: number): any'.
  currentTime: Date;
  constructor(h: number, m: number) {}
}
```

这是由于当一个 class 实现 interface 的时候，只有 class 的实例态会被检查。由于 constructor 是静态方法，因此不会被包含到检查中。

因此，你需要使用到 class 的静态一侧。在这个例子中，我们定义了两个 interface，`ClockConstructor` 用于构造函数，`ClockInterface` 用于实例方法。为了方便，我们定义了一个构造函数方法 `createClock` 来创建实例：

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
  return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
}

class AnalogClock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("tick tock");
  }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

因为 `createClock` 的第一个参数是 `ClockConstructor`，`AnalogClock` 和 `DigitalClock` 都有对应的构造函数签名，因此没有问题。

另一种方式是使用 class 表达式：

```ts
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
    console.log("beep beep");
  }
};

let clock = new Clock(12, 17);
clock.tick();
```

## Extending Interfaces

和 class 一样，interface 也能够继承。这使得你能够拷贝某个 interface 的成员到另一个 interface 中。

```ts
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

## Hybrid Types

有时候可能需要某个对象的类型是上面各种类型的组合，比较常见的就是函数具有额外属性的情况：

```ts
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
  let counter = function(start: number) {} as Counter;
  counter.interval = 123;
  counter.reset = function() {};
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

## Interfaces Extending Classes

当一个接口继承 class 的时候，只会继承 class 的成员但不会继承它们的实现方式。interface 甚至能继承 class 的 private 和 protected 成员。这意味着当你通过继承一个具有 private 和 protected 属性的 class 来创建 interface 时，该 interface 只能被该 class 或其子类实现。

This is useful when you have a large inheritance hierarchy, but want to specify that your code works with only subclasses that have certain properties. The subclasses don’t have to be related besides inheriting from the base class. For example:

```ts
class Control {
  private state: any;
}

interface SelectableControl extends Control {
  select(): void;
}

class Button extends Control implements SelectableControl {
  select() {}
}

class TextBox extends Control {
  select() {}
}

class ImageControl implements SelectableControl {
  // Error: Class 'ImageControl' incorrectly implements interface 'SelectableControl'.
  // Error: Types have separate declarations of a private property 'state'.
  private state: any;
  select() {}
}
```

在上面的例子中，`SelectableControl` 包含了 `Control` 中的所有成员，包括私有的 `state` 属性。由于 `state` 是一个私有成员，因此只能 `Control` 的子类来实现 `SelectableControl`。因为只有 `Control` 的子类才有同源的私有 `state` 成员，这是需要兼容私有成员的必要条件。

在 `Control` 类中，通过 `SelectableControl` 的实例可以访问到私有的 `state` 属性。事实上，`SelectableControl` 的角色类似于 `Control`。`Button` 和 `TextBox` 都是 `SelectableControl` 的子类型（因为他们都继承自 `Control` 并且有一个 `select` 方法）。`ImageControl` 类有自己的私有 `state` 成员而非继承自 `Control`，所以它不能实现 `SelectableControl`。
