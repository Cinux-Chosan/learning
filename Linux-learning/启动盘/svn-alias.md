# svn 快捷命令

为了简化 svn 命令行，在 `~/.bashrc` 里面增加

``` sh
alias svnci="svn st |grep M |awk '{print \$2}'|xargs svn ci -m 'nothing'"
alias svnadd="svn st |grep ? |awk '{print \$2}'|xargs svn add"
alias svndel="svn st |grep ! |awk '{print \$2}'|xargs svn del"
alias ci="svnadd && svndel && svnci"
```
