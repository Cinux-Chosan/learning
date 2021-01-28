# Modules

自从 ECMAScript 2015 开始，JavaScript 具有了模块的概念。typescript 共享这个概念。

Typescript 中与 ECMAScript 2015 一样，任何包含顶级 import 和 export 的文件都被当做模块。反过来，没有 `import` 和 `export` 声明的文件会被当做一段脚本，其内容暴露在全局。

## Export

### Exporting a declaration

### Importing Types

在 Typescript 3.8 之前，可以使用 `import` 导入一个类型，在 3.8 以后，你既可以使用 `import` 也可以使用 `import type` 来导入一个类型。

```ts
// Re-using the same import
import { APIResponseType } from "./api";

// Explicitly use import type
import type { APIResponseType } from "./api";
```

`import type` 在编译为 JavaScript 后会被移除，像 babel 这样的工具能够通过编译标志 `isolatedModules` 对代码有更好的假设。参考 [3.8 版本明细](https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports)
