var http = require('http');
var util = require('../myLib').util;

var body = "BODY:";
var data = JSON.stringify({
  name: 'Chosan',
  age: '100'
});
var opt = {
  port: 8088,
  headers: {
    'Content-Type':'application/x-www-form-urlencoded'
    ,'Content-Length': data.length
  }
  ,agent: new http.Agent({keepAlive: false})
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
  console.log('Error is :' + e.message);
}).on('connect', () => {
  console.log("Connecting");
});

//req.writeHeaders();
//req.write('data\n');
// req.write('more data\n');
req.end(data);
