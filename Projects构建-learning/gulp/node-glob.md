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
