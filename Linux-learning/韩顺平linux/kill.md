# 通过 kill 命令发送信号
kill -l   # 查看 kill 系统所支持的所有信号
kill -signal pid   # signal 为要发送的信号，可以是信号的名称或者对应的数字，pid为接收信号的进程ID
