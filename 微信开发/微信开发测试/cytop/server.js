var http = require('http'),

server = http.createServer(function(req, res) {

  res.end();

});



server.listen(80, function() {
  console.log('Listening');
});
