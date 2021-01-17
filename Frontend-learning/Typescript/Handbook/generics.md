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
