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
- 如果你在处理函数中抛出一个 promise，则outputPromise 会变成这个promise。

如果 `getInputPromise()` promise 变成 rejected 并且你没有提供 rejection 的处理函数，则 **error** 会传播给 outputPromise
```javascript
var outputPromise = getInputPromise()
.then(function (value) {
});
```

如果 `getInputPromise()` promise 变成 fulfilled 并且你没有提供 fulfillment 的处理函数，则 **value** 会传播给 outputPromise

```javascript
var outputPromise = getInputPromise()
.then(null, function (error) {
});
```

如果你只需要处理错误，则 Q promise 提供了一个 `fail` 方法代替 `then` 来处理错误

```javascript
var outputPromise = getInputPromise()
.fail(function (error) {
});
```

如果你仅仅适用现代引擎来写javascript或者适用 CoffeeScript，你可以使用 `catch` 代替 `fail`

Promises 同样有一个类似于 `finally` 的 `fin` 函数。final 处理函数不管 `getInputPromise()` 返回的是一个值或者是抛出一个异常都会被调用，并且没有参数。除非 final 处理函数失败，否则 `getInputPromise()` 返回的值 或者 异常会直接传递给 outputPromise。如果 final 处理函数返回一个 promise 则可能产生延迟

```javascript
var outputPromise = getInputPromise()
.fin(function () {
    // close files, database connections, stop servers, conclude tests
});
```
- 如果该final处理函数返回一个值，则值会被忽略
- 如果该final处理函数抛出一个错误，则错误会传递给outputPromise
- 如果该final处理函数返回一个promise，则outputPromise会被推迟。最终的值或者错误会像立即返回的值或错误一样，如果返回的是值则会被忽略，如果抛出错误则转发错误

如果你仅仅适用现代引擎来写javascript或者适用 CoffeeScript，你可以使用 `finally` 代替 `fin`

## 链式
有两种方法来链式链接promise，即可以在处理函数内或者外部来连接promise，以下两例等价：
```javascript
return getUsername()
.then(function (username) {
    return getUser(username)
    .then(function (user) {
        // if we get here without an error,
        // the value returned here
        // or the exception thrown here
        // resolves the promise returned
        // by the first line
    })
});
```

```javascript
return getUsername()
.then(function (username) {
    return getUser(username);
})
.then(function (user) {
    // if we get here without an error,
    // the value returned here
    // or the exception thrown here
    // resolves the promise returned
    // by the first line
});
```

唯一的区别是嵌套。如果是需要在某个函数内使用多个变量，则此时写成内部链式，将后续promise写在函数内部形成闭包会非常有用：
```javascript
function authenticate() {
    return getUsername()
    .then(function (username) {
        return getUser(username);
    })
    // chained because we will not need the user name in the next event
    .then(function (user) {
        return getPassword()
        // nested because we need both user and password next
        .then(function (password) {
            if (user.passwordHash !== hash(password)) {
                throw new Error("Can't authenticate");
            }
        });
    });
}
```

## 组合

你可以将一个 promise 数组内所有promise 转换成一个整体 promise，使用 `all` 来完成所有promise：
```javascript
return Q.all([
    eventualAdd(2, 2),
    eventualAdd(10, 20)
]);
```

如果需要对一个数组使用 promise，可以使用 `spread` 方法代替 `then`。`spread` 方法将值传递到 fulfillment 处理函数的参数上。rejection 处理函数将在失败的时候调用。也就是说，无论接收到的哪一个 promise 失败都会首先调用 rejection 错误处理函数。

```javascript
function eventualAdd(a, b) {
    return Q.spread([a, b], function (a, b) {
        return a + b;
    })
}
```

But `spread` calls `all` initially, so you can skip it in chains.
```javascript
return getUsername()
.then(function (username) {
    return [username, getUser(username)];
})
.spread(function (username, user) {
});
```

`all`方法为一个value的数组返回一个promise。当该promise变为 fulfilled，则该数组包含所有 原promise 的 fulfillment values，并且顺序一致。如果某一个promise变为 rejected，则返回的promise立即变为 rejected 而不会等待其它未返回的promise。如果需要等待所有的promise都返回，不管是否执行成功，则可以使用 `allSettled`方法。

```javascript
Q.allSettled(promises)
.then(function (results) {
    results.forEach(function (result) {
        if (result.state === "fulfilled") {
            var value = result.value;
        } else {
            var reason = result.reason;
        }
    });
});
```

`any` 方法接受一个promise数组，并返回第一个变为 fulfillment的promise，或者所有promise都变为rejected时。

```javascript
Q.any(promises)
.then(function (first) {
    // Any of the promises was fulfilled.
}, function (error) {
    // All of the promises were rejected.
});
```

## 序列 （Sequences）

如果有一系列的promise函数需要按序执行，可以写作：
```javascript
return foo(initialVal).then(bar).then(baz).then(qux);
```
然而，有时候你可能有一个动态生成的函数序列，则可以向下面这样：
```javascript
var funcs = [foo, bar, baz, qux];

var result = Q(initialVal);
funcs.forEach(function (f) {
    result = result.then(f);
});
return result;
```
可以使用`reduce`使它看起来更紧凑：
```javascript
return funcs.reduce(function (soFar, f) {
    return soFar.then(f);
}, Q(initialVal));
```
另外，你或许需要一个超级紧凑的版本：
```javascript
return funcs.reduce(Q.when, Q(initialVal));
```

## 错误处理 (Handling Errors)

一种不常见的错误情况是：在 fulfillment 处理函数里面抛出了一个异常，这个异常不会再被 rejection 处理函数所捕获。

```javascript
return foo()
.then(function (value) {
    throw new Error("Can't bar.");
}, function (error) {
    // We only get here if "foo" fails
});
```

为什么会这样？请考虑promise 和 `try`/`catch` 之间的平行关系。我们正在使用 `try` 来执行 `foo()`：rejection 处理函数代表 `foo()` 的 `catch` 方法， fulfillment 处理函数代表 `try`/`catch` 之后发生的代码（`try`/`catch` 不抛出异常才会执行 fulfillment处理函数）。所以如果在执行 fulfillment 的处理函数的时候，如果它抛出异常，则它需要自己的 `try`/`catch` 块来处理。

就promise而言，意味着需要将 rejection 处理函数链式写在后面：
```javascript
return foo()
.then(function (value) {
    throw new Error("Can't bar.");
})
.fail(function (error) {
    // We get here with either foo's error or bar's error
});
```

## 进度通知 (Progress Notification)

promise有能力报告它的处理进度，例如需要花长时间上传文件的时候。并非所有的promise都会实现进度通知，但是对于那些实现了进度报告的promise，可以使用`then`的三个参数（第三个回调函数）来处理进度：
```javascript
return uploadFile()
.then(function () {
    // Success uploading the file
}, function (err) {
    // There was an error, and we get the reason for error
}, function (progress) {
    // We get notified of the upload's progress as it is executed
});
```
像 `fail`， Q 还提供了一个名为 `progress`的回调方法简写：
```javascript
return uploadFile().progress(function (progress) {
    // We get notified of the upload's progress
});
```

## (The End)

在promise链的末尾，你必须返回最后一个promise或者结束该 promise链。

返回：
```javascript
return foo()
.then(function () {
    return "bar";
});
```

结束：
```javascript
foo()
.then(function () {
    return "bar";
})
.done();
```

在结束 promise链的时候，需要清楚： 如果在结束 promise 链之前错误没有进行处理，则错误会被报告并重新抛出

## (The Beginning)

在此之前，都是假设从别处获取 promise。现在，你需要自己从头开始创建 promise

### 使用 `Q.fcall`

以一个值创建promise，可以使用 `Q.fcall`，下例 `Q.fcall` 为 10 返回一个 promise
```javascript
return Q.fcall(function () {
    return 10;
});
```

也可以使用 `fcall` 来获取一个异常的 promise

```javascript
return Q.fcall(function () {
    throw new Error("Can't do it");
});
```

从名字可以看出，`fcall` 可以调用函数(call functions)，甚至是 promised functions。使用之前提到的 eventualAdd 方法来将两个数字相加：
```javascript
return Q.fcall(eventualAdd, 2, 2);
```

## 使用延迟 (Using Deferreds)

如果你不得不使用基于回调方法而非基于 promise 的异步函数，Q提供了几个方法（如 `Q.nfcall` ）。但是大多数时间，可能使用延迟(Deferreds)。

```javascript
var deferred = Q.defer();
FS.readFile("foo.txt", "utf-8", function (error, text) {
    if (error) {
        deferred.reject(new Error(error));
    } else {
        deferred.resolve(text);
    }
});
return deferred.promise;
```

注意，deferred 可以使用值或者promise进行解析。`reject`方法能够方便处理 rejected promise。
```javascript
// this:
deferred.reject(new Error("Can't do it"));

// is shorthand for:
var rejection = Q.fcall(function () {
    throw new Error("Can't do it");
});
deferred.resolve(rejection);
```

以下是`Q.delay`的一个简单实现

```javascript
function delay(ms) {
    var deferred = Q.defer();
    setTimeout(deferred.resolve, ms);
    return deferred.promise;
}
```

以下是`Q.timeout`的一个简单实现

```javascript
function timeout(promise, ms) {
    var deferred = Q.defer();
    Q.when(promise, deferred.resolve);
    delay(ms).then(function () {
        deferred.reject(new Error("Timed out"));
    });
    return deferred.promise;
}
```

最后，你可以通过 `deferred.notify` 给 promise 发送进度提醒

For illustration, this is a wrapper for XML HTTP requests in the browser. Note that a more [thorough](https://github.com/montagejs/mr/blob/71e8df99bb4f0584985accd6f2801ef3015b9763/browser.js#L29-L73) implementation would be in order in practice.

```javascript
function requestOkText(url) {
    var request = new XMLHttpRequest();
    var deferred = Q.defer();

    request.open("GET", url, true);
    request.onload = onload;
    request.onerror = onerror;
    request.onprogress = onprogress;
    request.send();

    function onload() {
        if (request.status === 200) {
            deferred.resolve(request.responseText);
        } else {
            deferred.reject(new Error("Status code was " + request.status));
        }
    }

    function onerror() {
        deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
    }

    function onprogress(event) {
        deferred.notify(event.loaded / event.total);
    }

    return deferred.promise;
}
```
下面示例如何使用 `requestOkText`函数：
```javascript
requestOkText("http://localhost:3000")
.then(function (responseText) {
    // If the HTTP response returns 200 OK, log the response text.
    console.log(responseText);
}, function (error) {
    // If there's an error or a non-200 status code, log the error.
    console.error(error);
}, function (progress) {
    // Log the progress as it comes in.
    console.log("Request progress: " + Math.round(progress * 100) + "%");
});
```

### 使用 `Q.Promise`

这是一个可以替代创建 promise 的 API，与 deferred 有相同概念，但是没有引入另一个概念实体。(This is an alternative promise-creation API that has the same power as the deferred concept, but without introducing another conceptual entity.)

使用 `Q.Promise` 重写 `requestOkText`：

```javascript
function requestOkText(url) {
    return Q.Promise(function(resolve, reject, notify) {
        var request = new XMLHttpRequest();

        request.open("GET", url, true);
        request.onload = onload;
        request.onerror = onerror;
        request.onprogress = onprogress;
        request.send();

        function onload() {
            if (request.status === 200) {
                resolve(request.responseText);
            } else {
                reject(new Error("Status code was " + request.status));
            }
        }

        function onerror() {
            reject(new Error("Can't XHR " + JSON.stringify(url)));
        }

        function onprogress(event) {
            notify(event.loaded / event.total);
        }
    });
}
```
如果 `requestOkText`抛出异常，则返回的promise会使用该异常作为参数，变为 rejected 状态。
