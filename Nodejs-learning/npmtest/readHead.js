require('babel-register');
var util = require('./myLib').util;
var http = require('http');
var fs = require('fs');


const port = 8008;

var server = http.createServer((req, res) => {
  req.on('connect', () => {
    console.log("Connected");
  });

  req.on('data', (chunk) => {
    console.log(chunk);
  });


  req.on('end', () => {
    console.log('req end');
    //util.readObj(req, res);
    util.readObj(req.headers);
    if (req.url == '/') {
      util.readObj(req.headers, res);
      res.end();
    };
    fs.readFile(`./${req.url}`, (err, data) => {
      console.log('ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
      console.log(data);
      res.end(data);
    });
  });
});


server.listen(port, () => {
  console.log(`listening on ${port}`);
})
