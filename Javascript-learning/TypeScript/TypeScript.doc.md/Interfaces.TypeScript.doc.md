# 接口

## 介绍

One of TypeScript’s core principles is that type-checking focuses on the shape that values have. This is sometimes called “duck typing” or “structural subtyping”. In TypeScript, interfaces fill the role of naming these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project.

TypeScript 的核心原则之一就是基于值的形态做类型检查. 有时候这被称作 "鸭子类型" 或者 "结构子类型". 在 TypeScript 中, 接口扮演的角色就是给这些类型命名, 它是一种代码约定, 这不仅存在与你的项目中, 也可能是和别的项目的约定.

## 第一个接口

The easiest way to see how interfaces work is to start with a simple example:

了解接口最简单的方法就是写一个简单的接口:

```ts
function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

The type-checker checks the call to `printLabel`. The `printLabel` function has a single parameter that requires that the object passed in has a property called `label` of type string. Notice that our object actually has more properties than this, but the compiler only checks that at least the ones required are present and match the types required. There are some cases where TypeScript isn’t as lenient, which we’ll cover in a bit.

上面的代码中, 类型检查器会在调用 `printLabel` 的时候对其进行检查. `printLabel` 方法只有一个参数, 这个参数需要是一个具有 `label` 属性并且类型为 `string` 的对象. 注意, 这个对象实际上有不止一个属性, 但是编译器只会检查是否有必要的属性和该属性的类型是否正确. 然而, 有时候 TypeScript 又没有这么宽松, 稍后会说到.

