# [lantern](https://github.com/getlantern/lantern) 编译


## clone 编译项目

``` sh
git clone https://github.com/getlantern/lantern.git
```

## 根据 https://github.com/getlantern/lantern.git 指引，安装相应程序

- git
- nodejs & npm
- 编译程序 gcc 或者 g++
- gulp `npm i gulp-cli -g`
- go (安装 lantern 提供的 go : https://github.com/getlantern/go)

准备好环境过后，就可以开始编译

``` sh
git clone https://github.com/getlantern/lantern.git
cd lantern
make lantern
./lantern
```

可以将 lantern 拷贝到 /usr/bin 中使用

``` sh
cp ./lantern /usr/bin/
```

使用 alias 简化命令和不在控制台输出 lantern 消息

``` sh
sudo vim ~/.bashrc
```

加上 `alias lantern="lantern >> /dev/null 2>&1 &"`


## 报错与处理

### 找不到 gtk+3.0  appindicator 等情况

安装过程中，可能报错，如 gtk+3.0 、 appindicator 等，可通过 yum 安装

``` sh
yum search gtk # 找到对应版本包名

yum install -y gtk3-devel.x86_64  # 如果报找不到 gtk+3.0 则安装该包

yum search appindicator

yum install -y libappindicator-devel.x86_64

# 如果还有其他包缺失，这通过该方法安装
```

安装完过后，如果报 pkg-config 找不到包的情况，则需要配置 PKG_CONFIG_PATH 变量。 pkg-config 需要找到对应的包的 .pc 文件

``` sh
find / -name '*.pc' # 找到 gtk+3.0.pc 和 appindicator 的 .pc 文件

# 如果找到的路径为  /usr/lib64/pkgconfig/gtk+-3.0.pc ，则将 PKG_CONFIG_PATH 指向该目录
#
export PKG_CONFIG_PATH=/usr/lib64/pkgconfig/
```

### 报 go 编译错误的情况

克隆 lantern 提供的 go 仓库。

``` sh
git clone https://github.com/getlantern/go.git
```

克隆完成过后，参考 https://github.com/northbright/Notes/blob/master/Golang/china/install-go1.6-from-source-on-centos7-in-china.md 进行安装


**注意，安装 go1.4以上版本可能会依赖 go1.4进行编译，所以需要提前安装好 go1.4**

从源代码编译安装Go1.4
  * `cd ~/`
  * `git clone git@github.com:golang/go.git`
  * `cd go`
  *  `git checkout -b 1.4.3 go1.4.3`
  * `cd src`
  * `./all.bash`

复制 `~/go` 到 `$GOROOT_BOOTSTRAP`（默认值是`~/go1.4`）
  * `cp ~/go ~/go1.4 -rf`


继续在导下来的 lantern 的 go 仓库中，执行

``` sh
cd ~/go
git branch
```

会看到有一个分支名为 lantern

``` sh
git clean -dfx
git checkout lantern
cd src
./all.bash
```

执行完成过后， go 命令在该仓库的 bin 目录

设置 go 命令环境变量

``` sh
sudo vim /etc/profile
```
在后面加上 `export PATH=$PATH:/usr/local/go/bin`

把 go 目录复制到 /usr/local 中去

``` sh
sudo cp -fr go /usr/local/
```

查看 go 时候安装完成

``` sh
go version
```

此时就可以编译安装 lantern 了
