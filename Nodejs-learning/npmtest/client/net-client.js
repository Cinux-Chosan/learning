<<<<<<< HEAD
const net = require('net');
const http = require('http');

const client = net.createConnection({port: 80, method:"CONNECT"}, () => {
  //'connect' listener
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
=======
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
>>>>>>> 8879b90913653d14d2f5ce80b59ae539daad2d5c
