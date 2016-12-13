# node code fragments

### Event
```javascript
//event.js  
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();  
event.on('some_event', function() {
  console.log('some_event occured.');
});  
setTimeout(function() {
  event.emit('some_event');
}, 1000);
```


### Modules

- 模块与对象不同，模块只会加载一次。

```javascript
//loadmodule.js  
var hello1 = require('./module');
hello1.setName('BYVoid');  
var hello2 = require('./module');
hello2.setName('BYVoid 2');  
hello1.sayHello();   //  Hello BYVoid 2
```

- 模块导出 exports 对象， require 的也是这个exports 对象。
- 事实上，exports 本身仅仅是一个普通的空对象，即 `{}`，它专门用来声明接口，本 质上是通过它为模块闭包的内部建立了一个有限的访问接口。因为它没有任何特殊的地方， 所以可以用其他东西来代替，譬如我们上面例子中的 Hello 对象。

```javascript
//hello.js  
function Hello() {   
  var name;     
  this.setName = function(thyName) {     
    name = thyName;   
  };      
  this.sayHello = function() {     
    console.log('Hello ' + name);   
  };
};  
module.exports = Hello
```
```javascript
//gethello.js  
var Hello = require('./hello');   // 直接调用
hello = new Hello();
hello.setName('BYVoid');
hello.sayHello();
```

- 不可以通过对 exports 直接赋值代替对 module.exports 赋值。 **exports 实际上只是一个和 module.exports 指向同一个对象的变量， 它本身会在模块执行结束后释放，但 module 不会** ，因此只能通过指定 module.exports 来改变访问接口。

### process

- process.stdin是标准输入流，初始时它是被暂停的，要想从标准输入读取数据， 你必须恢复流，并手动编写流的事件响应函数。

```javascript
process.stdin.resume();  
process.stdin.on('data', function(data) {   
  process.stdout.write('read from console: ' + data.toString());
});
```

- process.nextTick(callback)的功能是为事件循环设置一项任务，Node.js 会在 下次事件循环调响应时调用 callback。

- process.argv是命令行参数数组，第一个元素是 node，第二个元素是脚本文件名， 从第三个元素开始每个元素是一个运行参数。

初学者很可能不理解这个函数的作用，有什么任务不能在当下执行完，需要交给下次事 件循环响应来做呢？我们讨论过，Node.js 适合 I/O 密集型的应用，而不是计算密集型的应用， 因为一个 Node.js 进程只有一个线程，因此在任何时刻都只有一个事件在执行。如果这个事 件占用大量的 CPU 时间，执行事件循环中的下一个事件就需要等待很久，因此 Node.js 的一 个编程原则就是尽量缩短每个事件的执行时间。process.nextTick() 提供了一个这样的 工具，可以把复杂的工作拆散，变成一个个较小的事件。

```javascript
function doSomething(args, callback) {   
  somethingComplicated(args);   
  callback();
}  
doSomething(function onEnd() {   
  compute();
});
```

我们假设 compute() 和 somethingComplicated() 是两个较为耗时的函数，以上 的程序在调用 doSomething() 时会先执行 somethingComplicated()，然后立即调用 回调函数，在 onEnd() 中又会执行 compute()。下面用 process.nextTick() 改写上 面的程序：

```javascript
function doSomething(args, callback) {   somethingComplicated(args);   process.nextTick(callback); }  
doSomething(function onEnd() {   compute(); });
```

改写后的程序会把上面耗时的操作拆分为两个事件，减少每个事件的执行时间，提高事 件响应速度。

**注意：** 不要使用 setTimeout(fn,0)代替 process.nextTick(callback)， 前者比后者效率要低得多。

### 常用工具 util

util 是一个 Node.js 核心模块，提供常用函数的集合，用于弥补核心 JavaScript 的功能 过于精简的不足。

#### util.inherits

util.inherits(constructor, superConstructor)是一个实现对象间原型继承 的函数。

```javascript
var util = require('util');  
function Base() {   
  this.name = 'base';   
  this.base = 1991;      
  this.sayHello = function() {     
    console.log('Hello ' + this.name);   
  };
}  
Base.prototype.showName = function() {   
  console.log(this.name);
};  
function Sub() {   
  this.name = 'sub';
}  
util.inherits(Sub, Base);  
var objBase = new Base();
objBase.showName();
objBase.sayHello();
console.log(objBase);  
var objSub = new Sub();
objSub.showName();
//objSub.sayHello();
console.log(objSub);
```
结果为
```
base
Hello base
{ name: 'base', base: 1991, sayHello: [Function] }
sub
{ name: 'sub' }
```
**注意** ，Sub 仅仅继承了 Base 在原型中定义的函数，而构造函数内部创造的 base 属 性和 sayHello 函数都没有被 Sub 继承。同时，在原型中定义的属性不会被 console.log 作 为对象的属性输出。

### 事件驱动 events

events 模块只提供了一个对象： events.EventEmitter。EventEmitter 的核心就 是事件发射与事件监听器功能的封装。

```javascript
var events = require('events');  
var emitter = new events.EventEmitter();  
emitter.on('someEvent', function(arg1, arg2) {
  console.log('listener1', arg1, arg2);
});   
emitter.on('someEvent', function(arg1, arg2) {  
  console.log('listener2', arg1, arg2);
});  
emitter.emit('someEvent', 'byvoid', 1991);
```
输出:
```
listener1 byvoid 1991
listener2 byvoid 1991
```

处理 post 数据：
对于表单
```html
<form method="post" action="http://localhost:3000/">
<input type="text" name="title" />
<textarea name="text"></textarea>
<input type="submit" />
</form>
```
原始 Node代码：

```javascript
var http = require('http');
var querystring = require('querystring');
var server = http.createServer(function(req, res) {
  var post = '';

  req.on('data', function(chunk) {
  post += chunk;
  });
  req.on('end', function() {
  post = querystring.parse(post);
  res.write(post.title);
  res.write(post.text);
  res.end();
  });
}).listen(3000);
```
express 代码：
```javascript
var express = require('express');
var app = express.createServer();
app.use(express.bodyParser());
app.all('/', function(req, res) {
  res.send(req.body.title + req.body.text);
});
app.listen(3000);
```

## 异步陷阱
- 1.

陷阱代码：
```javascript
//forloop.js
var fs = require('fs');
var files = ['a.txt', 'b.txt', 'c.txt'];
for (var i = 0; i < files.length; i++) {
 fs.readFile(files[i], 'utf-8', function(err, contents) {
 console.log(files[i] + ': ' + contents);
 });
}
```
陷阱分析：由于是异步，所以在调用回调函数的时候，i 已经变为3，files[3] 为 undifined

解决方法：

  - 1、建立闭包

```javascript
//forloopclosure.js
var fs = require('fs');
var files = ['a.txt', 'b.txt', 'c.txt'];
for (var i = 0; i < files.length; i++) {
 (function(i) {
 fs.readFile(files[i], 'utf-8', function(err, contents) {
 console.log(files[i] + ': ' + contents);
 });
 })(i);
}
```

  - 2、使用数组 forEach 方法：
```javascript
//callbackforeach.js
var fs = require('fs');
var files = ['a.txt', 'b.txt', 'c.txt'];
files.forEach(function(filename) {
 fs.readFile(filename, 'utf-8', function(err, contents) {
 console.log(filename + ': ' + contents);
 });
});
```


- 2. **函数作用域的嵌套关系是定义时决定的，而不是调用时决定的** ，也就
是说，JavaScript 的作用域是静态作用域，又叫词法作用域，这是因为作用域的嵌套关系可
以在语法分析时确定，而不必等到运行时确定。下面的例子说明了这一切：

```javascript
var scope = 'top';
var f1 = function() {
  console.log(scope);
};
f1(); // 输出 top
var f2 = function() {
  var scope = 'f2';
  f1();
};
f2(); // 输出 top
