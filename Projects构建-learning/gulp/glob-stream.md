# [glob-stream](https://github.com/gulpjs/glob-stream)

将 node-glob 封装，使其具有流的特性，即 glob 的流式封装。

## 使用

```javascript
var gs = require('glob-stream');

var stream = gs('./files/**/*.coffee', { /* options */ });

stream.on('data', function(file){
  // file has path, base, and cwd attrs
});
```

你可以传入任何 glob 的组合，你不能仅传入取反的 glob（即带有 `!`的glob模式），至少需要传递一个非反 glob 让它知道从哪儿开始工作。


## API

### globStream(globs, options)

为多个 globs 或者 过滤器(filters) 返回一个流(stream)

#### options

- cwd
  - 默认为 `process.cwd()`
- base
  - Default is everything before a glob starts （参考 [glob-parent](https://github.com/es128/glob-parent)）
- cwdbase
  - 默认为 `false`
  - 当为 `true` 的时候，与 opt.base = opt.cwd 同
- allowEmpty
  - 默认为 `false`
  - 当为 `true` 的时候，匹配单个文件失败的时候不会触发错误
- 任何 through2 相关的参数参考 [through2](https://github.com/rvagg/through2)

该参数直接传递给 node-glob

### Glob

```javascript
var stream = gs(['./**/*.js', '!./node_modules/**/*']);
```

Globs 按顺序执行，所以 带有 `!` 的否定形式模式必须在不带 `!` 的模式（正模式）之后，例如：
```javascript
gulp.src(['!b*.js', '*.js'])
```
不会执行，但是下面的这个会执行：
```javascript
gulp.src(['*.js', '!b*.js'])
```

### 相关
- [globby](https://github.com/sindresorhus/globby) :支持多种模式(multiple patterns)的非流式 `glob` 封装
