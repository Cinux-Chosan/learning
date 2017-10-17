生成密钥

`openssl genrsa 1024 > key.pem`


生成证书

`openssl req -x509 -new -key key.pem > key-cert.pem`


``` js
const https = require('https');
const fs = require('fs');

let options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./key-cert.pem')
};

https.createServer(options, (req, res) => {
  // TODO:
}).listen(8000);
```
