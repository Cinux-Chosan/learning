# [Getting Started with MongoDB (MongoDB Shell Edition)](https://docs.mongodb.com/getting-started/shell/)

Overview
Available Editions
Additional Information

参考 [Overview、Available Editions、Additional Information](https://docs.mongodb.com/getting-started/shell/)

## Introduction to MongoDB

MongoDB 是一个开源的文档型数据库。

### Documents （文档）

MongoDB 中的一条记录就是一个文档，它由键/值对组成，类似于 JSON 对象。字段的值可以包含其它文档、数组、文档数组等。

``` json
{
   "_id" : ObjectId("54c955492b7c8eb21818bd09"),
   "address" : {
      "street" : "2 Avenue",
      "zipcode" : "10075",
      "building" : "1480",
      "coord" : [ -73.9557413, 40.7720266 ]
   },
   "borough" : "Manhattan",
   "cuisine" : "Italian",
   "grades" : [
      {
         "date" : ISODate("2014-10-01T00:00:00Z"),
         "grade" : "A",
         "score" : 11
      },
      {
         "date" : ISODate("2014-01-16T00:00:00Z"),
         "grade" : "B",
         "score" : 17
      }
   ],
   "name" : "Vella",
   "restaurant_id" : "41704620"
}
```

### Collections （集合）

MongoDB 把文档存储在集合之中，集合类似于关系型数据库中的表，但是与表不同的是，集合中的文档不需要有固定的模式。

在 MongoDB 中， 文档必须有一个唯一的 `_id` 字段作为主键。如果插入的数据中不包含该字段，这 MongoDB 会自动生成。


## 安装 [MongoDB](https://docs.mongodb.com/getting-started/shell/installation/)

## 导入示例数据集

本示例以 test 数据库的 restaurant 集合为例，完整数据在 [ https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json]( https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json)，将它存在本地用于导入数据（如运行`curl -O https://raw.githubusercontent.com/mongodb/docs-assets/primer-dataset/primer-dataset.json --socks5 localhost`下载数据），以下是 restaurant 集合中的一个文档样例：

``` json
{
  "address": {
     "building": "1007",
     "coord": [ -73.856077, 40.848447 ],
     "street": "Morris Park Ave",
     "zipcode": "10462"
  },
  "borough": "Bronx",
  "cuisine": "Bakery",
  "grades": [
     { "date": { "$date": 1393804800000 }, "grade": "A", "score": 2 },
     { "date": { "$date": 1378857600000 }, "grade": "A", "score": 6 },
     { "date": { "$date": 1358985600000 }, "grade": "A", "score": 10 },
     { "date": { "$date": 1322006400000 }, "grade": "A", "score": 9 },
     { "date": { "$date": 1299715200000 }, "grade": "B", "score": 14 }
  ],
  "name": "Morris Park Bake Shop",
  "restaurant_id": "30075445"
}
```

### 将数据导入集合

使用 `mongoimport` 插入数据。如果 test 数据库中已经存在该集合，该操作会先删除该集合：

``` sh
mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json
```

mongoimport 连接一个运行在 localhost:27017 的 mongod 实例， `--file` 选项提供导入数据的路径。

如果要将数据导入到运行在其它服务器或者端口的 mongod 实例，则通过指定 `--host` 或者 `--port` 选项来完成。

## MongoDB Shell (mongo)

mongo shell  是一个通过 Javascript 与 MongoDB 进行交互的接口，并且它也作为 MongoDB 的组件包。你可以使用 mongo shell 来查询和更新 MongoDB 的内容。

### 启动 mongo

启动 mongo shell 之前，请确保 MongoDB 已经启动，启动可以通过下面的命令来完成：

``` sh
mongo
```

windows 为 `mongo.exe`

也可能需要指定正确的命令路径。

如果不带任何参数运行 mongo 命令， mongo shell 会连接运行在 localhost:27017 的 MongoDB 实例。 To specify a different host or port number, as well as other options, see [mongo Shell Reference Page](http://docs.mongodb.com/manual/reference/program/mongo).

在 mongo shell 中，键入 help 即可获取帮助。

mongo shell 也提供类似于 bash shell 的 `<tab>` 键操作、 `<up-arrow>`、`<down-arrow>` 来检索历史命令。

## Insert Data with the mongo Shell

使用 `insert()` 方法来将文档添加到集合中去，如果集合不存在，MongoDB 将会自动创建一个。

- 切换到 test 数据库

> use test

- 插入文档

>
db.restaurants.insert(
   {
      "address" : {
         "street" : "2 Avenue",
         "zipcode" : "10075",
         "building" : "1480",
         "coord" : [ -73.9557413, 40.7720266 ]
      },
      "borough" : "Manhattan",
      "cuisine" : "Italian",
      "grades" : [
         {
            "date" : ISODate("2014-10-01T00:00:00Z"),
            "grade" : "A",
            "score" : 11
         },
         {
            "date" : ISODate("2014-01-16T00:00:00Z"),
            "grade" : "B",
            "score" : 17
         }
      ],
      "name" : "Vella",
      "restaurant_id" : "41704620"
   }
)

该方法返回一个包含了操作状态值的 [WriteResult](https://docs.mongodb.com/manual/reference/method/WriteResult/#WriteResult) 对象

> WriteResult({ "nInserted" : 1 })

如果传入的数据没有包含 `_id` 字段，mongo shell 会自动生成 [`ObjectId`](http://docs.mongodb.com/manual/reference/object-id) 来填充该字段的值。

## Find or Query Data with the mongo Shell

你可以使用 `find()` 方法来查询和检索 MongoDB 集合中的数据。MongoDB 中的所有查询操作都在单个集合中。

查询返回所有文档集合或者仅仅返回某个匹配的结果。可以通过在文档中指定查询的条件并将该文档传入 `find()` 作为其第二个参数。

`find()` 方法返回一个查询结果的游标，它是一个 yield 文档的可迭代对象。

切换到 test 数据库

- 查询所有数据

> `db.restaurants.find()`

- 指定查询条件的格式为 `{字段1：值1， 字段2：值2 ...}`
  - 如果字段是文档的顶级字段，则直接用引号引起来
  - 如果是嵌套的字段，则使用 `.` 号，并将字段引起来。

查询顶级字段：

> db.restaurants.find( { "borough": "Manhattan" } )

查询嵌套字段：

> db.restaurants.find( { "address.zipcode": "10075" } )

查询数组中对象的字段

> db.restaurants.find( { "grades.grade": "B" } )

### 指定操作条件

MongoDB 提供了操作符来指定查询条件，例如[比较操作符](http://docs.mongodb.com/manual/reference/operator/query-comparison/)，一般操作符的使用都是通过如下格式使用（尽管有些是例外，如 `$or` 和 `$and` 操作符）

> { <field1>: { <operator1>: <value1> } }

[全部操作符](http://docs.mongodb.com/manual/reference/operator/query)

- 大于操作符 （$gt）

查询 score 大于 30 的文档：

> db.restaurants.find( { "grades.score": { $gt: 30 } } )

- 小于操作符 （$lt）

> db.restaurants.find( { "grades.score": { $lt: 10 } } )

#### 组合条件

- 逻辑与（AND）
  - 多个条件同时成立

> db.restaurants.find( { "cuisine": "Italian", "address.zipcode": "10075" } )

- 逻辑或（OR）
  - 某个条件成立即可

> db.restaurants.find(
   { $or: [ { "cuisine": "Italian" }, { "address.zipcode": "10075" } ] }
)

#### 查询结果排序

将 `sort()` 方法追加在查询方法后面，并传递给 sort() 方法一个文档作为排序准则，文档字段值为 `1`（升序） 或者 `-1`（降序）

例如，如下操作返回所有 restaurants 集合中的文档，先根据 borough 字段升序排列，然后在每个 borough 中对 address.zipcode 字段进行排序:

> db.restaurants.find().sort( { "borough": 1, "address.zipcode": 1 } )

该操作返回指定序列的结果。

## Update Data with the mongo Shell

使用 update() 方法来更新集合中的文档。该方法接收以下参数：

- 一个用于匹配需要更新的文档的文档
- 一个用于更新第一个参数指定的文档的文档（新数据）
- 可选项参数

默认情况下， `update()` 方法更新单个文档，使用 `multi` 选项参数可以更新所有匹配的文档。

**不能更新 _id 字段**

- 切换到 test 数据库

### 更新指定字段

MongoDB 提供了 [更新操作符](http://docs.mongodb.com/manual/reference/operator/update)，如 `$set` 来修改指定的值。一些更新操作符，如 `$set` 在该字段不存在的情况下将会创建该字段。

#### 更新顶级字段

以下操作符更新 name 字段为 Juni 的第一个文档，使用 $set 操作符来更新 cuisine 字段，使用 $currentDate 操作符来用当前日期更新 lastModified 字段

> db.restaurants.update(
    { "name" : "Juni" },
    {
      $set: { "cuisine": "American (New)" },
      $currentDate: { "lastModified": true }
    }
)

该更新操作返回 [`WriteResult`](https://docs.mongodb.com/manual/reference/method/WriteResult/#WriteResult) 对象

#### 更新嵌套字段

> db.restaurants.update(
  { "restaurant_id" : "41156888" },
  { $set: { "address.street": "East 31st Street" } }
)

#### 更新多个文档

默认情况下， `update()` 方法只更新单个文档。如果要更新多个文档，使用 `multi` 参数。

> db.restaurants.update(
  { "address.zipcode": "10016", cuisine: "Other" },
  {
    $set: { cuisine: "Category To Be Determined" },
    $currentDate: { "lastModified": true }
  },
  { multi: true}
)

### 替换文档

如果要替换除了 `_id` 字段的整个文档，需要传递新的整个文档（非使用更新操作符如 $set）作为 `update()` 的第二个参数。新文档可以有与被替换文档不同的字段。因为 `_id` 字段不可改变，所以可以不用传递该字段，如果传递该字段，则必须与之前的相同。

> db.restaurants.update(
   { "restaurant_id" : "41704620" },
   {
     "name" : "Vella 2",
     "address" : {
              "coord" : [ -73.9557413, 40.7720266 ],
              "building" : "1480",
              "street" : "2 Avenue",
              "zipcode" : "10075"
     }
   }
)

该操作直接替换了原来的文档。

如果集合中没有匹配的文档，则更新不会做任何操作。将 `upsert`（更新插入） 选项指定为 true，则在没有匹配的情况下会将该文档插入集合。

In MongoDB, write operations are atomic on the level of a single document. If a single update operation modifies multiple documents of a collection, the operation can interleave with other write operations on that collection. In the MongoDB Manual, see [Atomicity](http://docs.mongodb.com/manual/core/write-operations-atomicity).

## Remove Data with the mongo Shell

使用 `remove()` 方法从集合中移除文档。该方法接收一个用于匹配的文档。

- 切换到 test 数据库

- 移除匹配的所有文档

> db.restaurants.remove( { "borough": "Manhattan" } )

- 使用 justOne 选项移除单条数据

> db.restaurants.remove( { "borough": "Queens" }, { justOne: true } )

返回 WriteResult, nRemoved 为移除的文档条数

> WriteResult({ "nRemoved" : 1 })

#### 移除所有的文档

将匹配的文档传递为空文档（`{}`）即可

> db.restaurants.remove( { } )

### 删除集合

删除所有文档仅仅移除一何种的文档，但是集合本身的 index 还保留着。要移除集合中的所有文档，更效率的方法是通过 `drop()`删除集合，然后重新创建：

> db.restaurants.drop()

如果删除成功，则返回 `true`，如果集合不存在，则返回 `false`

In MongoDB, write operations are atomic on the level of a single document. If a single remove operation removes multiple documents from a collection, the operation can interleave with other write operations on that collection. In the MongoDB Manual, see [Atomicity](http://docs.mongodb.com/manual/core/write-operations-atomicity).

## Data Aggregation with the mongo Shell

MongoDB 提供聚合操作，如根据指定的键进行分组操作、计算每个组的总值或者数量。

使用 `aggregate()` 方法来执行基于 stage（如 $group） 的聚合操作。 `aggregate()` 方法接收一个 stage 数组作为参数。每个 [stage](http://docs.mongodb.com/manual/meta/aggregation-quick-reference)按顺序进行处理，它可以描述数据处理的步骤。

> db.collection.aggregate( [ <stage1>, <stage2>, ... ] )

- 使用 test 数据库

### 通过字段将文档分组并计算文档数量

使用 `$group` stage 来根据键进行分组。在 $group stage 中指定 `_id` 字段来指定分组的键。 $group 通过加上`$` 前缀的字段名来指定字段的访问路径，$group stage 可以使用 [accumulators](http://docs.mongodb.com/manual/meta/aggregation-quick-reference/#group-operators) 来计算每个组。下例使用 restaurants 集合中文档的 borough 字段来进行分组，并且使用 accumulator $sum 来计算每个分组的文档数量。

``` js
db.restaurants.aggregate(
   [
     { $group: { "_id": "$borough", "count": { $sum: 1 } } }
   ]
);
```

返回结果

``` js
{ "_id" : "Staten Island", "count" : 969 }
{ "_id" : "Brooklyn", "count" : 6086 }
{ "_id" : "Manhattan", "count" : 10259 }
{ "_id" : "Queens", "count" : 5656 }
{ "_id" : "Bronx", "count" : 2338 }
{ "_id" : "Missing", "count" : 51 }
```

返回数据的 `_id` 字段包含了不同的 borough 字段的值

#### Filter and Group Documents

使用 $match stage 来过滤文档，$match 使用 MongoDB [查询语法](https://docs.mongodb.com/getting-started/shell/query/)：

``` js
db.restaurants.aggregate(
   [
     { $match: { "borough": "Queens", "cuisine": "Brazilian" } },
     { $group: { "_id": "$address.zipcode" , "count": { $sum: 1 } } }
   ]
);
```

返回值：

``` js
{ "_id" : "11368", "count" : 1 }
{ "_id" : "11106", "count" : 3 }
{ "_id" : "11377", "count" : 1 }
{ "_id" : "11103", "count" : 1 }
{ "_id" : "11101", "count" : 2 }
```

## Indexes with the mongo Shell

index（索引） 可以提高查询效率。如果不使用 index， MongoDB 必须遍历集合中的每一个文档来匹配查询条件。如果为查询建立适当的 index，MongoDB 可以使用 index 来限制必须检查的文档数量。

`createIndex()` 方法用于在一个集合上创建 index。 index 可以支持高效率的查询。 MongoDB 在创建集合的时候自动根据 `_id` 字段创建 index。

在一个或多个字段上创建 index ，可以给 createIndex() 传递一个用于指定 index 键的文档，该文档罗列需要创建index 的字段并且指定每个字段的 index类型。

> { <field1>: <type1>, ...}

- index类型为升序，则指定 type 为 1
- index类型为降序，则指定 type 为 -1

createIndex() 仅仅在 index 不存在的时候才会创建 index。

- 切换到 test 数据库

#### 创建当字段index

> db.restaurants.createIndex( { "cuisine": 1 } )

返回数据为操作状态

> {
  "createdCollectionAutomatically" : false,
  "numIndexesBefore" : 1,
  "numIndexesAfter" : 2,
  "ok" : 1
}

成功创建索引后， "numIndexesAfter" 值会大于 "numIndexesBefore"

#### 创建复合index

MongoDB 支持多字段[复合索引](https://docs.mongodb.com/manual/core/index-compound/#index-type-compound)。字段的顺序决定了 index 如何保存键。例如，以下操作在 cuisine 和 address.zipcode 字段上创建了一个复合索引。索引的顺序按照 cuisine 升序，然后再按照 address.zipcode 降序创建。

> db.restaurants.createIndex( { "cuisine": 1, "address.zipcode": -1 } )

返回数据为操作执行状态的文档：

> {
   "createdCollectionAutomatically" : false,
   "numIndexesBefore" : 2,
   "numIndexesAfter" : 3,
   "ok" : 1
}

成功创建索引后， "numIndexesAfter" 值会大于 "numIndexesBefore"

You can specify various properties for indexes, such as a [unique constraint](http://docs.mongodb.com/manual/core/index-unique). In the MongoDB Manual, see createIndex() for the available options.

MongoDB provides different index types to support different kinds of queries and datasets. In the MongoDB Manual, see the [Index Introduction](http://docs.mongodb.com/manual/core/indexes-introduction) for the different index types supported in MongoDB.
