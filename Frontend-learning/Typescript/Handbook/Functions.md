# Functions

- 可选参数放在其他参数最后，且它们共享相同的函数类型

```ts
function buildName(firstName: string, lastName?: string) {
  // ...
}

function buildName(firstName: string, lastName = "Smith") {
  // ...
}
```

上面两个函数的函数签名都是：`(firstName: string, lastName?: string) => string`

- 默认参数不一定要放在最后，只要该位置的参数为`undefined` 就会触发默认参数赋值，如果默认参数不在最后就需要显式传入 `undefined`：

```ts
function buildName(firstName = "Will", lastName: string) {
  return firstName + " " + lastName;
}

let result1 = buildName("Bob"); // error, too few parameters
// Error: Expected 2 arguments, but got 1.
let result2 = buildName("Bob", "Adams", "Sr."); // error, too many parameters
// Error: Expected 2 arguments, but got 3.
let result3 = buildName("Bob", "Adams"); // okay and returns "Bob Adams"
let result4 = buildName(undefined, "Adams"); // okay and returns "Will Adams"
```

- 剩余参数使用 `...` 声明变量，它相当于是一组可选参数的集合，且 `...` 也会出现在类型中：

```ts
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}

let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
```

## this 参数

在某些 this 不明确的情况下， 可以通过函数的第一个参数指定函数的 this 类型：

```ts
function f(this: void) {
  // make sure `this` is unusable in this standalone function
}
```

## this parameters in callbacks

当你向一些库中传入函数作为回调函数时也可能会遇到 this 导致的错误。因为这些库会以普通函数的方式调用你的回调函数，严格模式下为 `undefined`。这种情况下你也可以通过 this 参数来阻止回调函数中的错误。

首先，库的作者需要显示声明 this 类型为 void：

```ts
interface UIElement {
  addClickListener(onclick: (this: void, e: Event) => void): void;
}
```

`this: void` 表示 `addClickListener` 希望 `onclick` 是一个不需要 this 的函数。

```ts
class Handler {
  info: string;
  onClickBad(this: Handler, e: Event) {
    // oops, used `this` here. using this callback would crash at runtime
    this.info = e.message;
  }
}

let h = new Handler();
uiElement.addClickListener(h.onClickBad); // error!
// Error: Argument of type '(this: Handler, e: Event) => void' is not assignable to parameter of type '(this: void, e: Event) => void'.
// Error: The 'this' types of each signature are incompatible.
// Error: Type 'void' is not assignable to type 'Handler'.
```

由于 this 指定为 Handler，因此会提示类型不兼容错误。

所以在调用的地方也需要指定 this 为 void：

```ts
class Handler {
  info: string;
  onClickGood(this: void, e: Event) {
    // can't use `this` here because it's of type void!
    console.log("clicked!");
  }
}

let h = new Handler();
uiElement.addClickListener(h.onClickGood);
```

这样传入的函数类型才能兼容。但却不能访问 this 了。

如果真的需要用到 this，可以使用箭头函数像下面这么写：

```ts
class Handler {
  info: string;
  onClickGood = (e: Event) => {
    this.info = e.message;
  };
}
```

它会被编译为：

```ts
var Handler = /** @class */ (function () {
  function Handler() {
    var _this = this;
    this.onClickGood = function (e) {
      _this.info = e.type;
    };
  }
  return Handler;
})();
```

使用箭头函数的方式能够访问 this，但是它在每次实例化时都会新创建一个新的函数，而直接使用函数声明方法的形式是在原型链上。

## Overloads

在 JavaScript 中同一个函数根据函数参数不同而有不同操作的情况相当常见。这种方式在 typescript 中就使用函数重载来描述：

```ts
let suits = ["hearts", "spades", "clubs", "diamonds"];

function pickCard(x: { suit: string; card: number }[]): number;
function pickCard(x: number): { suit: string; card: number };
function pickCard(x: any): any {
  // Check to see if we're working with an object/array
  // if so, they gave us the deck and we'll pick the card
  if (typeof x == "object") {
    let pickedCard = Math.floor(Math.random() * x.length);
    return pickedCard;
  }
  // Otherwise just let them pick the card
  else if (typeof x == "number") {
    let pickedSuit = Math.floor(x / 13);
    return { suit: suits[pickedSuit], card: x % 13 };
  }
}

let myDeck = [
  { suit: "diamonds", card: 2 },
  { suit: "spades", card: 10 },
  { suit: "hearts", card: 4 },
];

let pickedCard1 = myDeck[pickCard(myDeck)];
alert("card: " + pickedCard1.card + " of " + pickedCard1.suit);

let pickedCard2 = pickCard(15);
alert("card: " + pickedCard2.card + " of " + pickedCard2.suit);
```

编译器选择重载的过程自上而下，找到合适的则停止向下继续查找。因此重载的顺序很重要。

还需要注意的是，`function pickCard(x): any` 包含实现，因此它不属于重载列表的一部分，所以上面实际上只有两个函数重载：一个接受 object，另一个接受 number。使用其它类型参数则会报错。
