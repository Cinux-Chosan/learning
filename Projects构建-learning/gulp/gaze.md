# [gaze](https://github.com/shama/gaze)

由其它 watch 库最好的部分组成的 glob fs.watch 封装模块

## 使用

安装模块： `npm i gaze`或者通过修改 `package.json`然后运行 `npm i`

```javascript
var gaze = require('gaze');

// Watch all .js files/dirs in process.cwd()
gaze('**/*.js', function(err, watcher) {
  // Files have all started watching
  // watcher === this

  // Get all watched files
  var watched = this.watched();

  // On file changed
  this.on('changed', function(filepath) {
    console.log(filepath + ' was changed');
  });

  // On file added
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  var files = this.relative();
});

// Also accepts an array of patterns
gaze(['stylesheets/*.css', 'images/**/*.png'], function() {
  // Add more patterns later to be watched
  this.add(['js/*.js']);
});
```

### Alternate Interface

```javascript
var Gaze = require('gaze').Gaze;

var gaze = new Gaze('**/*');

// Files have all started watching
gaze.on('ready', function(watcher) { });

// A file has been added/changed/deleted has occurred
gaze.on('all', function(event, filepath) { });
```

### Error

```javascript
gaze('**/*', function(error, watcher) {
  if (error) {
    // Handle error if it occurred while starting up
  }
});

// Or with the alternative interface
var gaze = new Gaze();
gaze.on('error', function(error) {
  // Handle error here
});
gaze.add('**/*');
```

#3# Minimatch / Glob

See [isaacs's minimatch](https://github.com/isaacs/minimatch) for more information on glob patterns.

## 文档

### gaze([patterns, options, callback])

  - `patterns` {String|Array} 匹配文件的 patterns
  - `options` {Object}
  - `callback` {Function}
    - `err` {Error|null}
    - `watcher` {Object} Gaze watcher 实例

### Class: gaze.Gaze

通过实例化 `gaze.Gaze`（gaze模块的Gaze方法）来创建 Gaze 实例
```javascript
var Gaze = require('gaze').Gaze;
var gaze = new Gaze(pattern, options, callback);
```

#### 属性

- `options` 传入的 options 对象
  - `interval` {Integer} 传递到 `fs.watchFile` 的时间间隔
  - `debounceDelay` {Integer} 以毫秒计算的相同文件的连续事件调用的延时
  - `mode` {String} 强制观察模式。默认为 `auto` ，`watch` (force native events)， `poll`  (force stat polling)
  - `cwd` {String} 当前工作目录，默认 `process.cwd()` （The current working directory to base file patterns from. Default is `process.cwd()`）

#### 事件

- `ready(watcher)` When files have been globbed and watching has begun.
- `all(event, filepath)` When an `added`, `changed` or `deleted` event occurs.
- `added(filepath)` When a file has been added to a watch directory.
- `changed(filepath)` When a file has been changed.
- `deleted(filepath)` When a file has been deleted.
- `renamed(newPath, oldPath)` When a file has been renamed.
- `end()` When the watcher is closed and watches have been removed.
- `error(err)` When an error occurs.
- `nomatch` When no files have been matched.

#### 方法

- `emit(event, [...])` `EventEmitter.emit` 的封装。 `added`| `changed`| `deleted` 事件也会触发 `all` 事件。
- `close()` 取消观察所有文件，并且重置 watch 实例
- `add(patterns, callback)` 添加 一个或多个文件进行观察
- `remove(filepath)` 移除某个观察中的文件或目录。目录不会递归
- `watched()` 返回当前观察的文件
- `relative([dir, unixify])` 返回当前已处于观察状态的文件的相对路径
  - `dir` {String} 仅返回文件对于该目录的相对路径
  - `unixify` {Boolean} 如果在Windows上，返回路径使用 `/` 代替 `\\`

## Similar Projects

- [paulmillr's chokidar](https://github.com/paulmillr/chokidar)
- [amasad's sane](https://github.com/amasad/sane)
- [mikeal's watch](https://github.com/mikeal/watch)
- [github's pathwatcher](https://github.com/atom/node-pathwatcher)
- [bevry's watchr](https://github.com/bevry/watchr)

## [Contributing](https://github.com/shama/gaze#contributing)

## [Release History](https://github.com/shama/gaze#release-history)

## [License](https://github.com/shama/gaze#license)
