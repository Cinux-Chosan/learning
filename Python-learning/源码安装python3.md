1.安装环境 #yum install gcc zlib-devel make
2.下载python版本 #wget http://www.python.org/ftp/python/3.*.0/Python-3.*.0.tgz

3.解压缩、编译和安装

#tar -zxvf Python-3.*.0.tgz

#cd Python-3.4.0

#./configure --prefix=/opt/python3

#make  

#make install 

4清除之前编译的可执行文件及配置文件

#make clean 

5清除所有生成的文件

#make distclean

6查看安装的新版本信息

#/opt/python3/bin/python3 -V Python 3.4.0 由此看出编译安装的新版本python生效了

7做个软连接到当前用户的bin目录

#ln -s /opt/python3/bin/python3 usr/bin/python3
8升级安装好新版本python以后，默认依然是python2.6 将文件头部的#!/usr/bin/python修改为 #!/opt/python3/bin/python3 即可。