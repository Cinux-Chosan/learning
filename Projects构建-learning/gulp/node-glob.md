# Glob

使用模式匹配文件名，该模块为 JavaScript的 Glob 实现，使用 `minimatch` 库来进行匹配。

## 使用

### 安装
```
npm i glob
```

```
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

```
var Glob = require("glob").Glob
var mg = new Glob(pattern, options, cb)
```

它是一个事件触发器，会立即出发文件系统开始查找匹配的文件

#### new glob.Glob(pattern, [options], [cb])

参数同 glob()

注意：如果在options中设置了 `sync` 标志，则 `matches`(匹配的文件名数组，cb的第二个参数) 立即可以在 `g.found` 成员中获取。

### Properties

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

[Events](https://github.com/isaacs/node-glob#events)
