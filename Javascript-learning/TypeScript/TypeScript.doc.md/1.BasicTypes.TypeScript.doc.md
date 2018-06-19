# 基本类型

## 简介

For programs to be useful, we need to be able to work with some of the simplest units of data: numbers, strings, structures, boolean values, and the like. In TypeScript, we support much the same types as you would expect in JavaScript, with a convenient enumeration type thrown in to help things along.

要让程序发挥作用，我们就需要能够使用一些最简单的数据单元：数字，字符串，结构体，布尔类型等。在 TypeScript 中，我们不仅支持和 JavaScript 相同的类型，还引入了枚举类型来帮助解决各种问题。

## Boolean

最常用的基本数据类型如 true/false，在JavaScript和TypeScript中被称为 boolean 值。

```ts
let isDone: boolean = false;
```

## Number

As in JavaScript, all numbers in TypeScript are floating point values. These floating point numbers get the type number. In addition to hexadecimal and decimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.

和JavaScript一样，TypeScript中的所有数字都是浮点值。 这些浮点数字就是 `number` 类型。除了十六进制和十进制外，TypeScript 还支持 ECMAScript 2015 中引入的二进制和八进制。

```ts
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
```

## String

Another fundamental part of creating programs in JavaScript for webpages and servers alike is working with textual data. As in other languages, we use the type string to refer to these textual datatypes. Just like JavaScript, TypeScript also uses double quotes (") or single quotes (') to surround string data.

用JavaScript创建网页和服务器程序的另一个基本部分是使用文本数据。和其他语言一样，我们使用 `string` 类型来引用这些文本数据类型。并且跟JavaScript一样，同样可是使用单引号和双引号包裹字符串中的数据。

```ts
let color: string = "blue";
color = 'red';
```

You can also use template strings, which can span multiple lines and have embedded expressions. These strings are surrounded by the backtick/backquote (`) character, and embedded expressions are of the form ${ expr }.

你也可以使用字符串模板，它可以跨越多行，并且可以嵌入表达式。这些字符串被包裹在反引号 (\`) 中，嵌入的表达式被包裹在 `${}` 中。

```ts
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${ fullName }.

I'll be ${ age + 1 } years old next month.`;
```

This is equivalent to declaring sentence like so:

它跟下面这种写法一样：

```js
let sentence: string = "Hello, my name is " + fullName + ".\n\n" +
    "I'll be " + (age + 1) + " years old next month.";
```

## Array

TypeScript, like JavaScript, allows you to work with arrays of values. Array types can be written in one of two ways. In the first, you use the type of the elements followed by `[]` to denote an array of that element type:

在 TypeScript 中， 数组有两种写法，第一种就是类 `[]` 前面加上类型来表示数组中元素的类型：

```ts
let list: number[] = [1, 2, 3];
```

The second way uses a generic array type, `Array<elemType>`:

第二种方式就是使用通用数组类型 `Array<elemType>`:

```ts
let list: Array<number> = [1, 2, 3];
```

## Tuple

Tuple types allow you to express an array where the type of a fixed number of elements is known, but need not be the same. For example, you may want to represent a value as a pair of a `string` and a `number`:

元祖类型能够让你给数组声明固定数量的已知类型。例如，你希望用一种方式表示一对 `string` 和 `number`：

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

When accessing an element with a known index, the correct type is retrieved:

当访问的元素在数组中时，将准确的检索该元素的类型(如果不在声明类型中, 则会报错)：

```ts
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

When accessing an element outside the set of known indices, a union type is used instead:

当访问的元素超出索引范围时，将使用联合类型来检查类型(如果类型不在联合类型中, 则报错)：

```ts
x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

x[6] = true; // Error, 'boolean' isn't 'string | number'
```

Union types are an advanced topic that we’ll cover in a later chapter.

联盟类型作为一个高级话题将在后面的章节中进行介绍。

## Enum (枚举)

A helpful addition to the standard set of datatypes from JavaScript is the `enum`. As in languages like C#, an enum is a way of giving more friendly names to sets of numeric values.

`enum` 是对 JavaScript 基本数据类型的一种补充. 枚举类型用于给一组数值类型指定一个对人类友好的名字.

```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

By default, enums begin numbering their members starting at `0`. You can change this by manually setting the value of one of its members. For example, we can start the previous example at `1` instead of `0`:

默认情况下, 枚举的值从 `0` 开始. 你可以改变其中任意一个的值, 比如, 我们可以从 `1` 而非 `0` 开始:

```ts
enum Color {Red = 1, Green, Blue}
let c: Color = Color.Green;
```

Or, even manually set all the values in the enum:

或者, 手动设置所有的值:

```ts
enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;
```

A handy feature of enums is that you can also go from a numeric value to the name of that value in the enum. For example, if we had the value `2` but weren’t sure what that mapped to in the `Color` enum above, we could look up the corresponding name:

枚举还有一个比较方便的特性就是你可以数值得到它在枚举中的名字. 例如, 现在你不确定 `2` 是否在枚举 `Color` 中, 我们可以查看它是否有名字:

```ts
enum Color {Red = 1, Green, Blue}
let colorName: string = Color[2];

alert(colorName); // Displays 'Green' as its value is 2 above
```

## Any

We may need to describe the type of variables that we do not know when we are writing an application. These values may come from dynamic content, e.g. from the user or a 3rd party library. In these cases, we want to opt-out of type-checking and let the values pass through compile-time checks. To do so, we label these with the `any` type:

我们写程序的时候并不是时刻都知道变量会是什么类型. 这些值可能来自动态的内容, 如来自用户或者第三方库. 这些情况下, 我们希望在编译过程中不对它做类型检查, 为了达到这样的目的, 我们就使用 `any` 类型:

```ts
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

The `any` type is a powerful way to work with existing JavaScript, allowing you to gradually opt-in and opt-out of type-checking during compilation. You might expect `Object` to play a similar role, as it does in other languages. But variables of type `Object` only allow you to assign any value to them - you can’t call arbitrary methods on them, even ones that actually exist:

`any` 类型让你在编译期间能够任意出入类型检查. 你可能希望 `Object`(TypeScript 中的类型之一, 而非 JavaScript 的 Object) 能够扮演像其他语言一样的角色. 但是 `Object` 类型的变量仅仅允许你把任何值赋值给它 - 你不能调用它们任意的方法, 即便是存在的方法:

```ts
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

The `any` type is also handy if you know some part of the type, but perhaps not all of it. For example, you may have an array but the array has a mix of different types:

`any` 类型在你知道一部分变量类型时也很方便. 例如, 一个可能混合了任何变量类型的数组:

```ts
let list: any[] = [1, true, "free"];

list[1] = 100;
```

## Void

`void` is a little like the opposite of `any`: the absence of having any type at all. You may commonly see this as the return type of functions that do not return a value:

`void` 更像是 `any` 的对立面: 没有任何类型. 你会经常在没有任何返回值的函数中看到这个类型:

```ts
function warnUser(): void {
    alert("This is my warning message");
}
```

Declaring variables of type `void` is not useful because you can only assign `undefined` or `null` to them:

声明 `void` 的类型并没有太大用处, 因为只能给它赋值 `undefined` 和 `null`:

```ts
let unusable: void = undefined;
```

## Null and Undefined

In TypeScript, both `undefined` and `null` actually have their own types named `undefined` and `null` respectively. Much like `void`, they’re not extremely useful on their own:

在 TypeScript 中, `undefined` 和 `null` 实际上分别就是 `undefined` 类型和 `null` 类型. 和 `void` 一样, 申明这种类型并没有太大作用:

```ts
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

By default `null` and `undefined` are subtypes of all other types. That means you can assign `null` and `undefined` to something like `number`.

`null` 和 `undefined` 默认是作为我有其他类型的子类型. 因此你可以将 `null` 和 `undefined` 赋值给任意类型:

However, when using the `--strictNullChecks` flag, `null` and `undefined` are only assignable to `void` and their respective types. This helps avoid many common errors. In cases where you want to pass in either a `string` or `null` or `undefined`, you can use the union type `string` | `null` | `undefined`. Once again, more on union types later on.

然而, 如果使用了 `--strictNullChecks` 标志, `null` 和 `undefined` 就只能赋值给 `void` 和它们各自的类型. 这样做可以避免一些常规错误. 如果你希望传递 `string` 或者 `null` 或者 `undefined` 之一的类型, 你可以使用联合类型 `string` | `null` | `undefined`. 再次强调, 以后尽量用联合类型.

> As a note: we encourage the use of `--strictNullChecks` when possible, but for the purposes of this handbook, we will assume it is turned off.

> 我们鼓励使用 `--strictNullChecks`, 但是在该教程里面还是假设这个选项是关闭的.

## Never

The `never` type represents the type of values that never occur. For instance, `never` is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns; Variables also acquire the type `never` when narrowed by any type guards that can never be true.

`never` 类型代表永远不可能产生的类型. 例如, 函数表达式和箭头函数表达式抛出异常或者没有返回的情况的值就是 `never` 类型. 在任何类型检查都不为 true 的变量也会是 `never` 类型.

The `never` type is a subtype of, and assignable to, every type; however, no type is a subtype of, or assignable to, `never` (except `never` itself). Even `any` isn’t assignable to `never`.

`never` 类型是所有类型的子类型, 然而, 没有任何类型是 `never` 的子类型(除了`never`自己). 即便是 `any` 也不能赋值给 `never`.

Some examples of functions returning `never`:

返回 `never` 的函数示例:

```ts
// Function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
```

## Object

`object` is a type that represents the non-primitive type, i.e. any thing that is not number, string, boolean, symbol, null, or undefined.

`object` 代表任何非原始类型, 如任何非 `number`, `string`, `boolean`, `symbol`, `null` 或者 `undefined`.

With `object` type, APIs like `Object.create` can be better represented. For example:

使用 `object` 类型可以让类似于 `Object.create` 这样的 API 更具有代表意义. 例如:

```ts
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

## 类型转换 (文档此处为 Type assertions, 但翻译为类型转换更合适 )

Sometimes you’ll end up in a situation where you’ll know more about a value than TypeScript does. Usually this will happen when you know the type of some entity could be more specific than its current type.

有时候你可能比 TypeScript 更了解某个值, 你知道某个实体的类型.

Type assertions are a way to tell the compiler “trust me, I know what I’m doing.” A type assertion is like a type cast in other languages, but performs no special checking or restructuring of data. It has no runtime impact, and is used purely by the compiler. TypeScript assumes that you, the programmer, have performed any special checks that you need.

类型转换就好比告诉编译器 "别管我, 我知道我在做啥". 跟其它语言中的类型转换一样, 但并不对数据做特殊的检查和重构处理, 不会影响运行时, 完全被编译器使用. TypeScript 假设开发人员已经对数据做了必要的检查.

类型转换有两种写法, 一种是使用尖括号`<>`语法:

```ts
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

And the other is the `as`-syntax:

另一种是 `as` 写法:

```ts
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

The two samples are equivalent. Using one over the other is mostly a choice of preference; however, when using TypeScript with JSX, only `as`-style assertions are allowed.

两种写法等效. 使用哪一种完全是个人习惯. 但是如果在 JSX 中使用 TypeScript 时, 只允许 `as` 写法.

## A note about `let`

You may’ve noticed that so far, we’ve been using the `let` keyword instead of JavaScript’s `var` keyword which you might be more familiar with. The `let` keyword is actually a newer JavaScript construct that TypeScript makes available. We’ll discuss the details later, but many common problems in JavaScript are alleviated by using `let`, so you should use it instead of `var` whenever possible.

你应该已经注意到了, 我们一直在使用 `let` 代替 JavaScript 中的 `var`. `let` 是新的 JavaScript 变量声明方式之一. 它可以解决一些通常会遇到的问题, 我们将在后面讨论 `let`, 你从现在开始也应该尽量使用 `let` 代替 `var`.

---

## 完

---