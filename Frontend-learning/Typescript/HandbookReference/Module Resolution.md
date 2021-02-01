# Module Resolution

编译器通过模块解析的过程来确定导入的内容的引用。如 `import { a } from 'moduleA'`，为了对 a 的使用进行检查，编译器需要知道 `a` 到底是什么。

模块 `moduleA` 可能被定义在 `.ts`/`.tsx` 或者 `.d.ts` 文件中。

首先编译器会尝试定位导入模块文件的位置。其遵循两种不同的策略：[`Classic`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#classic) 或者 [`Node`](https://www.typescriptlang.org/docs/handbook/module-resolution.html#node) 的方式。这些策略会告诉编译器去哪里寻找 `moduleA`。

如果都不起作用并且模块名不是相对路径形式的，则编译器会尝试定位 [`ambient 模块声明`](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules)

最后，如果编译器不能解析模块，它会打印一个错误。类似这样：`error TS2307: Cannot find module 'moduleA'.`

## Relative vs. Non-relative module imports

模块导入的解析根据模块是否是相对路径形式而有所不同。相对路径的形式是 `/`、`./` 或者 `../` 开始。其他情况都是非相对导入，称之为绝对导入。

相对导入是相对于当前文件，且不会解析到 `ambient 声明模块中`。自己的模块应该使用相对导入。

绝对导入会相对于 `baseUrl`，或者通过 path 映射。它们还会解析到 [`ambient 模块声明文件`](https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules) 去。使用绝对导入来对外部模块进行引用。

## Module Resolution Strategies

有两种引入模块的策略：`Node` 和 `Classic`。你可以使用 `--moduleResolution` 来指定模块解析策略。如果没有指定则 `--module commonjs` 默认使用 `Node` 形式，`--module` 设置为 `amd`、`system`、`umd`、`es2015`、`esnext` 等则默认使用 `Classic`

### Classic

曾经该策略是默认解析策略。如今该策略主要用于向后兼容。

相对引入是相对于当前文件而言，如 `/root/src/folder/A.ts` 中有 `import { b } from "./moduleB"` 则会进行如下查找：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

对于绝对导入而言，编译器会从包含当前文件的目录开始向上遍历目录树，直到定位到对应的文件。例如：

在文件 `/root/src/folder/A.ts` 中存在 `import { b } from "moduleB"`，则会像下面这样寻找模块 `moduleB`：

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

### Node

这种策略是模仿 Nodejs 运行时的模块解析机制。完整的算法在 [Node.js module documentation](https://nodejs.org/api/modules.html#modules_all_together)

#### How Node.js resolves modules

要明白 Typescript 编译器是怎么做的，首先需要了解 Nodejs 的模块是怎么加载的。

传统情况下，在 Nodejs 通过 require 导入模块，Nodejs 中的 require 会根据参数的相对还是绝对路径来指定不同的操作。

相对路径非常直接，如 `/root/src/moduleA.js` 中存在 `var x = require("./moduleB")`，Nodejs 会按照如下顺序解析：

1. `/root/src/moduleB.js`
2. 如果目录 `/rot/src/moduleB` 包含名字为 `package.json` 的文件，该文件中指定了 `main`，则会引用到 `main` 指定的文件
3. `root/src/moduleB/index.js`，`index.js` 作为模块隐式的 main 字段

然而，对于绝对路径略有不同。Node 会从 `node_modules` 中查找模块。`node_modules` 可能存在于包含当前文件的目录中，也可能在目录层级的上层，Nodejs 会向上查找每一个 `node_modules` 直到找到需要载入的模块为止。

如果 `/root/src/moduleA.js` 中存在 `var x = require("moduleB")`，则按如下顺序查找：

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json` (if it specifies a `"main"` property)
3. `/root/src/node_modules/moduleB/index.js`
4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json` (if it specifies a `"main"` property)
6. `/root/node_modules/moduleB/index.js`
7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json` (if it specifies a `"main"` property)
9. `/node_modules/moduleB/index.js`

第 4 和 7 步向上跳了目录层级。

#### How TypeScript resolves modules

Typescript 模拟 Node.js 运行时的解析策略来在编译时定位模块文件。Typescript 会基于 Node 的解析逻辑覆盖 Typescript 资源类型的文件（`.ts`、`.tsx` 和 `.d.ts`）。Typescript 也会使用 `package.json` 中的 `types` 字段，其作用同 `main` —— 编译器会使用它来查找 `main` 的定义。

例如，在 `/root/src/moduleA.ts` 中存在 `import { b } from './moduleB'` 会进行如下顺序查找 `./moduleB`：

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json` (if it specifies a `"types"` property)
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

回想一下，Nodejs 查找文件的顺序是先 `moduleB.js` 然后是 `package.json` 中的 `main` 字段，然后是对应目录下的 `index.js`

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json` (if it specifies a `"types"` property)
5. `/root/src/node_modules/@types/moduleB.d.ts`
6. `/root/src/node_modules/moduleB/index.ts`
7. `/root/src/node_modules/moduleB/index.tsx`
8. `/root/src/node_modules/moduleB/index.d.ts`
9. `/root/node_modules/moduleB.ts`
10. `/root/node_modules/moduleB.tsx`
11. `/root/node_modules/moduleB.d.ts`
12. `/root/node_modules/moduleB/package.json` (if it specifies a `"types"` property)
13. `/root/node_modules/@types/moduleB.d.ts`
14. `/root/node_modules/moduleB/index.ts`
15. `/root/node_modules/moduleB/index.tsx`
16. `/root/node_modules/moduleB/index.d.ts`
17. `/node_modules/moduleB.ts`
18. `/node_modules/moduleB.tsx`
19. `/node_modules/moduleB.d.ts`
20. `/node_modules/moduleB/package.json` (if it specifies a `"types"` property)
21. `/node_modules/@types/moduleB.d.ts`
22. `/node_modules/moduleB/index.ts`
23. `/node_modules/moduleB/index.tsx`
24. `/node_modules/moduleB/index.d.ts`

不要被步骤的数量吓到，其实和 Node 一样，只是在 9 和 17 步的时候上跳了目录。

## Additional module resolution flags

项目的源码结构有时候和输出并不一致。通常经历一系列构建步骤之后才得到最终的输出。这包括将 `.ts` 编译为 `.js` 和将依赖从不同地方拷贝到同一个输出文件中。最终结果就是导致模块运行时的名称或路径和源文件名称不同。

Typescript 中具有一系列额外的标志来告诉编译器需要在源代码和最终结果之间做了何种转换。注意编译器并不执行这些转换，它只是使用这些信息来引导解析模块的过程找到正确的文件。

### Base URL

在使用 AMD 模块加载器并且模块最后都在一个目录的应用中，通常使用 `baseUrl` 选项。虽然模块的资源文件在不同的目录，但是最终会被放到一起。

设置 `baseUrl` 告诉编译器去哪里寻找模块。所有使用绝对路径引用的模块都会被假设它们是相对于 `baseUrl`

`baseUrl` 的值为：

- 命令行中的 `baseUrl` 参数的值（如果是相对路径，则基于当前目录作来计算最终位置）
- `tsconfig.json` 中的 `baseUrl`（如果是相对路径，则会基于 `tsconfig.json` 的位置来计算最终位置）

注意，设置 baseUrl 并不影响相对路径的模块，因为它们始终相对于导入它们的文件路径。

### Path mapping

有时候模块并不直接在 `baseUrl` 里面。例如模块 `jquery` 可能在运行时会被转换成 `node_modules/jquery/dist/jquery.slim.min.js`。在运行时加载器会使用一个模块映射配置来定位文件。

Typescript 编译器支持通过在 `tsconfig.json` 中使用 `paths` 来声明映射关系。下面演示如何通过 `paths` 来指定 `jquery`：

```ts
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
    }
  }
}
```

`paths` 也是相对于 `baseUrl`，因此指定了 `paths` 也需要指定 `baseUrl`。修改了 `baseUrl` 也需要同步修改 `paths`。

使用 `paths` 还能够完成一些复杂的映射。比如某个项目一部分模块在其中一个位置，剩下的模块又在另一个位置。构建的时候需要将它们统一在一个地方，假设项目结构如下：

```
projectRoot
├── folder1
│   ├── file1.ts (imports 'folder1/file2' and 'folder2/file3')
│   └── file2.ts
├── generated
│   ├── folder1
│   └── folder2
│       └── file3.ts
└── tsconfig.json
```

对应的 tsconfig.json 如下：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["*", "generated/*"]
    }
  }
}
```

上面这段代码告诉编译器，任何满足模式 `*` 的模块需要在这两个位置查找：

1. `*`：表示名字不变，因此 `<moduyleName>` 就是 `<baseUrl>/<moduleName>`
2. `generated/*` 表示模块名字添加了 `generated` 前缀，因此 `<moduleName>` 会变成 `<baseUrl>/generated/<moduleName>`

根据这个逻辑，编译器会尝试像下面这样解析两个 import：

import "foler1/file2"：

1. 模式 `*` 匹配成功，通配符捕获到整个模块名
2. 尝试使用列表中第一项 `*` 进行查找，`*` 代表模块名 `folder1/file2`
3. 由于是绝对导入，因此和 baseUrl 进行合并，形成 `procetRoot/foler1/file2.ts`
4. 由于文件存在，查找结束

import ‘folder2/file3’:

前面 3 步和上面一样，但是文件不存在，因此

4. 使用列表中第二项 `generated/*` 生成 `generated/folder2/file3`
5. 同样是绝对导入，通过和 `baseUrl` 组合形成 `projectRoot/generated/folder2/file3.ts`
6. 文件存在，查找结束

## Virtual Directories with rootDirs

有些情况是项目中多个目录下的资源会在编译期合并生成到一个输出目录。这可以看做是通过一组源目录创建了一个 “虚拟” 目录。

使用 `rootDirs` 来告诉编译器

## Using --noResolve

通常编译器会在编译开始之前解析所有导入的模块。每次它解析成功一个 `import` 就会将它添加到文件集合中等待稍后编译过程使用。

`--noResolve` 编译器选项告诉编译器不要给编译添加任何文件，除非它们通过命令行指定。编译器仍然会尝试去将模块解析为文件，但是如果该文件没有指定，则不会被包含进编译文件集合中。

例如：

```ts
// app.ts

import * as A from "moduleA"; // OK, 'moduleA' passed on the command-line
import * as B from "moduleB"; // Error TS2307: Cannot find module 'moduleB'.
```

执行 `tsc app.ts moduleA.ts --noResolve`，则会：

- 正确找到 `moduleA`，因为它通过命令行传入
- 找不到 `moduleB`，因为它没有被指定

## Common Questions

### 为什么在 exclude 列表中的模块仍然被编译器获取到了？

`tsconfig.json` 将文件夹转换成一个 `项目`。没有指定任何 `exclude` 或者 `files` 入口的情况下，包含 `tsconfig.json` 的文件夹内的所有文件及其子目录都会被包含到编译过程中。如果你希望排除一些文件则使用 `exclude` 字段,如果你希望自己来指定所有文件而非让编译器去查找它们则使用 `files` 字段。

如果编译器确定一个文件是某个模块的 `import` 目标，则它会被包含到变异种，不管它在之前的步骤是否被过滤掉了。

因此如果你想要从编译中去掉一个文件，则需要把所有通过 `import` 或者 `///<reference path="..." />` 引用它的文件也一并过滤掉才行。
