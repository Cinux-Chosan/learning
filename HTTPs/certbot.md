
# http 升级 HTTPS (node版)

之前一直考虑的是, 我肯定不会把一个日访问量低于 100 的个人博客网站升级成 https 的... 确定, 肯定以及 Sure ...

然而, 今天竟然**小有空闲** ..

就坐在那里思考人生...

自己毕竟是个高技术的, 就算不为了博客, 从长远的角度来说, 为了自己技术的提升, 也可以实际操作一把..

干吧, 说干就干...


.....


好了. 干完了 ..

下面开始分享, 过程很简单..

这里有个 git: https://github.com/certbot/certbot

(以前顺手 start 的.. 今天终于用上了 ...)

阅读了简单的balabala介绍过后,  我们来到指南部分:

https://certbot.eff.org/

映入眼帘..

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/1522828680403.jpg)

选择你使用的服务器软件和系统.

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/1522828784915.jpg)

由于我是使用的 nodejs , 没有我要的选项, 就选 None of the above , 系统也选择使用的系统, 我的是 centos 7 就选 CentOS/RHEL7 .. 选择完毕之后, 自动出现安装步骤:

> Certbot is packaged in EPEL (Extra Packages for Enterprise Linux). To use Certbot, you must first [enable the EPEL repository](https://fedoraproject.org/wiki/EPEL#How_can_I_use_these_extra_packages.3F).

大意: Certbot 放在 EPEL 上, 你如果要使用 Certbot, 就必须首先启用 EPEL 仓库..

我是启用了的, 如果没有启用的朋友, 这么做:

去 [EPEL](https://fedoraproject.org/wiki/EPEL#How_can_I_use_these_extra_packages.3F)  下载二进制安装文件手动安装, 或者通过命令行安装:

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/1522829585405.jpg)

操作很简单, 分分钟就完成了, 接着进行下一步:

安装 Certbot:

`sudo yum install certbot`

tip: 加上 `-y` 可以省去手动安装确认.

...

安装完成 ...

到现在准备工作 OK 了..

Get Started ..


下面提供一点个人翻译资料:

### Get Started

> Certbot supports a number of different “plugins” that can be used to obtain and/or install certificates.

Certbot  支持一些不同的 "插件" 可以帮助你取得并且安装证书

> Since your server architecture doesn't yet support automatic installation you'll have to use the certonly command to obtain your certificate.

如果你的服务器架构不支持自动安装, 你就只能使用 certonly 命令来获取你的证书.

`sudo certbot certonly`

> This will allow you interactively select the plugin and options used to obtain your certificate. If you already have a webserver running, we recommend choosing the ["webroot" plugin](https://certbot.eff.org/docs/using.html#webroot).

这让你可以交互式的选择插件和可选项来获取你的证书. 如果你已经有一个正在运行的 web 服务器, 我们推荐你选择 webroot 插件.

> Alternatively, you can specify more information on the command line.

另外, 你可以在命令行中指定更多的信息.

> To obtain a cert using the "webroot" plugin, which can work with the webroot directory of any webserver software:

webroot 插件可以和任何 web 服务器软件的 webroot 目录配合使用,使用 webroot 插件来获取证书:

`sudo certbot certonly --webroot -w /var/www/example -d example.com -d www.example.com -w /var/www/thing -d thing.is -d m.thing.is`

> This command will obtain a single cert for **example.com**, **www.example.com**, **thing.is**, and **m.thing.is**; it will place files below **/var/www/example** to prove control of the first two domains, and under **/var/www/thing** for the second pair.

这行命令会为 **example.com**, **www.example.com**, **thing.is** 和 **m.thing.is** 生成一个证书. 前两个域名的文件放在 **/var/www/example**  目录, 后两个放在 **/var/www/thing**.

> Note:
To use the webroot plugin, your server must be configured to serve files from hidden directories. If /.well-known is treated specially by your webserver configuration, you might need to modify the configuration to ensure that files inside /.well-known/acme-challenge are served by the webserver.

注意事项: 使用 webroot 插件的时候, 你的服务器必须配置为可以支持隐藏目录的访问. 如果你的服务器配置为对 `/.well-know` 特殊处理, 你就需要修改服务器配置确保在 `./well-known/acme-challenge` 目录中的文件可以被外网访问.

> To obtain a cert using a built-in “standalone” webserver (you may need to temporarily stop your existing webserver, if any) for example.com and www.example.com:

如果使用一个内置的 "标准" web 服务器来获取 example 和 www.example.com 的证书(你可能需要暂时停止你正在运行的 web 服务器):

`sudo certbot certonly --standalone -d example.com -d www.example.com`

> You can also use one of Certbot's DNS plugins to obtain a certificate if it's installed and you have configured DNS for the domain you want to obtain a certificate for with the DNS provider matching the plugin. To see more information about using these plugins, click [here](https://certbot.eff.org/docs/using.html#dns-plugins). If you want to use one of these plugins with Let's Encrypt's new ACMEv2 server that will issue wildcard certificates, you'll also need to include the following flag on the command line:

如果你已经为该域名配置了 DNS 供应商匹配的插件 ,你也可以使用 Certbot 提供的众多 DNS 插件中的某一个来获取证书. 点击这里了解更多信息. 如果你想使用插件配合 Let's Encrypt 的 new ACMEv2 server 来颁发通配符证书, 你还需要在命令行中包含下面的标记:

`--server https://acme-v02.api.letsencrypt.org/directory`

### Automating renewal

> Certbot can be configured to renew your certificates automatically before they expire. Since Let's Encrypt certificates last for 90 days, it's highly advisable to take advantage of this feature. You can test automatic renewal for your certificates by running this command:

Certbot 可以配置为在到期之前自动更新. 强烈推荐使用自动更新, 因为 Let's Encrypt 证书只能持续 90 天.