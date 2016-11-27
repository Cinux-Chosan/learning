# [Gulp getting started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)

## 安装

```
npm i -g gulp-cli
```
## 初始化目录

```
npm init
```

## 本地安装gulp

```
npm i -dev gulp
```

## 在根目录创建 gulpfile.js

```
var gulp = require('gulp');

gulp.task('default', function() {
  // place code for your default task here
});
```

## 运行 gulp

```
gulp
```

## 说明
- 本例运行 default 任务
- 运行特定的任务，执行 gulp <task> <othertask>
