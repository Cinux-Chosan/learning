# Triple-Slash Directives

三斜线指令必须在文件最开头，如果在其他语句之后则会被当做普通的注释。

`/// <reference path="..." /> ` 用于声明文件之间的依赖。它指示编译器在编译期间在对应位置引入额外的文件。

## Preprocessing input files

编译器会在开始编译之前扫描所有输入文件来解析所有的三斜线指令，并在这个过程中将额外的文件添加到此次编译中。

从命令行或者 `tsconfig.json`中的`files`字段指定的输入文件开始作为根文件。这些根文件已他们指定的顺序进行预处理。在一个文件被添加到列表之前，它其中的所有三斜线指令以都会被解析并处理。三斜线指令的解析过程是深度优先的，并且是以在文件中出现的顺序进行的。

如果没有根，则三斜线路径的解析是以包含它的文件作为相对路径。

## Errors

引用不存在的文件会抛出错误。使用三斜线指令引用自身也会引发错误。

## Using `--noResolve`

如果指定了 `--noResolve` 选项，则三斜线指令会被忽略。既不会添加新的文件，也不会改变文件的顺序。

## /// <reference types="..." />

同 `/// <reference path="..." />` 指令，该指令指定依赖的声明。`/// <reference types="..." />` 指令声明一个包的依赖。

它的解析过程类似于 `import` 语句。

例如，在声明文件中包含 `/// <reference types="node" />` 表示该文件使用 `@types/node/index.d.ts` 中的声明。因此这个包需要把该声明文件包含在一起。

只有当你手动编写 `d.ts` 文件的时候才会用到这些指令。

在编译期间自动生成这些文件的时候，编译器会自动添加 `/// <reference types="..." />`。当且仅当结果文件中使用了任何该引用包中的声明才会生成 `/// <reference types="..." />`。

For declaring a dependency on an `@types` package in a `.ts` file, use `--types` on the command line or in your `tsconfig.json` instead. See [using @types, typeRoots and types in tsconfig.json files](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types) for more details.

## /// <reference lib="..." />

该指令允许一个文件显式包含一个已经存在的内置库文件。

内置库文件的引用和 `tsconfig.json` 中 `lib` 编译器选项一样。（如使用 `lib="es2015"` 而不是 `lib="lib.es2015.d.ts"` ）

对于那些依赖于内置类型（如 DOM API 和内置运行时构造函数 Symbol 或者 Iterable）的作者编写声明文件的时候，推荐使用三斜线指令的 lib 指令。

例如，加入 `/// <reference lib="es2017.string" />` 到编译文件之一等于使用 `--lib es2017.string`

```ts
/// <reference lib="es2017.string" />

"foo".padStart(4);
```

## /// <reference no-default-lib="true"/>

该指令将一个文件标记为默认库。你能够在 `lib.d.ts` 等文件中看到该指令。

该指令告诉编译器在编译期间不要包含默认库（如 `lib.d.ts`）。类似于通过命令行传递 `--noLib`

另外还需要注意如果传递了 `--skipDefaultLibCheck`，编译器只会跳过带有 `/// <reference no-default-lib="true"/>` 的文件的检查。

## /// <amd-module />

默认情况下 AMD 模块是匿名生成的。当使用其他工具（如打包工具）来处理生成的模块时，这可能会导致问题（例如 r.js）

`amd-module` 指令允许向编译器传递一个可选模块名：

```ts
// amdModule.ts
///<amd-module name="NamedModule"/>
export class C {}
```

这样将会以 `NamedModule` 作为调用 `AMD define` 时的模块名称。

```ts
// amdModule.js

define("NamedModule", ["require", "exports"], function (require, exports) {
  var C = (function () {
    function C() {}
    return C;
  })();
  exports.C = C;
});
```

## /// <amd-dependency />

> 该指令已经废弃，使用 `import "moduleName"` 来代替
