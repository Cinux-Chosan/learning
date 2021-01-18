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
