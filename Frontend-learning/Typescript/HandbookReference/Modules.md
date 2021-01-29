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

### export = and import = require()

CommonJS 和 AMD 通常都使用 exports 对象了包含模块的导出内容。

同时他们也都支持使用自定义对象带替代 exports 对象。默认导出就扮演着这种替换，但是这两者并不兼容。Typescript 支持 `export =` 来支持传统的 CommonJS 和 AMD 工作流。

`export =` 与语法指定了从一个模块导出单个对象。它可以是 class、interface、namespace、function 或者 enum。

当使用 `export =` 来导出一个模块时，需要使用 Typescript 独有的 `import module = require("module")`。

```ts
// ZipCodeValidator.ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```

```ts
// Test.ts
import zip = require("./ZipCodeValidator");

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validator = new zip();

// Show whether each string passed each validator
strings.forEach((s) => {
  console.log(`"${s}" - ${validator.isAcceptable(s) ? "matches" : "does not match"}`);
});
```

## Code Generation for Modules

根据编译时期指定的目标模块类型会生成对应模块加载系统的代码，如 `Node.js` [(CommonJS)](http://wiki.commonjs.org/wiki/CommonJS), `require.js` [(AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD), [UMD](https://github.com/umdjs/umd), [SystemJS](https://github.com/systemjs/systemjs), or [ECMAScript 2015 native modules](http://www.ecma-international.org/ecma-262/6.0/#sec-modules) (ES6)。对于生成代码中的`define`、`require`、和 `register`是什么含义需要查阅对应模块的文档。

下面是不同目标模块示例:

```ts
// SimpleModule.ts
import m = require("mod");
export let t = m.something + 1;
```

```ts
// AMD / RequireJS SimpleModule.js
define(["require", "exports", "./mod"], function(require, exports, mod_1) {
  exports.t = mod_1.something + 1;
});
```

```ts
// CommonJS / Node SimpleModule.js
var mod_1 = require("./mod");
exports.t = mod_1.something + 1;
```

```ts
// UMD SimpleModule.js
(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports", "./mod"], factory);
  }
})(function(require, exports) {
  var mod_1 = require("./mod");
  exports.t = mod_1.something + 1;
});
```

```ts
// System SimpleModule.js
System.register(["./mod"], function(exports_1) {
  var mod_1;
  var t;
  return {
    setters: [
      function(mod_1_1) {
        mod_1 = mod_1_1;
      },
    ],
    execute: function() {
      exports_1("t", (t = mod_1.something + 1));
    },
  };
});
```

```ts
// Native ECMAScript 2015 modules SimpleModule.js
import { something } from "./mod";
export var t = something + 1;
```

## Simple Example

再来巩固一下上面的内容。

编译的时候需要指定目标模块的类型，对于 Node.js，使用 `--module commonjs`，对于 require.js，使用 `--module amd`，例如：`tsc --module commonjs Test.ts`。

## Optional Module Loading and Other Advanced Loading Scenarios

有时候你希望根据特定的情况才加载对应的模块。在 Typescript 中，我们可以使用下面的模式来达到目的和一些直接调用模块加载器的高级载入场景。

编译器会检测每个模块是否在结果 JavaScript 中有使用，如果一个模块标识符仅仅用于类型声明，并没有用作表达式，则在编译结果中不会有该模块的 `require` 存在。这样使得我们可以有选择性的加载某些模块，并且能够得到更好的性能。

这种模块的核心思想就是 `import id = require("...")` 让我们能够访问模块中暴露的类型，像下面 `if` 中那样，模块下载器能够（通过 `require`）动态的加载模块：

```ts
// Dynamic Module Loading in Node.js

declare function require(moduleName: string): any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
  let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
  let validator = new ZipCodeValidator();
  if (validator.isAcceptable("...")) {
    /* ... */
  }
}
```

上面的示例中，从 `ZipCodeValidator` 引入的 `Zip` 在 `if` 内部，仅作为类型来使用，不要用在会输出到 JavaScript 结果中的位置。

为了类型安全，可以像上面那样使用 `typeof` 关键字。

```ts
// Sample: Dynamic Module Loading in require.js

declare function require(moduleNames: string[], onLoad: (...args: any[]) => void): void;

import * as Zip from "./ZipCodeValidator";

if (needZipValidation) {
  require(["./ZipCodeValidator"], (ZipCodeValidator: typeof Zip) => {
    let validator = new ZipCodeValidator.ZipCodeValidator();
    if (validator.isAcceptable("...")) {
      /* ... */
    }
  });
}
```

```ts
// Sample: Dynamic Module Loading in System.js

declare const System: any;

import { ZipCodeValidator as Zip } from "./ZipCodeValidator";

if (needZipValidation) {
  System.import("./ZipCodeValidator").then((ZipCodeValidator: typeof Zip) => {
    var x = new ZipCodeValidator();
    if (x.isAcceptable("...")) {
      /* ... */
    }
  });
}
```

## Working with Other JavaScript Libraries

要描述那些不是使用 Typescript 编写的库，则需要声明它们暴露的 API。

我们将那些没有定义实现的声明称为 “ambient”

### Ambient Modules

在 Node.js 中，大多数任务通过一个或多个模块来完成。我们可以在每个模块的 `.d.ts` 文件中定义顶级 export 声明，但是将它们定义在一个大的 `.d.ts` 文件中会更加方便。为此，我们使用类似于 `namespace` 的结构，但使用关键字 `module` 以及引号包裹的模块名以便之后可以 import：

```ts
// node.d.ts (部分摘要)

declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }

  export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```

现在我们可以 `/// <reference> node.d.ts` 然后通过 `import url = require("url")` 或者 `import as URL from "url"` 来加载模块。

```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");
```

### Shorthand ambient modules

如果没有那么多时间来编写声明，则可以使用快捷声明的方式：

```ts
// declarations.d.ts

declare module "hot-new-module";
```

所有从快捷声明模块中导入的内容都是 `any` 类型：

```ts
import x, { y } from "hot-new-module";
x(y);
```

### Wildcard module declarations

像 SystemJS 和 AMD 这样的模块加载器允许导入非 JavaScript 内容。通常使用前缀或者后缀的方式来代表这种特殊的导入。通配符模块声明可以覆盖这种场景：

```ts
declare module "*!text" {
  const content: string;
  export default content;
}
// Some do it the other way around.
declare module "json!*" {
  const value: any;
  export default value;
}
```

现在可以导入匹配 `"*!text"` 或者 `"json!*"` 的模块：

```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

### UMD modules

还有一些模块被设计为适配很多模块加载器或者是根本没有模块加载的场景（如全局变量）。这就是 [`UMD`](https://github.com/umdjs/umd) 模块。这些模块既能够通过 import 导入，也能够通过全局变量引用：

```ts
// math-lib.d.ts

export function isPrime(x: number): boolean;
export as namespace mathLib;
```

这些模块能够在其它模块中通过 import 使用：

```ts
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // ERROR: can't use the global definition from inside a module
```

也能够在脚本中通过全局变量来使用（脚本就是没有 import 或者 export 的文件）：

```ts
mathLib.isPrime(2);
```

## Guidance for structuring modules

## Export as close to top-level as possible
