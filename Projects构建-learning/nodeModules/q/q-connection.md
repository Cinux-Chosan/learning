# [Q-connection](https://github.com/kriskowal/q-connection) : Asynchronous Remote Objects

该模块使得两个内存隔离的JavaScript上下文环境异步通信成为可能，其中包括使用管道交互。promise作为远程数据对象的代理。

Q-connection 在Node和其他CommonJS 模块加载器（如 [Browserify](https://github.com/substack/node-browserify)、[Mr](https://github.com/kriskowal/mr)、[Montage](https://github.com/montagejs/montage)）中工作。

看起来如下：
```javascript
var Q = require("q");
var Connection = require("q-connection");
var remote = Connection(port, local);
```

`remote`对象是`local`对象在连接的另一端的promise，同样，连接的另一端将会得到一个`local`对象的promise。你并不需要提供一个 local 对象，这取决于连接的哪一端提供服务。

如果 `remote` 或者 `local` 对象不可序列化（如函数or有函数的对象），则另一端将接收到一个promise，但是你将不得不向该 promise  "send messages" 而不是直接与该远程对象交互。当你在远程对象上面调用方法时，你得到一个结果的promise并且你可以立即在结果上调用管道方法。

`port` 是任意W3C 消息端口，web worker或者web socket。在 W3C中，这些并没有统一的API，但是 Q-Connection 将会在内部将它们归一化：
```javascript
// To communicate with objects in a worker
var worker = new Worker("worker.js");
var child = Connection(worker, local);
```
```javascript
// Inside a worker, to communicate with the parent
var parent = Connection(this);
```
```javascript
// To communicate with a remote object on the other side of
// a web socket
var socket = new WebSocket("ws://example.com");
var remote = Connection(socket, local);
```
```javascript
// To communicate with a single frame on the same origin
// (multiple frames will require some handshaking event sources)
var iframe = document.frames[0];
var child = Connection(iframe.contentWindow, local, {
    origin: window.location.origin
})
```
```javascript
// To communicate with a parent frame on the same origin
var child = Connection(window, local, {
    origin: window.location.origin
})
```
```javascript
// With a message port
var port = new MessagePort();
var near = Connection(port[0]);
var far = Connection(port[1]);
```
