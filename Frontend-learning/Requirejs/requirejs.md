# GET STARTED WITH REQUIREJS

如果使用 jQuery, 参考 [targeted jQuery tutorial](http://requirejs.org/docs/jquery.html)

## GET REQUIREJS

[下载](http://requirejs.org/docs/download.html)

## ADD REQUIREJS

现在假设你的项目中所有的 JavaScript 文件都放在一个叫 `scripts` 的文件中, 就像下面这样:

- project-directory/
  - project.html
  - scripts/
    - main.js
    - helper/
      - util.js

然后把 require.js 放到 scripts 目录中:

- project-directory/
  - project.html
  - scripts/
    - main.js
    - require.js
    - helper/
      - util.js

为了充分利用优化工具，建议将所有内联脚本通过外部 js 的方式来引用，并且仅通过require.js 的 requirejs 方法来加载脚本：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My Sample Project</title>
        <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
        <script data-main="scripts/main" src="scripts/require.js"></script>
    </head>
    <body>
        <h1>My Sample Project</h1>
    </body>
</html>
```

如果你不希望加载 js 脚本的时候阻断页面渲染, 你也可以把 script 标签放到 body 的最后面. 如果浏览器支持, 你还可以给 script 标签添加一个 [async 属性](https://developer.mozilla.org/en/docs/Web/HTML/Element/script#Attributes)来使得浏览器异步加载该脚本.

译者备注: async 和 defer 都是异步加载, async 加载完成就执行, 而 defer 需要等待文档(document)被解析完成之后但在 [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded) 事件触发之前执行.

在 `main.js` 中, 你可以使用 `requirejs()` 来加载其他你需要的执行的脚本. 只是用一个 `main.js` 可以确保脚本只有一个入口, 因为 data-main 指定的脚本会异步执行

```js
requirejs(["helper/util"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});
```

这样就会加载 `helper/util.js` 脚本. 这就是 RequireJS 的基本使用, 如果希望充分利用 RequireJS 可以参考 [API 文档](http://requirejs.org/docs/api.html) 学习更多模块的定义和使用.

## 优化

开发完成, 现在你需要部署你的代码让用户使用, 你可以使用 [优化器](http://requirejs.org/docs/optimization.html) 来把这些 JavaScript 文件合并在一起并压缩它们的体积. 上面的例子中, 可以把 `main.js` 和 `helper/util.js` 合并到一个文件中, 然后把合并后的结果体积压缩到最小化.

## 示例

如果你希望开始在一个项目中使用 RequireJS, 可以参考下面的例子:

- [Simple one page app](https://github.com/volojs/create-template) 单页应用
- [Multipage app](https://github.com/requirejs/example-multipage) 多页应用
- [Multipage app with shim config](https://github.com/requirejs/example-multipage-shim) 配置了 shim 的多页应用

------

------

**下面是 API 文档部分**

## 1.1 加载 JavaScript 文件

RequireJS 使用与传统 `<script>` 标签不同的方式来加载脚本. 虽然它也可以快速运行并优化，但主要目标是鼓励代码模块化.

对于 script 标签来说, 鼓励使用模块 ID 来替代传统使用 URL 的方式.

RequireJS 所有加载的内容路径都相对于 baseUrl. baseUrl 通常设置成与 `data-main` 属性指定的顶级脚本所在目录相同. `data-main` 属性是 require.js 用于开始加载脚本时所需要检查的特殊属性. 下面这个例子的 baseUrl 为 scripts:

```html
<!--This sets the baseUrl to the "scripts" directory, and
    loads a script that will have a module ID of 'main'-->
<script data-main="scripts/main.js" src="scripts/require.js"></script>
```

除了这样设置 baseUrl, 也可以通过 RequireJS 配置中手动设置. 如果没有显式指定 baseUrl 也没有使用 data-main 属性, 则 baseUrl 默认为包含当前 HTML 的目录.

RequireJS 默认假设所有的依赖都是 script. 所以就不需要在模块 ID 末尾添加 `.js` 后缀. RequireJS 在将模块 ID 转换成路径的时候会默认加上这个后缀. 使用路径配置的时候, 你可以设置一组 script 的位置. 所有这些功能, 都是为了使用更短的 script 路径(与传统通过 script 标签相比).

有时候你希望直接指定 script 的位置而不是使用 "baseUrl+path" 这样的规则来找到它. 如果模块 ID 有以下情况之一就可以达到这个目的:

- 以 `.js` 结尾
- 以 `/` 开始
- 包含 URL 协议, 如 `http:` 和 `https:`

这些情况下模块 ID 就不会传递给 "baseUrl+path" 规则处理而是当做常规 URL.

通常最好的方式还是使用 baseUrl 和 path 配置来设置模块 ID 的路径. 因为这样做可以让构建的时候重命名和指定不同的路径变得更加灵活.

类似的, 为了避免一大堆的配置, 最好避免将脚本的路径层级嵌套的很深, 最好是所有 script 都放到 baseUrl 下或者像下面这样:

- www/
  - index.html
  - js/
    - app/
      - sub.js
    - lib/
      - jquery.js
      - canvas.js
    - app.js
    - require.js

在 index.html 中:

```html
<script data-main="js/app.js" src="js/require.js"></script>
```

在 app.js 中:

```js
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['jquery', 'canvas', 'app/sub'],
function   ($,        canvas,   sub) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});
```

注意上面的例子中, 像 jQuery 这样的第三方库在文件名中没有包含版本号. 推荐将版本号也放到文件名中, 或者你使用 [volo](https://github.com/volojs/volo), 它会使用版本信息来标记 package.json 但是仍然以 "jquery.js" 存在磁盘上. 这允许你最小化配置而不是为每个三方库在 path 中配置一个入口(如 jquery 需要手动配置为 jquery-1.7.2 这样).

理想情况下你加载的模块是通过 `define()` 方法定义的. 然而你可能需要使用一些并非通过 `define()` 方法来声明了依赖的传统的浏览器全局 script, 你就需要使用 shim 配置来正确的声明依赖.

如果你不声明依赖, 你可能很容易在 RequireJS 异步加载脚本的时候得到加载错误, 因为加载的速度不一样会导致加载脚本的顺序发生变化.

## 1.2 data-main 入口

RequireJS 开始加载 script 的时候会去检查 data-main 属性.

```html
<!--when require.js loads it will inject another script tag
    (with async attribute) for scripts/main.js-->
<script data-main="scripts/main" src="scripts/require.js"></script>
```

一般你需要使用 data-main 指定的脚本来配置可选项, 然后加载第一个模块. 注意: RequireJS 根据 data-main 生成的 script 标签包含 [async 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#attr-async), 因此你不能假设 data-main 指定的 script 会在相同页面其他 scripts 之前加载和执行.

例如,

```html
<script data-main="scripts/main" src="scripts/require.js"></script>
<script src="scripts/other.js"></script>
```

```js
// contents of main.js:
require.config({
    paths: {
        foo: 'libs/foo-1.1.3'
    }
});
```

```js
// contents of other.js:

// This code might be called before the require.config() in main.js
// has executed. When that happens, require.js will attempt to
// load 'scripts/foo.js' instead of 'scripts/libs/foo-1.1.3.js'

// 这段代码可能在 main.js 中 require.config() 执行之前调用, 如果是这样, require.js 就会加载 'scripts/foo.js' 而不是 'scritps/libs/foo-1.1.3.js'

require(['foo'], function(foo) {

});
```

如果你希望在 HTML 中使用 require() 调用, 那么最好就不用 data-main. 因为 data-main 仅用于当页面只有一个主入口的情况下. 即 data-main 指定的 script. 如果需要使用内联的 require(), 最好在配置中嵌套使用 require()

```js
<script src="scripts/require.js"></script>
<script>
require(['scripts/config'], function() {
    // Configuration loaded now, safe to do other require calls
    // that depend on that config.
    require(['foo'], function(foo) {

    });
});
</script>
```

## 1.3 定义模块

模块与传统的 script 相比较的好处就是它把代码放到局部作用域中, 从而避免污染全局变量. 它可以明确的列出依赖, 无需引用全局对象就可以操作和使用它们 (依赖被当做定义该模块的方法参数传入). RequireJS 中的模块是 [模块模式](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth) 的一个扩展, 它的好处就是可以不用全局变量来引用其他模块.

RequireJS 中模块的语法使得它们尽可能的加载得更快, 甚至不按顺序, 但是会以正确的依赖顺序执行, 并且由于不创建全局变量, it makes it possible to load multiple versions of a module in a page.http://requirejs.org/docs/api.html#define