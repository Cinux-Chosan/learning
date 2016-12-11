var fs = require('fs');
var express = require('express');
var app = new express;
var port = 9999;

app.get('*', function(req, res) {
  //res.setHeader('Content-Type', 'video/avi');
  console.log(req.path.toLowerCase());
  //res.contentType('application/octet-stream'); // 二进制
  if (req.path.toLowerCase().indexOf('favicon.ico') == -1) {
    fs.createReadStream('.' + req.path).pipe(res);
  } else {
    res.end();
  }
});


app.listen(port, function() {
	console.log('listening on port: ' + port);
});
