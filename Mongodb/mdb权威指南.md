# 续

- `$setOnInsert`：在插入的时候才创建，否则不创建

```js
// 更新 name 为 Chosan 的记录的年龄字段。如果该记录不存在则插入，插入时添加 createdAt 字段。如果该字段存在则不会执行插入操作，也不会更新 createdAt 字段
db.user.update({ name: "Chosan" }, { $set: { age: 18 }, $setOnInsert: { createdAt: new Date() } }, true);
```
