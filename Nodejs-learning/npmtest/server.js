
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
  });
});
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
