# vinyl-fs

vinyl-fs 是一个用于描述文件的元对象，当谈起一个文件的时候，最先想到的是文件的路径 (path) 和文件的内容 (contents)，它们都是Vinyl对象的主要属性。文件并不一定是本地文件系统的一部分，它可以是S3, FTP, Dropbox, Box, CloudThingly.io 或者其它服务。 Vinyl 可以用于描述所有这些资源上的文件。

## Vinyl Adapter

虽然Vinyl提供了一个简洁的方式来描述一个文件，但是我们还是需要首先能够访问这些文件。每个文件资源都需要一个 Vinyl adapter，它包含 `src(globs)` 和 `dest(folder)` 方法，这两个方法都返回 stream。`src` 流将文件转化成 Vinyl object，`dest` 流将 Vinyl object 转化成文件。Vinyl Adapter 可以暴露出其它特定的接口，如 `vinyl-fs` 提供的 `symlink`方法

## 使用

```
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

参数globs为一个 glob字符串　或者　globs字符串数组，第二个可选参数为配置选项。

返回值： 返回一个 vinyl file object 的 stream

注意： 通过 `.src` 读取文件会将 UTF-8 BOM 去除，否则请禁用该选项。

#### globs

globs 按顺序执行，所以 `!`（negations ，非） 应该在 不带 `!` 的glob 之后，例如：

```
fs.src(['!b*.js', '*.js'])
```
上例不会排除任何文件，会忽略 `!b*.js` ，下例不会：

```
fs.src(['*.js', '!b*.js'])
```

#### options

- 传入的选项必须是正确的值，否则会被忽略
- 所有的选项可以通过传入函数来代替值，函数必须返回正确类型的值，否则会被忽略掉

##### `options.buffer`

是否将文件内容buffer到内存中，设置为 `false` 会将 `file.contents`变回一个暂停的 stream (paused Stream)

type: `Boolean`  default: `true`

##### `options.read`

是否将文件设置为可读。在移除未见的时候会比较有用。设置为 `false` 将会使 `file.contents`变为 `null` 并且禁止通过 `.dest()` 方法将文件内容写入磁盘

type: `Boolean` default:`true`

##### `options.since`

指定在此时间之后被修改的 stream files

type: `Date` or `Number` default: `undefined`

##### `options.stripBOM`

在使用 UTF-8 解码文件的时候，去除 BOM。设置为 `false` 会保留 BOM

type: `Boolean` default: `true`

##### `options.passthrough`

允许 `.src` 在管道之间使用。它接收 objects 并将转化成 glob 的文件添加到流中

type: `Boolean` default: `false`

##### `options.sourcemaps`

对通过流传递的文件启用源映射支持。加载sourcemaps并且解析文件的sourcemaps映射关系，使用 [ gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)

type: `Boolean` default: `false`

##### `options.followSymlinks`

Whether or not to recursively resolve symlinks to their targets. Setting to false to preserve them as symlinks and make file.symlink equal the original symlink's target path.

type: `Boolean` default: `true`

##### `options.dot`

是否允许 glob 匹配点号开头的文件（如 `.gitignore`）

type: `Boolean` default: `false`

##### 其它

任何 glob　相关的参数在　[lob-stream](https://github.com/gulpjs/glob-stream) 和 [node-glob](https://github.com/isaacs/node-glob)中， 任何与 through2 相关的选项在 [through2](https://github.com/rvagg/through2) 中。 Those options are forwarded verbatim.


### `dest(folder[, options])`
https://github.com/gulpjs/vinyl-fs#destfolder-options
