# svn 快捷命令

为了简化 svn 命令行，在 `~/.bashrc` 里面增加

``` sh
#alias svnci=" svn st |grep M |awk '{print \$2 \"@\"}'|xargs sudo svn ci -m 'nothing' "
alias svnci=" sudo svn ci -m '' "
alias svnadd=" svn st |grep ^? |grep -v node_modules|grep -v bower_components |awk '{print \$NF \"@\"}'|xargs sudo svn add "
alias svndel=" svn st |grep ^! |awk '{print \$NF \"@\"}'|xargs sudo svn del "
alias svntree=" svn st | grep ^C |awk '{print \$NF \"@\"}'|xargs sudo svn resolve --accept working "
alias svnst=" svn st |grep -v node_modules | grep -v bower_components "
alias svnrmt6=" svn rm ^/t6 -m '' "
alias svngt6=" svn cp ^/trunk ^/t6 -m '' "
alias svnup=" sudo svn up "
alias svnC=" svn st|grep ^C "
alias ci=" svnadd ; svndel ; svnci "
alias ebc=" eb && ci "
alias es=" sudo ember s "
alias eb=" sudo ember b --prod "
alias sudo=" sudo "
alias npmi=" sudo npm i "
alias boweri=" sudo bower i --allow-root "
alias a=" sudo atom . "
alias aa=" atom . "
alias lantern="lantern >> /dev/null 2>&1 &"
```

如果需要起效果，需要重新载入用户数据，

``` sh
su - 用户名
```
