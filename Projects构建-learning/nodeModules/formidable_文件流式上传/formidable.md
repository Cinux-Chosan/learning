# [formidable](https://www.npmjs.com/package/formidable)

一个用于解析表单数据、文件上传的 node 模块

## 宗旨

### 当前状态

该模块是为 [Transloadit](http://transloadit.com/) —— 一个专注于文件上传和图片、视频编码的服务平台 而设计。它已经对来自大量客户端的数百GB文件上传进行了测试。

## 特性

- 快速（~500mb/sec），非缓冲解析器
- 自动将上传文件写入磁盘
- 低内存占用
- 优雅的错误处理
- 非常高的测试覆盖率

## 安装

这是一个底层包，如果使用一些其它高级 package 如 Express、chances ，则已经包含有该模块。可以参考 [how Formidable is integrated with Express](http://stackoverflow.com/questions/11295554/how-to-disable-express-bodyparser-for-file-uploads-node-js)

- 通过npm安装：

```
npm install formidable@latest
```

- 手动安装：

```
git clone git://github.com/felixge/node-formidable.git formidable
vim my.js
# var formidable = require('./formidable');
```

**注意**： Formidable 需要使用 [gently](http://github.com/felixge/node-gently)来运行单元测试，但是如果仅是使用该模块，则不需要。

## Example

解析文件上传：

``` js
var formidable = require('formidable'),
    http = require('http'),
    util = require('util');

http.createServer(function(req, res) {
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/plain'});
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8080);
```

## [API](https://www.npmjs.com/package/formidable#api)
