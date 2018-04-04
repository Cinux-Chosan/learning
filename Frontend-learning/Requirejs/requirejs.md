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

RequireJS 中模块的语法使得它们尽可能的加载得更快, 甚至不按顺序, 但是会以正确的依赖顺序执行, 并且由于不创建全局变量, 因此使得引入同一个 lib 的不同版本成为了可能。

（如果你对使用 CommonJS 模块熟悉， 还可以参考 [CommonJS Notes](http://requirejs.org/docs/commonjs.html) 学习如何将 RequireJS 模块映射成 CommonJS 模块）

每个文件应该只包含一个模块的定义。 模块可以通过 [优化工具](http://requirejs.org/docs/optimization.html) 打包在一起。


### 1.3.1 Simple Name/Value Pairs

如果模块没有任何依赖， 只是一个 name/value 对的集合， 那么直接将它传给 define():

```js
//Inside file my/shirt.js:
define({
    color: "black",
    size: "unisize"
});
```

### 1.3.2 Definition Functions

如果模块没有依赖， 但是需要用一个函数执行一些配置操作， 那么传递一个函数作为 define() 的参数：

```js
//my/shirt.js now does setup work
//before returning its module definition.
define(function () {
    //Do setup work here

    return {
        color: "black",
        size: "unisize"
    }
});
```

### 1.3.3 Definition Functions with Dependencies

如果模块有依赖， 那么给 define() 的第一个参数应该是一个包含所有依赖名字的数组， 第二个参数应该是这个定义函数。 该函数在所有依赖都加载完成之后会被调用一次。 该函数应该返回一个定义该模块的对象。 依赖会被作为参数传入该定义函数， 依赖的顺序和依赖数组的顺序一样：

```js
//my/shirt.js now has some dependencies, a cart and inventory
//module in the same directory as shirt.js
define(["./cart", "./inventory"], function(cart, inventory) {
        //return an object to define the "my/shirt" module.
        return {
            color: "blue",
            size: "large",
            addToCart: function() {
                inventory.decrement(this);
                cart.add(this);
            }
        }
    }
);
```

这个例子中会创建 my/shirt 模块， 它依赖于 my/cart 和 my/inventory，它们在磁盘上的结构如下：

- my/cart.js
- my/inventory.js
- my/shirt.js

调用的函数指定了两个参数， "cart" 和 "inventory"， 它们分别代表 "./cart" 和 "./inventory" 模块。

在 my/cart 和 my/inventory 模块加载完成之后， 该函数会收到 "cart" 和 "inventory" 作为这两个模块。

由于不鼓励定义全局模块， 所以可以在同一个模块中使用模块的多个版本。

函数返回的对象定义了 "my/shirt" 模块， 这种方式定义的模块不会被当做全局对象。

### 1.3.4 Define a Module as a Function

模块并不是必须要返回对象， 任何合法的值都可以返回。这个例子就展示了该模块返回一个函数作为模块的定义：

```js
//A module definition inside foo/title.js. It uses
//my/cart and my/inventory modules from before,
//but since foo/title.js is in a different directory than
//the "my" modules, it uses the "my" in the module dependency
//name to find them. The "my" part of the name can be mapped
//to any directory, but by default, it is assumed to be a
//sibling to the "foo" directory.
define(["my/cart", "my/inventory"],
    function(cart, inventory) {
        //return a function to define "foo/title".
        //It gets or sets the window title.
        return function(title) {
            return title ? (window.title = title) :
                   inventory.storeName + ' ' + cart.name;
        }
    }
);
```

### 1.3.5 Define a Module with Simplified CommonJS Wrapper

如果你希望重用一些用传统的 CommonJS 模块格式写的代码， 要把它们修改成可以用于依赖数组的代码又比较困难，但是你确实希望通过一个依赖名字就可以直接使用它， 这种情况下你可以使用简易的 CommonJS 包装器：

```js
define(function(require, exports, module) {
        var a = require('a'),
            b = require('b');

        //Return the module value
        return function () {};
    }
);
```

该包装器依赖于 Function.prototype.toString() 来取得函数内容的字符串。 在一些像 PS3 和老式 Opera 手机浏览器上可能不会正常工作，在这些设备上需要使用 [optimizer](http://requirejs.org/docs/optimization.html) 来获取依赖。

More information is available on the [CommonJS page](http://requirejs.org/docs/commonjs.html), and in the ["Sugar" section in the Why AMD page](http://requirejs.org/docs/whyamd.html#sugar).

### 1.3.6 Define a Module with a Name

你可能看到一些 define() 调用第一个参数是一个名字：

```js
   //Explicitly defines the "foo/title" module:
    define("foo/title",
        ["my/cart", "my/inventory"],
        function(cart, inventory) {
            //Define foo/title object in here.
       }
    );
```

通常这是 [optimization tool](http://requirejs.org/docs/optimization.html) 生成的结果。你可以显式指定模块名， 但是这就降低了它的适应性 —— 如果你将这些文件移动到其它目录之后你还需要修改它们的名字。 通常最好不要自己去给模块写一个名字，让优化工具去这样做吧。 优化工具需要添加这些名字以便将多个模块捆绑到一个文件中， 这样使得它们在浏览器中加载得更快！

### 1.3.7 模块的其他注意事项

**一文件一模块:** 考虑到通过模块名查找文件路径算法的本质, 每个 JavaScript 文件应该只定义一个模块. 将多个模块打包到一起的操作应该交给优化工具去完成.

**在 define() 中使用相对路径的模块名:** require('./relative/name') 可能发生在 define() 调用中, 请确保使用 require 来声明依赖, 以便能够正确的解析相对路径名.

```js
define(["require", "./relative/name"], function(require) {
    var mod = require("./relative/name");
});
```

Or better yet, use the shortened syntax that is available for use with [translating CommonJS](http://requirejs.org/docs/commonjs.html) modules:

```js
define(function(require) {
    var mod = require("./relative/name");
});
```

这种格式会使用 Function.prototype.toString() 来查找 `require()` 调用, 然后将它们添加到依赖数组中去,所以使用 require 才能够正确解析相对路径.

如果你在一个目录里面创建了多个模块, 相对路径就显得特别有用, 因为使用兄弟模块的时候完全不需要知道目录的名字, 你完全可以很方便的将这个目录和其他人或其它项目共享

**相对模块名称是指相对于其他模块名, 而非路径:** 加载器会在内部保存模块的名称而不是它们的路径. 因此，对于相对名称引用，这些引用相对于引用该引用的模块名称进行了解析，然后如果需要加载，则将该模块名称或ID转换为路径.

下面的例子中, compute 包下面有 main 和 extras 模块:

- lib/
  - compute/
    - main.js
    - extras.js

main.js 模块是这样的:

```js
define(["./extras"], function(extras) {
    //Uses extras in here.
});
```

路径配置是这样的:

```js
require.config({
    baseUrl: 'lib',
    paths: {
      'compute': 'compute/main'
    }
});
```

`require(['compute'])` 执行完成后, `lib/compute/main.js` 的模块名就被设置为 `compute`.

当需要 `./extras` 的时候, 它就会被解析为相对于 `compute`, 即 `compute/./extras` 会被规格化为 `extras`. 由于没有这个模块的路径配置, 生成的路径就变成了错路的 `lib/extras.js`.

这种情况下, 使用 package 配置, 因为它可以把 main 模块设置为 `compute`, 但是加载器内部会使用 `compute/main` 作为模块 ID, 因此 `./extras` 的相对引用才能够正常工作.

Another option is to construct a module at lib/compute.js that is just define(['./compute/main'], function(m) { return m; });, then there is no need for paths or packages config.

Or, do not set that paths or packages config and do the top level require call as require(['compute/main']).


**Generate URLs relative to module:** You may need to generate an URL that is relative to a module. To do so, ask for "require" as a dependency and then use require.toUrl() to generate the URL:

```js
define(["require"], function(require) {
    var cssUrl = require.toUrl("./style.css");
});
```

**Console debugging:** If you need to work with a module you already loaded via a require(["module/name"], function(){}) call in the JavaScript console, then you can use the require() form that just uses the string name of the module to fetch it:

```js
require("module/name").callSomeFunction()
```

Note this only works if "module/name" was previously loaded via the async version of require: require(["module/name"]). If using a relative path, like './module/name', those only work inside define
