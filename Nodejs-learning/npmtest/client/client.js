require('babel-register');
var http = require('http');
var util = require('../myLib').util;

var body = "BODY:";
var data = JSON.stringify({
  name: 'Chosan',
  age: '100'
});
var opt = {
<<<<<<< HEAD
//  url: 'http://localhost/decision/getadminDecisionList',
=======
  port: 8088,
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
    ,'Content-Length': data.length
  }
//  ,agent: new http.Agent({keepAlive: false})
}
//util.readObj(opt.agent, 0);
var req = http.request(opt, function(res) {
  console.log('Status:' + res.statusCode);
  console.log('Headers:' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function(chunk) {
    console.log(body += chunk);
  });
});

req.on('error', function(e) {
<<<<<<< HEAD
  console.log('Error :' + e.message);
}).on('response', function(res) {
  console.log('Enter client req.response');
  console.log('Leave client req.response');
}).on('abort',function() {
  console.log('abort');
}).on('connect', function(res, socket, head) {
  console.log('connect');
=======
  console.log('Error is :' + e.message);
}).on('connect', () => {
  console.log("Connecting");
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
});

//req.writeHeaders();
//req.write('data\n');
<<<<<<< HEAD
setTimeout(function(){req.emit('abort');});

=======
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
// req.write('more data\n');
req.end(data);
