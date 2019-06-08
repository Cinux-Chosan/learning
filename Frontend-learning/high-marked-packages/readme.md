
## 以下来自项目 https://github.com/microsoft/TypeScript-Node-Starter.git package.json 的摘录

- [shelljs](https://www.npmjs.com/package/shelljs)
  - Unix shell commands for Node.js
- [winston](https://www.npmjs.com/package/winston)
  - A logger for just about everything.
- [async](https://www.npmjs.com/package/async)
  - Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript.
- [neo-async](https://www.npmjs.com/package/neo-async) （来自webpack）
  - Neo-Async 被认为是 Async 的直接替代品，几乎完全覆盖了它的功能并且运行速度更快。
- [bcrypt.js](https://www.npmjs.com/package/bcryptjs)
  - 不可逆加密工具，bcrypt 的 js 版本。参考 [使用Bcrypt对密码进行加密与解密验证](http://www.cnblogs.com/yspace/p/10105386.html)
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
  - Passport的唯一目的是验证请求，它通过一组称为策略的可扩展插件来完成。
- [passport-local](https://www.npmjs.com/package/passport-local)
  - passport 策略的一种，通过用户名和密码来验证用户信息，可用于做登陆验证功能等。
- [chai](https://www.npmjs.com/package/chai)
  - Chai is an assertion library, similar to Node's built-in assert. It makes testing much easier by giving you lots of assertions you can run against your code. 即一个可读性极强的断言框架，参考官网 https://www.chaijs.com/ 查看更多示例。

  ```js
    chai.should();

    foo.should.be.a('string');
    foo.should.equal('bar');
    foo.should.have.lengthOf(3);
    tea.should.have.property('flavors').with.lengthOf(3);
  ```
- [supertest]()
  - HTTP assertions made easy via superagent。可读性强的 http 测试框架，类似于 chai：
  ```js
    const request = require('supertest');
    const express = require('express');

    const app = express();

    app.get('/user', function(req, res) {
    res.status(200).json({ name: 'john' });
    });

    request(app)
    .get('/user')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function(err, res) {
        if (err) throw err;
    });
  ```
- [concurrently](https://www.npmjs.com/package/concurrently)
  - Run multiple commands concurrently。多个任务同时运行，并可追踪其输出和执行是否成功等。
- [ts-node](https://www.npmjs.com/package/ts-node)
  - TypeScript execution and REPL for node.js, with source map support. Works with typescript@>=2.0。即 ts 命令行执行终端。


## 来自 [nwb](https://github.com/insin/nwb.git)


- [chalk](https://www.npmjs.com/package/chalk)
  - Terminal string styling done right
  ```js
  // Combine styled and normal strings
  log(chalk.blue('Hello') + ' World' + chalk.red('!'));
  
  // Compose multiple styles using the chainable API
  log(chalk.blue.bgRed.bold('Hello world!'));
  ```
- [minimist](https://www.npmjs.com/package/minimist)
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
- [Commander.js](https://www.npmjs.com/package/commander)
  - node.js 命令行界面的完整解决方案，受 Ruby commander 启发。
- [yargs](https://www.npmjs.com/package/yargs)
  - 同 minimist 和  commander 一样，也是命令行解析工具
- [Inquirer.js](https://www.npmjs.com/package/inquirer)
  - A collection of common interactive command line user interfaces. 常用交互式命令行用户界面的集合。
- [ora](https://www.npmjs.com/package/ora)
  - Elegant terminal spinner
- [run-series](https://www.npmjs.com/package/run-series)
  - npm install run-series
- [copy-template-dir] (https://www.npmjs.com/package/copy-template-dir)
  - High throughput template dir writes. Supports variable injection using the mustache `{{ }}` syntax.
  - 高吞吐量模板目录写入。支持使用 mustache 的 `{{}}` 语法注入变量。可用于编写 cli 工具时给模板注入变量。


# 来自 [webpack](https://www.npmjs.com/package/webpack)

- [neo-async](https://www.npmjs.com/package/neo-async)
  - Neo-Async 被认为是 Async 的直接替代品，几乎完全覆盖了它的功能并且运行速度更快。