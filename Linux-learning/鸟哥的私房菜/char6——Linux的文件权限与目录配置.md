# 文件权限与目录配置

- /etc/passwd：记录所有系统上的账号与一般身份的用户、root的相关信息
- /etc/shadow：记录个人密码
- /etc/group：记录Linux上面的所有组名

### 权限字符
- d：目录
- -：文件
- l：连接文件linkfile
- b：设备文件，可供存储的设备文件
- c：设备文件，串行端口设备，如键盘、鼠标（一次性读取设备）

### 额外记录
- 只有目录的r权限没有x权限，也无法进入目录

