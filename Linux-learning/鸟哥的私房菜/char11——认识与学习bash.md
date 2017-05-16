# bash

- 系统 shell 查询： 系统所支持的 shell 被记录在 /etc/shells 文件中
- 用户登录默认 shell 被记录在 /etc/passwd 文件中

#### bash 内置命令 type:

例子：

``` sh
type [-tpa] name
```

- 无 tpa 参数的时候，type 会显示 name 是外部命令还是 bash 内置命令
- `-t`：file代表外部命令；alias代表该命令为别名；builtin表示该命令为bash内置命令
- `p`：如果后面的 name 为外部命令时，才会显示完整的文件名
- `a`：列出在 PATH 定义的路径中所有含有 name 的命令（包括alias）

## 变量

#### 显示变量

显示变量使用 echo，`echo $variable`

``` sh
echo $PATH
echo ${PATH}
```
