## 查询

```js
// 查询数组 comments 中包含 { text: 'Hello, Chosan. Nice to see you!' } 的文档
// 也可能是直接是 { comments: { text: 'Hello, Chosan. Nice to see you!' }} 的文档
db.user.find({ "comments.text": "Hello, Chosan. Nice to see you!" });
```

## 修改器

- `$set`：修改字段值：`{ "$set": { name: "Chosan"} }`

- `$unset`：删除某个字段：`{ "$unset": { "name": 1 } }`

- `$inc`：增加或减少某个字段的计数（如果没有该字段则会创建一个）：`{ "$inc": { "age": 10, "weight": -3 } }`

### 数组修改器

- `$push`：向数组中添加数据（如果没有改字段则创建一个数组）：`{ "$push": { "comments": { "text": "你好, Chosan!" } } }`

- `$each`：配合 `$push` 一起使用，一次性向数组中添加多个值：`{ $push: { comments: { $each: [{ text: "这是第一条"}, { text: "这是第二条"}] }}}`，如果不使用 `$each`： `{ $push: { comments: { [{ text: "这是第一条"}, { text: "这是第二条"}] }}` 则会像 JavaScript 的 push 一样，会将整个数组作为一项插入。

- `$slice`：配合 `$push` 和 `$each` 一起使用（必须要配合 `$each`），可以限制数组最大长度：`{ $push: { comments: { $each: [{ text: "这是一条评论" }], $slice: -3 }}}`，只保留 3 条数据，

- `$sort`：配合 `$push` 和 `$each` 一起使用（必须要配合 `$each`），可以对数组进行排序，加上 `$slice` 可以先排序然后再截取数组，保留截取后的项。

- `$addToSet`：将数组当做集合，但不会插入重复的数据。如果数组中已经存在该记录，则不会插入。（避免重复插入数据）

```js
db.user.update({ name: "chosan" }, { $addToSet: { emails: "xyz@163.com" } }); // 如果 emails 数组中已经存在 xyz@163.com 则不会插入
db.user.update({ name: "post" }, { $addToSet: { comments: { text: "这是一条评论" } } }); // 如果 comments 数组中已经有一模一样的 { text: '这是一条评论' } 则不会插入，字段也要一样
```

- `$pop`：从数组前后删除元素，字段 1 表示从后面删除（类似于 JavaScript 数组的 pop）， -1 表示从前面删除（类似于 JavaScript 数组的 unshift）

```js
db.user.update({ name: "chosan" }, { $pop: { faverates: 1 } });
```

- `$pull`：从数组中删除指定项，所有匹配的项都会被删除

```js
db.user.update({ name: "chosan" }, { $pull: { faverates: "eating" } });
```

- 基于数组下标的修改：数组下标从 0 开始，因此可以使用 `db.user.update({ "name": "chosan" }, { $set: { "comments.1.text": "How are you!" }})`

- 基于查询结果的下标修改：很多情况下不查询文档根本不知道要对第几个元素进行修改，因此可以使用定位操作符 `$`，用来定位查询文档已经匹配的数组元素。但 `$` 只匹配第一项

```js
db.user.update({ "comments.text": "How are you!" }, { $set: { "comments.$.text": "chosan" } }); // 修改 comments 数组中 text 为 "How are you!" 的元素的 text 值
```

- `$setOnInsert`：在插入的时候才创建，否则不创建

```js
// 更新 name 为 Chosan 的记录的年龄字段。如果该记录不存在则插入，插入时添加 createdAt 字段。如果该字段存在则不会执行插入操作，也不会更新 createdAt 字段
db.user.update({ name: "Chosan" }, { $set: { age: 18 }, $setOnInsert: { createdAt: new Date() } }, true);
```

## 查询

### 比较

- `$gt`
- `$lt`
- `$gte`
- `$lte`
- `$ne`

### 条件

- `$in`：查询一个键的多个值，相当于是对单个键进行 `$or`

```js
db.users.find({"user_id" : {"$in" : [12345, "joe"]})
```

- `$or`：查询多个键的给定值

```js
db.raffle.find({ $or: [{ ticket_no: 725 }, { winner: true }] });
```

- `$nin`：与 `$in` 相反，查询不满足给定数组中的文档
- `$not`：对查询条件取反

```js
db.users.find({ id_num: { $mod: [5, 1] } }); // 返回"id_num"值为1、6、11、16等的用户
db.users.find({ id_num: { $not: { $mod: [5, 1] } } }); // 返回"id_num"为2、3、4、5、7、8、9、10、12等的用户
```

- `$exists`：判断某个字段是否存在。如 `null` 既可以匹配 `null` 本身，还会匹配字段不存在的情况，因此如果要查找某个值为 null 的文档，则需要配合 `$exists` 来使用。

```js
db.user.find({ info: { $in: [null], $exsists: true } });
```

### 数组查询