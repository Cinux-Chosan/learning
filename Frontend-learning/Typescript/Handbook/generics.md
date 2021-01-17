# Generics

## Working with Generic Type Variables

泛型函数中的变量类型 `T` 实际上是通用类型，它可能是任意类型，因此你不能假设它一定会具有什么成员变量，即如果没有任何地方表明它是数组或者字符串或者具有 `length` 成员的对象，就不能调用对应变量的 `.length` 属性：

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  // Error: Property 'length' does not exist on type 'T'.
  return arg;
}
```

## Generic Types

在前面我们创建了泛型函数 identity。本节我们来看看泛型函数类型和泛型接口。

泛型函数类型和普通函数没有太大差别，只是具有类型参数列表：

```ts
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: <T>(arg: T) => T = identity;
```

也可以使用对象字面量类型的调用签名来编写泛型类型：

```ts
function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: { <T>(arg: T): T } = identity;
```

然后我们把它移到接口中：

```ts
interface GenericIdentityFn {
  <T>(arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn = identity;
```

再做一些小改动，我们将泛型参数移到整个 interface 上，这样可以使得 interface 内部都可以使用到该类型：

```ts
// 泛型移到了 interface 上
interface GenericIdentityFn<T> {
  (arg: T): T;
}

function identity<T>(arg: T): T {
  return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

这里和前一个例子稍有不同。前面是定义了一个泛型函数，这里是定义了一个泛型接口中的非泛型函数。因此现在在使用 `GenericIdentityFn` 的时候需要指定参数类型。

除了泛型接口，我们还可以创建泛型类型，但需要注意的是不能创建泛型 enum 和泛型 namesapce。

## Generic Classes

```ts
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) {
  return x + y;
};
```

泛型类只作用于类的实例端，不作用与类的静态端。

## Generic Constraints

还是之前的例子：

```ts
function loggingIdentity<T>(arg: T): T {
  console.log(arg.length);
  // Property 'length' does not exist on type 'T'.
  return arg;
}
```

如果我们希望将类型 `T` 限制为至少有 `length` 属性的类型，则可以通过 `extends` 来完成：

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length); // Now we know it has a .length property, so no more error
  return arg;
}
```

由于现在泛型函数存在约束，它不再对所有类型适用。

## Using Type Parameters in Generic Constraints

可以通过一个类型参数来约束另一个类型参数。例如我们希望通过属性名获取一个对象上的字段值，我们需要确保该对象上存在对应的属性，因此我们需要对两个类型进行约束：

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a");
getProperty(x, "m");
// Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
```

## Using Class Types in Generics

```ts
function create<T>(c: { new (): T }): T {
  return new c();
}
```

更高级的用法：

```ts
class BeeKeeper {
  hasMask: boolean;
}

class ZooKeeper {
  nametag: string;
}

class Animal {
  numLegs: number;
}

class Bee extends Animal {
  keeper: BeeKeeper;
}

class Lion extends Animal {
  keeper: ZooKeeper;
}

function createInstance<A extends Animal>(c: new () => A): A {
  // 传入构造函数，返回继承自 Animal 类型的实例
  return new c();
}

createInstance(Lion).keeper.nametag;
createInstance(Bee).keeper.hasMask;
```
