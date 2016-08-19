# VIM 实用技巧

## 查看帮助
> :h vimtutor 可以查看到一些帮助和目录，引导学习

> :h usr_01.txt，:h usr_02.txt


## 执行命令
> 本书约定：
>> $ grep -n Waldo *  // $表示在外部shell中执行

>> :grep Waldo *  // :表示在内部的命令模式执行


## Vim出厂配置
> $ vim -u NONE -N
    -u NONE 标志让 Vim 在启动时不加载你的 vimrc ，这样，你的定制项就不会生
    效，插件也会被禁用。当用不加载 vimrc 文件的方式启动时，Vim 会切换到 vi 兼
    容模式，这将导致很多有用的功能被禁用，而 -N 标志则会使能 ‘nocompatible’ 选
    项，防止进入 vi 兼容模式。
> 如果又一个vim的配置文件取代vimrc，可启动 vim -u file_path;


## 技巧部分
> 基本技巧

>> =G，\>G, <G：G为文档最后，=自动排版，\>为增加选中行的左间距，<为减小间距

# 第一章完结
