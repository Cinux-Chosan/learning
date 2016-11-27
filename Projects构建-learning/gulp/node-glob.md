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

以下字符有特殊含义：
- `*` 匹配0个 或 0个以上字符
- `?` 匹配一个字符
- `[...]` 匹配某个范围内的字符，如果第一个字符是 `!`或者　`^` 则匹配任何不在该范围内的字符
- `!(pattern|pattern|pattern)` 匹配不存在其中的元素
- `?(pattern|pattern|pattern)` 匹配 0个或 1个其中的pattern
- `+(pattern|pattern|pattern)` 匹配 1个或 更多
- `*(a|b|c)` 匹配 0个或 更多
- `@(pattern|pat*|pat?erN)` 完全匹配其中某个模式
- `**` 如果 "globstar" 是路径的一部分，它匹配 0个或 多个目录或者子目录，不会查询软连接目录进行匹配

#### 点号 (Dot)
如果文件或者目录的第一个字符为 `.` ，则除非模式中第一个字符也为 `.`，否则该文件或目录不会与任何模式匹配

例如，模式 `a/.*/c` 可以匹配文件 `a/.b/c`，但是模式 `a/*/c` 不能与之匹配，因为 `*` 不能以 `.` 开始

如果需要将 `.` 作为常规字符看待，可以通过在option中设置 `dot:true`

#### 相对路径根节点匹配 (Basename Matching)

如果在option中设置 `matchBase:true` 并且模式中没有斜线 `/`，则会搜索该目录树下面的任何地方的任何文件进行匹配，例如 `*.js` 会匹配 `test/simple/basic.js`


[下一节：](https://github.com/isaacs/node-glob#empty-sets)
