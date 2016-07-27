var util = require('./myLib').util;

var http = require('http');


var server = http.createServer(function(req, res) {
  var body = ['Chosan'];
  req.on('data', function(chunk) {
    console.log('Enter req.data\n');
    body.push(chunk);
    console.log('' + chunk);
   //res.write('response');
    setInterval(function() {
      res.write('I am listening\n');
      console.log('listening');
    }, 2000);
    console.log('Leave req.data\n');

  }).on('end', function() {
    console.log('Enter req.end\n');
    body = Buffer.concat(body).toString();
    res.setHeader('Access-Control-Allow-Origin', '*');
    //util.readObj(res.agent, res);

    res.end('data is :' + body);
    console.log('Leave req.end\n');
  });
});
server.listen(80);
