# connect

高性能中间件框架

Connect 是一个用于使用中间件的 node HTTP 服务端的可扩展的框架。

``` js
var connect = require('connect');
var http = require('http');

var app = connect();

// gzip/deflate outgoing responses
var compression = require('compression');
app.use(compression());

// store session state in browser cookie
var cookieSession = require('cookie-session');
app.use(cookieSession({
    keys: ['secret1', 'secret2']
}));

// parse urlencoded request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

// respond to all requests
app.use(function(req, res){
  res.end('Hello from Connect!\n');
});

//create node.js http server and listen on port
http.createServer(app).listen(3000);
```

## 开始

Connect 是一个将多个中间件"粘黏"在一起来处理请求的框架。

## 安装

```
npm i connect
```

## 创建一个 app

核心组件就是一个 Connect app，它会存储所有添加进来的中间件，它本身就是一个函数。

``` js
var app = connect();
```

## 使用中间件

Connect的核心是`using`中间件。中间件被添加到一个类似于栈的结构，接收到的请求会一次一个一个的调用中间件直到某个中间件没有调用 `next()` 方法。

``` js
app.use(function middleware1(req, res, next) {
  // middleware 1
  next();
});
app.use(function middleware2(req, res, next) {
  // middleware 2
  next();
});
```

## 安装中间件（挂载）

使用 `.use()`方法还接受一个可选的路径字符串，该字符串与请求的URL开头相匹配，这允许自定义基本路由：

``` js
app.use('/foo', function fooMiddleware(req, res, next) {
  // req.url starts with "/foo"
  next();
});
app.use('/bar', function barMiddleware(req, res, next) {
  // req.url starts with "/bar"
  next();
});
```

## 错误中间件

错误处理中间件接受 **4** 个参数。当一个中间件给 `next`传递一个错误的时候，该app 会继续搜索该中间件之后的错误处理中间件并调用它。它会忽略在此之前的错误处理中间件和在此之后的非错误处理中间件。

``` js
// regular middleware
app.use(function (req, res, next) {
  // i had an error
  next(new Error('boom!'));
});

// error middleware for errors that occurred in middleware
// declared before this
app.use(function onerror(err, req, res, next) {
  // an error occurred!
});
```

## 使用 app 创建 server

最后一步就是在server中使用connect app。使用`.listen()` 方法非常方便的启动一个 HTTP服务器。

``` js
var server = app.listen(port);
```

app 本身实际上只是一个接受3个参数的函数，所以也可以被传递给 `.createServer()`来处理

``` js
var server = http.createServer(app);
```

## 一些中间件
