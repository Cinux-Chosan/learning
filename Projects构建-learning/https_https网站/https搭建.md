# 用 HTTPS 加强程序的安全性 (摘自《node.js实战》 p85)

对于电子商务网站，以及那些会涉及到敏感数据的网站来说，一般都要求能够保证跟服务器往来的数据是私密的。在标准的HTTP会话中，客户端跟服务器端用未经加密的文本交换信息。这使得HTTP通信很容易被窃听。

安全的超文本传输协议（HTTPS）提供了一种保证Web会话私密性的方法。HTTPS将HTTP和TLS/SSL传输层结合到一起。用HTTPS发送的数据是经过加密的，因此更难窃听。本节会介绍一些用HTTPS加强程序安全性的基础知识。

如果你想在你的Node程序里使用HTTPS，第一件事就是取得一个私钥和一份证书。私钥本质上是个“秘钥”，可以用它来解密客户端发给服务器的数据。私钥保存在服务器上的一个文件里，放在一个不可信用户无法轻易访问到的地方。本节会教你如何生成一个自签发的证书。这种SSL证书不能用在正式网站上，因为当用户访问带有不可信证书的页面时，浏览器会显示警告信息，但对于开发和测试经过加密的通信而言，它很实用。

生成私钥需要OpenSSL，在装Node时就已经装过了。打开命令行窗口，输入下面的命令会生成一个名为key.pem的私钥文件：

```
openssl genrsa 1024 > key.pem
```

除了私钥，你还需要一份证书。证书跟私钥不同，可以与全世界分享，它包含了公钥和证书持有者的信息。公钥用来加密从客户端发往服务器的数据。

创建证书需要私钥。输入下面的命令会生成名为key-cert.pem的证书：

```
openssl req -x509 -new -key key.pem > key-cert.pem
```

秘钥已经生成了，把它们放到一个安全的地方。在下面的代码清单中，我们引用的秘钥跟服务器脚本放在同一个目录下，但秘钥通常都是放在别处，一般是 ~/.ssh。下面的代码会创建一个使用秘钥的HTTPS服务器。


## https 服务器配置项

``` js
var https = require('https');
var fs = require('fs');

var options = {
  key: fs.readFileSync('./key.pem');
  cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end("Hello world\n");
}).listen(3000);
```

HTTPS服务器的代码跑起来后，就可以用浏览器跟它建立安全的连接了。你只需在浏览器中访问 https://localhost:3000/ 。因为我们这个例子中所用的证书不是由证书颁发机构颁发的，所以会显示一个警告信息。这里可以忽略这个警告，但如果要把网站部署到公网上，你就应该找个证书颁发机构（CA）进行注册，并为你的服务器取得一份真实的、受信的证书。
