# [Quick Start](http://mongodb.github.io/node-mongodb-native/2.2/quick-start/quick-start/)

该部分阐述了如何安装 Nodejs 的 MongoDB 驱动，并演示了一些简单的增删改查操作。更多内容可以参考[tutorials](http://mongodb.github.io/node-mongodb-native/2.2/reference/main/)

## 创建 package.json 文件

首先，创建项目目录

> mkdir myproject
cd myproject

初始化项目目录

> npm init

安装驱动依赖

> npm i mongodb --save

## 启动 MongoDB 服务

- 从[这里](https://www.mongodb.org/downloads)下载适用于自己操作系统的 MongoDB
- 创建数据库目录(本例设置为 `/data`)
- 安装并启动 mongod

> mongod --dbpath=/data

你可以看到 mongod 启动并输出一些状态信息

## 连接 MongoDB

创建一个新的 app.js 文件，添加下面的代码：

``` js
// 连接 myproject 数据库
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

运行app.js

> node app.js

如果连接成功，会在控制台输出"Connected successfully to server"

## 插入一个文档

使用 `insertMany` 方法来添加 3 条文档到 document 集合：

``` js
var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}
```

insert 指令返回一个对象到回调函数，上例中为 result，包含以下字段：
- result: 包含来自 MongoDB 的结果文档
- ops: 包含了含有 `_id` 字段的文档
- connection： 包含用于执行 insert 的 connection(连接对象)

修改 app.js 调用 insertDocuments：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() { // +++
    db.close();  // +++
  });  // +++
});
```

运行 app.js

> node app.js

输出：
>
Connected successfully to server
Inserted 3 documents into the collection

## 查找所有文档

``` js
var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}
```

上面的查询返回集合 documents 中的所有文档。 修改 app.js 调用 findDocuments 方法：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  insertDocuments(db, function() {
    findDocuments(db, function() {  // +++
      db.close();  // +++
    });  // +++
  });
});
```

## 过滤查询结果

给 `find` 传入匹配参数：

``` js
var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({'a': 3}).toArray(function(err, docs) {  // +++
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs);
    callback(docs);
  });      
}
```

返回结果只会包含 `'a':3` 的数据。

## 更新文档

``` js
var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}
```

该方法匹配第一个 a 为 2 的文档，为它添加一个新的字段 b，其值为 1，修改 app.js 调用该方法：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    updateDocument(db, function() {  // +++
      db.close();  // +++
    });  // +++
  });
});
```

## 删除文档

删除 a 为 3 的文档：

``` js
var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}
```

修改 app.js 来调用 removeDocument：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    updateDocument(db, function() {
      removeDocument(db, function() {
        db.close();
      });
    });
  });
});
```

## 给集合创建索引

[索引](https://docs.mongodb.org/manual/indexes/) 可以提升查询效率。下面给 documents 集合创建以 a 字段为关键字的索引

``` js
var indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};
```

修改 app.js 调用该方法：

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/myproject';
// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    indexCollection(db, function() {  // +++
      db.close();  // +++
    });  // +++
  });
});
```
