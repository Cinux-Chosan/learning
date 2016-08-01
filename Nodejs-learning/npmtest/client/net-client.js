var net = require('net');


var connection = net.createConnection({port: 8000}, () => {
  console.log('connected to server!');
  client.write('The message is from client side!');
});


connection.on('data', (data) => {
  console.log(data.toString());
  connection.end();
});

connection.on('end', () => {
  console.log('disconnected form server');
})
