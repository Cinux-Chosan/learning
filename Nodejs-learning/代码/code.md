``` javascript
// echo 服务器
var net = require('net');
var server = net.createServer(function(socket) {
  socket.once('data', function(data) {
    socket.write(data);
  });
});

server.listen(8888);
```



``` js
var EventEmitter = require('events').EventEmitter;
var channel = new EventEmitter();
channel.on('join', function() {
  // DO STUFF
});

channel.emit('join');

```
