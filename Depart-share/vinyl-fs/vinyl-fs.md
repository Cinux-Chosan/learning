# vinyl-fs

vinyl是文件描述对象, vinyl-fs 是 vinyl 的文件系统适配器

vinyl只是提供了一个简介的方式来描述一个文件, 但是无法对文件进行操作, 所以我们需要用到文件适配器 vinyl-fs

## 使用

```javascript
var map = require('map-stream');
var vfs = require('vinyl-fs');

var log = function(file, cb) {
  console.log(file.path);
  cb(null, file);
};

vfs.src(['./js/**/*.js', '!./js/vendor/*.js'])
  .pipe(map(log))
  .pipe(vfs.dest('./output'));
```

## API

### `src(globs[, options])`
- 参数1: type:`String`or`Array` 即glob字符串或者glob字符串数组
- 参数2: type:`Object` 配置项, 参考 [src options](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/vinyl-fs.md#options)
  - `options.buffer`:
- 返回值: `Stream` vinyl file object 的 stream

**注意：** `.src` 方法会去除 UTF-8 的 BOM, 可禁用该行为

### `dest(folder[, options])`

- 参数1: type:`String`or`Function` 文件存放目录(该目录受 cwd 影响)
- 参数2: type:`Object` 参考 [dest options](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/vinyl-fs.md#options-1)


### `symlink(folder[, options])`

将匹配的文件以软连接的方式放入 folder

- 参数2: 参考[symlink options](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/vinyl-fs.md#options-2)
