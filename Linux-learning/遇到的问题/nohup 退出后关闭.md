使用 nohup 命令过后, 应该使用 exit 命令退出终端, 否则由 putty 等发送的终止信号会 kill 当前 session 的所有进程.

```sh
nohup [命令] > /dev/null 2>&1 &  # 执行某个命令
exit # 退出终端
```
