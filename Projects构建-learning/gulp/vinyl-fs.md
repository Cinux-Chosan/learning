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

是否将文件设置为可读。在移除文件的时候会比较有用。设置为 `false` 将会使 `file.contents`变为 `null` 并且禁止通过 `.dest()` 方法将文件内容写入磁盘

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

第一个参数为文件夹路径的字符串或者返回该类型的函数，第二个参数为可选项对象。如果第一个参数为一个对象，它将会在每个 Vinyl file object上调用，并且必须返回一个文件夹路径。

返回一个接受 vinyl file object 的 stream，将它们写入 folder/cwd 指定的磁盘目录，并将它们传入下游，即可以继续 pipe

Once the file is written to disk, an attempt is made to determine if the `stat.mode`, `stat.mtime` and `stat.atime` of the [vinyl](https://github.com/wearefractal/vinyl) `File` object differ from the file on the filesystem. If they differ and the running process owns the file, the corresponding filesystem metadata is updated. If they don't differ or the process doesn't own the file, the attempt is skipped silently. This functionality is disabled on Windows operating systems or any other OS that doesn't support `process.getuid` or `process.geteuid` in node. This is due to Windows having very unexpected results through usage of `fs.fchmod` and `fs.futimes`.

如果文件有一个 `symlink` 属性指定了一个目标路径，则会创建 `symlink`

注意： 文件在写入该流过后会被改变
  - `cwd`、`base`和 `path` 将会被覆盖
  - `stat` 会被更新
  - `contents` 如果是个 stream，则它的位置将会被重置为开始状态。（contents will have it's position reset to the beginning if it is a stream.）

#### Options

  - 传入Options的值必须为正确类型，否则会被忽略。
  - 所有的值都可以通过传入能够返回该值的函数代替。函数接受该 vinyl file object 作为它的唯一参数被调用。

##### `options.cwd`

目录相关的当前工作目录

type: `String` default: `process.cwd()`

##### `options.mode`

文件被创建时候的权限

type: `Number` default: 如果输入的文件有 `mode` ，则使用该文件的 `mode`（`file.stat.mode`），如果没有，则使用进程的 `mode`

##### `options.dirMode`

目录被创建时候的权限

type: `Number` default: 进程的 `mode`

##### `options.overwrite`

当文件已经存在时，是否覆盖该文件。该属性也可以是一个返回 `true` 或者 `false` 的函数

type: `Boolean` 或者 `Function` default: `true`(总是覆盖已存在的文件)

##### `options.sourcemaps`

是否允许通过 stream 传递的文件支持 sourcemap。如果设置为 `true` 则生成内联 sourcemap，如果指定一个字符串则使用该字符串作为文件路径，该引擎使用 [gulp-sourcemaps](https://github.com/floridoo/gulp-sourcemaps)

示例：
```
// Write as inline comments
vfs.dest('./', {
  sourcemaps: true
});

// Write as files in the same folder
vfs.dest('./', {
  sourcemaps: '.'
});

// Any other options are passed through to [gulp-sourcemaps]
vfs.dest('./', {
  sourcemaps: {
    path: '.',
    addComment: false,
    includeContent: false
  }
});
```

type: `Boolean`，`String` or `Object` default: `undefined`（无 sourcemaps）

###### other

Any through2-related options are documented in [through2](https://github.com/rvagg/through2). Those options are forwarded verbatim.

### symlink(folder[, options])

第一个参数为文件夹路径的字符串或者返回该类型的函数，第二个参数为可选项对象。如果第一个参数为一个对象，它将会在每个 Vinyl file object上调用，并且必须返回一个文件夹路径。（同dest）

返回一个接受 vinyl file object 的 stream，在指定的 folder/cwd 创建一个符号链接，并将它们传入下游，即可以继续 pipe

注意： 文件在写入该流过后会被改变
  - `cwd`、`base` 和 `path` 将会被覆盖

#### Options

  - 传入的选项必须是正确的类型，否则会被忽略
  - 所有值可以使用返回该类型的值的函数代替。函数会接受该 vinyl file object 作为它的唯一参数被调用。

##### `options.cwd`

文件夹相对的工作目录（The working directory the folder is relative to.）

type: `String` default: `process.cwd()`

#### `options.dirMode`

目录被创建时候的权限

type: `Number` default: 进程的权限

#### `options.relative`

Whether or not the symlink should be relative or absolute.

type: `Boolean` default: `false`

#### `other`

Any through2-related options are documented in [through2](https://github.com/rvagg/through2). Those options are forwarded verbatim.
