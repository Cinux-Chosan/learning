# Gulp

This quick start guide will teach you how to build TypeScript with gulp and then add Browserify, uglify, or Watchify to the gulp pipeline. This guide also adds functionality for Babel functionality using Babelify.

该指南教你如何在 TypeScript 中如何将 [Browserify](http://browserify.org/), [uglify](http://lisperator.net/uglifyjs/), [Watchify](https://github.com/substack/watchify) 添加到 gulp 管道任务中, 还会使用 [Babelify](https://github.com/babel/babelify) 来添加 Babel 功能.

## 最简项目

Let’s start out with a new directory. We’ll name it `proj` for now, but you can change it to whatever you want.

我们从一个全新的目录开始. 这里就叫它 proj 吧.

```sh
mkdir proj
cd proj
```

To start, we’re going to structure our project in the following way:

目录结构如下:

```sh
proj/
   ├─ src/
   └─ dist/
```

TypeScript files will start out in your `src` folder, run through the TypeScript compiler and end up in `dist`.

TypeScript 源文件放在 `src` 目录中, 然后通过 TypeScript 编译最后放在 `dist` 目录中.

Let’s scaffold this out:

开始吧:

```sh
mkdir src
mkdir dist
```

### 项目初始化

Now we’ll turn this folder into an npm package.

现在把项目转换成一个 npm 包.

`npm init`

You’ll be given a series of prompts. You can use the defaults except for your entry point. For your entry point, use `./dist/main.js`. You can always go back and change these in the `package.json` file that’s been generated for you.

除了入口文件使用 `./dist/main.js` 之外, 其它配置项都可以使用默认值. 你随时都可以在 `package.json` 进行修改.

### 安装依赖

Now we can use npm install to install packages. First install `gulp-cli` globally (if you use a Unix system, you may need to prefix the npm install commands in this guide with `sudo`).

首先通过 npm 全局安装 `gulp-cli`, 如果是类 Unix 系统, 可能需要加 `sudo`(如果你不知道什么是 sudo, 建议还是换回 windows)

`npm install -g gulp-cli`

Then install `typescript`, `gulp` and `gulp-typescript` in your project’s dev dependencies. Gulp-typescript is a gulp plugin for Typescript.

在项目 dev 依赖中安装 `typescript`, `gulp` 和 `gulp-typescript`. Gulp-typescript 就是 TypeScript 的 gulp 插件.

`npm install --save-dev typescript gulp gulp-typescript`

### 来个简单的例子

Let’s write a Hello World program. In `src`, create the file `main.ts`:

来个 Hellow World 项目, 在 `src` 目录中创建 `main.ts`:

```ts
function hello(compiler: string) {
    console.log(`Hello from ${compiler}`);
}
hello("TypeScript");
```

In the project root, `proj`, create the file `tsconfig.json`:

在项目根目录, 即 `proj` 中创建 `tsconfig.json`:

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

### **创建 gulpfile.js**

In the project root, create the file `gulpfile.js`:

项目根目录中, 创建 `gulpfile.js`:

```js
var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});
```

Test the resulting app

测试一下, 看看效果

```sh
gulp
node dist/main.js
```

The program should print “Hello from TypeScript!”.

这段程序应该输出 “Hello from TypeScript!”.

## 添加模块

Before we get to `Browserify`, let’s build our code out and add modules to the mix. This is the structure you’re more likely to use for a real app.

开始使用 `Browserify` 之前, 先看看模块的使用, 这在真正的应用中应该有的结构.

Create a file called `src/greet.ts`:

创建一个叫 `src/greet.ts` 的文件:

```ts
export function sayHello(name: string) {
    return `Hello from ${name}`;
}
```

Now change the code in `src/main.ts` to import `sayHello` from `greet.ts`:

然后在 `src/main.ts` 中使用 `greet.ts` 中的 `sayHello`:

```ts
import { sayHello } from "./greet";

console.log(sayHello("TypeScript"));
```

Finally, add `src/greet.ts` to `tsconfig.json`:

最后, 把 `src/greet.ts` 添加到 TypeScript 的配置文件 `tsconfig.json` 中:

```json
{
    "files": [
        "src/main.ts",
        "src/greet.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es5"
    }
}
```

Make sure that the modules work by running `gulp` and then testing in Node:

还是使用 `gulp` 来运行, 使用 `Node` 来测试:

```sh
gulp
node dist/main.j
```

Notice that even though we used ES2015 module syntax, TypeScript emitted CommonJS modules that Node uses. We’ll stick with CommonJS for this tutorial, but you could set `module` in the options object to change this.

注意: 即使是我们使用 ES2015 的语法, TypeScript 也会使用 Node 所用的 CommonJS 规范. 在本教程中，我们将坚持使用 CommonJS，但你可以在选项对象中设置 `module` 来更改此模块。

## Browserify

Now let’s move this project from Node to the browser. To do this, we’d like to bundle all our modules into one JavaScript file. Fortunately, that’s exactly what Browserify does. Even better, it lets us use the CommonJS module system used by Node, which is the default TypeScript emit. That means our TypeScript and Node setup will transfer to the browser basically unchanged.

现在开始, 我们就把该项目从 Node 转到浏览器, 因此我们需要将所有的模块都添加到一个 JavaScript 文件中去, 这就是 Browserify 所做的事情, 它做得更好, 它能够让我们使用 Node 的 CommonJS 模块系统, 这也是 TypeScript 的默认方式. 现在, TypeScript 和 Node 的设置都将转到浏览器环境中去.

First, install browserify, tsify, and vinyl-source-stream. tsify is a Browserify plugin that, like gulp-typescript, gives access to the TypeScript compiler. vinyl-source-stream lets us adapt the file output of Browserify back into a format that gulp understands called vinyl.

首先, 安装 `browserify`, `tsify`, 和 `vinyl-source-stream`. 就像 gulp-typescript 能够让 gulp 访问 TypeScript 编译器一样, `tsify` 作为浏览器的插件. `gulp-typescript` 能够将 Browserify 输出的文件转换成 gulp 可以使用的 `vinyl` 格式.

`npm install --save-dev browserify tsify vinyl-source-stream`

### 创建一个页面

Create a file in `src` named `index.html`:

在 `src` 中创建一个 `index.html`:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Hello World!</title>
    </head>
    <body>
        <p id="greeting">Loading ...</p>
        <script src="bundle.js"></script>
    </body>
</html>
```

Now change `main.ts` to update the page:

让 `main.ts` 来更新页面:

```js
import { sayHello } from "./greet";

function showHello(divName: string, name: string) {
    const elt = document.getElementById(divName);
    elt.innerText = sayHello(name);
}

showHello("greeting", "TypeScript");
```

Calling `showHello` calls `sayHello` to change the paragraph’s text. Now change your gulpfile to the following:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest("dist"));
});
```

This adds the `copy-html` task and adds it as a dependency of `default`. That means any time `default` is run, `copy-html` has to run first. We’ve also changed `default` to call Browserify with the tsify plugin instead of gulp-typescript. Conveniently, they both allow us to pass the same options object to the TypeScript compiler.

上面这段代码添加了一个 `copy-html` 任务并且用它作为 `default` 任务的依赖. 也就是说任何时候运行 `default` 任务之前就会首先运行 `copy-html` 任务. 这里我们还修改了 `default` 任务, 通过 tsify 插件来调用 Browserify 而不再是 gulp-typescript. 方便的是, 它们都允许我们给 TypeScript 编译器传递相同的配置选项.

After calling `bundle` we use `source` (our alias for vinyl-source-stream) to name our output bundle bundle.js.

使用 `bundle` 之后, 再使用 `source` 给输出文件命名为 `bundle.js`.

Test the page by running gulp and then opening `dist/index.html` in a browser. You should see “Hello from TypeScript” on the page.

运行 gulp 之后, 在浏览器中打开 `dist/index.html` , 你应该会在页面上看到 “Hello from TypeScript”.

Notice that we specified `debug: true` to Browserify. This causes tsify to emit source maps inside the bundled JavaScript file. Source maps let you debug your original TypeScript code in the browser instead of the bundled JavaScript. You can test that source maps are working by opening the debugger for your browser and putting a breakpoint inside `main.ts`. When you refresh the page the breakpoint should pause the page and let you debug `greet.ts`.

我们给 Browserify 指定了 `debug: true`. 它会让 tsify 在打包的 JavaScript 文件中保留 source map. Source map 让你能在浏览器中调试原生的 TypeScript 代码而非打包过后的代码. 当你在浏览器调试窗口中的 `main.ts` 文件中打断点后就可以测试 ts 代码了. 当你刷新页面, 页面就会在断点处暂停了. (在 Chrome 中测试时, 直接在 bundle.js 中打断点会自动定位到相应的 ts 中)

## Watchify, Babel, 和 Uglify

Now that we are bundling our code with Browserify and tsify, we can add various features to our build with browserify plugins.

我们现在已经使用 Browserify 和 tsify 将代码打包到一起, 另外也可以使用各种 browserify 插件来构建我们的项目了.

- Watchify starts gulp and keeps it running, incrementally compiling whenever you save a file. This lets you keep an edit-save-refresh cycle going in the browser.
  - Watchify 启动 gulp 并保持一直运行, 每当保存文件时都会进行编译. 可以让你循环在 "编辑-保存-刷新" 工作模式中.
- Babel is a hugely flexible compiler that converts ES2015 and beyond into ES5 and ES3. This lets you add extensive and customized transformations that TypeScript doesn’t support.
  - Babel 是一个强大且灵活的编译器, 它能够将 ES2015 或者之后的代码编译成 ES5 和 ES3 的代码. 这让你可以添加 TypeScript 不提供的扩展.
- Uglify compacts your code so that it takes less time to download.
  - Uglify 用于压缩代码, 节省下载流量和时间.

### Watchify

We’ll start with Watchify to provide background compilation:

下面开始介绍用 Watchify 来通过后台编译功能:

`npm install --save-dev watchify gulp-util`

Now change your gulpfile to the following:

修改 `gulpfile.js`:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var watchify = require("watchify");
var tsify = require("tsify");
var gutil = require("gulp-util");
var paths = {
    pages: ['src/*.html']
};

var watchedBrowserify = watchify(browserify({
    basedir: '.',
    debug: true,
    entries: ['src/main.ts'],
    cache: {},
    packageCache: {}
}).plugin(tsify));

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

function bundle() {
    return watchedBrowserify
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest("dist"));
}

gulp.task("default", ["copy-html"], bundle);
watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
```

There are basically three changes here, but they require you to refactor your code a bit.

这里基本上涉及 3 个变化, 但是你需要重构你的代码.

- We wrapped our `browserify` instance in a call to `watchify`, and then held on to the result.
  - 我们用 `browserify` 实例作为 `watchify` 的参数
- We called `watchedBrowserify.on("update", bundle);` so that Browserify will run the bundle function every time one of your TypeScript files changes.
  - 通过调用 `watchedBrowserify.on("update", bundle);` 使得每次 TypeScript 文件改变之后 Browserify 都会运行 bundle 方法.
- We called `watchedBrowserify.on("log", gutil.log);` to log to the console.
  - 调用 `watchedBrowserify.on("log", gutil.log);` 将日志输出到控制台.

Together (1) and (2) mean that we have to move our call to `browserify` out of the `default` task. And we have to give the function for `default` a name since both Watchify and Gulp need to call it. Adding logging with (3) is optional but very useful for debugging your setup.

(1) 和 (2) 意味着我们必须将 `browserify` 从 `default` 任务中移出来. 我们还需要给 `default` 使用的函数起个名字, 因为 Watchify 和 Gulp 都需要调用它. 在 (3) 中添加 logging 作为可选项, 但是调试时非常有用.

Now when you run Gulp, it should start and stay running. Try changing the code for `showHello` in `main.ts` and saving it. You should see output that looks like this:

现在当你运行 gulp, 它启动之后会一直保持运行. 尝试改变 `main.ts` 中的 `showHello` 然后报错看看效果. 应该会有如下输出:

```sh
# 运行命令
gulp
# 输出内容
[10:34:20] Using gulpfile ~/src/proj/gulpfile.js
[10:34:20] Starting 'copy-html'...
[10:34:20] Finished 'copy-html' after 26 ms
[10:34:20] Starting 'default'...
[10:34:21] 2824 bytes written (0.13 seconds)
[10:34:21] Finished 'default' after 1.36 s
[10:35:22] 2261 bytes written (0.02 seconds)
[10:35:24] 2808 bytes written (0.05 seconds)
```

### Uglify

First install Uglify. Since the point of Uglify is to mangle your code, we also need to install vinyl-buffer and gulp-sourcemaps to keep sourcemaps working.

首先安装 Uglify. 由于 Uglify 会丑化代码, 所以我们需要安装 `vinyl-buffer` 和 `gulp-sourcemaps` 使得 sourcemap 起作用.

`npm install --save-dev gulp-uglify vinyl-buffer gulp-sourcemaps`

Now change your gulpfile to the following:

修改 `gulpfile.js`:

```js
var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task("copy-html", function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["copy-html"], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("dist"));
});
```

Notice that `uglify` itself has just one call — the calls to `buffer` and `sourcemaps` exist to make sure sourcemaps keep working. These calls give us a separate sourcemap file instead of using inline sourcemaps like before. Now you can run Gulp and check that `bundle.js` does get minified into an unreadable mess:

注意: `uglify` 本身也是一个调用 - 它对 `buffer` 和 `sourcemap` 的调用来确保 sourcemap 一直起作用. 这些调用给我们生成了分离的 sourcemap 文件而非之前的内联 sourcemap. 现在运行 gulp 之后就能够看到 `bundle.js` 已经被压缩成一团难以阅读的代码了:

```sh
gulp
# cat 为类 unix 系统带的查看文件命令, windows 请用 notepad
cat dist/bundle.js
```

## Babel

First install Babelify and the Babel preset for ES2015. Like Uglify, Babelify mangles code, so we’ll need vinyl-buffer and gulp-sourcemaps. By default Babelify will only process files with extensions of `.js`, `.es`, `.es6` and `.jsx` so we need to add the `.ts` extension as an option to Babelify.

首先安装 `Babelify` 并把 Babel 预设为 ES2015. Babelify 也会像 Uglify 那样丑化代码, 因此我们需要 `vinyl-buffer` 和 `gulp-sourcemap`. 默认情况下 Babelify 只会处理扩展名为 `.js`, `.es`, `.es6` 和 `.jsx` 的文件, 因此我们需要添加 `.ts` 扩展到 Babelify 中.

`npm install --save-dev babelify babel-core babel-preset-es2015 vinyl-buffer gulp-sourcemaps`

Now change your gulpfile to the following:

修改 `gulpfile.js`:

```js
var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['src/*.html']
};

gulp.task('copyHtml', function () {
    return gulp.src(paths.pages)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['copyHtml'], function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['src/main.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .transform('babelify', {
        presets: ['es2015'],
        extensions: ['.ts']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});
```

We also need to have TypeScript target ES2015. Babel will then produce ES5 from the ES2015 code that TypeScript emits. Let’s modify `tsconfig.json`:

我们还需要 TypeScript 编译为 ES2015 的代码. Babel 将会根据 TypeScript 产出的代码编译出 ES5 的代码. 修改 `tsconfig.json`:

```json
{
    "files": [
        "src/main.ts"
    ],
    "compilerOptions": {
        "noImplicitAny": true,
        "target": "es2015"
    }
}
```

Babel’s ES5 output should be very similar to TypeScript’s output for such a simple script.

由于这个项目非常小, 因此Babel ES5 的输出可能会和 TypeScript 的输出非常相像.