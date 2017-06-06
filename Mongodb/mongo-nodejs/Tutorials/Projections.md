# [Projections](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/projections/) （投影）

默认情况下，MongoDB 返回匹配文档的所有字段。你可以在查询的时候包含一个`projections document(投影文档)` 来限制 MongoDB 返回大量的数据。

## 投影文档

投影文档限制查询到的文档返回指定字段。投影文档可以指定返回的数据 包含与不包含 制定字段:

> { field1: <value>, field2: <value> ... }

`<value>` 可能是 `0` 或者 `false`来排除字段，如果为 `1` 或者 `true` 来包含字段。 除了 `_id` 字段，在同一个投影文档中你不可以同时包含和不包含一个字段。

## 例子

下面的样例代码使用样本数据集 `restaurants`

仅返回文档的 `name`、`cuisine` 和 `_id` 字段。在投影文档中明确包含 `name` 和 `cuisine` 字段。 默认情况 `_id` 会被自动包含在里面，除了显式排除该字段：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  findDocuments(db, function() {
    db.close();
  });  
});


var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection( 'restaurants' );
  // Find some documents
  collection.find({ 'cuisine' : 'Brazilian' }, { 'name' : 1, 'cuisine' : 1 }).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
```

如果需要仅返回 `name` 和 `cuisine` 字段，排除其它所有字段（包括`_id`），可以使用下面的投影文档：

``` json
{ 'name' : 1, 'cuisine' : 1, '_id': 0 }
```

如果需要返回除了 address 字段的所有其它字段，可以使用下面的投影文档：

``` json
{ 'address' : 0 }
```
