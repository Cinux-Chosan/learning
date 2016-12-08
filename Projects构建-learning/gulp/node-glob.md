# Glob

使用模式匹配文件名，该模块为 JavaScript的 Glob 实现，使用 `minimatch` 库来进行匹配。

## 使用

### 安装
```
npm i glob
```

```javascript
var glob = require("glob")

// options is optional
glob("**/*.js", options, function (er, files) {
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
})
```

### Glob 入门

"Glob" 是一种模式，正如在命令行中输入类似于  `ls *.js` 这样的命令，或者在 .gitignore 文件中的内容。

在将 path 解析成模式之前，大括号里面的部分会被扩展进一个集合，使用 `,` 分隔，其中支持 `/`符号，所以 `a{/b/c, bcd}`能扩展为 `a/b/c` 和 `abcd`

以下字符有特殊含义(magic pattern)：
- `*` 匹配0个 或 0个以上字符
- `?` 匹配一个字符
- `[...]` 匹配某个范围内的字符，如果第一个字符是 `!`或者　`^` 则匹配任何不在该范围内的字符
- `!(pattern|pattern|pattern)` 匹配不存在其中的元素
- `?(pattern|pattern|pattern)` 匹配 0个或 1个其中的pattern
- `+(pattern|pattern|pattern)` 匹配 1个或 更多
- `*(a|b|c)` 匹配 0个或 更多
- `@(pattern|pat*|pat?erN)` 完全匹配其中某个模式
- `**` 递归查询文件，它匹配 0个或 多个目录或者子目录，不会查询软连接目录进行匹配

#### 点号 (Dot)
如果文件或者目录的第一个字符为 `.` ，则除非模式中第一个字符也为 `.`，否则该文件或目录不会与任何模式匹配

例如，模式 `a/.*/c` 可以匹配文件 `a/.b/c`，但是模式 `a/*/c` 不能与之匹配，因为 `*` 不能以 `.` 开始

如果需要将 `.` 作为常规字符看待，可以通过在option中设置 `dot:true`

#### 相对路径根节点匹配 (Basename Matching)

如果在option中设置 `matchBase:true` 并且模式中没有斜线 `/`，则会搜索该目录树下面的任何地方的任何文件进行匹配，例如 `*.js` 会匹配 `test/simple/basic.js`

#### 空集合 (Empty Sets)

如果没有匹配的文件，则返回空数组，这与 shell 的表现不同，shell 直接返回匹配模式 (pattern)。

如果需要表现得跟 bash 一样，则需要在 options 中设置 `nonull:true`


#### glob.hasMagic(pattern, [options])

如果pattern中有上述通配符则返回 `true`，否则返回 `false`

注意：此返回结果受 options 参数影响。 如果设置了 `noext:true`，则 `+(a|b)` 不会被当做通配模式字符(magic pattern)。  如果模式中有 `{` `}` ，如 `a/{b/c,x/y}` ，则不会被当做通配模式字符，除非 设置了 `nobrace:true`

#### glob(pattern, [options], cb)

异步方式查找匹配的文件名

- `pattern` 为 `String` 类型，用于匹配文件
- `options` 为 `Object`
- `cb` 为 `Function`，回调函数，当发生错误的时候或者文件匹配完成时会被调用
    - `err` 为 `{Error | null}`
    - `matches` 为 `{Array<String>}`，与模式匹配成功的文件名集合

#### glob.sync(pattern, [options])

同步方式查找文件

参数与 glob() 同

#### Class: glob.Glob

通过实例化 glob.Glob 类来创建 Glob 对象

```javascript
var Glob = require("glob").Glob
var mg = new Glob(pattern, options, cb)
```

它是一个事件触发器，会立即出发文件系统开始查找匹配的文件

#### new glob.Glob(pattern, [options], [cb])

参数同 glob()

注意：如果在options中设置了 `sync` 标志，则 `matches`(匹配的文件名数组，cb的第二个参数) 立即可以在 `g.found` 成员中获取。

### 属性成员

- `minimatch` glob 使用的 minimatch 对象
- `options` 传入的 options
- `aborted` 当调用 `abort()` 方法的时候该属性会被设置为 `true`。当 abort 之后没有方法可以让 glob 继续执行搜索匹配，但是你可以重复使用 statCache 属性来避免多次系统调用。
- `cache` Convenience object。每个字段有如下可能的值：
  - `false` 路径不存在
  - `true` 路径存在
  - `FILE` 路径存在，并且它不是一个文件夹
  - `DIR` 路径存在，并且它是一个文件夹
  - `[file, entries, ...]` 路径存在，并且是一个文件夹，数组的值为 `fs.readdir` 的返回值
- `statCache` `fs.stat` 结果的缓存，用于防止同一路径多次调用
- `symlinks` 与 `**` 模式相关，用于记录哪些路径是软连接
- `realpathCache` 传入 `fs.realpath` 的包含可选项的对象，用于最小化不必要的系统调用。它被存放在实例化过后的 Glob 对象上，可能被多次重复使用。

### 事件

- `end` 当匹配完成会出发该事件，如果设置了 `nonull`，则 `matches` 包含了原始模式， matches 为已序数组，除非设置了 `nosrot`
- `watch` 每当匹配一个文件，就会触发该事件。
- `error` 发生错误的时候会触发该事件，或者当设置了 `options.strict`并且发生文件系统错误的时候也会被触发
- `abort` 当调用`abort()` 的时候触发

### 方法

- `pause` 暂时停止搜索
- `resume` 重启搜索
- `abort` 永远停止搜索

### 可选项参数

所有可以传入 Minimatch 的参数都可以传入 Glob 来改变模式的匹配行为

所有选项默认都为 `false`除非另有说明

所有选项都被加入到 Glob 对象上

如果你正在运行多个 `glob` 操作，你可以传入一个 Glob 对象作为 `options` 参数给随后的操作来作为 `stat` 和 `readdir` 调用的捷径(to shortcut some `stat` and `readdir` calls)，至少你可以传入共享的 `symlinks`、`statCache`、`realpathCache`和 `cache`选项，因此并行的 glob　操作将会因为共享文件系统信息而得到加速。

- `cwd` 当前搜索目录，默认为 `process.cwd()`
- `root` 模式以 `/` 开始挂载的目录。默认为 `path.resolve(options.cwd(), "/")` 在Unix系 统上是`/`，在Windows上为 `C:\`
- `dot` 在正常的匹配中和 `**` 匹配中包含 `.dot`文件。注意，模式中的 `.` 会匹配带点的文件
- `nomount`默认情况下，以正斜线开始的模式会被挂在到根上，以便返回有效的文件系统路径，设置该选项可以禁用此行为
- `mark` 为匹配的文件夹添加一个 `/` 字符，注意此操作需要额外的 stat 调用
- `nosort` 对结果不排序，默认会排序
- `stat` 如果设置为 `true`则会统计所有结果，某种程度上会降低性能，而且不必要， 除非 `readdir` 可能返回不可信的文件描述符
- `silent` 当读取目录遇到异常错误的时候，警告信息会被输出到 stderr，将该选项设置为 `true` 将不会输出警告
- `strict` 当读取目录遇到异常错误的时候，进程会继续搜索和匹配，如果将该属性设为 `true` 将在遇到错误的时候抛出错误
- `cache` 参考上面的 ceche 属性，传入之前声称的 cache 对象可以节省文件系统调用
- `statCache` 该属性为文件系统结果的缓存，用于避免不必要的系统调用。虽然通常不需要设置它，如果你知道在不同的调用期间文件系统不会改变，那么你可以将一个来自 glob() 调用返回的 statCache 传入另一个的 options 参数内。
- `symlinks` 缓存已知的软连接。当解析 `**`匹配的时候，你可以传入一个在此之前生成的 `symlinks` 对象来减少 `lstat`调用
- `sync` *已废弃* 使用`glob.sync(pattern, options)`代替
- `nounique` 在某种情况下， `{ }`模式会导致某些文件在结果集中出现多次。默认情况下该种实现会阻止结果集中出现多次。将该属性设置为 `true` 会禁用去重
- `nonull`  设置该选项来禁止返回空集合，如果没有匹配的文件将会返回模式本身的集合
- `debug` 在minimatch 和 glob 中开启调试 logging
- `nobrace` 不扩展大括号集模式，如 `{a,b}`或者 `{1..3}`不会扩展
- `noglobstar` 禁用 `**`，将它看做常规的 `*`
- `noext` 不匹配 `extglob` 模式，即 `+(a|b)`
- `nocase` 设置匹配不区分大小写。注意（Note: on case-insensitive filesystems, non-magic patterns will match by default, since stat and readdir will not raise errors.）
- `matchBase` 如果模式不包含任何斜线字符，则只匹配文件名，也就是说 `*.js`等同于 `**/*.js`，匹配根目录下所有以 `.js`结尾的文件。
- `nodir` 不匹配文件夹，仅匹配文件。（提示：如果仅匹配目录，可以在模式尾部加上`/`）
- `ignore` 添加一个模式或者glob 模式数组来执行匹配。注意： `ignore` 参数总会使用 `dot:true` 模式
- `follow` 当使用 `**`的时候也会采用软连接目录。注意：该选项会导致重复引用
- `realpath` 设置为 `true` 的时候会在所有结果上调用 `fs.realpath`。 在无法解析软连接的情况下，将会返回匹配的完整的绝对路径（尽管它通常是一个断开的软连接）
- `absolute` 如果该项设置为`true`将总是返回匹配文件的绝对路径。与`realpath`不同的是，该选项会影响 `match` 的返回值

### [Comparisons to other fnmatch/glob implementations](https://github.com/isaacs/node-glob#comparisons-to-other-fnmatchglob-implementations)

该部分同 minimatch 的相同部分

### 在Windows上的差异

请仅在 glob 表达式中使用正斜线 `/`

尽管Windows使用 `/` 或者 `\` 作为路径分隔符，但是在 glob表达式中仅使用　`/` 。反斜线`\`将始终被当做转义字符而非路径分隔符。

从模式匹配的绝对路径的结果会使用 `path.join`挂载到根目录上，如 `/foo/*`。但是在Windows上，默认情况下 `/foo/*` 会匹配到 `C:\foo\bar.txt`

### Race Conditions

由于其本质，Glob 搜索依赖于目录的遍历，所以在文件变动非常快的时候会有一定影响。当 Glob 搜寻并返回结果的时候，文件存在，但是在这之后可能文件已被迅速删除或者改变，并且为了减少系统开销，缓存了文件的状态和 readdir 调用的结果等，这些都可能在文件会经常发生迅速变化的场景造成影响，但是在大部分情况下不会有问题。
