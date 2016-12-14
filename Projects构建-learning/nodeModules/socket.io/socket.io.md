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

将允许的源设置为动态返回值的函数。函数接收两个参数 `origin:String` 和 `callback(error, success)`，`success`为表明是否允许该源的Boolean

#### 潜在缺点
- 在某些情况下，当不能确定`origin`的时候它可能是 `*`
- 该函数会在每次请求的时候调用。所以建议它能够高效
- 如果`socket.io`与 `Express`一起运行，则 CORS 头部将只会影响 `socket.io`的请求。Express使用 [cors](https://github.com/expressjs/cors)

### Server#sockets:Namespace

默认为namespace `/`

### Server#attach(srv:http#Server,opts:Object):Server

使用提供的 `opts` 将`Server`附加到`srv`的 engine.io 实例上

### Server#attach(port:Number,opts:Object):Server

将`Server`附加到根据`opts`绑定了`port`的engin.io实例上

### Server#listen

同`Server#attach`

### Server#bind(srv:engine#Server):Server

Advanced use only. 将 server 绑定到指定的 engine.io `Server`(或者兼容的API) 实例上

### Server#onconnection(socket:engine#Socket):Server

Advanced use only. 根据传入的 engine.io `socket`创建一个新的 `socket.io` 客户端

### Server#of(nsp:String):Namespace

根据提供的路径名称标识符`nsp`来初始化和检索给定的 `Namespace`

如果namespace 已经初始化，则立即返回它

### Server#emit

给所有连接的客户端发送一个事件。以下两个相同：
```javascript
var io = require('socket.io')();
io.sockets.emit('an event sent to all connected clients');

io.emit('an event sent to all connected clients');
```

其它可用函数，参考后面的 `Namespace`

### Server#close([fn:Function])

关闭 socket.io server

`fn` 被传递到node.js核心模块 `net` 的 `server.close([callback])`方法 并且 在发生错误或所有连接关闭的时候调用。回调函数 `callback`带参数 `err`

```javascript
var Server = require('socket.io');
var PORT   = 3030;
var server = require('http').Server();

var io = Server(PORT);

io.close(); // Close current server

server.listen(PORT); // PORT is free to use

io = Server(server);
```

### Server#use

参考后面的`Namespace#use`

## Namespace

Namespace 代表一个根据 pathname区分的 sockets 连接池

默认情况下客户端总是连接到 `/.`

### Events

- `connection`/`connect`： 当链接到来的时候被触发

  参数：
  - `Socket` 传入的 socket

### Namespace#name:String

该属性为namespace的标识符


### Namespace#connected:Object

连接到当前 namespace 下面的`Socket`对象。它由 `id` 进行索引

### Namespace#clients(fn:Function)

得到一个连接到当前namespace 的列表（如果可以将会跨所有节点）

例：

得到当前namespace下的所有客户端
```javascript
var io = require('socket.io')();
io.of('/chat').clients(function(error, clients){
  if (error) throw error;
  console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
});
```

An example to get all clients in namespace's room:
```javascript
var io = require('socket.io')();
io.of('/chat').in('general').clients(function(error, clients){
  if (error) throw error;
  console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
});
```

As with broadcasting, the default is all clients from the default namespace ('/'):
```javascript
var io = require('socket.io')();
io.clients(function(error, clients){
  if (error) throw error;
  console.log(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
});
```

### Namespace#use(fn:Function):Namespace

注册一个中间件函数，该函数会在每个 `Socket` 上面执行，并且接收socket作为参数和一个稍后会延迟执行的用于传递到下一个中间件去的回调函数next。(Registers a middleware, which is a function that gets executed for every incoming Socket, and receives as parameters the socket and a function to optionally defer execution to the next registered middleware.)

```javascript
var io = require('socket.io')();
io.use(function(socket, next){
  if (socket.request.headers.cookie) return next();
  next(new Error('Authentication error'));
});
```

传递给中间件回调函数的错误会被当做特殊的 `error` 包发送到客户端(clients)

## Socket

`Socket` 是一个作为与客户端浏览器交互的基本的类，它属于一个确定的`Namespace`（默认为`/`），并且使用底层 `Client`进行通信

需要注意的是，`Socekt` 不直接与底层实际的 TCP/IP 套接字相关，它只是类的名字

### Socket#use(fn:Function):Socket

注册一个中间件函数，它会在每个到来的 `Packet` 上执行，并且接收packet 作为参数和一个稍后会延迟执行的用于传递到下一个中间件去的回调函数next。(Registers a middleware, which is a function that gets executed for every incoming Packet and receives as parameter the packet and a function to optionally defer execution to the next registered middleware.)

```javascript
var io = require('socket.io')();
io.on('connection', function(socket){
  socket.use(function(packet, next){
    if (packet.doge === true) return next();
    next(new Error('Not a doge error'));
});
```

传递给中间件回调函数的错误会被当做特殊的 `error` 包发送到客户端(clients)

### Socket#rooms:Object

一个Object或者String类型，用于标志 client 的 room。以 room 名称为索引

##
