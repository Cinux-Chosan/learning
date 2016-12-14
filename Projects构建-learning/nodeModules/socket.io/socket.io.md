# [socket.io](https://www.npmjs.com/package/socket.io)

## 使用

下例将 socket.io 附加到 Node.js 的 HTTP server上，并监听 3000 号端口。

```javascript
var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('event', function(data){});
  client.on('disconnect', function(){});
});
server.listen(3000);
```

## 单独使用

```javascript
var io = require('socket.io')();
io.on('connection', function(client){});
io.listen(3000);
```
## 结合 Express

从3.0开始，express应用程序已经变成了传递给 `http` 或者 `http Server`实例的请求处理函数。你需要把 `Server` 传递给 `socket.io`，`Server` 不是 express 应用程序函数。

```javascript
var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(3000);
```

## 结合 Koa

如 Express.js，Koa 通过在应用程序上调用`callback`作为请求的处理函数。

```javascript
var app = require('koa')();
var server = require('http').createServer(app.callback());
var io = require('socket.io')(server);
io.on('connection', function(){ /* … */ });
server.listen(3000);
```

## API

### Server

通过 `require('socket.io')`获取

### Server()

创建一个新的 `Server`，`new`为可选写法。

```javascript
var io = require('socket.io')();
// or
var Server = require('socket.io');
var io = new Server();
```

### Server(opts: Object)

可选。该构造函数的第一个或者第二个参数为可选object类型，支持以下选项：
- `serveClient` 为 Server#serveClient() 设值
- `path` 为 Server#path() 设值

传递个 socket.io 的选项总会被传递给 `engine.io`创建的`Server`，参考 [engine.io options](https://github.com/socketio/engine.io#methods-1)

### Server(srv:http#Server, opts:Object)

创建一个新的 `Server` 并且将它附加到 `srv`，`opts`作为可选参数


### Server(port:Number, opts:Object)

将 socket.io 绑定到一个新的 `http.Server`上，并在端口 `port` 上进行监听

### Server#serveClient(v:Boolean):Server

如果 `v` 是 `true`，则附加的 server(参考 `Server#attach`)将会服务客户端文件(serve the client files)。默认为 `true`

该方法在 `attach`调用之后不会有副作用

```javascript
// pass a server and the `serveClient` option
var io = require('socket.io')(http, { serveClient: false });

// or pass no server and then you can call the method
var io = require('socket.io')();
io.serveClient(false);
io.attach(http);
```

如果没有传递参数，则该方法返回当前值

### Server#path(v:String):String

设置 `engine.io` 和提供静态文件的路径 `v`，默认为`/socket.io`

如果没有传递参数，则该方法返回当前值

### Server#adapter(v:Adapter):Server

设置adapter `v`，默认为基于内存的socket.io 附带的 Adapter的实例。参考[socket.io-adapter](https://github.com/socketio/socket.io-adapter)

如果没有参数传入，则返回当前值

### Server#origins(v:String):Server

设置允许的源 `v`，默认为允许任何来源

如果没有传递参数，则返回当前值

### Server#origins(v:Function):Server
