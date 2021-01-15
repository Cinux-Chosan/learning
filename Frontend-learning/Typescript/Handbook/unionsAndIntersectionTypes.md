# Unions and Intersection Types

到目前为止，我们定义的类型都是一些原子类型，但随着项目的逐渐扩大，你可能需要一种能够将之前的原子类型组合起来的类型，从而避免从头创建它们。

为此，交叉和联合类型出现了。

## Union Types

联合类型表示它能够接收组成它的任何一个类型：

```ts
type unionType = string | number | boolean;
```

### Unions with Common Fields

由于一个联合类型可能是其组成成员的任意类型之一，因此我们只能访问联合类型中在所有类型都共有的成员：

```ts
interface Bird {
  fly(): void;
  layEggs(): void;
}

interface Fish {
  swim(): void;
  layEggs(): void;
}

declare function getSmallPet(): Fish | Bird;

let pet = getSmallPet();
pet.layEggs();

// Only available in one of the two possible types
pet.swim();
// Error: Property 'swim' does not exist on type 'Bird | Fish'.
//  Error: Property 'swim' does not exist on type 'Bird'.
```

上面的 pet 是 `Fish | Bird` 类型，虽然 Bird 有 fly 方法，但我们无法确定 `pet` 是否是 Bird 类型，因为在运行时它也可能是 Fish 类型，使用它的 fly 方法则会报错。

### Discriminating Unions

联合类型一种常见的用法是定义一个公共字段，该字段可以让 typescript 缩小类型检查的范围，例如：

```ts
type NetworkLoadingState = {
  state: "loading";
};

type NetworkFailedState = {
  state: "failed";
  code: number;
};

type NetworkSuccessState = {
  state: "success";
  response: {
    title: string;
    duration: number;
    summary: string;
  };
};

// Create a type which represents only one of the above types
// but you aren't sure which it is yet.
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState;
```

上面的所有类型都有一个 `state` 字段，然后各自拥有自己的其它字段。

你可以通过比较字面量类型 `state` 来让 typescript 缩小类型范围：

```ts
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState;

function logger(state: NetworkState): string {
  // Right now TypeScript does not know which of the three
  // potential types state could be.

  // Trying to access a property which isn't shared
  // across all types will raise an error
  state.code;
  // Error: Property 'code' does not exist on type 'NetworkState'.
  // Error: Property 'code' does not exist on type 'NetworkLoadingState'.

  // By switching on state, TypeScript can narrow the union
  // down in code flow analysis
  switch (state.state) {
    case "loading":
      return "Downloading...";
    case "failed":
      // The type must be NetworkFailedState here,
      // so accessing the `code` field is safe
      return `Error ${state.code} downloading`;
    case "success":
      return `Downloaded ${state.response.title} - ${state.response.summary}`;
  }
}
```

### Union Exhaustiveness checking

当没有覆盖完联合类型中所有情况时，我们希望编译器能够告诉我们，例如在 `NetworkState` 中添加了 `NetworkFromCachedState`，我们同时需要更新 `logger`：

```ts
type NetworkFromCachedState = {
  state: "from_cache";
  id: string;
  response: NetworkSuccessState["response"];
};

type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState | NetworkFromCachedState;

function logger(s: NetworkState) {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

有两种方式来达到目的：

1、首先启用 `--strictNullChecks` 并指定返回类型：

```ts
function logger(s: NetworkState): string {
  // Function lacks ending return statement and return type does not include 'undefined'.
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
  }
}
```

因为现在 `switch` 的情况并不完全，typescript 意识到某些情况下会返回 `undefined`。如果你显式指定了 `string` 类型，你将会收到错误提示，因为实际返回类型是 `string | undefined`。然而，这个问题非常隐蔽，此外，`--strictNullChecks` 并不总是适用于老代码。

2、使用 `never` 类型来让编译器检查：

```ts
function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}

function logger(s: NetworkState): string {
  switch (s.state) {
    case "loading":
      return "loading request";
    case "failed":
      return `failed with code ${s.code}`;
    case "success":
      return "got response";
    default:
      return assertNever(s);
    // Error: Argument of type 'NetworkFromCachedState' is not assignable to parameter of type 'never'.
  }
}
```

`assertNever` 检查 `s` 为 `never` 类型 —— 联合类型中所有其它类型移除之后剩下的类型。如果你忘了某些情况，则 `s` 走到这里的时候会拥有自己的类型，因此编译器也会提示错误。这种方式需要你定义一个额外的函数来辅助完成，但提示更加明显。

## Intersection Types

交叉类型和联合类型密切相关，但用法完全不同。

交叉类型将多个类型组合成一个类型，该类型具有所有组成该类型的成员的全部属性。例如 `Person & Serializable & Loggable` 代表的类型包含了 `Person`、`Serializable` 和 `Loggable` 中全部属性。

```ts
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// These interfaces are composed to have
// consistent error handling, and their own data.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};
```
