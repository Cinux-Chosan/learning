<<<<<<< HEAD
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
=======

//var util = require('./myLib').util;
var http = require('http');

var server = http.createServer(function(req, res) {
  var body = ['Chosansdfasfasdf'];
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
  }
).on('end', function() {
    console.log('Enter req.end\n');
    //body = Buffer.concat(body).toString();
    res.setHeader('Access-Control-Allow-Origin', '*');
    //util.readObj(res.agent, res);
    res.end('data is :' + body);
    console.log('Leave req.end\n');
  }).on('error', (e) => {
    console.log("Error is:" + e.message);
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
  });

});
<<<<<<< HEAD
=======
server.listen(8088, () => {
  console.log("I am listening");
});


// http.createServer(function(request, response) {
//   var headers = request.headers;
//   var method = request.method;
//   var url = request.url;
//   var body = [];
//   request.on('error', function(err) {
//     console.error(err);
//   }).on('data', function(chunk) {
//     body.push(chunk);
//   }).on('end', function() {
//     body = Buffer.concat(body).toString();
//     // At this point, we have the headers, method, url and body, and can now
//     // do whatever we need to in order to respond to this request.
//   });
// }).listen(8080); // Activates this server, listening on port 8080.
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
