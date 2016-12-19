# Glob 基本用法简介

使用模式匹配匹配文件名，内部使用 `minimatch` 库

## 使用

### 安装
```
npm i --save-dev glob
```

将模式转换成路径之前，大括号里面的部分将会被扩展开来，如 `a{/b/c,bcd}`会被展开成 `a/b/c` 和 `abcd`

模式字符:
- `*` 匹配0个 或 0个以上字符
- `?` 匹配一个字符
- `[...]` 匹配某个范围内的字符，如果第一个字符是 `!`或者　`^` 则匹配任何不在该范围内的字符
- `!(pattern|pattern|pattern)` 匹配不存在其中的元素
- `?(pattern|pattern|pattern)` 匹配 0个或 1个其中的pattern
- `+(pattern|pattern|pattern)` 匹配 1个或 更多
- `*(a|b|c)` 匹配 0个或 更多
- `@(pattern|pat*|pat?erN)` 完全匹配其中某个模式
- `**` 递归查询文件，它匹配 0个或 多个目录或者子目录，不会查询软连接目录进行匹配

**注意：** 如果文件或者目录第一个字符为 `.`，则除非模式中第一个字符也为 `.`才能进行匹配。`*`不能以`.`开头，所以不能匹配以`.`开头的文件名。如果需要`*`能够匹配`.`，需要将options中参数`dot`设置为`true`


### glob(pattern, [options], cb)

异步方式查找匹配的文件名

### glob.sync(pattern, [options])

同步方式查找匹配的文件名

### glob.hasMagic(pattern, [options])

如果模式 `pattern` 中含有模式通配符，则返回`true`,否则返回`false`

### options

参考[options](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/node-glob.md#可选项参数)
