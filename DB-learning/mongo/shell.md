## 创建

- 查看所有数据库列表
  - `show dbs`
- 显示当前的数据集合(mysql 中叫表)
  - `show collections`
- 使用数据库、创建 数据库
  - `use COLLECTION_NAME`
  - 如果真的想把这个数据库创建成功，那么必须插入一个数据。
  - 数据库中不能直接插入数据，只能往集合(collectio ns)中插入数 据。不需要专门创建集合，只需要写点语法插入数据就会创建集合:
    - `db.COLLECTION_NAME.insert({“name”:”x iaom ing”})`
- 删除数据库，删除当前所在的数据库
  - `db.dropDatabase()`
- 删除集合
  - `db.COLLECTION_NAME.drop()`

## 插入数据

- 插入一条数据
  - `db.COLLECTION_NAME.insert({"name":"zhangsan"})`

## 查找数据

- 查询所有记录

  - `db.userInfo.find()`
  - 相当于 `select* from userInfo`

- 查询去掉后的当前聚集集合中的某列的重复数据

  - `db.userInfo.distinct("name")` # 会过滤掉 name 中的相同数据
  - 相当于 `select distict name from userInfo`

- 查询 age = 22 的记录

  - `db.userInfo.find({"age": 22})`
  - 相当于 `select * from userInfo where age = 22`

- 查询 age > 22 的记录

  - `db.userInfo.find({age: {$gt: 22}})`
  - 相当于 `select * from userInfo where age >22`

- 查询 age < 22 的记录

  - `db.userInfo.find({age: {$lt: 22}})`

- 查询 age >= 23 并且 age <= 26

  - `db.userInfo.find({age: {$gte: 23, $lte: 26}})`

- 查询 name 中包含 mongo 的数据, 模糊查询用于搜索

  - `db.userInfo.find({name: /mongo/})`
  - 相当于 `select * from userInfo where name like '%mongo%'`

- 查询 name 中以 mongo 开头的

  - `db.userInfo.find({name: /^mongo/})`
  - 相当于 `select * from userInfo where name like ‘mongo%’`

- 查询指定列 name、age 数据

  - `db.userInfo.find({}, { name: true, age: true})` # true 表示包含该字段， false 就会排除该字段
  - 相当于 `select name, age from userInfo`

- 查询指定列 name、age 数据, age > 25

  - `db.userInfo.find({age: {$gt: 25}}, { name: true, age: true})`
  - 相当于 `select name, age from userInfo where age >25`

- 按照年龄排序 1 升序 -1 降序

  - `db.userInfo.find().sort(1)` # 1 为升序、-1 为降序

- 查询 name = zhangsan, age = 22 的数据

  - `db.userInfo.find({ name: 'zhangsan', age: 22 })`
  - 相当于 `select * from userInfo where name = 'zhangsan' and age = '22'`

- 查询前 5 条数据

  - `db.user.find().limit(5)`
  - 相当于 `selecttop 5 * from userInfo`

- 查询 10 条以后的数据

  - `db.userInfo.find().skip(10)`
  - 相当于 `select * from userInfo where id not in ( selecttop 10 * from userInfo )`

- 查询在 5-10 之间的数据

  - `db.userInfo.find().limit(10).skip(5)` # 可用于分页，`limit` 是 `pageSize`，`skip` 是`第几页 * pageSize`

- or 查询

  - `db.userInfo.find({$or: [{ age: 22 }, { age: 25 }]})`
  - 相当于 `select * from userInfo where age = 22 or age = 25`

- findOne 查询第一条数据

  - `db.userInfo.findOne()`
  - `db.userInfo.find().limit(1)`
  - 相当于 `select top 1 * from userInfo`

- 查询某个结果集的记录条数统计数量
  - `db.userInfo.find({age: {$gte: 25}}).count()`
  - 如果要返回限制之后的记录数量，要使用 `count(true)`或者 `count(非 0)`，如 `db.users.find().skip(10).limit(5).count(true)`
  - 相当于 `select count(*) from userInfo where age >= 20`

## 修改数据

修改里面还有查询条件

- 查找名字叫做小明的，把年龄更改为 16 岁

  - `db.userInfo.update({ name: '小明' }, { $set: { age: 16 } })`
    - 默认情况下 `update()` 方法只更新一条文档，如果要更新多个需要在 update 方法中使用 `multi` 选项
      - `db.userInfo.update({ name: '小明' }, { $set: { age: 16 } }, { multi: true })`

- 完整替换，不出现 `$set` 关键字

  - `db.userInfo.update({ "name": "小明" }, { "name": "大明", "age": 16})`

- 增加计数
  - `db.userInfo.update({name: 'Lisi'}, { $inc: {age: 50}}, false, true)`
  - 相当于 `update userInfo set age = age + 50 where name = 'Lisi'`
  - 可以同时修改多个值 `db.userInfo.update({name: 'Lisi'}, {$inc: {age: 50}, $set: {name: 'hoho'}}, false, true)`

## 删除数据

- `db.userInfo.remove({ "name": "Lisi" })`
  - 默认情况下 `remove()` 会删除所有匹配的文档。使用 `justOne` 指明只希望删除一条数据。
  - `db.userInfo.remove({ "name": "Lisi" }, { justOne: true })`
