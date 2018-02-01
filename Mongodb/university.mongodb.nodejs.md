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

- sort, skip, limit:
  - 不管我们按照什么顺序使用, mongodb 都会按照 sort, skip, limit 的顺序执行, 所以下面的代码也是先 sort, 然后 skip 然后 limit .

  ```js
   var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    cursor.limit(30);
    cursor.skip(10);
    // cursor.sort({founded_year: 1});  // 单个排序 , 1 为增序, -1 为降序
    cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);  // 多个排序
  ```