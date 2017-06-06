# [Collections](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/collections/)（集合）

MongoDB 在集合中存储文档。如果一个集合不存在，MongoDB 会在首次向该集合存数据的时候创建该集合。

你也可以显式创建一个集合，这样就可以传入各种各样的集合配置参数。

## Capped Collection（固定集合）

Capped 集合有文档最大条数限制，这样就可以防止它们超过最大阈值。所有的固定集合必须指定一个最大的文档数。MongoDB 在集合达到最大限度数之前会删除旧的文档。

使用 `createCollection` 方法，并且指定 `capped` 为 true 可以创建 [capped 集合](https://docs.mongodb.com/manual/core/capped-collections/)

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  createCapped(db, function() {
    db.close();
  });
});

var createCapped = function(db, callback) {
  db.createCollection("myCollection", { "capped": true, "size": 100000, "max": 5000},
    function(err, results) {
      console.log("Collection created.");
      callback();
    }
  );
};
```

## 文档校验（Document Validation）

使用了校验的集合，在插入或更新每一条文档的时候都会与校验规则进行比较。根据 `validationLevel` 和 `validationAction`， 如果匹配失败， MongoDB 会返回一个警告或者是拒绝插入或更新文档。

下例使用验证规则创建了一个 `contacts` 集合，它指定插入或更新文档的时候至少需要匹配以下规则之一。

- phone 字段的值是一个字符串
- emial 字段匹配指定的正则表达式
- status 字段是 `Unknown` 或者 `Incomplete`

``` js
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  createValidated(db, function() {
    db.close();
  });
});

var createValidated = function(db, callback) {
  db.createCollection("contacts",
	   {
	      'validator': { '$or':
	         [
	            { 'phone': { '$type': "string" } },
	            { 'email': { '$regex': /@mongodb\.com$/ } },
	            { 'status': { '$in': [ "Unknown", "Incomplete" ] } }
	         ]
	      }
	   },	   
    function(err, results) {
      console.log("Collection created.");
      callback();
    }
  );
};
```
