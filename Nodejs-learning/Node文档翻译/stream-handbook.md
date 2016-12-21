# [stream-handbook](https://github.com/substack/stream-handbook)

## 为什么使用 stream

在node中I/O多为异步，所以在与磁盘或者网络交互的时候，需要传递回调函数。也许你打算这样发送文件内容：

```javascript
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    });
});
server.listen(8000);
```

以上代码没有问题，但是效率和性能等可能并不是很好，每次请求它都会将整个`data.text`文件的内容缓存到内存中。如果`data.text`非常大，这将会非常占用内存。

这样的用户体验非常糟糕，因为用户需要等到整个文件被读取到内存之后才可能接受任何内容。

幸运的是`(req, res)`都是stream 类的实例，也就是说你可以使用 `fs.createReadStream()`代替`fs.readFile()`，上面的代码变成这样：
```javascript
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
    var stream = fs.createReadStream(__dirname + '/data.txt');
    stream.pipe(res);
});
server.listen(8000);
```

这样的写法是，`.pipe()`会自动监听和处理来自`fs.createReadStream()`的`data` 和`event`事件。这段代码的好处不仅是简洁明了，而且`data.text`的内容每次只会一小个一小个的发送数据片段，从磁盘读取多少，就发送多少。

使用`.pipe()`也有另一个好处，像自动处理背压式数据一样，当与客户端连接变得非常慢速或者高延迟的情况下，node不会将数据片段缓存到内存中，读取多少，发送多少。

想要减少流量？那就压缩吧，咱有适用于流的压缩模块！
```javascript
var http = require('http');
var fs = require('fs');
var oppressor = require('oppressor');

var server = http.createServer(function (req, res) {
    var stream = fs.createReadStream(__dirname + '/data.txt');
    stream.pipe(oppressor(req)).pipe(res);
});
server.listen(8000);
```
这样一来，我们的文件被压缩并发送给支持gzip或者deflate格式的浏览器！把所有内容编码的东西交给[oppressor](https://github.com/substack/oppressor)处理。

一旦你学会了掌握stream api，你就可以将这些处理流的模块像堆积木一样很好的融合在一起使用，而不需要记住那些不是使用流的方式进行数据推送的自定义api

Stream让node的编码变得简单、优雅、易兼容。


## 基础

有 5 种流：readable（可读流：数据来源）、writable（可写流：数据去向）、transform、duplex 和 classic（典型）

### pipe

所有的流都使用 `.pipe()` 将输入和输出关联

`.pipe()`是一个将 readable stream 的内容传输到 writable stream 中去的函数，并且该函数返回该 writable stream 以便链式调用:
```javascript
a.pipe(b).pipe(c).pipe(d)
```
还可以这样玩：
```javascript
a.pipe(b);
b.pipe(c);
c.pipe(d);
```
其实它们跟在命令行中使用下面的格式一样，只是它们是用在node中而非shell里面
```
a | b | c | d
```

### readable stream

Readable stream 输出数据，并通过`.pipe()`传入其他流

```
readableStream.pipe(dest)
```

#### 创建可读流

可读流这样创建：

```javascript
var Readable = require('stream').Readable;

var rs = new Readable;
rs.push('beep ');
rs.push('boop\n');
rs.push(null);

rs.pipe(process.stdout);
```

```
$ node read0.js
beep boop
```

`rs.push(null)` 告诉后面的流`rs`完成了数据输出，后续不再继续输出数据。

我们在将数据传递给 `process.stdout`之前将数据通过 `push()` 提交给了流 `rs`，但是也可以在`push()`数据之前使用 `.pipe()`将 `rs`与`process.stdout`关联

我们多次通过`push()`向 `rs`提交数据，因为我们提交的每一段数据都会被缓存起来，直到有其他流来读取它们

然而，在大多情况下，我们可能并不需要先将数据缓存，而是在有其它流来读取的时候再生成数据。

我们可以通过定义 `._read` 方法，并在该方法内部生成需要的数据。它在其他流请求的时候会被自动调用：

```javascript
var Readable = require('stream').Readable;
var rs = Readable();

var c = 97;
rs._read = function () {
    rs.push(String.fromCharCode(c++));
    if (c > 'z'.charCodeAt(0)) rs.push(null);
};

rs.pipe(process.stdout);
```

```
$ node read1.js
abcdefghijklmnopqrstuvwxyz
```

在这里，当其他流准备好向`rs`读取数据的时候，我们才按顺序生成字母 `a`到`z`中的某个字符，并提交给`rs`让其它流进行读取。

`._read` 函数也接受一个临时的参数`size`作为第一个参数，该参数指定其他流想要读取的字节数，但是readable stream 可以忽略`size`参数。

我们可以使用 `util.inherits()`来继承一个 Readable stream，但是这样并不利于我们当前理解这些例子。

为了表明是仅在有其它流请求数据的时候才会调用`_read()`，我们可以在该例的readable stream 加点延迟效果：
```javascript
var Readable = require('stream').Readable;
var rs = Readable();

var c = 97 - 1;

rs._read = function () {
    if (c >= 'z'.charCodeAt(0)) return rs.push(null);

    setTimeout(function () {
        rs.push(String.fromCharCode(++c));
    }, 100);
};

rs.pipe(process.stdout);

process.on('exit', function () {
    console.error('\n_read() called ' + (c - 97) + ' times');
});
process.stdout.on('error', process.exit);
```

```
$ node read2.js | head -c5
abcde
_read() called 5 times
```

运行这段代码，我们会发现当我们请求了5 字节数据的时候，`_read()`刚好被调用了5 次

setTimeout 设置的延迟是必要的，因为操作系统需要一点时间来发送相应的信号来关闭管道

`process.stdout.on('error, fn')`也是必要的，因为当 `head` 不再需要我们程序的输出数据时，操作系统会发送一个 SIGPIPE 信号给我们的进程，它会在 `process.stdout`上触发一个 EPIPE error

当我们与node外部的管道（如操作系统的管道）进行连接时，这些额外的处理是必要的，虽然它们让程序变得更加复杂，但是使得程序更加健壮；当与node的stream交互时，则不需要做这些处理。

如果你想创建一个能够 push 任意值而非仅仅是 string或者 buffer的 readable stream时，请这样创建： `Readable({ objectMode: true })`

#### 读取 readable stream
