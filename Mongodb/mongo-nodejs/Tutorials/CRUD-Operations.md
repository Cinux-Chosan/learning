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
