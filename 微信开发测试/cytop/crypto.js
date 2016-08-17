var express = require('express'),
    WXBizMsgCrypt = require('wechat-crypto'),
    app = new express(),
    wechatInfo = require('./myConfig').wechatInfo,
    config = {
        token: wechatInfo.msgApp.token,
        encodingAESKey: wechatInfo.msgApp.encodingAESKey,
        corpId: wechatInfo.cropId
    };
    bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));  
app.get('/get-wx-service', function(req, res) {
    var msg_signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId);
    var s = cryptor.decrypt(echostr);
    res.send(s.message);
    console.log(s.message);

});

app.post('/get-wx-service', function(req, res) {
    console.log('get Post');
    console.log('------------------------------------------------------------------');

    var msg_signature = req.query.msg_signature;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId);
    console.log(decrypt(msg_signature));
    console.log('------------------------------------------------------------------');

})

app.listen(6666);

console.log('Server running at http://127.0.0.1:6666/');
