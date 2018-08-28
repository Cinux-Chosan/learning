
Windows中使用git-bash作为日常终端工具，在使用ssh命令连接到服务器后，如果较长时间没进行交互时，ssh会断开，导致的现象就是终端卡住，你只能等待它退出，或直接关闭窗口重建连接，很麻烦。

使用ssh命令时，可以增加ServerAliveInterval参数设置心跳时间，比如设置60秒发送一次心跳包

`ssh -o ServerAliveInterval=60 root@xx.xx.xx.xx`
想一劳永逸，可以在ssh-config中配置全局参数
在git安装目录下的`/etc/ssh/ssh_config`文件中，增加一行

`ServerAliveInterval 60`
现在再使用ssh时，就可以一直保存ssh连接在线了。