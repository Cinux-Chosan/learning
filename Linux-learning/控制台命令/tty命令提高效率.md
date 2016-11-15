# Linux控制台（文本模式）下提高工作效率的快捷键

##在Linux环境里，有一些按键有特殊的含意。
- Ctrl-U: 擦除一行光标前面的部分。
- Ctrl-H: 擦除光标前面的一个字符。
- Ctrl-D: 终止输入。(退出 shell，如果您正在使用 shell 的话)。
- Ctrl-C: 终止当前正在运行的程序。
- Ctrl-Z: 暂停程序。 
&'')
- Ctrl-S: 停止向屏幕输出。 
- Ctrl-Q: 重新激活向屏幕输出。

## 默认的 shell，`bash’， 有历史编辑和 tab 补齐功能。


- up-arrow: 开始历史命令搜索。
- Ctrl-R: 开始增量历史命令搜索，可以按照关键字查查自己用过哪些命令。
- TAB: 完整的把文件名输入到命令行。
- Ctrl-V TAB: 输入 TAB 而不是扩展命令行。
- Ctrl + P - 上一条命令
- Ctrl + N - 下一条命令
- Ctrl-U: 擦除一行光标前面的部分。
- Ctrl + Y - 粘贴前一Ctrl+U类命令删除的字符 ，是粘贴不是撤销啊！

## 下面的应用可能稍稍高级一点点
- !! - 上一条命令
- !-n - 倒数第N条历史命令
- !-n:p - 打印上一条命令（不执行）
- !?string？- 最新一条含有“string”的命令
- !-n:gs/str1/str2/ - 将倒数第N条命令的str1替换为str2，并执行（若不加g,则仅替换第一个）

## 其他一些有用的按键组合。
Ctrl-Alt-Del:挂起或者重新启动系统，这三个按键在Linux下可以轻松地修改成关机的操作，这对于单用户的朋友还是很方便的

- Ctrl + l - 清屏
- Ctrl + A - 光标移到行首
- Ctrl + E - 光标移到行尾
- Ctrl + W - 清除光标之前一个单词
- Ctrl + K - 清除光标到行尾的字符
- Ctrl + T - 交换光标前两个字符
- Ctrl + V - 输入控制字符 如Ctrl+v ,会输入^M
- Ctrl + F - 光标后移一个字符
- Ctrl + B - 光标前移一个字符
- Ctrl + H - 删除光标前一个字符
- N++F - 光标后移N个单词，N为1时可省略
- N++B - 光标前移N个单词，N为1时可省略
- Left-click-and-drag mouse: 选择并且拷贝到剪贴板。
- Click middle mouse button: 使用剪贴板的内容粘贴。
- Meta-key (Emacs terminology) 传统的是使用 Left-Alt-key.
