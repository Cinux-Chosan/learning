require('babel-register');
var http = require('http');
var util = require('../myLib').util;

var body = "BODY:";
var data = JSON.stringify({
  name: 'Chosan',
  age: '100'
});
var opt = {
//  url: 'http://localhost/decision/getadminDecisionList',
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
  console.log('Error :' + e.message);
}).on('response', function(res) {
  console.log('Enter client req.response');
  console.log('Leave client req.response');
}).on('abort',function() {
  console.log('abort');
}).on('connect', function(res, socket, head) {
  console.log('connect');
});

//req.writeHeaders();
//req.write('data\n');
setTimeout(function(){req.emit('abort');});

// req.write('more data\n');
req.end(data);
