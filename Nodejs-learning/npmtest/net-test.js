var net = require('net');

let opt = {
}
var server = net.createServer(c => {
  console.log('server side connected!');
  c.write('The message is from server side!');
  c.on('end', () => {
    console.log('server side end!');

  });
});

server.on('data', (err, data) => {
  if (err) {
    console.log(err.message);
  }
  console.log(data);
});

server.listen(8000, () => {
  console.log('Server bound');
  var connection = net.connect({port: 8000}, () => {
    console.log('connected to server!');
    connection.write('The message is from client side!');
  });
  connection.on('data', (data) => {
    console.log('Client data begin!');
    console.log(data.toString());
    connection.end();
  });
  connection.on('end', () => {
    console.log('disconnected form server');
  })



 /////////////////////////////////////


});
