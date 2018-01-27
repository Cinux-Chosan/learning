- find() 返回一个 cursor
  - cursor.toArray 获取全部数据
    ``` js
    db.find().toArray((err, docs) => {
      assert.equal(err, null);
      // 处理 docs
    })
    ```
  - forEach 处理单个数据, 每次处理完成才会去向 mongodb 发起请求获取下一条数据
    ```js
      let cursor = db.find();
      cursor.forEach(doc => {
        // 处理单条数据
      }, err => {
        return db.close();
      })
    ```