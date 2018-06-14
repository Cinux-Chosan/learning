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

We can write the same example again, this time using an interface to describe the requirement of having the `label` property that is a string:

现在我们用接口再来实现上面的例子（用接口来描述我们的需求：参数要一个具有值为字符串的 `label` 属性的对象）：

```ts
interface LabelledValue {
    label: string;
}

function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

The interface `LabelledValue` is a name we can now use to describe the requirement in the previous example. It still represents having a single property called `label` that is of type string. Notice we didn’t have to explicitly say that the object we pass to `printLabel` implements this interface like we might have to in other languages. Here, it’s only the shape that matters. If the object we pass to the function meets the requirements listed, then it’s allowed.

接口 `LabelledValue` 是一个我们可以用来描述需求的名字。它代表一个具有单个属性且名为 `label` 的字符串类型。注意，并没有明确的规定传给 `printLabel` 的对象需要像其他语言那样实现该接口。在这里，我们只关心它的外形。如果传入的这个对象满足我们在接口中列出的要求，那么它就是被允许的。

It’s worth pointing out that the type-checker does not require that these properties come in any sort of order, only that the properties the interface requires are present and have the required type.

还有一点要提出的是，类型检查不需要传入对象的属性是按照接口的顺序，只要这个属性存在并且是正确的类型就可以了。

## 可选属性

Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. These optional properties are popular when creating patterns like “option bags” where you pass an object to a function that only has a couple of properties filled in.

注意目前为止接口所有的属性都是必须存在的。但是有些在特定环境下才会存在或者根本不存在的属性就变得不好处理了。可选属性在我们创建如“option bags” 这样的模式的时候非常受欢迎，即给函数传递一个只填充了其中几个属性的对象作为参数时。

Here’s an example of this pattern:

下面是这种模式的举例：

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

Interfaces with optional properties are written similar to other interfaces, with each optional property denoted by a `?` at the end of the property name in the declaration.

具有可选属性的接口和其它接口写法差不多，只是在属性名后面加一个 `?`。

The advantage of optional properties is that you can describe these possibly available properties while still also preventing use of properties that are not part of the interface. For example, had we mistyped the name of the `color` property in `createSquare`, we would get an error message letting us know:

可选属性的优点是它可以描述一些可能存在的属性，并且能够防止使用到不属于接口中声明的属性。例如，如果我们在 `createSquare` 中写错了 `color` 属性的名字，我们后收到一个错误消息：

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = {color: "white", area: 100};
    if (config.clor) {
        // Error: Property 'clor' does not exist on type 'SquareConfig'
        newSquare.color = config.clor;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```

## 只读属性

Some properties should only be modifiable when an object is first created. You can specify this by putting readonly before the name of the property:

有些属性一旦创建就不能更改了，我们只需要在属性名前面加上 `readonly` 即可：

```ts
interface Point {
    readonly x: number;
    readonly y: number;
}
```

You can construct a `Point` by assigning an object literal. After the assignment, x and y can’t be changed.

你可以用一个对象来构造一个 `Point`，`x` 和 `y` 在赋值完成之后就不允许更改了：

```ts
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!
```

TypeScript comes with a `ReadonlyArray<T>` type that is the same as `Array<T>` with all mutating methods removed, so you can make sure you don’t change your arrays after creation:

TypeScript 带有一个 `ReadonlyArray <T>` 类型，它与 `Array <T>` 相同，但是删除了所有的可以改变它的方法，因此你可以确保在创建之后不会更改到数组：

```ts
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
ro[0] = 12; // error!
ro.push(5); // error!
ro.length = 100; // error!
a = ro; // error!
```

On the last line of the snippet you can see that even assigning the entire `ReadonlyArray` back to a normal array is illegal. You can still override it with a type assertion, though:

在上面的代码中也看到，即便是把一个 `ReadonlyArray` 赋值给一个普通 Array 也是不允许的，不过你仍然可以使用类型转换：

```ts
a = ro as number[];
```

### readonly 和 const 比较

The easiest way to remember whether to use readonly or const is to ask whether you’re using it on a variable or a property. Variables use `const` whereas properties use `readonly`.

使用 `const` 还是 `readonly`，最简单的分辨方式就是看用在变量上还是用在属性上，变量用 `const`，属性用 `readonly`。

## 严格属性检查 （文档中为Excess Property Checks，即多余属性检查）

In our first example using interfaces, TypeScript lets us pass `{ size: number; label: string; }` to something that only expected a `{ label: string; }`. We also just learned about optional properties, and how they’re useful when describing so-called “option bags”.

第一个使用接口的例子中，给只需要 `{ label: string; }` 的方法传了 `{ size: number; label: string; }` 。 我们学了可选属性，知道了用它来描述 “option bags” 模式非常有用。

However, combining the two naively would let you to shoot yourself in the foot the same way you might in JavaScript. For example, taking our last example using `createSquare`:

然而，天真的将两者结合起来，你就是搬起石头砸自己的脚。比如，看看最后一个使用 `createSquare` 的例子：

```ts
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    // ...
}

let mySquare = createSquare({ colour: "red", width: 100 });
```

Notice the given argument to `createSquare` is spelled `colour` instead of `color`. In plain JavaScript, this sort of thing fails silently.

注意，传给 `createSquare` 的参数是 `colour` 而不是 `color`。在JavaScript中，这种错误会悄无声息的失败。

You could argue that this program is correctly typed, since the `width` properties are compatible, there’s no `color` property present, and the extra `colour` property is insignificant.

你可能会争辩说这个程序没毛病啊，因为 `width` 和 `color` 都是可选属性且 `width` 的值是正确的，没有 `color` 属性，`colour` 作为多余的无意义的属性。

However, TypeScript takes the stance that there’s probably a bug in this code. Object literals get special treatment and undergo excess property checking when assigning them to other variables, or passing them as arguments. If an object literal has any properties that the “target type” doesn’t have, you’ll get an error.

然而， TypeScript 会认为代码中可能存在错误。 **对象字面量** 会得到特殊处理，在将其分配给其他变量或作为参数时会进行多余的属性检查。如果一个对象字面量具有任何目标类型不存在的属性就会报错。

```ts
// error: 'colour' not expected in type 'SquareConfig'
let mySquare = createSquare({ colour: "red", width: 100 });
```

Getting around these checks is actually really simple. The easiest method is to just use a type assertion:

绕过这些检查其实非常简单。最简单的方法是使用一个类型转换：

```ts
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
```

However, a better approach might be to add a string index signature if you’re sure that the object can have some extra properties that are used in some special way. If `SquareConfig` can have `color` and `width` properties with the above types, but could also have any number of other properties, then we could define it like so:

然而，如果你确定对象会有一些额外的属性用于特殊用途，那么可以使用更好的方法 —— 那就是字符串索引签名。如果 `SquareConfig` 有 `color` 和 `width` 属性，并且还可能有任意数量的其它属性，那可以这样来定义它：

```ts
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
```

We’ll discuss index signatures in a bit, but here we’re saying a `SquareConfig` can have any number of properties, and as long as they aren’t `color` or `width`, their types don’t matter.

稍后会讨论索引签名，但是这里我们要说的是一个 `SquareConfig` 可以有非 `color` 和 `width` 之外任意数目的属性，并且它们的类型无关紧要。

One final way to get around these checks, which might be a bit surprising, is to assign the object to another variable: Since `squareOptions` won’t undergo excess property checks, the compiler won’t give you an error.

最后一种方法可能有点奇怪，那就是把这个对象赋值给一个变量（在最前面的例子中就是这样的）：由于 `squareOptions` 不会进行多余的属性检查，编译器也就不会报错。

```ts
let squareOptions = { colour: "red", width: 100 };
let mySquare = createSquare(squareOptions);
```

Keep in mind that for simple code like above, you probably shouldn’t be trying to “get around” these checks. For more complex object literals that have methods and hold state, you might need to keep these techniques in mind, but a majority of excess property errors are actually bugs. That means if you’re running into excess property checking problems for something like option bags, you might need to revise some of your type declarations. In this instance, if it’s okay to pass an object with both a color or colour property to createSquare, you should fix up the definition of SquareConfig to reflect that

对于一些简单的代码片段，你不应该绕过这些检查。对于一些具有方法和状态的复杂的对象字面量，你可能需要使用这个技术，但大多数多余属性错误实际上是bug，意味着你需要调整你的类型声明。这个例子中，如果可以传一个既有 `color` 又有 `colour` 属性的对象给 `createSquare` ，那就应该在 `SquareConfig` 中反映出来。

## 函数类型

Interfaces are capable of describing the wide range of shapes that JavaScript objects can take. In addition to describing an object with properties, interfaces are also capable of describing function types.

接口能够描述JavaScript对象能够使用的各种形态的数据。除了描述具有何种属性的对象之外，接口还能够描述函数类型。

To describe a function type with an interface, we give the interface a call signature. This is like a function declaration with only the parameter list and return type given. Each parameter in the parameter list requires both name and type.

使用接口来描述函数的做法就是给接口一个调用签名。就像只用参数列表和返回类型来声明一个函数。参数列表中的每个参数都需要名字加类型。

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
}
```

Once defined, we can use this function type interface like we would other interfaces. Here, we show how you can create a variable of a function type and assign it a function value of the same type.

定义之后，就可以像使用其它接口一样使用函数类型接口。这里，我们展示了如何创建函数类型的变量并赋予它相同类型的函数值。

```ts
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```

For function types to correctly type-check, the names of the parameters do not need to match. We could have, for example, written the above example like this:

参数的名字并不需要一样，上面的例子也可以像下面这样写：

```ts
let mySearch: SearchFunc;
mySearch = function(src: string, sub: string): boolean {
    let result = src.search(sub);
    return result > -1;
}
```

Function parameters are checked one at a time, with the type in each corresponding parameter position checked against each other. If you do not want to specify types at all, TypeScript’s contextual typing can infer the argument types since the function value is assigned directly to a variable of type SearchFunc. Here, also, the return type of our function expression is implied by the values it returns (here false and true). Had the function expression returned numbers or strings, the type-checker would have warned us that return type doesn’t match the return type described in the SearchFunc interface.

函数的参数会逐个进行检查，要求对应位置上的参数类型是兼容的。 如果你不想指定类型，TypeScript 的类型系统会推断出参数类型，因为函数直接赋值给了 `SearchFunc` 类型变量。 函数的返回值类型是通过其返回值推断出来的（此例是 `false`和`true`）。 如果让这个函数返回数字或字符串，类型检查器会警告我们函数的返回值类型与 `SearchFunc` 接口中的定义不匹配。

```ts
let mySearch: SearchFunc;
mySearch = function(src, sub) {
    let result = src.search(sub);
    return result > -1;
}
```

## 可索引类型
