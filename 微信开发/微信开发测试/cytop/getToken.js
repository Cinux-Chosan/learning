// var dataStr = 'https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=wx0543fa361f18ca46&corpsecret=mpTSmqpsHchlDwXnawp0yzW0O_kj073z9iKjdP21fHOk-h1aWLvJGZ5bBX8cusAy';

var https = require('https'),
    myConfig = require('./myConfig').wechatInfo;
    cropId = myConfig.cropId,
    corpSecret = myConfig.corpSecret,
    options = {
        host: 'qyapi.weixin.qq.com',
        port: 443,
        method: 'GET',
        path: '/cgi-bin/gettoken?corpid=' + cropId + '&corpsecret=' + corpSecret
    };

var req = https.request(options, function(res) {

    res.on('data', function(chunk) {
        process.stdout.write(chunk);
    });

});
req.on('error', function(e) {
    console.log('error:', e.message);
});
req.end();
