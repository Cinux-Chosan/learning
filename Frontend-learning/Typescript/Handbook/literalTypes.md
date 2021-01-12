# Literal Types

字面量类型是更具体的类型。如在类型系统中， `Hello World` 是 `string` 类型，但是 `string` 并非 `Hello World` 类型。

目前，在 typescript 中有 3 类对象字面量类型：`string`、`number` 和 `boolean`。使用它们的字面量类型能够更加精准的对类型做限定。

## Literal Narrowing

当使用 `var` 或者 `let` 声明变量时，意味着这些变量可以在之后发生改变，使用 `const` 则告诉 typescript 这个变量以后不会发生变化，因此一下类型会略有不同：

```ts
// We're making a guarantee that this variable
// helloWorld will never change, by using const.

// So, TypeScript sets the type to be "Hello World", not string
const helloWorld = "Hello World";

// On the other hand, a let can change, and so the compiler declares it a string
let hiWorld = "Hi World";
```

其中，`helloWorld` 由于是常量，它以后也不会发生变化，因此其类型就是 `Hello World`，但是 `hiWorld` 是变量，因此它是 `string` 类型。

## String Literal Types

字符串字面量和联合类型、类型守卫、类型别名可以很好的组合在一起使用。

```ts
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy"); // Error: Argument of type '"uneasy"' is not assignable to parameter of type 'Easing'.
```

用于区分函数重载：

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
  // ... code goes here ...
}
```

## Numeric Literal Types

```ts
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```

## Boolean Literal Types

typescript 中也有 boolean 字面量类型，可用于约束属性相关的对象类型：

```ts
interface ValidationSuccess {
  isValid: true;
  reason: null;
}

interface ValidationFailure {
  isValid: false;
  reason: string;
}

type ValidationResult = ValidationSuccess | ValidationFailure;
```
