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
