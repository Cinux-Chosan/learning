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
