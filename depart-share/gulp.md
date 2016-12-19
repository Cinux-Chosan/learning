# Gulp

## 特性

- 易于使用
  - 通过代码优于配置的策略，Gulp 让简单的任务简单，复杂的任务可管理。
- 构建快速
  - 利用 Node.js 流的威力，你可以快速构建项目并减少频繁的 IO 操作。
- 插件高质
  - Gulp 严格的插件指南确保插件如你期望的那样简洁高质得工作。
- 易于学习
  - 通过最少的 API，掌握 Gulp 毫不费力，构建工作尽在掌握:如同一系列流管道。

## 入门指南

- 全局安装 gulp (*为了运行 gulp 命令*)
```
npm i -g gulp
```

- 作为依赖安装 (*为了引入依赖*)
```
npm i --save-dev gulp
```

- 创建 `gulpfile.js` (*gulp命令会自动搜索该文件*)
```
const gulp = require('gulp');
gulp.task('default', () => {
  // TODO
});
```

- 运行 gulp 命令
```
gulp
```

## Gulp APIs

### gulp.src(globs[, options])

- 参数1: type: `String` or `Array`, [`glob`](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/node-glob.md) 为文件模式匹配的一种实现方式
- 参数2: type: `Object`，配置项
  - `options.buffer`: type: `Boolean` default: `true` 以流形式返回数据，不缓存文件，对大文件较有用
  - `options.read`: type: `Boolean` default: `true` 设置为 `false` 将无法得到文件数据
  - `options.base`: type: `String` default: glob starts (\*\*)  之前的所有字符
- 返回值: [Vinyl](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/vinyl.md) 文件流，可通过 pipe 传递给下游。

```javascript
gulp.src('client/templates/*.jade')
  .pipe(jade())
  .pipe(minify())
  .pipe(gulp.dest('build/minified_templates'));
```

### gulp.dest(path[, options])

- 参数1:type:`String` or `Function`，Function 需要能够返回正确的路径名
- 参数2:type:`Object` 配置项
  - `options.cwd`:type:`String` default:`process.cwd()` 当前工作目录
  - `options.mode`:type:`String` default:`0777` 文件创建的权限

### gulp.task(name[, deps] [, fn])

自定义任务，gulp 定义任务使用 [`Orchestrator`](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/Orchestrator.md) 模块
- 参数1:type:`String`  任务名
- 参数2:type:`Array`  任务依赖
- 参数3:type:`Function`  该任务执行的操作

```javascript
gulp.task('somename', function() {
  // Do stuff
});
```

### gulp.watch(glob[, opts] tasks) or gulp.watch(glob[, opts, cb])

当文件发生变化的时候，执行相应的任务
- glob: `String` or `Array`
- opts: `Object`，被直接传递给 [`gaze`](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/gaze.md)
- tasks: `Array`
- cb(event): `Function`
  - `event.type`: 事件类型，为 `added`、`changed`、`deleted`、`renamed`
  - `event.path`: 触发事件的文件路径


## 进阶用法
