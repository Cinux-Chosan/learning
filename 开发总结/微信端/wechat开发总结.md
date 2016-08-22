# 微信端企业号开发总结

## 开启回调模式
      
      app.get('/get-wx-service', function(req, res) {
          var echostr = req.query.echostr;
          var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId);
          var echoStr = cryptor.decrypt(echostr);
          res.send(echoStr.message);
      });
      


## 回调模式数据处理
> 微信端回调企业URL时，将XML数据POST到企业的URL上，企业接收到数据，需要使用XML解析器，以node为例，由于body-parser用于解析json等，不能解析XML,所以可能导致req.body为空，所以引入express-xml-bodyparser来解析收到的XML数据，由于收到的数据格式为：
        <xml> 
          <ToUserName><![CDATA[toUser]]</ToUserName>
          <AgentID><![CDATA[toAgentID]]</AgentID>
          <Encrypt><![CDATA[msg_encrypt]]</Encrypt>
        </xml>

> 所以解析完成，req.body有一个为xml的属性，如果要访问Encrypt则需要通过 req.body.xml.encrypt[0]访问。

> Encrypt中包含数据信息，需要解密，使用wechat-crypto包的WXBizMsgCrypt的decrypt进行解密:

    var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId);
    var xmlData = cryptor.decrypt(req.body.xml.encrypt[0]).message;   // decrypt方法返回{message, id},message为加密数据，也为XML格式，如果要获取数据，还需要解析该XML
    // 使用 xml2js 解析
    var xml2js = require('xml2js');
    xml2js.parseString(xmlData, function(err, result) {
      if (err) {
	console.error(err.message);
      } else {
        data = result;  // data 为数据
      }
    });
> 返回数据亦是相同格式，数据封装为XML形式，然后加密，存入父XML的Encrypt内。将父XML返回给微信:


      var retData = {};
      var retDataContent = {};
      retDataContent.ToUserName = data.xml.FromUserName[0] ;
      retDataContent.FromUserName = data.xml.FromUserName[0] ;
      retDataContent.CreateTime = data.xml.CreateTime[0];
      retDataContent.MsgType = data.xml.MsgType[0] ;
      retDataContent.Content = data.xml.Content[0] ;
      var content = xmlBuilder.buildObject(retDataContent);
      retData.Encrypt = cryptor.encrypt(content) ;
      retData.TimeStamp = (new Date()).getTime();
      retData.Nonce = parseInt(Math.random() * 10000000000);
      retData.MsgSignature = cryptor.getSignature(retData.TimeStamp, retData.Nonce, retData.Encrypt);
      retXml = xmlBuilder.buildObject(retData);
      res.status(200).contentType('xml').send(retXml);
	   
### 注意事项
- xml2js 默认会封装一个顶层节点为名为 root，即你的数据被包裹在外层的 ＜root＞＜/root＞ 里面，但是微信识别xml，所以需要配置xml2js的Builder方法:

      var xmlBuilder = new xml2js.Builder({ cdata: true, rootName: 'xml' });
