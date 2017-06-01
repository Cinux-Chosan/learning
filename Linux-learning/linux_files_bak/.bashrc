# .bashrc

# Source global definitions
if [ -f /etc/bashrc ]; then
	. /etc/bashrc
fi

# Uncomment the following line if you don't like systemctl's auto-paging feature:
# export SYSTEMD_PAGER=

# User specific aliases and functions
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
alias lantern=" lantern >> /dev/null 2>&1 & "
alias s=" sudo -v ; nohup sslocal -c /etc/shadowsocks.json >> /dev/null 2>&1 & "
alias cvm=" ssh 119.28.77.31 "
alias gitci=" git add *; git commit -m 'x'; git push "
alias gci=" gitci "
alias gcia=" git add *; git commit -am 'x'; git push "
alias pyhttp=" python -m SimpleHTTPServer 8888 >> /dev/null 2>&1 &  "
alias npmlogin=" npm login --registry http://registry.npmjs.org "
alias npmpub=" npm publish --registry http://registry.npmjs.org "
alias tree=" tree -N --charset utf-8 "

### export


export work=" $HOME/desktop/all/projects/"
export desktop=" $HOME/desktop/"
export learning=" $desktop/all/learning/"
export myproj=" $desktop/all/myproj/ "
