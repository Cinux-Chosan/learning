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

传递给 socket.io 的选项总会被传递给 `engine.io`创建的`Server`，参考 [engine.io options](https://github.com/socketio/engine.io#methods-1)

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

### Socket#client:client

底层 `Client`对象的引用

### Socket#conn:Socket

底层`Client` 传输连接对象的引用(engine.od `Socket` object)。这允许你能够访问IO传输层，且任然是实习 TCP/IP 套接字的抽象

### Socket#request:Request

一个 getter 代理，用于返回底层 engine.io的`Client`的`request`的引用。对访问请求头中的信息非常有用(如 `Cookie` 或者 `User-Agent`)

### Socket#id:String

来自底层 `Client` 的该session的唯一标识符

### Socket#emit(name:String[, ...]):Socket

向客户端发送一个以 `name` 标志的事件。可以包含其他任何参数

支持所有数据接口，包括`Buffer`。javascript function 不能被序列化和反序列化

```javascript
var io = require('socket.io')();
io.on('connection', function(client){
  client.emit('an event', { some: 'data' });
});
```

### Socket#join(name:String[,fn:Function]):Socket

将客户端(client)添加到`room`并且调用回调函数，回调函数接受参数 `err`

客户端(client)自动成为以session id标识的 room 的成员

加入 room 的机制由已配置的 `Adapter` 处理(参考上面的 `Server#adapter`)，默认为 [socket.io-atapter](https://github.com/socketio/socket.io-adapter)

### Socket#leave(name:String[,fn:Function]):Socket

移除 `room` 上的某个 client，并且以`err`作为参数调用 fn

**Rooms are left automatically upon disconnection.**

离开 room 的机制由已配置的 `Adapter` 处理(参考上面的 `Server#adapter`)，默认为 [socket.io-atapter](https://github.com/socketio/socket.io-adapter)

### Socket#to(room:String):Socket

为后续事件触发设置一个修饰器(modifier)，后续事件只会被广播到加入了给定 `room`的客户端(clients)

如果需要触发到多个 room，则可以多次调用 `to`

```javascript
var io = require('socket.io')();
io.on('connection', function(client){
  client.to('others').emit('an event', { some: 'data' });
});
```

### Socket#in(room:String):Socket

同 `Socket#to`

### Socket#compress(v:Boolean):Socket

为后续事件的触发设置一个修饰器(modifier)，如果该值为`true`，则这些事件只会被compress。当你不调用该方法时，默认为 `true`
```javascript
var io = require('socket.io')();
io.on('connection', function(client){
  client.compress(false).emit('an event', { some: 'data' });
});
```

### Socket#disconnect(close:Boolean):Socket

断开该客户端的连接。如果close的值为 `true`，则关闭底层连接，否则仅仅只断开该namespace

### Events
- `disconnect`
  - 当断开连接的时候触发
  - 参数
    - `String`：断开连接的原因(客户端或服务端发起断开)
- `error`
  - 当错误发生的时候触发
  - 参数
    - `Object`：错误数据
- `disconnecting`
  - 当客户端正准备断开连接的时候触发(但是还没有离开它所属于的 `room`)
  - 参数
    - `String`: 断开连接的原因（客户端或服务端发起断开）

以上事件(连同`connet`、`newListener`和`removeListener`)被称为保留事件，也就是说不能用它们作为事件名

## Client

`Client` 类代表一个传输(engine.io)连接(incoming transport connection)。`Client`可以与许多属于不同`Namespace`的多路复用`Socket`进行关联。

### Client#conn

底层`engine.io`的`Socket`连接的引用

### Client#request

getter代理，用于返回发起 engine.io 连接的 `request`引用。当需要获取请求头(如`Cookie`或 `User-Agent`)的时候会很有用

## Debug / logging

Socket.IO is powered by debug. In order to see all the debug output, run your app with the environment variable `DEBUG` including the desired scope.

To see the output from all of Socket.IO's debugging scopes you can use:

```
DEBUG=socket.io* node myapp
```

## Testing

```
npm test
```

使用 `gulp`的`test`任务。默认test会使用在 `lib`目录里面的源码

将环境变量 `TEST_VERSION` 设置为 `compat`来测试转换成 es5兼容 版本的代码(Set the environmental variable TEST_VERSION to compat to test the transpiled es5-compat version of the code.)

`gulp`的 `test`任务将会在运行代码之前将代码转化成 es5 并且导出到`dist`目录
