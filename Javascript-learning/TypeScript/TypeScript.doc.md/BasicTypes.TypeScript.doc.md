# 基本类型

## 简介

For programs to be useful, we need to be able to work with some of the simplest units of data: numbers, strings, structures, boolean values, and the like. In TypeScript, we support much the same types as you would expect in JavaScript, with a convenient enumeration type thrown in to help things along.

要让程序有用，我们就需要能够使用一些最简单的数据单元：数字，字符串，结构体，布尔类型等。在 TypeScript 中，我们不仅支持和 JavaScript 相同的类型，还引入了枚举类型来帮助解决各种问题。

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

元祖类型能够让你通过固定数量的已知类型来声明数组值的类型。例如，你希望用一种方式表示一对 `string` 和 `number`：

```ts
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

When accessing an element with a known index, the correct type is retrieved:

当访问的元素在数组中时，将准确的检索该元素的类型：

```ts
console.log(x[0].substr(1)); // OK
console.log(x[1].substr(1)); // Error, 'number' does not have 'substr'
```

When accessing an element outside the set of known indices, a union type is used instead:

当访问的元素超出索引范围时，将使用联合类型来替代：

```ts
x[3] = "world"; // OK, 'string' can be assigned to 'string | number'

console.log(x[5].toString()); // OK, 'string' and 'number' both have 'toString'

x[6] = true; // Error, 'boolean' isn't 'string | number'
```

Union types are an advanced topic that we’ll cover in a later chapter.

联盟类型作为一个高级话题将在后面的章节中进行介绍。
