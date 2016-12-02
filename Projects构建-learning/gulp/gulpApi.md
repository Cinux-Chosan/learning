# [Gulp APIs](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options)

## gulp.src

### 用法： gulp.src(globs[, options])
- 参数1： `String`或者`Array`，globs可以为某个文件路径 (path) 或者路径数组，支持正则表达式。
- 参数2:  `Object`，optinons包含 (buffer、read、base)
- return: 返回 Vinyl 文件类型流，可通过管道 (pipe) 传递给其他插件
- 示例：
```
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

#### globs

type: `String` or `Array`

Glob 形式或者 glob 形式的数组，Glob使用 node-glob 语法，除了 `!` 形式，其它完全支持。

以 `!` 开头的 glob，从 glob 结果中将会去除那一部分。例如:

文件结构如下：

```
client/
  a.js
  bob.js
  bad.js
```

以下表达式将会匹配到 `a.js`和　`bad.js`

```
gulp.src(['client/*.js', '!client/b*.js', 'client/bad.js'])
```

#### options

type:`Object`

options 将会通过 [glob-stream](https://github.com/gulpjs/glob-stream) 传递给 node-glob

gulp 支持除了`ignore`之外所有的 node-glob options 和 glob-stream options。并且添加了如下options选项：

##### options.buffer

type: `Boolean` default: `true`

如果设置为 `false` 将会将 `file.contents` 以流的形式返回并且没有 buffer 文件。这在使用大文件时很有用。

注意：插件可能不支持流的实现。

##### options.read

type: `Boolean` default:`true`

设置为 `false` 将会将 `file.contents` 以 null 返回并且不会读取文件

##### options.base

type: `String` default: everything before a glob starts (see [glob2base](https://github.com/wearefractal/glob2base))

例如，假如 `somefile.js` 在 `client/js/somedir`中的情况：

```
gulp.src('client/js/**/*.js') // Matches 'client/js/somedir/somefile.js' and resolves `base` to `client/js/`
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/somedir/somefile.js'

gulp.src('client/js/**/*.js', { base: 'client' })
  .pipe(minify())
  .pipe(gulp.dest('build'));  // Writes 'build/js/somedir/somefile.js'
```

### gulp.dest(path[, options])

可以将信息通过管道传输给它，并且它会将信息写入文件。可以多次 pipe 到不同目录，如果目录不存在将会被创建。

```
gulp.src('./client/templates/*.jade')
  .pipe(jade())
  .pipe(gulp.dest('./build/templates'))
  .pipe(minify())
  .pipe(gulp.dest('./build/minified_templates'));
```

上例的写入目录根据当前相对目录加上给定目录来计算。相对目录根据 file base计算，参考 `gulp.src`了解更多


#### path

type: `String` or `Function`

代表写入路径的字符串或者返回写入路径字符串的函数。该函数将会被给予一个[vinyl 文件实例](https://github.com/gulpjs/vinyl)

#### options

type: `Object`

##### options.cwd

type: `String` default: `process.cwd()`

写入目录的`cwd`，只有在写入目录为相对路径的时候有影响

##### options.mode

type: `String` default: `0777`

以八进制的形式规定任何需要被创建的写入目录权限

### gulp.task(name[, deps] [,fn])

使用 [Orchestrator](https://github.com/robrich/orchestrator) 定义任务

```
gulp.task('somename', function() {
  // Do stuff
});
```

#### name

type: `String`

任务名，需要在命令行中运行的任务中不应该有空格

#### deps

type: `Array`

依赖数组，在你的任务开始之前，该数组内的任务将会被执行完成

```
gulp.task('mytask', ['array', 'of', 'task', 'names'], function() {
  // Do stuff
});
```

注意：你的任务是否依赖于其他依赖的完成，确保你的依赖任务能够正确的使用异步模式：接受回调或者返回一个promise或者事件流

如果你只是为了运行一组依赖任务，你可以忽略回调函数：

```
gulp.task('build', ['array', 'of', 'task', 'names']);
```

注意： 任务将会并行运行一次，因此不要假设任务将按顺序完成运行

#### fn

type: `Function`

该函数为该任务任务需要执行的操作，通常如下形式：

```
gulp.task('buildStuff', function() {
  // Do something that "builds stuff"
  var stream = gulp.src(/*some source path*/)
  .pipe(somePlugin())
  .pipe(someOtherPlugin())
  .pipe(gulp.dest(/*some destination*/));

  return stream;
  });
```

#### 异步任务

如果 `fn` 遵循如下规则，则任务可以异步执行：

- 接受回调函数

```
// run a command in a shell
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});

// use an async result in a pipe
gulp.task('somename', function(cb) {
  getFilesAsync(function(err, res) {
    if (err) return cb(err);
    var stream = gulp.src(res)
      .pipe(minify())
      .pipe(gulp.dest('build'))
      .on('end', cb);
  });
});
```

- 返回 stream

```
gulp.task('somename', function() {
  var stream = gulp.src('client/**/*.js').
    .pipe(minify())
    .pipe(gulp.dest('build'));
  return stream;
});
```

- 返回 promise

```
var Q = require('q');

gulp.task('somename', function() {
  var deferred = Q.defer();

  // do async stuff
  setTimeout(function() {
    deferred.resolve();
  }, 1);

  return deferred.promise;
});
```

注意：默认情况下，任务以最大并发数运行。例如，它会立即启动所有任务并且不会等待。如果需要创建一系列按序执行的任务，遵循如下两点：
- give it a hint to tell it when the task is done,
- and give it a hint that a task depends on completion of another.

例如，现在有两个任务"one" 和 "two" 需要按如下顺序执行：
1. 在任务 one 上添加一种提醒来通知任务执行完成。接受一个回调函数并且在完成的时候执行它 或者 返回一个 promise 或者 stream ，它们会等待被 resolve 或者 end
2. 在任务 two 中你添加一个提示告诉程序它依赖于第一个任务完成

所以有如下示例：

```
var gulp = require('gulp');

// takes in a callback so the engine knows when it'll be done
gulp.task('one', function(cb) {
    // do stuff -- async or otherwise
    cb(err); // if err is not null and not undefined, the run will stop, and note that it failed
});

// identifies a dependent task must be complete before this one begins
gulp.task('two', ['one'], function() {
    // task 'one' is done now
});

gulp.task('default', ['one', 'two']);
```

### gulp.watch(glob [, opts], tasks) 或 gulp.watch(glob [, opts, cb])

观察文件，当文件改变的时候执行相应操作。该函数总会返回一个触发 `change`事件的事件触发器

#### gulp.watch(glob[, opts], tasks)

##### glob

type: `String` 或者 `Array`

单个 glob　或者　glob 数组用于表示哪些文件会被观察

##### opts

type: `Object`

options 参数，会被传给 [`gaze`](https://github.com/shama/gaze)

##### tasks

type: `Array`

当文件发生改变的时候需要执行的任务名数组。它们需要被 `gulp.task()`添加过

```
var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

#### gulp.watch(glob[, opts, cb])

##### glob

type: `String` 或者 `Array`

单个 glob　或者　glob 数组用于表示哪些文件会被观察

##### opts

options 参数，会被传给 [`gaze`](https://github.com/shama/gaze)

##### cb(event)

type: `Function`

每个改变发生的时候会被调用的函数

```
gulp.watch('js/**/*.js', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
```

该回调函数会接受一个 `event` 对象作为参数。该 `event` 对象用于描述改变信息

##### event.type

type: `String`

发生改变的事件类型，它们是 `added`、`changed`、`deleted`、`renamed`

##### event.path

type: `String`

触发事件发生的文件的文件路径
