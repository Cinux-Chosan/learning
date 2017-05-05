# [原文](http://blog.csdn.net/senlin1202/article/details/51479385)

1. 安装Shadowsocks Server

``` sh
pip install shadowsocks
```

2. 配置/etc/shadowsocks.json

``` sh
vim /etc/shadowsocks.json
```

配置信息如下：

``` json
{
  "server":"0.0.0.0",
  "server_port":8388,
  "local_address":"127.0.0.1",
  "local_port":1080,
  "password":"MyShadowsocks",
  "timeout": 600,
  "method":"rc4-md5",
  "fase_open":false,
  "workers": 8
}
```

**注解：** 在以上配置文件中，
定义了监听的服务器地址为任意地址："server": "0.0.0.0",
定义了监听的服务器端口为443："server_port": 443,
定义了客户端本地的监听地址为127.0.0.1："local_address": "127.0.0.1",
定义了客户端本地的监听端口为1080："local_port": 1080,
定义了密码为shadowsockspass："password": "shadowsockspass",
定义了连接超时的时间为600秒："timeout": 600,
定义了加密的方式为aes-256-cfb："method": "aes-256-cfb",
默认关闭了fast_open属性："fast_open": false,
定义了进程数为1："workers": 1

3. 配置/etc/sysctl.conf，新增如下配置：

```
fs.file-max = 65535
net.core.rmem_max = 67108864
net.core.wmem_max = 67108864
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_max_tw_buckets = 5120
net.ipv4.tcp_mem = 25600 51200 102400
net.ipv4.tcp_rmem = 4096 87380 67108864
net.ipv4.tcp_wmem = 4096 65536 67108864
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_congestion_control = hybla
```

执行命令 `sysctl -p`

4. 启动Shadowsocks服务

``` sh
ssserver -c /etc/shadowsocks.json -d start
```

查看：

``` sh
netstat -lntp | grep 443
```

显示

```
tcp      0      0      0.0.0.0:443      0.0.0.0:*      
LISTEN      11037/python
```
