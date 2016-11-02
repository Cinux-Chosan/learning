# 配置网络
ifconfig 网卡名 Ip

# 手动修改网卡配置
/etc/sysconfig/network-scripts/ifcfg-eth0   # 修改网卡信息
需要重启网络服务
/etc/rc.d/init.d/network restart
