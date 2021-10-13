## 重要

- [ajv](https://www.npmjs.com/package/ajv/v/0.1.4)
  - json 模式校验，如在编译之前校验配置文件是否符合模式等

<!-- ## 以下来自项目 https://github.com/microsoft/TypeScript-Node-Starter.git package.json 的摘录 -->

- [shelljs](https://www.npmjs.com/package/shelljs)
  - Unix shell commands for Node.js
- [winston](https://www.npmjs.com/package/winston)

  - A logger for just about everything.

- [log4js](https://www.npmjs.com/package/log4js)

  - log4j 的 js 版本。灵活的日志管理模块

- [morgan](https://www.npmjs.com/package/morgan)

  - HTTP request logger middleware for node.js

- [async](https://www.npmjs.com/package/async)
  - Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.
- [neo-async](https://www.npmjs.com/package/neo-async) （来自 webpack）
  - Neo-Async 被认为是 Async 的直接替代品，几乎完全覆盖了它的功能并且运行速度更快。
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
  - 不可逆加密工具，bcrypt 的 js 版本。参考 [使用 Bcrypt 对密码进行加密与解密验证](http://www.cnblogs.com/yspace/p/10105386.html)
- [crypto-js](https://www.npmjs.com/package/crypto-js)
  - 标准加密工具
- [bluebird](https://www.npmjs.com/package/bluebird)
  - Bluebird is a fully featured promise library with focus on innovative features and performance
- [dotenv](https://www.npmjs.com/package/dotenv)
  - loads environment variables from a .env file into process.env.
- [errorhandler](https://www.npmjs.com/package/errorhandler)
  - This middleware is only intended to be used in a development environment, as the full error stack traces and internal details of any object passed to this module will be sent back to the client when an error occurs.
- [connect](https://www.npmjs.com/package/connect)
  - 一个简单的 http 框架，结合了各种插件，可以快速开发 http 服务
- [lusca](https://www.npmjs.com/package/lusca)
  - Web application security middleware. （阻止各种 web 攻击，如 csrf, csp 等）
- [Passport](https://www.npmjs.com/package/passport)
  - Passport 的唯一目的是验证请求，它通过一组称为策略的可扩展插件来完成。
- [passport-local](https://www.npmjs.com/package/passport-local)
  - passport 策略的一种，通过用户名和密码来验证用户信息，可用于做登陆验证功能等。
- [chai](https://www.npmjs.com/package/chai)

  - Chai is an assertion library, similar to Node's built-in assert. It makes testing much easier by giving you lots of assertions you can run against your code. 即一个可读性极强的断言框架，参考官网 https://www.chaijs.com/ 查看更多示例。

  ```js
  chai.should();
  foo.should.be.a("string");
  foo.should.equal("bar");
  foo.should.have.lengthOf(3);
  tea.should.have.property("flavors").with.lengthOf(3);
  ```

- [supertest]()

  - HTTP assertions made easy via superagent。可读性强的 http 测试框架，类似于 chai：

  ```js
  const request = require("supertest");
  const express = require("express");

  const app = express();

  app.get("/user", function(req, res) {
    res.status(200).json({ name: "john" });
  });

  request(app)
    .get("/user")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200)
    .end(function(err, res) {
      if (err) throw err;
    });
  ```

- [assert-plus](https://www.npmjs.com/package/assert-plus)
  - 提供了比 node assert 更多实用的功能，并且可以根据环境禁用
- [concurrently](https://www.npmjs.com/package/concurrently)
  - Run multiple commands concurrently。多个任务同时运行，并可追踪其输出和执行是否成功等。
- [ts-node](https://www.npmjs.com/package/ts-node)
  - TypeScript execution and REPL for node.js, with source map support. Works with typescript@>=2.0。即 ts 命令行执行终端。

## 来自 [nwb](https://github.com/insin/nwb.git)

- [chalk](https://www.npmjs.com/package/chalk)

  - Terminal string styling done right

  ```js
  // Combine styled and normal strings
  log(chalk.blue("Hello") + " World" + chalk.red("!"));

  // Compose multiple styles using the chainable API
  log(chalk.blue.bgRed.bold("Hello world!"));
  ```

- [cli-color](https://www.npmjs.com/package/cli-color)

  - 同 chalk，也是在命令行输出多种颜色的字体

- [consola](https://www.npmjs.com/package/consola)
  - Elegant Console Logger for Node.js and Browser
    - Easy to use
    - Fancy output with fallback for minimal environments
    - Pluggable reporters
    - Consistent command line interface (CLI) experience
    - Tag support
    - Redirect console and stdout/stderr to the consola and easily restore redirect.
    - Browser support
    - Pause/Resume support
    - Mocking support
    - Spam prevention by throttling logs

* [minimist](https://www.npmjs.com/package/minimist)
  - parse argument options。即解析命令行参数
  ```sh
    $ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
  ```
  ```js
    { _: [ 'foo', 'bar', 'baz' ],
      x: 3,
      y: 4,
      n: 5,
      a: true,
      b: true,
      c: true,
      beep: 'boop' }
  ```
* [Commander.js](https://www.npmjs.com/package/commander)
  - node.js 命令行界面的完整解决方案，受 Ruby commander 启发。
* [yargs](https://www.npmjs.com/package/yargs)
  - 同 minimist 和 commander 一样，也是命令行解析工具
* [nopt](https://www.npmjs.com/package/nopt)
  - 同 minimist 和 commander 一样，也是命令行解析工具
* [Inquirer.js](https://www.npmjs.com/package/inquirer)
  - A collection of common interactive command line user interfaces. 常用交互式命令行用户界面的集合。
* [ora](https://www.npmjs.com/package/ora)
  - Elegant terminal spinner
* [run-series](https://www.npmjs.com/package/run-series)
  - npm install run-series
* [copy-template-dir](https://www.npmjs.com/package/copy-template-dir)
  - High throughput template dir writes. Supports variable injection using the mustache `{{ }}` syntax.
  - 高吞吐量模板目录写入。支持使用 mustache 的 `{{}}` 语法注入变量。可用于编写 cli 工具时给模板注入变量。

# 来自 [webpack](https://www.npmjs.com/package/webpack)

- [neo-async](https://www.npmjs.com/package/neo-async)
  - Neo-Async 被认为是 Async 的直接替代品，几乎完全覆盖了它的功能并且运行速度更快。

* [inflection](https://www.npmjs.com/package/inflection)

  - 处理字符串，如转首字母大写、驼峰命名等

* [execa](https://www.npmjs.com/package/execa)

  - 用于执行 shell 命令，它对 child_process 模块进行了一些封装

* [get-caller-file](https://www.npmjs.com/package/get-caller-file)

  - 让函数知道它是从哪个文件中被调用的，依赖于 node/v8 特定 API

* [esprima](https://www.npmjs.com/package/esprima)

  - JavaScript 词法分析和语法分析器，生成 AST

* [recast](https://www.npmjs.com/package/recast)

  - 类似于 @babel/parser

* [tiny-lr](https://www.npmjs.com/package/tiny-lr)

  - This script manages a tiny LiveReload server implementation. It exposes an HTTP server and express middleware, with a very basic REST API to notify the server of a particular change.

* [fs-tree-diff](https://www.npmjs.com/package/fs-tree-diff)

  - FSTree provides the means to calculate a patch (set of operations) between one file system tree and another.

* [capture-exit](https://www.npmjs.com/package/capture-exit)

  - Allow cooprative async exit handlers, we unfortunately must hijack process.exit.It allows a handler to ensure exit, without that exit handler impeding other similar handlers. for example, see: [sindresorhus/ora#27](https://github.com/sindresorhus/ora/issues/27)

* [ci-info](https://www.npmjs.com/package/ci-info)

  - Get details about the current Continuous Integration environment.（ci 服务器信息监测）

* [configstore](https://www.npmjs.com/package/configstore)

  - Easily load and persist config without having to think about where and how
  - 轻松的加载和保存配置，而不用关心路径问题。它会在当前电脑的特定目录中（如 `$XDG_CONFIG_HOME` or `~/.config`）创建配置文件

* [jsdiff](https://www.npmjs.com/package/diff)

  - A javascript text differencing implementation.
  - 比较文本实现

* [exit](https://www.npmjs.com/package/exit)

  - A replacement for process.exit that ensures stdio are fully drained before exiting.

* [filesize.js](https://www.npmjs.com/package/filesize)

  - filesize.js provides a simple way to get a human readable file size string from a number (float or integer) or string.
  - 获取人类易读的文件大小

* [find-up](https://www.npmjs.com/package/find-up)

  - 查找目录或文件

* [fs-tree-diff](https://www.npmjs.com/package/fs-tree-diff)

  - FSTree provides the means to calculate a patch (set of operations) between one file system tree and another.

* [git-repo-info](https://www.npmjs.com/package/git-repo-info)

  - Retrieves repo information without relying on the git command.

* [is-git-url](https://www.npmjs.com/package/is-git-url)

  - 验证 url 是否是 git 地址

* [isBinaryFile](https://www.npmjs.com/package/isbinaryfile)

  - 检测一个文件是否是二进制文件

* [js-yaml](https://www.npmjs.com/package/js-yaml)

  - yaml 的 js 实现

* [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify)

  - `JSON.stringify()` 的确定性版本，用于获取一致的 json 序列化结果

* [lodash.template](https://www.npmjs.com/package/lodash.template)

  - The lodash method `_.template` exported as a Node.js module.
  - https://lodash.com/docs#template

* [markdown-it](https://www.npmjs.com/package/markdown-it)

  - Markdown parser done right. Fast and easy to extend.

- [npm-package-arg](https://www.npmjs.com/package/npm-package-arg)

  - 根据传给 npm install 的参数解析出具体信息。如版本号等

- [node-portfinder](https://www.npmjs.com/package/portfinder)

  - 用于寻找可用端口，从 8000 起

- [promise.prototype.finally](https://www.npmjs.com/package/promise.prototype.finally)

  - ES Proposal spec-compliant shim for Promise.prototype.finally

- [arch](https://www.npmjs.com/package/arch)

  - This module is used by WebTorrent Desktop to determine if the user is on a 32-bit vs. 64-bit operating system to offer the right app installer.

- [resolve](https://www.npmjs.com/package/resolve)

  - implements the node `require.resolve()` algorithm such that you can require.resolve() on behalf of a file asynchronously and synchronously
  - 同步或异步 resolve 文件

- [sane](https://www.npmjs.com/package/sane)

  - I've been driven to insanity by node filesystem watcher wrappers. Sane aims to be fast, small, and reliable file system watcher.
  - 观察文件或目录变动

- [semver](https://www.npmjs.com/package/semver)

  - npm 根据语义检测版本号是否合法

- [Sort Package.json](https://www.npmjs.com/package/sort-package-json)

  - 用于对 package.json 的字段进行排序，依照一些[众所周知的顺序](https://github.com/keithamus/sort-package-json/blob/HEAD/index.js)

- [node-temp](https://www.npmjs.com/package/temp)

  - Handles generating a unique file/directory name under the appropriate system temporary directory, changing the file to an appropriate mode, and supports automatic removal (if asked)

- [tree-sync](https://www.npmjs.com/package/tree-sync)

  - 同步两个目录的文件，即一边修改之后，同步改动到另一个目录中

- [uuid](https://www.npmjs.com/package/uuid)

  - Simple, fast generation of [RFC4122](http://www.ietf.org/rfc/rfc4122.txt) UUIDS.

- [node-walk](https://www.npmjs.com/package/walk)

  - nodejs walk implementation. This is somewhat of a port python's os.walk, but using Node.JS conventions.
  - 遍历目录文件

- [node-walk-sync](https://www.npmjs.com/package/walk-sync)

  - Return an array containing all recursive files and directories under a given directory, similar to Unix find. Follows symlinks. Bare-bones, but very fast.
  - 和上面的 node-walk 一样，只不过是同步版本

- [yam](https://www.npmjs.com/package/yam)

  - 支持带注释的 json

- [which](https://www.npmjs.com/package/which)

  - Like the unix which utility.

- [supertest](https://www.npmjs.com/package/supertest)

  - test HTTP 请求

- [strip-ansi](https://www.npmjs.com/package/strip-ansi)

  - Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string

- [mocha](https://www.npmjs.com/package/mocha)

  - Simple, flexible, fun JavaScript test framework for Node.js & The Browser

- [nock](https://www.npmjs.com/package/nock)

  - HTTP server mocking and expectations library for Node.js
  - HTTP 服务端模拟

- [nyc](https://www.npmjs.com/package/nyc)

  - Istanbul's state of the art command line interface, with support for
  - 还没明白

- [prettier](https://www.npmjs.com/package/prettier)

  - Prettier is an opinionated code formatter

- [memoize-one](https://www.npmjs.com/package/memoize-one)

  - A memoization library that only caches the result of the most recent arguments.
  - 对函数结果进行缓存，如果再次传入相同的参数则返回缓存的结果，而不用再次执行函数获得结果。

- [bytes](https://www.npmjs.com/package/bytes)

  - Utility to parse a string bytes (ex: 1TB) to bytes (1099511627776) and vice-versa.
  - 将表示字节的单位与字节数量进行相互转换

- [Browserslist](https://www.npmjs.com/package/browserslist)

  -

- [connect-history-api-fallback](https://www.npmjs.com/package/connect-history-api-fallback)

  - SPA 使用 history 模式的 nodejs 端解决方案，可以方便的配合前端 SPA
    使用 history API

- [archiver](https://www.npmjs.com/package/archiver)

  - 文件归档，即压缩，目录压缩

- [ismobilejs](https://www.npmjs.com/package/ismobilejs)
  - 在浏览器端和 Nodejs 中，检测是否是手机环境，Nodejs 中通过请求 header 来判断
- [mathjs](https://www.npmjs.com/package/mathjs)

  - 内置一些常量和函数，并且可以直接计算字符串，解析字符串等，单位换算等

  ```js
  evaluate("12.7 cm to inch"); // 5 inch
  evaluate("sin(45 deg) ^ 2"); // 0.5
  derivative("x^2 + x", "x"); // 2 * x + 1
  ```

- [bignumber](https://www.npmjs.com/package/bignumber.js)

  - 处理 js 任意精度的计算问题。

- [jsdom](https://www.npmjs.com/package/jsdom)

  - 使用纯 JavaScript 实现了很多 web 标准。

- [UAParser.js](https://www.npmjs.com/package/ua-parser-js)

  - 基于 User-Agent 获取用户的浏览器名、设备名、OS 名、CPU 架构等，可在浏览器和服务端使用

- [qrcode](https://www.npmjs.com/package/qrcode)

  - node 二维码生成器

- [chokidar](https://www.npmjs.com/package/chokidar)

  - 跨平台高性能监听文件变化的包

- [pako](https://www.npmjs.com/package/pako)

  - js 高速压缩/解压包，可运行在浏览器端

- [download-git-repo](https://www.npmjs.com/package/download-git-repo)

  - 使用 nodejs 下载并提取一个 git 仓库（GitHub，GitLab，Bitbucket）。

- [millisecond](https://www.npmjs.com/package/millisecond)

  - 时间转换，将人类语言的时间转换成毫秒数，如 `ms('1 second')` 返回 `1000`

- [ms](https://www.npmjs.com/package/ms)

  - 时间转换，在人类语言的时间和毫秒之间相互转换。

- [iterare](https://www.npmjs.com/package/iterare)

  - ES6 Iterator library for applying multiple transformations to a collection in a single iteration.
  - 建立在[iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)之上，将对一个集合（可迭代对象）的多次操作转换为单次迭代，使用场景如：

```js
// 这段代码实际上迭代了四此，Array.form 一次，filter 一次，map 一次，然后还有转换回去一次，如果数据量太大实际上性能损耗非常严重
// RxJS 或者 Nodejs stream 虽然可以解决这个问题，但是它们都是异步的
new Set(
  Array.from(uris)
    .filter(uri => uri.startsWith("file://"))
    .map(uri => uri.substr("file:///".length))
);
```

```js
// 只需要迭代一次
import iterate from "iterare";

iterate(uris)
  .filter(uri => uri.startsWith("file://"))
  .map(uri => uri.substr("file:///".length))
  .toSet();
```

- [stream-wormhole](https://www.npmjs.com/package/stream-wormhole)

  - 把 stream 内容发送给虫洞... 即把 stream 内容消耗掉，在某些情况下需要这样做。

* [director](https://www.npmjs.com/package/director)

  - Director 是一个可用于客户端和服务端的路由工具（不过感觉很老了，虽然 star 数有 5.5k，但最后提交代码是在 2015 年）

* [defu](https://www.npmjs.com/package/defu)

  - Recursively assign default properties. Lightweight and Fast!
  - 递归设置默认值

* [schema-utils](https://www.npmjs.com/package/schema-utils)

  - webpack 用于校验 loader 和 plugin 的 options 参数

* [concurrently](https://www.npmjs.com/package/concurrently)

  - 同步运行多个程序

- [pify](https://www.npmjs.com/package/pify)

  - 将回调函数形式的函数转换为 promise 格式的函数，即 promisify

- [upath](https://www.npmjs.com/package/upath)

  - 处理路径分隔分在 windows 和 unix 上的差异

- [qrcode-generator](https://www.npmjs.com/package/qrcode-generator)

  - 生成二维码

- [qrcode](https://www.npmjs.com/package/qrcode)

  - 生成二维码/条码

- [jsqr](https://github.com/cozmo/jsQR)

  - 识别二维码

- [bcrypt](https://www.npmjs.com/package/bcrypt)

  - 密码加密库

- [hash-sum](https://www.npmjs.com/package/hash-sum)

  - hash 生成器，可以用于对象等。

- [table](https://www.npmjs.com/package/table)

  - 将数据格式化为字符串表格，非常适合在控制台输出表格

- [cpy](https://www.npmjs.com/package/cpy)

  - 在代码中执行力快速的文件拷贝

  - 相关：
    - [cp-file](https://www.npmjs.com/package/cp-file)：拷贝单个文件
    - [move-file](https://www.npmjs.com/package/move-file)：移动单个文件
    - [make-dir](https://www.npmjs.com/package/make-dir)：创建目录，如果需要同时也会创建父目录
      - 相关：https://www.npmjs.com/package/make-dir#related

- [cpy-cli](https://www.npmjs.com/package/cpy-cli)
  - cpy 的 cli 版本，例如可用于 `package.json#script#postinstall` 中。

- [validator](https://github.com/validatorjs/validator.js)
  - 能够方便完成字符串的各种验证逻辑
## 一些不那么高的但比较有用的模块

- [redirect-ssl](https://www.npmjs.com/package/redirect-ssl)

  - 强制跳转到 https 协议

- [browser-sync](https://www.npmjs.com/package/browser-sync)

  - 在构建网站的时候同步多个页面、设备的静态资源。类似于 webpack devServer 热替换模块

- [configstore](https://www.npmjs.com/package/configstore)
  - 存放和加载用户信息而不用关心具体存放在什么位置

- [patch-package](https://github.com/ds300/patch-package)
  - 在某些边缘情况下需要修改 node_modules 中的源码，但是重新 `npm i` 之后修改会丢失，该包用于记录修改到当前项目下，保持修改一直跟随当前项目。 

## 一些有趣的 lib

- [WD.js](https://www.npmjs.com/package/wd)

  - node.js Webdriver/Selenium 2 client

* [image-to-ascii](https://www.npmjs.com/package/image-to-ascii)

  - 把图片转换成命令行符号显示，支持彩色图片

* [scrape-it](https://www.npmjs.com/package/scrape-it)

  - 简单的爬虫，其实理解成一个 HTML 解析器更好，它可以根据 css 选择器筛选出页面中的数据并返回。但是对于一些单页应用就无力了。视情况而用。

## 一些有趣的玩具

- L2Dwidget

  - 给你的网站领养一只喵喵~

- [autocannon](https://www.npmjs.com/package/autocannon)
  - 接口压力测试



## 独立工具

- [Wheat](https://github.com/creationix/wheat)
  - 一个博客引擎，从 git 读取并呈现为网站

- [surge](https://github.com/sintaxi/surge)
  - 无需配置，一键部署网站或者内容到互联网，主页 https://surge.sh/
  - 免费托管

## 动画
- [dynamics.js](https://www.npmjs.com/package/dynamics.js)
  - 一个物理动画库