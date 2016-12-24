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

### `orchestrator.add(name[, deps][, function])`

- 参数1: 任务名 type `String`
- 参数2: 任务依赖 type `Array`
- 参数3：任务主体函数  `Function`

如果该任务需要依赖其他任务的完成，则操作函数需要遵循：
- 接受回调函数并在最后调用该回调函数
- 返回 promise
- 返回 stream

### `orchestrator.hasTask(name);`

该方法用于判断是否已经添加某个任务

- 参数1: 任务名 type `String`

### `orchestrator.start(tasks...[, cb]);`

启动任务

- 参数1: 可以为 `String`、多个`String`或者`String`的`Array`
- 参数2: 任务执行完成过后的回调函数 type `Function`，该参数接收一个 `err` 作为参数

```javascript
orchestrator.start('thing1', 'thing2', 'thing3', 'thing4', function (err) {
  // all done
});
```
```javascript
orchestrator.start(['thing1','thing2'], ['thing3','thing4']);
```

### `orchestrator.stop()`

停止程序当前正在运行的 orchestrator, 它会使用 err 作为参数调用 start() 的 callback 来提示 orchestration 停止。

### `orchestrator.on(event, cb)`

#### evnet

type: `String`

需要监听的事件名:

  - `start`: from `start()` method, shows you the task sequence
  - `stop`: from `stop()` method, the queue finished successfully
  - `err`: from `stop()` method, the queue was aborted due to a task error
  - `task_start`: from `_runTask()` method, task was started
  - `task_stop`: from `_runTask()` method, task completed successfully
  - `task_err`: from `_runTask()` method, task errored
  - `task_not_found`: from `start()` method, you're trying to start a task that doesn't exist
  - `task_recursion`: from `start()` method, there are recursive dependencies in your task list

#### cb

type: `Function`

形式： `function(event){...}`

接受一个参数 event，描述事件细节

```javascript
orchestrator.on('task_start', function (e) {
  // e.message is the log message
  // e.task is the task name if the message applies to a task else `undefined`
  // e.err is the error if event is 'err' else `undefined`
});
// for task_end and task_err:
orchestrator.on('task_stop', function (e) {
  // e is the same object from task_start
  // e.message is updated to show how the task ended
  // e.duration is the task run duration (in seconds)
});
```

**注意**： *stop 或者 *err 只会同时出发一个

### orchestrator.onAll(cb)

#### cb

type: `Function`

形式: `function(event){...}`

接受一个参数 event，描述事件细节

```javascript
orchestrator.onAll(function (e) {
  // e is the original event args
  // e.src is event name
});
```
