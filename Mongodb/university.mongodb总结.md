# MongoDB for Node.js Developers 视频总结

导入数据 mongorestore

## insertMany()

默认情况下, 传入给 insertMany 的文档按顺序插入, 如果中途出现错误(如`_id`出现重复), 写入操作就会中断, 出现错误前的文档已经被写入数据库, 错误抛出时及之后的都未被写入数据库.

指定参数 `ordered: false` 即可不按顺序写入数据. 出现错误的文档不会被写入数据库, 其他正常的(不管前后顺序)都会写入数据库.

## _id

ObjectId 为 BSON 定义的一种类型, 由 12 字节的十六进制字符串组成.

1-4 字节: Date
5-7 字节: Mac 地址
8-9 字节: PID
10-12字节: Counter

## 读取



- `db.collection.find({"writers": ["Ethan Coen", "Joel Coen"]})`
  - 会对数据进行严格匹配, 包括每一项的顺序.

- `db.collection.find({ actors: 'Jeff Bridges'})`
  - 匹配数组中 actors 数组包含 'Jeff Bridges' 的文档

- `db.collection.find({ 'actors.0': 'Jeff Bridges'})`
  - 匹配数组中 actors 数组第一个元素为 'Jeff Bridges' 的文档

在 mongod shell 中

- 如果不把 find 的结果 cursor 赋值给一个变量, 那么它会自动迭代 20 次, 读取 20 条数据, 然后通过输入 `it` 来迭代下一个 20 条数据
- 如果将结果 cursor 赋值给一个变量, 则可以通过 cursor 的 `hasNext()` 来判断是否有剩余数据, 通过 `next()` 来获取下一条数据, 通过 cursor 的 `objsLeftInBatch()` 来查看剩余条数.

  ```js
  var c = db.movieDetails.find();
  var doc = () => c.hasNext() ? c.next() : null;
  doc();  // 查看一条数据
  doc();  // 查看另一条数据
  ```

### 基于数组的匹配

- 匹配整个数组
  - `db.movieDetails.find({ "writers": ["Ethan Coen", "Joel Coen"] })`, 完全匹配数组, 包括元素的顺序

- 基于数组中任一元素
  - `db.movieDetails.find({ "actors": "Jeff Bridges"})`; actors 为数组, 如果它有一个元素为 "Jeff Bridges" 那么就匹配成功

- 基于指定元素(如第一个第二个等)
  - `db.movieDetails.find({ "actors.0": "Jeff Bridges"})`; actors 为数组, 如果它第一个元素为 "Jeff Bridges" 那么就匹配成功, 查询中的 `0` 是索引

- 使用 operators 的更复杂的匹配

### Projection 筛选

默认情况下, MongoDB 会返回整个文档的所有字段, 但如果有大部分我们不需要的字段, 我们可以使用 project 去除掉不必要返回的字段, 在 mongo shell 中:

```js
db.movieDetails.find({ rated: 'PG'}, { title: 1, _id: 0});  // 返回 title 字段, 默认情况下会返回 _id 字段, 所以需要指定 _id 为 0 来去除
```

### [查询和映射操作符](https://docs.mongodb.com/manual/reference/operator/query/) (Query and Projection Operators)

- 比较(Comparison)
  - `$eq`: `===`
  - `$gt`: `>`
  - `$gte`: `>=`
  - `$in`: 指定值在数组中
  - `$lt`: `<`
  - `$lte`: `<=`
  - `$ne`: `!==`
  - `$nin`: 指定的值都不在数组中
- 逻辑(Logical)
  - `$and`: `&&`, 用于同一个字段有多个不同条件, 用于不同字段则与不用它一样.
    - `find({ $and: [ {"matacritic": { $ne: null}}, {"metacritic": { $exists: true}}]})`
  - `$not`: `!` 匹配与条件不匹配的文档, 即对条件取反
  - `$nor`: `!(||)` 或非, 对 `$or` 取反, 匹配所有条件为 `false` 的文档,
  - `$or`: `||`
    - `find({$or: [{ "tomato.meter": { $gt: 95}}, { "metacritic": { $gt: 88}}]})`
- 元素(Element)
  - `$exists`: 指定字段存在
    - `find({"tomato.meter": { $exists: true}})`
  - `$type`: 指定字段的类型
    - `find({"_id": { $type: "string"}})`
- 计算(Evaluation)
  - `$expr`
  - `$jsonSchema`
  - `$mod`
  - `$regex`
    - `find({ "awards.text": { $regex: /^Won\s.*/}})`
  - `$text`
  - `$where`
- 地理(Geospatial)
  - `$geoIntersects`
  - `$geoWithin`
  - `$near`
  - `$nearSphere`
- 数组(Array)
  - `$all`: 所有指定元素必须包含在数组中.
    - `find({ genres: { $all: ["Comedy", "Crime", "Drama"]}})`, 如果 genres 为数组, 且包含所有 $all 指定的元素, 则匹配成功.
  - `$elemMatch`: 用于查询数组中嵌套的文档, `$elemMatch` 指定的条件必须在同一个数组项(单个项, 即为数组中嵌套的一个文档)中全部包含 (条件必须在单个数组项中满足)
    - ```js
    boxOffice: [ { "country": "USA", "revenue": 41.3 },
             { "country": "Australia", "revenue": 2.9 },
             { "country": "UK", "revenue": 10.1 },
             { "country": "Germany", "revenue": 4.3 },
             { "country": "France", "revenue": 3.5 } ]
        db.movieDetails.find({ boxOffice: { country: "UK", revenue: { $gt: 15 } } })  // 会将每个条件在不同数组项中进行匹配, 不要求所有条件全部存在于同一个数组项中
        db.movieDetails.find({ boxOffice: { $elemMatch: { country: "UK", revenue: { $gt: 15 } } } } )   // 要求所有条件都在同一个数组项中满足
        ```
  - `$size`: 匹配拥有指定长度数组的文档
- Bitwise
  - `$bitsAllClear`
  - `$bitsAllSet`
  - `$bitsAnyClear`
  - `$bitsAnySet`
- 评论(Comments)
  - `$comment`
- Projection Operators
  - `$`:
  - `$elemMatch`
  - `$meta`
  - `$slice`

### 更新文档 (Update Documents)

使用 `$set` , 它为一个文档, 其中包含键值对, 用于更新文档中对于的字段.

```js
db.movieDetails.updateOne({title: "The  Martian"}, { $set: { poster: "xxxxx"}})
```

```js
db.movieDetails.updateOne({title: "The Martian"}, {
  $push: {
    reviews: {
      $each: [
        {
          rating: 0.5,
          data: ISODate("2016-01-13T07:00:00Z"),
          reviewer: "Shannon B.",
          text: "Enjoyed watching with my kids!"
        }
      ],
      $slice: 5  // 正数为保留前5条, 负数为保留后5条
    }
  }
})
```

```js
db.moiveDetails.updateMany({ rated: null}, { $unset: { rated: "" } });  // 移除该字段, 这里指定空字符串或其它值都可以
```




## The nodejs driver 章

```js
let cursor = db.collection('companies').find(query);
cursor.forEach(
    function(doc) {
        console.log( doc.name + " is a " + doc.category_code + " company." );
    },
    function(err) {  // 遍历结束或者出现错误的时候的时候会执行.
        assert.equal(err, null);
        return db.close();
    }
);
```

上面这种方式, find 会立即创建一个 cursor, 但是并不立即向数据库发出请求, 直到我们需要使用 cursor 提供的数据的时候才会向数据库请求数据(例如调用 forEach 的时候).

如果我们写作下面的形式:

```js
db.collection('companies').find(query).toArray(function(err, docs) {
  // you code here...
}
```

相当于 find 返回了一个 cursor 过后, 在 cursor 上面调用 toArray() 方法. 只是链式写法. 调用 toArray() 的时候数据库就会认为我们需要数据, 并且希望得到一个包含所需数据的数组.

### 排序(sort), 跳过(skip), 限制(limit)

```js
    var cursor = db.collection('companies').find(query);
    cursor.sort({founded_year: -1}); // 单个排序
    cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);  // 多个字段排序, 因为字段有顺序, 所以使用数组

    cursor.skip(nSkip);   // 跳过前 nSkip 条数据
    cursor.limit(nLimit);  // 只返回 nLimit 条数据
```

**注意:** 值的注意的是, 不管代码中以何种顺序调用 sort, skip, limit, mongoDB 都会按照 sort, skip, limit 的顺序来执行.

如果删除多个数据, 可以将他们的 _id 收集到一个数组里面, 使用 `$in` 作为条件, 然后执行 `deleteMany`:

```js
var filter = {"_id": {"$in": markedForRemoval}};  // markedForRemoval 是所有需要删除的元素的 _id

db.collection("companies").deleteMany(filter, function(err, res) {

    console.log(res.result);
    console.log(markedForRemoval.length + " documents removed.");

    return db.close();
});
```

## Schema Design

### Relationships

#### 一对一

比如有一个 Employee 代表员工, 一个 Resume 代表其简历.

每个员工有一份自己的简历, 我们可以把 Resume 作为一个 Employee 的属性放在 Emploee 下面, 也可以把 Employee 放到 Resume 下面, 这取决于我们的到底要如何使用数据:

一种情况: 如果我们经常需要访问 Employee 的数据, 但并不经常使用 Resume 的数据, 而 Resume 的数据又比较大, 我们不希望在使用 Employee 的时候将这部分数据也一起从数据库中取出来放进内存中, 我们最好就把它们分开, 通过外键进行关联.

第二种情况: 考虑它们在项目中哪个是不断增长的, 哪个不怎么增长. 例如我们不经常对 Employee 写入数据, 但经常会更新 Resume, 或者 Resume 的数据太大等因素

第三种情况: 如果希望对 Employee 和 Resume 使用原子操作, 那就把它们放到一起.

#### 一对多

如果较多的情况不算多, 那就可以放到一起. 比如博客的留言就可以作为博客的一个属性放在一起.

如果较多的情况确实比较多, 比如一个城市有 8 千万人, 那么就把它们分开来放. 例如分别用一个 collection city 来存放所有的城市, 一个 collection people 来放所有的人,

#### 多对多

以教师和学生为例, 它们就应该分在放, 因为可能在已经有教师的时候, 还没有对应的学生. 插入学生之前, 需要为其分配教师.

### Benifits Of Embedding

嵌套的主要的两个好处就是:

- 性能
  - 性能主要是读取的性能. 磁盘需要一点时间来查找数据的第一个字节所在的区域, 当找到过后, 从他开始读取数据就比较快了. 所以数据放在一起会比分两个 collection 在读取上面更加快速

## Indexes and Performance

mongodb 3.0 提供插件式的存储引擎(介于mongo server 和 磁盘之间的引擎, 它是 mongo server 与 磁盘通信的接口)
整个流程可以参考 [mongo university 视频](https://university.mongodb.com/course/MongoDB/M101JS/2018_March/chapter/Week_5_Indexes_and_Performance/lesson/5511794cd8ca39285477dfd2/tab/vertical_6cb5df1bc7d1)

现在有两种存储引擎:

- MMAP (默认)
- Wired Tiger (2014年被 mongodb 收购, 该团队也是创建 Berkeley DB等的团队, 还有 SleepyCat 公司的其他产品)

### MMAP

v1 使用 mmap 系统调用, 可以通过 `man mmap` 查看. 它用于控制磁盘和建立磁盘的虚拟内存, 内存分页和映射等.
提供 in place update, 即在所要更新的数据原来在磁盘上的位置进行就地更新(与下面的 wired tiger 进行比较)

### Wired Tiger

- 提供 document level concurrency(MMAP 是 collection level); 如果是对相同的 document 进行写, 那么其中一个写操作就会被解除等待重新尝试, 这个操作对实际的应用程序是透明的.
- 支持压缩: documents 和 indexes . Wired Tiger 会用自己的方式来管理哪些数据会被保留在内存中, 哪些数据会被写入磁盘. 你并不希望压缩后的数据保留在内存中, 因为如果你需要访问的数组在内存中命中, 那你还需要对它进行解压. 但是 wired tiger 就不需要解压, 它在内存中清晰的保存着. 但是在写入磁盘之前, 会对它们进行压缩. 考虑到 mongodb 这种数据库中很多字段名重复, 所以压缩能够节省很多磁盘空间.

不提供 in place update, 每次需要更新数据的时候, 就将之前的数据标记为不再使用, 重新在磁盘上开辟新的空间, 并把数据写到这里. 最后它会回收不再使用的空间.


如果希望使用 Wired Tiger 作为存储引擎, 使用 `-storageEngine` 标记, 后面指定为 `wiredTiger`:

``` sh
mongod -dbpath WT -storageEngine wiredTiger
```