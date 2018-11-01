# windows 版本的 vscode 配置使用 git-bash

- 打开设置，搜索 terminal
- 找到 Terminal › Integrated › Shell: Windows
- 填入 git 安装路径中 `/bin` 目录下的 `bash.exe` 或者 `sh.exe` 全路径
- 编辑 `~/.bash_profile` 文件，将启动项写入
- 打开 vscode 中的设置，搜索 `shellarg`， 在 `terminal.integrated.shellArgs.windows` 一项中添加 `-l` 选项（[参考这里](https://code.visualstudio.com/docs/editor/integrated-terminal#_shell-arguments)）

以下片段摘自 vscode 官方文档：

For example, to enable running bash as a login shell (which runs `.bash_profile`), pass in the `-l` argument (with double quotes):

``` json
// Linux
"terminal.integrated.shellArgs.linux": ["-l"]
```

现在，就可以在 vscode 中使用 bash 命令了，并且可以在启动的时候加载 `.bash_profile` 中的内容。