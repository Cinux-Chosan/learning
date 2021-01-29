# Namespaces

## Multi-file namespaces

随着项目越来越大，我们可以将代码分割到多个文件中以方便管理。

尽管 namespace 在多个不同文件中，但是他们会被组织成一个 namespace，对使用者而言就像他们被定义在一起一样。

由于文件之间存在相互依赖，我们需要添加引用标记来告诉编译器它们之间的关系：

```ts
// Validation.ts

namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

```ts
// LettersOnlyValidator.ts

/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```

```ts
// ZipCodeValidator.ts

/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```

```ts
// Test.ts

/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(`"${s}" - ${validators[name].isAcceptable(s) ? "matches" : "does not match"} ${name}`);
  }
}
```

由于有多个文件参与，执行 `tsc` 命令不会将 `/// <reference path="Validation.ts" />` 这样的文件编译到当前文件中，但是我们需要确保所有编译后的代码都能够载入到执行环境中，有两种方式可以实现：

1. 使用 `--outFile` 标志告诉编译器所有输入文件串联输出到一个文件中：`tsc --outFile sample.js Test.ts`。编译器会基于 `reference` 标记自动对输出文件进行排序。因此你也能够独立指定每个文件：`tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts`

2. 使用默认配置，即默认情况下每个文件对应一个 JavaScript 文件，如果有多个文件则需要自己通过 `<script>` 标签按对应顺序添加到页面中。

```ts
// MyTestPage.html (excerpt)

<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```

## Aliases

可以通过 `import q = x.y.z` 这种方式来创建名字空间中常用对象的别名。不要和 `import x = require("name")` 这种加载模块的语法混淆了，它只会简单的创建指定标志的一个别名。你可以对任何标识符使用这种 import，包括通过 import 引入的模块对象：

```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```

注意不是使用 `require` 关键字，只是简单的赋值语句。这种方式类似于使用关键字 `var` 声明变量，但是它可以用于类型和名字空间以及导入的内容。

需要注意的是，对于真实的值来说，`import` 创建了与原值独立的引用，所以对别名的修改不会反应到原值上（这里应该是对于值类型而言，而非引用类型）。

## Ambient Namespaces

只有声明没有定义实现的文件我们称之为 `ambient`，通常这些内容都定义在 `.d.ts` 文件中。

```ts
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }

  export interface Event {
    x: number;
    y: number;
  }

  export interface Base extends Selectors {
    event: Event;
  }
}

declare var d3: D3.Base;
```
