# RPM

- `RPM` 安装软件的时候，会首先读取服务器上该软件的配置信息，并与本机环境进行比较。找出是否有依赖没有安装。检查合格才予以安装。

- 软件安装完毕，该软件相关信息就会被记录到本机的 `/var/lib/rpm/` 目录下的数据库中。以后的升级、卸载等，都与之有关。

## RPM 安装

- rpm 安装参数
  - -i : 安装
  - -v : 查看详细安装信息画面
  - -h : 以安装信息栏显示进度
  - --test : 测试软件是否能够被安装到本机

## RMP 升级与更新

- rpm 更新参数
  - -U : 如果没有安装则安装，如果安装了则更新
  - -F : 如果没有安装则忽略，不安装也不更新

``` sh
rpm  -Uvh pam-devel
```

## RPM 查询

- rpm 查询参数
  - -q : 仅查询软件是否安装
  - -qa : 列出所有已安装在本机系统的所有软件名称
  - -qi : 列出该软件的详细信息（infomation）
  - -ql : 列出该软件所有的文件与目录所在完整文件名（list）
  - -qc : 列出该软件的所有配置文件（即找出在 /etc/ 下面的文件名而已）
  - -qd : 列出该软件的所有帮助文档（与 man 有关的文件）
  - -qR : 列出与该软件有关的依赖软件所含的文件（Required）
  - -qf : 由后面接的文件名称找出该文件属于哪一个已安装的软件

- 查询某个rpm文件内含有的信息
  - -qp[icdlR] : -qp后面的参数与上述一致，但用途仅在于找出某个RPM文件内的信息，而非已安装的软件信息。

- 用例展示：
  - 找出本机是否安装 xxx
    - rpm -q xxx
  - 列出属于 xxx 软件提供的文件和目录
    - rpm -ql xxx
  - 列出 xxx 软件的相关说明
    - rpm -qi xxx
  - 列出 xxx 软件的配置（帮助）文档
    - rpm -qc xxx （配置）
    - rpm -qd xxx （帮助）
  - 查看安装 xxx 所需要的依赖
    - rpm -qR xxx
  - 查看某个文件或者目录属于哪个软件
    - rpm -qf /bin/sh
  - 假设有一个 RPM 文件 xxx ，想要知道该文件的需求文件
    - rpm -qpR xxx

## RPM 删除软件

- rpm -e xxx


# YUM

yum 通过分析 RPM 标题数据后，根据软件的相关性质作出属性依赖时的解决方案，然后可以自动处理软件的依赖属性问题。以解决软件安装或删除与升级的问题。

使用 yum 时，必须要找到合适的 yum server才行，但是每个 yum server 提供许多不同的软件功能，这就是"容器"，因此要前往 yum server 查询到相关的容器网址后，再继续后续设置。

CentOS 在发布的时候已经制作了多个提供全世界更新之用的镜像站点，正常情况下我们不需要做任何设置。

## yum 查询

- yum [option] [查询工作项目] [相关参数]
  - [option] 有
    - -y : 当 yum 需要用户确认时，该选项自动提供 yes 响应。
    - --installroot=/some/path : 将该软件安装在 /some/path 中而不是默认路径
  - [查询相关信息]
    - search : 搜索某个软件名称或者是描述（description） 的重要关键字
    - list : 列出目前 yum 所管理的所有软件名称与版本，有点类似于 rpm -qa
    - info : 同上，有点类似于 rpm -qai
    - provides : 从文件去搜软件，类似于 rpm -qf

用例
  - 搜索磁盘阵列（raid）的相关软件
    - yum search raid
  - 找出 mdadm 这个软件的功能
    - yum info mdadm
  - 列出 yum 服务器上提供的所有软件（找出以pam开头的软件名有哪些）
    - yum list （yum list pam*）
  - 列出目前服务器上可供本机升级的软件
    - yum list updates
  - 列出提供 passwd 这个文件的软件有哪些
    - yum provides passwd

## yum 安装

- yum [install|update] xxx


## yum 删除

- yum remove xxx


## yum 的配置文件

yum 的配置文件在 /etc/yum.repos.d/ 下面，如 /etc/yum.repos.d/CentOS-Base.repos

- 文件属性参数：
  - [base] : 代表容器的名字，中括号一定要，括号内名称随意，但是不能有重复的容器名。
  - name : 说明容器的意义，不重要
  - mirrorlist= : 列出这个容器可以使用的镜像站点。如果不想使用可以注释该行
  - baseurl= : 这个最重要，它代表容器实际的网址， mirrorlist 是 yum 程序自行寻找镜像站点，而 baseurl 则是指定固定容器地址
  - enable=1 : 该容器是否可以启动， 0 代表不启动
  - gpgcheck=1 : 是否需要查阅 RPM 文件内的数字证书
  - gpgkey= : 数字证书的公钥文件所在位置，默认值即可。

添加配置文件，在 /etc/yum.repos.d/　下面新建扩展名为 .repo 的文件即可，修改镜像站点或者容器地址，而没有修改容器名，由于容器版本可能不同，又因为 yum 会先下载容器的清单到本机的 /var/cache/yum 里面去，这就可能造成本机与 yum 服务器的列表不同步，此时会出现无法更新的问题。解决方法是通过 yum clean 清除掉本机的旧数据。

- yum clean [packages|headers|all]
  - packages : 将已下载的软件文件删除
  - headers : 将下载的软件文件头删除
  - all : 将所有容器数据都删除

## yum 软件组

如果一个大型项目，会有一大堆软件需要安装，则 yum groupinstall 会全部整个安装它们。

- yum [组功能] [软件组]
  - 参数
    - grouplist : 列出所有可使用的组列表，如 Development Tools 之类的
    - groupinfo : 后面接 group name，则可了解该 group 内的所有组名称
    - groupinstall : 安装一整组组件
    - groupremove : 删除某个组

## yum 自动升级

- yum -y update

自动升级：通过 crontab 来执行

``` sh
vim /etc/crontab

0  3  *  *  *  root /usr/bin/yum -y update
```
