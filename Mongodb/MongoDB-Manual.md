# [MongoDB-Manual](https://docs.mongodb.com/manual/)


# Introduction

## Databases and Collections

MongoDB 存储的是 [BSON文档](https://docs.mongodb.com/manual/core/document/#bson-document-format), 即数据记录存放在集合中,集合存放在数据库中.

![image](https://docs.mongodb.com/manual/_images/crud-annotated-collection.bakedsvg.svg)

### 数据库

在 mongodb中,数据库包含集合,集合包含文档.

在 mongo shell 中, 选取一个数据库,使用 `use <db>`, 如下:

> use myDB

#### 创建数据库

如果数据库不存在, mongodb 会在你第一次往数据库存放数据的时候创建它. 因此, 你可以切换到一个不存在的数据库, 然后插入数据. 在 mongo shell 中如下:
> use myNewDB
db.myNewCollection1.insertOne( { x: 1 } )

这里, `insertOne()` 创建了 myNewDB 数据库和 myNewCollection1 集合.

### 集合

mongodb 在集合中存储文档, 集合类似于关系型数据库中的表.

#### 创建集合

如果集合不存在, mongodb 会在第一次往该集合插入数据的时候创建它.

> db.myNewCollection2.insertOne( { x: 1 } )
db.myNewCollection3.createIndex( { y: 1 } )

这里, `insertOne()` 和 `createIndex()` 都各自创建了自己的数据库.

#### 显式创建集合

mongodb 提供了[`db.createCollection()`](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection) 方法来显式创建一个集合. 该方法接受创建参数. 如果你不需要指定参数, 则完全可以不用调用该方法, 而是在插入数据的时候让 mongodb 自动为你创建数据库.

#### 文档校验

默认情况下, 集合不要求它里面存储的文档有相同的模式. 单个集合中的文档不需要有相同的字段、数据类型等。

从 mongodb 3.2 开始，你可以为执行数据的插入和更新时制定 [文档校验规则](https://docs.mongodb.com/manual/core/document-validation/) ，
See [Document Validation](https://docs.mongodb.com/manual/core/document-validation/) for details.

#### 改变文档结构

添加新的字段、移除已经存在的字段、改变字段值类型等需要改变文档结构的操作，可以直接更新该文档为一个新的文档。

### Views

3.4 版本的新特性

从版本3.4 开始，mongodb 支持从已经存在的集合或其它视图创建 **只读** 的视图。
（视图从基表建立了一份映射，只包含指定条件的数据。对它的相应操作都会直接操作到基表，那些被经常使用的查询可以被定义为视图，从而使得用户不必为以后的操作每次指定全部的条件。see[数据库视图](http://baike.baidu.com/link?url=RlfoaWdKlcd-_8KXTS__MEc2UKkr4hjFxKkzpHs6Yhxkx20rqaH0SY-XH7VKHCFRVMM4eTPFnTkG8GClyXRFmDVWBJbKqlRSVO_5SAemOrDqj_EcoK7e-kfZlghXXn__c9NfLd4HLxbl4_EbKj85bK)）

#### 创建视图

- 使用已存在的 [`create`](https://docs.mongodb.com/manual/reference/command/create/#dbcmd.create)命令（也可以 [db.createCollection](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection) helper）的 viewOn 和 pipeline 选项

> db.runCommand( { create: <view>, viewOn: <source>, pipeline: <pipeline> } )

or if specifying a default [collation](https://docs.mongodb.com/manual/release-notes/3.4/#relnotes-collation) for the view:

> db.runCommand( { create: <view>, viewOn: <source>, pipeline: <pipeline>, collation: <collation> } )

- 使用新的 mongo shell helper [db.createView()](https://docs.mongodb.com/manual/reference/method/db.createView/#db.createView)

> db.createView(<view>, <source>, <pipeline>, <collation> )

#### 表现

- 只读
  - 对视图执行写操作将会报错
- 能够建立索引和排序操作
  - 视图使用它基于的集合的索引
  - 你不能给视图指定一个 [$natural](https://docs.mongodb.com/manual/reference/operator/meta/natural/#metaOp._S_natural) 排序
- Projection Restrictions
  在视图上执行 [find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find) 操作不支持以下  [projection](https://docs.mongodb.com/manual/reference/operator/projection/) 操作符：
  - [$](https://docs.mongodb.com/manual/reference/operator/projection/positional/#proj._S_)
  - [$elemMatch](https://docs.mongodb.com/manual/reference/operator/projection/elemMatch/#proj._S_elemMatch)
  - [$slice](https://docs.mongodb.com/manual/reference/operator/projection/slice/#proj._S_slice)
  - [$meta](https://docs.mongodb.com/manual/reference/operator/projection/meta/#proj._S_meta)
- 视图名不可更改
- [视图创建](https://docs.mongodb.com/manual/core/views/#view-creation)
  
