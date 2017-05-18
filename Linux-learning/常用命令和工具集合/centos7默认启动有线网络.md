# centos7 默认启动有线网络

- 首先ifconfig查看网卡

- 名称类似ifcfg-eth0或ifcfg-enp​2s0

然后编辑 /etc/sysconfig/network-scripts/ifcfg-eth0

将 ONBOOT设置为 yes


## 如果希望开机启动热点，修改 ifcfg-Hotspot ，将 ONBOOT 修改为 ONBOO=true
