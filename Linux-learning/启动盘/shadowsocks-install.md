# [centos安装shadowsocks客户端](http://blog.csdn.net/lell3538/article/details/50812161)

原文：http://blog.csdn.net/lell3538/article/details/50812161


## 安装shadowsocks

``` sh
yum install python-pip    

pip install shadowsocks



vim /etc/shadowsocks.json



{

    "server":"1.1.1.1",             #ss服务器IP

    "server_port":1035,             #端口

    "local_address": "127.0.0.1",   #本地ip

    "local_port":1080,              #本地端口

    "password":"password",          #连接ss密码

    "timeout":300,                  #等待超时

    "method":"rc4-md5",             #加密方式

    "fast_open": false,             # true 或 false。如果你的服务器 Linux 内核在3.7+，可以开启 fast_open 以降低延迟。开启方法： echo 3 > /proc/sys/net/ipv4/tcp_fastopen 开启之后，将 fast_open 的配置设置为 true 即可

    "workers": 1                    # 工作线程数

}
```

在使用centos7的软件包管理程序yum安装Python-pip的时候会报一下错误：

```
No package python-pip available.
Error: Nothing to do
```

说没有python-pip软件包可以安装。

这是因为像centos这类衍生出来的发行版，他们的源有时候内容更新的比较滞后，或者说有时候一些扩展的源根本就没有。
所以在使用yum来search  python-pip的时候，会说没有找到该软件包。因此为了能够安装这些包，需要先安装扩展源EPEL。
EPEL(http://fedoraproject.org/wiki/EPEL) 是由 Fedora 社区打造，为 RHEL 及衍生发行版如 CentOS、Scientific Linux 等提供高质量软件包的项目。
首先安装epel扩展源：

``` sh
 sudo yum -y install epel-release
```

然后安装python-pip

``` sh
sudo yum -y install python-pip
```

安装完之后别忘了清除一下cache

``` sh
sudo yum clean all
```

## 启动shawodsocks

``` sh
 nohup sslocal -c /etc/shadowsocks.json /dev/null 2>&1 &
//是shadowsocks后台运行

 然后加入开机自启动

 echo " nohup sslocal -c /etc/shadowsocks.json /dev/null 2>&1 &" /etc/rc.local



 查看后台进程

 [root@kcw ~]# ps aux |grep sslocal |grep -v "grep"

root      7587  0.1  0.1 184180  8624 pts/0    S    08:44   0:03 /usr/bin/python /usr/bin/sslocal -c /etc/shadowsocks.json /dev/null
```
