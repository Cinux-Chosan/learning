# Connect to MongoDB

This reference applies to 2.1.11 or higher. For 2.1.10 or earlier, refer to the [legacy connection settings](http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/legacy-connection-settings/). 2.1.11 is backward compatible with the legacy settings as well as the simplified settings.


使用 `MongoClient.connect` 方法来连接 MongoDB

## 连接单个 MongoDB 实例

通过指定 MongoDB 实例的 URI 来连接到指定的实例。

以下示例中， [URI 连接字符串](https://docs.mongodb.org/manual/reference/connection-string/) 指定连接到 `localhost:27017` 的 MongoDB 实例。 `myproject` 为需要使用的数据库。 如果数据库缺省，则 `MongoClient` 会使用默认的 `test` 数据库：

``` js
var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
 assert.equal(null, err);
 console.log("Connected successfully to server");

 db.close();
});
```

For more information on the URI connection string, see [URI Connection String](https://docs.mongodb.org/manual/reference/connection-string/) .

## 连接到 Replica Set（副本集）

如果需要连接到副本集，需要在 URI 中包含副本集成员的多个地址 和 副本集的名称。

下例中，连接字符串指定了两个副本集成员 `localhost:27017` 和 `localhost27018`。数据库为 myproject，副本集名称为 `foo`; **When using the 2.0 driver, you must include the replica set name.**

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017,localhost:27018/myproject?replicaSet=foo';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
```

## 连接分片集群(Sharded Cluster)

通过在 URI 中指定m ongo实例来连接 [Sharded Cluster](https://docs.mongodb.org/manual/core/sharded-cluster-components/)

在下例中，在连接字符串 URI 中指定了运行在 `localhost:50000` 和 `localhost:50001` 的 `mongos` 实例和需要连接的数据库 myproject

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:50000,localhost:50001/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});
```

## 连接选项

你可以在 URI 中指定多种连接配置参数

例如，你可以指定 TLS/SSL 和认证配置：

``` js
var MongoClient = require('mongodb').MongoClient,
  f = require('util').format,
  assert = require('assert'),
  fs = require('fs');

  // Read the certificate authority
  var ca = [fs.readFileSync(__dirname + "/ssl/ca.pem")];
  var cert = fs.readFileSync(__dirname + "/ssl/client.pem");

// Connection URL
var url = 'mongodb://dave:password@localhost:27017?authMechanism=DEFAULT&authSource=db&ssl=true"';

// Use connect method to connect to the Server passing in
// additional options
MongoClient.connect(url,  {
  server: {
      sslValidate:true
    , sslCA:ca
    , sslCert:cert
  }
}, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  db.close();
});
```

For more information on connecting with authentication and TSL/SSL, see:

- [Authentication](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/connect/authenticating/): detailed documentation of the various ways to specify authentication credentials
- [TLS/SSL](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/connect/ssl/): Detailed documentation of the various ways to specify the properties of an TLS/SSL connection
For more information on the connection options:

- [URI Connection String](https://docs.mongodb.org/manual/reference/connection-string/): MongoDB connection string URI.
- [Connection Settings](http://mongodb.github.io/node-mongodb-native/2.2/reference/connecting/connection-settings/): Reference on the driver-specific connection settings.
