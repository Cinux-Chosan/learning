const assert = require('assert');
const http = require('http');
const {readObj} = require('./myLib').util;

const obj1 = {
	a: {
		b: 2
	}
}

const obj2 = {
	a: {
		b: 2
	}
}

const obj3 = {
	a: {
		b: 3
	}
}

const n  =  '1';
//assert.deepEqual(1, 1);
assert.throws(
  () => {
    throw new Error('Wrong value');
  },
  function(err) {
	  console.log("XXXXXXXXXXXXXXXXXXXXXXXX");
	  console.log(typeof err);
	  var server = http.createServer((req, res) => {
		   var body = ['Chosan'];
    console.log("server start");
		  req.on('data', (chunk)=> { 
		  console.log('Enter req.data\n');
        body.push(chunk);
        console.log('' + chunk);
        //res.write('response');
        // setInterval(function() {
        //   res.write('I am listening\n');
        //   console.log('listening');
        // }, 2000);
        console.log('Leave req.data\n');
			 
		  });
		  req.on('end', () => {
			  console.log("in end");
		  });
		  res.setHeader('Access-Control-Allow-Origin', '*')
		  res.end(JSON.stringify(err));
	  });
	  server.listen(8888);
	  	  console.log("XXXXXXXXXXXXXXXXXXXXXXXX");

    if ( (err instanceof Error) && /value/.test(err) ) {
      return true;
    }
  },
  'unexpected error'
);