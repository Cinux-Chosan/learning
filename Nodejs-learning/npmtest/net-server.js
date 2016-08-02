const net = require('net');
const fs = require('fs');

var server = net.createServer(c => {
    console.log('client connected');
    var openFd;
    var handle = fs.open('./text.txt', 'w+', (err, fd) => {
        if (fd) {
            console.log('open file success!');
            openFd = fd;
        }
    });

var count = 0;
var writable;
    c.on('readable', () => {
      console.log('writable');
      count++;
      c.read(1);
      //  writable = fs.createWriteStream('',{
      //   flags: 'w+',
      //   defaultEncoding: 'utf8',
      //   fd: openFd
      // },{end: false});
      //
      // c.pipe(writable);

      c.pipe(process.stdout);
       console.log('pause');
      //  c.pause();
      //  setTimeout(() => {
      //   c.resume();
      //   console.log('resume');
      // }, 5000);
    });

    // c.on('data', (chunk) => {
    //   c.setEncoding('utf8');
    //   console.log("get data");
    //   fs.createWriteStream('',{
    //     flags: 'w+',
    //     defaultEncoding: 'utf8',
    //     fd: openFd
    //   }).write(chunk);
    //   console.log('pause');
    //     c.pause();
    //     setTimeout(() => {
    //     c.resume();
    //     console.log('resume');
    //   }, 5000);
    // });



    c.on('end', () => {
        console.log('client disconnected');
        // c.pipe(fs.createWriteStream('',{
        //   flags: 'w+',
        //   defaultEncoding: 'utf8',
        //   fd: openFd
        // }), {end: false});
        //writable.pipe(process.stdout);
    });

    c.write('hello\r\n');
    //  c.pipe(c);
});

server.listen(8124, () => {
    console.log('server bound');
});
