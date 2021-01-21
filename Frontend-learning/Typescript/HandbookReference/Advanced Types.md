# Advanced Types

## Type Guards and Differentiating Types

类型守卫和类型区分

联合类型虽然在可用类型出现重叠的时候非常有用，但是我们只能访问联合类型中所有成员都必须有的公有成员：

```ts
let pet = getSmallPet();

// You can use the 'in' operator to check
if ("swim" in pet) {
  pet.swim();
}
// However, you cannot use property access
if (pet.fly) {
  // Error: Property 'fly' does not exist on type 'Fish | Bird'.
  //   Error: Property 'fly' does not exist on type 'Fish'.
  pet.fly();
  // Error: Property 'fly' does not exist on type 'Fish | Bird'.
  //   Error: Property 'fly' does not exist on type 'Fish'.
}
```

为了让上面的代码能够工作，我们需要用到类型断言：

```ts
let pet = getSmallPet();
let fishPet = pet as Fish;
let birdPet = pet as Bird;

if (fishPet.swim) {
  fishPet.swim();
} else if (birdPet.fly) {
  birdPet.fly();
}
```

但是这种代码并不是我们希望的样子。

## User-Defined Type Guards

如果我们执行检查之后就能在对应的分支知道 `pet` 的类型就好了。

这就是 typescript 中的类型守卫(type guard)。类型守卫就是一些用于在某些作用域内确保类型正确的运行时检查的表达式。

### Using type predicates

我们可以简单的定义一个返回类型为 `类型断言` 的函数来定义类型守卫：

```ts
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` 就是这个例子中的类型断言。断言的格式为 `parameterName is Type`，其中 `parameterName` 必须是函数签名中的参数。

任何时候使用某个变量调用 `isFish`，typescript 都会在类型兼容的情况下缩小该变量的类型。

```ts
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

typescript 不仅知道在 `if` 分支中 `pet` 是 `Fish` 类型，并且还知道在 `else` 分支中 `pet` 不是 `Fish` 类型，因此它肯定是 `Bird` 类型。

你可能会用 `isFish` 来过滤一个 `Fish | Bird` 类型的数组：

```ts
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter<Fish>(isFish);
const underWater3: Fish[] = zoo.filter<Fish>((pet) => isFish(pet));
// Error: Argument of type '(pet: Fish | Bird) => boolean' is not assignable to parameter of type '(value: Fish | Bird, index: number, array: (Fish | Bird)[]) => value is Fish'.
// Error: Signature '(pet: Fish | Bird): boolean' must be a type predicate.
```

其中用于 filter 的回调函数需要是 `类型断言` 的格式，即返回类型是 `parameterName is Type`。因此上面第三种写法无法通过。

### Using the in operator
