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
https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpdestpath-options
