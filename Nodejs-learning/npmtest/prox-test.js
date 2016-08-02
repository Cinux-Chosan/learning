const http = require('http');
const net = require('net');
const url = require('url');

// Create an HTTP tunneling proxy
var proxy = http.createServer( (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('okay');

  req.on('data', ()=>{
    console.log("REQ DATA");
  });
});
proxy.on('data', ()=>{
  console.log("SERVER DATA");
});
proxy.on('connect', (req, cltSocket, head) => {
  // connect to an origin server
  var srvUrl = url.parse(`http://${req.url}`);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, () => {
    cltSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');

    //srvSocket.write(head);
   srvSocket.pipe(cltSocket);
   cltSocket.pipe(srvSocket);


// setTimeout(function() {
//   var x = cltSocket;
// },5000);
    console.log(srvSocket.buffer == cltSocket.buffer);
    console.log('HEAD ABOVE ALL!+++++++++++++');
  });
});

proxy.on('end', () => {
  console.log('ENGDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD\n\n\n\n\n\n');
});

// now that proxy is running
proxy.listen(8001, '127.0.0.1', () => {

  // make a request to a tunneling proxy
  var options = {
    port: 8001,
    hostname: '127.0.0.1',
    method: 'CONNECT',
    path: 'www.baidu.com:80'
  };

  var req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('got connected!');

      console.log(head.toString());
  console.log('HEAD ABOVE ALL!+++++++++++++');
    // make a request over an HTTP tunnel
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: www.baidu.com:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
