# [minimatch](https://github.com/isaacs/minimatch)

迷你匹配工具

minimatch 是npm 内部使用的用于匹配的库

它将 glob 表达式转换成 JavaScript 正则表达式

## 使用

```
var minimatch = require("minimatch")

minimatch("bar.foo", "*.foo") // true!
minimatch("bar.foo", "*.bar") // false!
minimatch("bar.foo", "*.+(bar|foo)", { debug: true }) // true, and noisy!
```

## 特性

支持如下 glob 特性：
- 大括号
- 扩展 glob 匹配
- "Globstar" `**` 匹配

### see

- `man sh`
- `man bash`
- `man 3 fnmatch`
- `man 5 gitignore`


## Minimatch Class

通过实例化 `minimatch.Minimatch` 类来创建一个 minimatch 对象

```
var Minimatch = require("minimatch").Minimatch
var mm = new Minimatch(pattern, options)
```

### Properties

- `pattern` minimatch 对象代表的原始模式
- `options` 提供给构造函数 (constructor) 的参数选项
- `set` 正则表达式或者字符串表达式的二维数组。每一行对应一个大括号模式(brace-expanded，即使用 `{`和`}`)，每一行的每个元素代表模式中的一部分，例如模式 `{a,b/c}/d` 会扩增成如下：

```
[ [ a, d ]
 , [ b, c, d ] ]
```
  如果模式不包含特殊匹配字符(如 `foo`而非 `fo*o`)，则它会被当做字符串而非被转换成正则表达式。
- `regexp` 该属性被 `makeRe` 方法创建。表示完整模式的正则表达式，在使用如开启了 `FNM_PATH` 的 `fnmatch(3)` 的时候，如果希望使用模式去匹配的时候非常有用
- `negate` 如果模式取反，则为`true`
- `comment` 如果模式是注释，则为`true`
- `empty`如果模式是 `""` 时候为 `true`

### 函数方法

- `makeRe` 在需要的时候会生成 `regexp`并返回它，如果 模式无效则返回 `false`
- `match(fname)` 如果文件名与模式匹配，则返回 `true`，否则返回 `false`
- `matchOne(fileArray, patternArray, partical)` 用一个使用 `/` 切分的文件名与 `regExpSet` 中的行进行匹配。该方法主要是用于内部使用，但是也暴露出来给 glob-walker 使用以防止过多的文件系统调用。

所有其它方法都是内部调用方法，并且会在必要的时候被调用

[minimatch](https://github.com/isaacs/minimatch#minimatchpath-pattern-options)
