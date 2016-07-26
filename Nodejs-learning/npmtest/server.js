var util = require('./myLib').util;

var http = require('http');


var server = http.createServer(function(req, res) {
  var body = [];
  req.on('data', function(chunk) {
    body.push(chunk);
    console.log(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.end('data is :' + body);
  });
});

server.listen(80);
