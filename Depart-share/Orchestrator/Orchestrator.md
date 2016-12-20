# Orchestrator 使用简介

一个以最大并发执行任务和依赖的模块。

## 使用

- 获取引用
```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
```

- 添加任务
```javascript
orchestrator.add('thing1', function(){
  // do stuff
});
orchestrator.add('thing2', function(){
  // do stuff
});
```

- 启动任务
```javascript
orchestrator.start('thing1', 'thing2', function (err) {
  // all done
});
```

## APIs

`orchestrator.add(name[, deps][, function])`

- 参数1: 任务名 type `String`
- 参数2: 任务依赖 type `Array`
- 参数3：任务主体函数  `Function`
