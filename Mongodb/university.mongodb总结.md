# MongoDB for Node.js Developers 视频总结

## insertMany()

默认情况下, 传入给 insertMany 的文档按顺序插入, 如果中途出现错误(如`_id`出现重复), 写入操作就会中断, 出现错误前的文档已经被写入数据库, 错误抛出时及之后的都未被写入数据库.

指定参数 `ordered: false` 即可不按顺序写入数据. 出现错误的文档不会被写入数据库, 其他正常的(前后)都会写入数据库.

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
  - `$all`: 包含所有指定元素的数组(条件可以分散在所有数组项中)
    - `find({ genres: { $all: ["Comedy", "Crime", "Drama"]}})`
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