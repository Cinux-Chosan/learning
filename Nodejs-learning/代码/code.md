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


``` js
// 简单的控制台多人聊天程序
// 实现将某个 socket 数据转发到其他 socket进行通信

var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();

channel.clients = {};
channel.subscription = {};

channel.on('join', function(id, client) {
    this.clients[id] = client;
    this.subscription[id] = function(senderId, message) {  // 保存监听函数用于移除
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscription[id]);
    channel.on('leave', (leave_id) => {
      channel.removeListener('broadcast', this.subscription[leave_id]);   // 移除离开用户的监听器，并向其他用户发送该用户退出消息
      channel.emit('broadcast', leave_id, leave_id + " has left the chat.\n");
    });
});

var server = net.createServer(function(client) {
    var id = client.remoteAddress + ":" + client.remotePort;
    channel.emit('join', id, client);
    client.on('data', data => {
        data = data.toString();
        channel.emit('broadcast', id, data);
    });
    client.on('close', () => {
      channel.emit('leave', id);
    });
});


server.listen(8888);

```

``` js
var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer((req, res) => {
  switch (req.method) {
    case 'POST':
      var item = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        item += chunk;
      });
      req.on('end', function() {
        items.push(item);
        res.end('OK\n');
      });
      break;
    case 'GET':
    items.forEach(function(item, i) {
      res.write(i + ') ' + item + '\n');
    });
    res.end();
    break;
  }
});

```
