var util = require('./myLib').util;
var fs = require('fs');
var http = require('http');
var url = require('url');
var net = require('net');
var server = http.createServer(function(req, res) {
    var body = ['Chosan'];
    console.log("server start");
    req.on('data', function(chunk) {
        console.log('Enter req.data\n');
        body.push(chunk);
        console.log('' + chunk);
        //res.write('response');
        // setInterval(function() {
        //   res.write('I am listening\n');
        //   console.log('listening');
        // }, 2000);
        console.log('Leave req.data\n');

    }).on('end', function() {
        console.log('Enter req.end\n');
        //body = Buffer.concat(body).toString();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('method', 'CONNECT');
        //util.readObj(res.agent, res);
        //    util.readObj(req, res);
        if (req.url.startsWith("/decision/getadminDecisionList")) {
            var data = fs.readFile('./data.json', function(err, data) {
                    if (err) {
                        console.error(err.message);
                    } else {
                        console.log(data);
                        res.end('' + data);
                    }
                });
            };
        setTimeout(() => res.end('end server'), 200);
        console.log('Leave req.end\n');
    }).on('abort', function() {
      console.log('client abort!');
    }).on('connect', function(){
      console.log('connected');
    });
});
server.listen(80, function() {
  console.log("server start in listen");
});
server.on('connect', (req, socket, head) => {
  console.log("Connected !");
  //socket.write("The connection is from server side");
  var srvUrl = url.parse(`http://${req.url}`);
  console.log(srvUrl);
  var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, ()=>{
    socket.write('GET / HTTP/1.1\r\n' +
                   'Host: www.google.com:80\r\n' +
                   'Connection: close\r\n' +
                   '\r\n');
  });

});
