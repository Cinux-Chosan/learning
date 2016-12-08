# [q](https://www.npmjs.com/package/q)

promise 库(CommonJS/Promises/A,B,D)

  <a href="http://promises-aplus.github.com/promises-spec" class="text-center" style="display:inline-block;">
    <img src="http://kriskowal.github.io/q/q.png" align="right" alt="Q logo" />
  </a>


当前版本号为1，来自Git的`v1`分支。当前文档适用于 v0.9 和 v1。v2 向后不兼容，当前正在试验阶段。

如果函数不能够在不阻塞的情况下返回一个值或者抛出异常，那么可以用promise取代返回值。promise为一个对象，用它来代表函数的返回值或者抛出的异常。promise也可以用来当做远程数据对象([remote object](https://github.com/kriskowal/q-connection))的代理来解决延时问题。

promise可以减缓 “金字塔式代码”
```javascript
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```
如果是使用 promise 库，可以如下：
```javascript
Q.fcall(promisedStep1)
.then(promisedStep2)
.then(promisedStep3)
.then(promisedStep4)
.then(function (value4) {
    // Do something with value4
})
.catch(function (error) {
    // Handle any error from all above steps
})
.done();
```
使用这种方法，你同样可以获得向后传播的隐式错误，就像 `try`、`catch`、`finally`。在 `promisedStep1` 中的错误会冒泡到 `catch` 函数中被接收和处理。 (Here promisedStepN is a version of stepN that returns a promise.)

回调方法称为"控制反转"。接收一个回调函数来代替返回值的函数，貌似在说 "别调用我，我会调用你的"。 Promises un-invert the inversion, cleanly separating the input arguments from control flow arguments. This simplifies the use and creation of API’s, particularly variadic, rest and spread arguments.

## Getting Started

该模块（Q）可以这样加载：
- 使用`<script>`标签，它会创建一个 `Q` 作为全局变量。最小化后gzip压缩约2.5kb
- 作为 node。js/CommonJS 模块。npm 中的 q
- AMD 模块
- `microjs/q`的组件([component](https://github.com/component/component))
- [bower](http://bower.io/)中的 `q#1.0.1`
- [NuGet](http://nuget.org/) 的 [`Q`](https://nuget.org/packages/q)

Q 可以与 JQuery，Dojo，When.js，WinJS 以及其他更多的库交换 promise

## 资源 (Resources)
Q 的 [wiki](https://github.com/kriskowal/q/wiki) 包含了许多有用的资源，包括：
- [Q API 参考](https://github.com/kriskowal/q/wiki/API-Reference)
- 不断增长的示例，向您展示如何使用Q来把事情做得更好。从XHR到数据库接入到接入Flickr API
- There are many libraries that produce and consume Q promises for everything from file system/database access or RPC to templating. For a list of some of the more popular ones, see [Libraries](https://github.com/kriskowal/q/wiki/Libraries).
- If you want materials that introduce the promise concept generally, and the
  below tutorial isn't doing it for you, check out our collection of
  [presentations, blog posts, and podcasts](https://github.com/kriskowal/q/wiki/General-Promise-Resources).
- A guide for those [coming from jQuery's `$.Deferred`](https://github.com/kriskowal/q/wiki/Coming-from-jQuery).

We'd also love to have you join the Q-Continuum [mailing list](https://groups.google.com/forum/#!forum/q-continuum).

## 教程 (Tutorial)
promise 有个 `then` 方法，你可以使用它来获取最终的值(fulfillment)或者抛出异常(rejection)

```javascript
promiseMeSomething()
.then(function (value) {
}, function (reason) {
});
```

如果 `promiseMeSomething` 变为 fulfilled 状态（成功状态）并返回一个值，则会将返回值作为参数调用第一个函数，如果变为 rejected 状态（失败）并抛出一个异常，则会将异常作为参数调用第二个函数。

注意，解析一个promise都是异步的，也就是说在事件循环的下一个循环中将始终调用 fulfillment 或者 rejection 的处理函数（如： Node中的 `process.nextTick`）。这给了你追踪代码的保障，也就是说，`then`方法会在 fulfillment 和 rejection 的处理函数执行之前返回。

## Propagation

`then` 方法返回一个 promise

```javascript
var outputPromise = getInputPromise()
.then(function (input) {
}, function (reason) {
});
```

outputPromise 变量变成了一个新的处理函数返回值的 promise，一个函数只能返回一个值或者抛出一个异常，并且也只有一个处理函数会被调用来解析 outputPromise
- 如果你在处理函数中返回一个值，则 outputPromise 会变为 fulfilled
- 如果你在处理函数中抛出一个异常，则 outputPromise 会变为 rejected
