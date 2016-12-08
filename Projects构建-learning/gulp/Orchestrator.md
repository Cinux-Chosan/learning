# [Orchestrator](https://github.com/robrich/orchestrator)

一个以最大并发执行任务和依赖的模块。

## 使用

- 获取引用：
```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();
```
- 添加要做的事情：
```javascript
orchestrator.add('thing1', function(){
  // do stuff
});
orchestrator.add('thing2', function(){
  // do stuff
});
```
- 运行任务：
```javascript
orchestrator.start('thing1', 'thing2', function (err) {
  // all done
});
```

## API

### `orchestrator.add(name[, deps][, function])`

定义任务

```javascript
orchestrator.add('thing1', function(){
  // do stuff
});
```

#### `name`

任务名

type: `String`

#### `deps`

任务依赖项，即数组内的任务会在运行该函数定义的任务之前运行完成

type: `Array`

```javascript
orchestrator.add('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

Note: Are your tasks running before the dependencies are complete? Make sure your dependency tasks are correctly using the async run hints: take in a callback or return a promise or event stream.

#### `fn`

任务执行的函数主体。对于异步任务，需要在任务完成的时候给出提示：
  - 接收 callback
  - 返回 stream 或者 promise

##### 示例：
###### 接收 callback

```javascript
orchestrator.add('thing2', function(callback){
  // do stuff
  callback(err);
});
```

###### 返回 promise

```javascript
var Q = require('q');

orchestrator.add('thing3', function(){
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function () {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

###### 返回 stream (当流结束的时候任务被标记为完成)

```javascript
var map = require('map-stream');

orchestrator.add('thing4', function(){
  var stream = map(function (args, cb) {
    cb(null, args);
  });
  // do stream stuff
  return stream;
});
```

**注意**：默认情况下任务最大并行化执行，所有任务会被立即开启。如果需要一系列任务按顺序执行，需要做以下两件事情：
  - 当任务完成时候给出提示
  -

例如：你有任务 `one` 和 任务 `two` 需要按顺序执行：

  1、 在任务 `one` 中添加一个任务完成的提示，接收回调函数并在任务完成的时候调用它 或者 返回一个程序会等待resolve的 promise  或返回一个程序会等待结束的 stream 。

  2、 在任务 `two` 中添加一个提示告诉程序任务 `two` 需要依赖任务 `one` 执行完成。

代码：

```javascript
var Orchestrator = require('orchestrator');
var orchestrator = new Orchestrator();

// takes in a callback so the engine knows when it'll be done
orchestrator.add('one', function (cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null or undefined, the orchestration will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
orchestrator.add('two', ['one'], function () {
    // task 'one' is done now
});

orchestrator.start('one', 'two');
```

### orchestrator.hasTask(name);

判定是否定义过该 name 的任务

#### name

type: `String`

需要查询的任务名

### orchestrator.start(tasks...[, cb]);

开始运行任务

#### tasks

type: `String` 或者 `String` 的 `Array`

需要执行的任务或者任务数组，可以传入任意数目的任务

#### cb

type: `Function`

形式： `function(err){...}`

运行完成过后的回调函数

接收一个参数 `err` 用于判断是否成功执行

**注意**：
- 任务同时执行，可能不是按顺序完成
- Orchestrator模块使用 `sequencify` 在运行前解析依赖，因此可能不会按顺序开始执行。监听 Orchestration evnets 来观察任务运行。

```javascript
orchestrator.start('thing1', 'thing2', 'thing3', 'thing4', function (err) {
  // all done
});
```
```javascript
orchestrator.start(['thing1','thing2'], ['thing3','thing4']);
```

FRAGILE: Orchestrator catches exceptions on sync runs to pass to your callback but doesn't hook to process.uncaughtException so it can't pass those exceptions to your callback

FRAGILE: Orchestrator 会确保每个任务和依赖在一个运行事件中只运行一次，即便是指定了多次也是如此（例如 `orchestrator.start('thing1', 'thing1')`只会执行一次 "thing1"）。如果需要执行多次，等待 orchestration结束、回调开始执行的时候，在回调函数中再次调用 start（例如： `orchestrator.start('thing1', function () {orchestrator.start('thing1');})`）， 或者再创建一个 orchestrator 实例。

### orchestrator.stop()

停止程序当前正在运行的 orchestrator

**注意**： 它会使用 `err` 作为参数调用 `start()` 的 callback 来提示 orchestration 停止。

### orchestrator.on(event, cb)

监听 orchestrator 内部

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

## [证书](https://github.com/robrich/orchestrator#license)
