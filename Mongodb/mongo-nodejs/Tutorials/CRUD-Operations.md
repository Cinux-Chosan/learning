# [CRUD Operations](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/crud/)（增删改查）

CRUD 即 create, read, update, delete

该部分包含了基本的 CRUD 方法和 基于`findAndModify` 方法。
*This tutorial covers both the basic CRUD methods and the specialized findAndModify based methods as well as the new Bulk API methods for efficient bulk write operations.*


## 写方法

写方法分为向集合中插入文档、更新文档、删除文档。

### 插入文档

`insertOne` 和 `insertMany` 方法存在于 `Collection` 类。这里罗列了 es5 和 es6 版本的代码，后面的例子只罗列 es6 的代码，如果需要查看 es5 请访问 [http://mongodb.github.io/node-mongodb-native/2.2/tutorials/crud/](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/crud/)

es5:

``` js

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  // Insert a single document
  db.collection('inserts').insertOne({a:1}, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);

    // Insert multiple documents
    db.collection('inserts').insertMany([{a:2}, {a:3}], function(err, r) {
      assert.equal(null, err);
      assert.equal(2, r.insertedCount);

      db.close();
    });
  });
});
```

es6:

``` js

var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://localhost:27017/myproject');
  console.log("Connected correctly to server");

  // Insert a single document
  var r = yield db.collection('inserts').insertOne({a:1});
  assert.equal(1, r.insertedCount);

  // Insert multiple documents
  var r = yield db.collection('inserts').insertMany([{a:2}, {a:3}]);
  assert.equal(2, r.insertedCount);

  // Close connection
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

第一个 `insert` 向 *insert* 集合中插入一个文档。注意，这里没有显式创建一个新的集合 insert，因为在插入文档的时候 MongoDB 会自动创建它。 `db.createIndex` 方法仅在创建非标准集合的时候才必要，如 [capped 集合](https://docs.mongodb.org/manual/core/capped-collections/) 或 参数不是默认值的情况下才需要。

`insertOne` 和 `insertMany` 方法也接收第二个对象参数，它有以下字段：

| 字段 | 类型 | 描述 |
| :---- |:---:| :-----|
| w | {Number/String, > -1 或 ‘majority’} | <1 的时候，写操作响应不带有结果的 {ok:1}， w >= 1 或者 w='majority'会响应完整的写结果|
| wtimeout |  {Number,0} | 写完成的等待超时时间|
| j | (Boolean, default:false) | write waits for journal sync. |
| serializeFunctions | (Boolean, default:false) | 默认情况下序列化函数不会序列化文档中的对象，将它设置为 true 会序列化对象 |
| forceServerObjectId |	(Boolean, default:false) | 强制使用 MongoDB服务 给 _id 属性赋值而非该驱动对 _id 赋值 |

下例演示如何序列化文档中的函数并写入到[副本集](https://docs.mongodb.org/manual/core/replica-set-members/)：

``` js
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://localhost:27017/myproject');
  console.log("Connected correctly to server");

  // Insert a single document
  var r = yield db.collection('inserts').insertOne({
        a:1
      , b: function() { return 'hello'; }
    }, {
        w: 'majority'
      , wtimeout: 10000
      , serializeFunctions: true
      , forceServerObjectId: true
    });

  assert.equal(1, r.insertedCount);
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

### 指定数据类型

下面的例子演示使用 insertMany 方法在插入文档的时候指定数据类型：

The Decimal128 data type requires MongoDB server version 3.4 or higher.

``` js

var Long = require('mongodb').Long;
var Decimal = require('mongodb').Decimal128;

var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://localhost:27017/myproject');
  console.log("Connected correctly to server");

  var longValue = Long(1787);
  var decimalValue = Decimal.fromString("27.8892836");

  // Insert multiple documents
  var r = yield db.collection('numbers').insertMany([ { a : longValue }, { b : decimalValue } ]);
  assert.equal(2, r.insertedCount);

  // Close connection
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

上面的操作插入了以下两个文档到 numbers 集合：

``` json
{ "_id" : ObjectId("57d6f63a98724c65a5d7bd7a"), "a" : NumberLong(1787) }
{ "_id" : ObjectId("57d6f63a98724c65a5d7bd7b"), "b" : NumberDecimal("27.8892836") }
```

### 更新文档

`updateOne` 和 `updateMany`方法存在于`Collection` 类，用于更新和插入文档：

``` js
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://localhost:27017/myproject');
  console.log("Connected correctly to server");

  // Get the updates collection
  var col = db.collection('updates');
  // Insert a single document
  var r = yield col.insertMany([{a:1}, {a:2}, {a:2}]);
  assert.equal(3, r.insertedCount);

  // Update a single document
  var r = yield col.updateOne({a:1}, {$set: {b: 1}});
  assert.equal(1, r.matchedCount);
  assert.equal(1, r.modifiedCount);

  // Update multiple documents
  var r = yield col.updateMany({a:2}, {$set: {b: 1}});
  assert.equal(2, r.matchedCount);
  assert.equal(2, r.modifiedCount);

  // Upsert a single document
  var r = yield col.updateOne({a:3}, {$set: {b: 1}}, {
    upsert: true
  });
  assert.equal(0, r.matchedCount);
  assert.equal(1, r.upsertedCount);
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

`update` 方法也接受第三个参数，它可以有以下字段：

| 参数 | 类型 | 描述 |
| ---  | --- | --- |
| w | {Number/String, > -1 || ‘majority’} | 同 insertOne |
| wtimeout | {Number, 0} | 同 insertOne |
| j | (Boolean, default:false) | 同 insertOne |
| multi | (Boolean, default:false) | 更新一个/所有 文档 |
| upsert | (Boolean, default:false) | 更新操作为 upsert |

与 `insert` 一样， `update` 方法允许你使用 `w`、`wtimeout`、`fsync` 参数来指定每一个操作更新操作。

### 删除文档

`deleteOne` 和 `deleteMany` 方法存在于 `Collection` 类，用于从 mongodb 删除文档。

``` js
var MongoClient = require('mongodb').MongoClient,
  co = require('co'),
  assert = require('assert');

co(function*() {
  // Connection URL
  var db = yield MongoClient.connect('mongodb://localhost:27017/myproject');
  console.log("Connected correctly to server");

  // Get the removes collection
  var col = db.collection('removes');
  // Insert a single document
  var r = yield col.insertMany([{a:1}, {a:2}, {a:2}]);
  assert.equal(3, r.insertedCount);

  // Remove a single document
  var r = yield col.deleteOne({a:1});
  assert.equal(1, r.deletedCount);

  // Update multiple documents
  var r = yield col.deleteMany({a:2});
  assert.equal(2, r.deletedCount);
  db.close();
}).catch(function(err) {
  console.log(err.stack);
});
```

`deleteOne` 和 `deleteMany` 方法也接受第二个参数，它有以下字段。

| 参数 | 类型 | 描述 |
| --- | --- | --- |
| w | {Number/String, > -1 || ‘majority’} | 同 insertOne |
| wtimeout | {Number, 0} | 同 insertOne |
| j | (Boolean, default:false) | 同 insertOne |
| single | (Boolean, default:false) | 移除找到的第一条文档 |
