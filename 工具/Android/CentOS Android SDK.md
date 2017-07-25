# [CentOS 安装 android SDK](http://blog.csdn.net/CheNorton/article/details/50345039)

- 下载软件

`curl http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz --ouput /opt/download/android-sdk_r24.4.1-linux.tar
`

- 解压

`tar xvf android-sdk_r24.4.1-linux.tar`

- 配置环境变量到当前目录（配置环境变量）

``` sh
vim ~/.bash_profile
export PATH=$PATH:/当前文件夹/tools
```

- 安装 SDK

进入 tools 目录：

`./android list sdk -u`
