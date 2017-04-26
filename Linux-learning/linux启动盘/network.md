mini 如果需要连接WiFi，需要安装包 wireless-tools-29-5.1.1.el6.x86_64.rpm，但是由于没有网络，并且如果将 wireless-tools-29-5.1.1.el6.x86_64.rpm 拷贝到linux机器上也无法安装，安装需要网络载入包的一些信息，此时就只有用有线网。

又由于Centos默认不会建立本地连接，至少在虚拟机里是这样，自己新建一个就行了：
- cd /etc/sysconfig/network-scripts/
- vi ifcfg-eth0
    DEVICE=eth0
    BOOTPROTO=dhcp
    ONBOOT=yes   // 打开这一项，然后重启
    NM_CONTROLLED=yes

保存退出。
- 重启网络
  /etc/init.d/network restart
