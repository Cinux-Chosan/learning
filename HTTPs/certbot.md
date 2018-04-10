# http 升级 HTTPS (node版)

之前一直考虑的是, 我肯定不会把一个日访问量低于 100 的个人博客网站升级成 https 的... 确定, 肯定以及 Sure ...

然而, 今天竟然**小有空闲** ..

就坐在那里思考人生...

... (省略一大堆) ...自己毕竟是个搞技术的, 就算不为了博客, 从长远的角度来说, 为了自己技术的提升, 也可以实际操作一把..

干, 说干就干...


.....


好了. 干完了 ..

下面开始分享, 过程很简单..

(毕竟还有很多小伙伴是像我一样不会花钱去购买那些 CA 颁发的昂贵的证书，只有自行解决，丰衣足食)

这里有个 git: https://github.com/certbot/certbot

(以前顺手 start 的.. 今天终于用上了 ...)

阅读了简单的balabala介绍过后,  我们来到指南部分:

https://certbot.eff.org/

映入眼帘..

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/1522828680403.jpg)

如果你还打开它的控制台，wtf ?? :

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180404230243.png)

喜欢看代码？哈哈哈，这都被我们发现了，原来阁下也是性情中人，正好，来 github 我们一起看代码吧.. 这儿的代码有你好看的... 闲话不多扯了.. go on ...

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

运行命令来获取证书，比如我希望给我的域名 `chosan.cn` 申请一个证书，同时希望 `www.chosan.cn` 也可以使用该证书，我的 web 根目录为 `/var/www/mypost`，如果 web 目录还不存在，则需要创建该目录

`mkdir -p /var/www/mypost`

现在可以输入下面的命令来申请证书了:

`sudo certbot certonly --webroot -w /var/www/mypost -d chosan.cn -d www.chosan.cn`

中途会要求输入 email 地址，如果出现下面这个错误， 不要惊慌， 多试几次就好了：

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180405003631.png)

这个过程还会让你进行确认:

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/10.png)

（演示的时候临时采用了 mln.kim 这个域名, 并且使用的 `--standalone`，即使用的 certbot 提供的标准 webserver，只要根据我说的做，结果都一样）

这里说的很清楚， 证书放在 `/etc/letsencrypt/live/mln.kim/fullchain.pem`， 秘钥放在 `/etc/letsencrypt/live/mln.kim/privkey.pem`， 此时我们只需要引用 node 的 https 模块来创建服务器即可：

```js
var https = require('https');
var fs = require('fs');

const options = {
    cert: fs.readFileSync('/etc/letsencrypt/live/mln.kim/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/mln.kim/privkey.pem')
  };

const server = https.createServer(options, (req, res) => {
	// ... your code here
});

server.listen(443);  // https 使用 443 端口
```

另外，如果我完全使用 https 替换 http，那我们还可以将所有 http 请求全部重定向到 https：

```js
var http = require('http');
var { URL } = require('url');

http.createServer((req, res) => {  // 负责将 http 请求重定向到 https
  let redirectUrl = new URL(req.url, `https://${req.headers.host}`);
  res.writeHead(301, { 'Location': redirectUrl.toString() });
  res.end();
}).listen(80);
```

大功告成！

现在我们就可以看看效果了：

![](//posts-1256188574.cos.ap-chengdu.myqcloud.com/http%20%E5%8D%87%E7%BA%A7%20HTTPS%EF%BC%88node%E7%89%88%EF%BC%89/Jietu20180405-135401-HD.gif)

动图...

使用这个命令的时候需要确保能够通过外网访问 `/var/www/mypost/.well-known/acme-challenge/` 目录下的文件， 你的服务器可能默认配置不会让外网访问到隐藏目录(`.`打头的目录)，所以就需要修改服务器配置，不同的服务器配置有所不同。我使用的是 node，不需要配置即可， 当然你也可以使用 `--standalone` 使用 centbot 提供的内置服务器来完成认证，不过此时你必须关闭你的服务器，否则 80 端口可能被占用 ing， `--standalone` 不能和 `--webroot` 一起使用。另外打个小广告， 如果你也不使用 `--standalone`， 你可以通过运行 `npm i -g q-cmd` 安装 q-cmd 模块， 然后在目录下面运行 `server -p 80` 即可开启本地服务，简单快捷。为什么在这里打这个广告呢，因为它是我发布的包。。封装了一些命令，目的就是一键开启有用的功能(欢迎pr)。。


**下面提供一点个人翻译资料:**

### Get Started

> Certbot supports a number of different “plugins” that can be used to obtain and/or install certificates.

Certbot  支持一些不同的 "插件" 可以帮助你取得并且安装证书。

> Since your server architecture doesn't yet support automatic installation you'll have to use the certonly command to obtain your certificate.

如果你的服务器架构不支持自动安装, 你就只能使用 certonly 命令来获取你的证书.

`sudo certbot certonly`

> This will allow you interactively select the plugin and options used to obtain your certificate. If you already have a webserver running, we recommend choosing the ["webroot" plugin](https://certbot.eff.org/docs/using.html#webroot).

这让你可以交互式的选择插件和可选项来获取你的证书. 如果你已经有一个正在运行的 web 服务器, 我们推荐你选择 webroot 插件。

> Alternatively, you can specify more information on the command line.

另外, 你可以在命令行中指定更多的信息。

> To obtain a cert using the "webroot" plugin, which can work with the webroot directory of any webserver software:

webroot 插件可以和任何 web 服务器软件的 webroot 目录配合使用,使用 webroot 插件来获取证书:

`sudo certbot certonly --webroot -w /var/www/example -d example.com -d www.example.com -w /var/www/thing -d thing.is -d m.thing.is`

> This command will obtain a single cert for **example.com**, **www.example.com**, **thing.is**, and **m.thing.is**; it will place files below **/var/www/example** to prove control of the first two domains, and under **/var/www/thing** for the second pair.

这行命令会为 **example.com**, **www.example.com**, **thing.is** 和 **m.thing.is** 生成一个证书. 前两个域名的文件放在 **/var/www/example**  目录, 后两个放在 **/var/www/thing** 。

> Note:
To use the webroot plugin, your server must be configured to serve files from hidden directories. If /.well-known is treated specially by your webserver configuration, you might need to modify the configuration to ensure that files inside /.well-known/acme-challenge are served by the webserver.

注意事项: 使用 webroot 插件的时候, 你的服务器必须配置为可以支持隐藏目录的访问. 如果你的服务器配置为对 `/.well-know` 特殊处理, 你就需要修改服务器配置确保在 `./well-known/acme-challenge` 目录中的文件可以被外网访问。

> To obtain a cert using a built-in “standalone” webserver (you may need to temporarily stop your existing webserver, if any) for example.com and www.example.com:

如果使用一个内置的 "标准" web 服务器来获取 example 和 www.example.com 的证书(你可能需要暂时停止你正在运行的 web 服务器):

`sudo certbot certonly --standalone -d example.com -d www.example.com`

> You can also use one of Certbot's DNS plugins to obtain a certificate if it's installed and you have configured DNS for the domain you want to obtain a certificate for with the DNS provider matching the plugin. To see more information about using these plugins, click [here](https://certbot.eff.org/docs/using.html#dns-plugins). If you want to use one of these plugins with Let's Encrypt's new ACMEv2 server that will issue wildcard certificates, you'll also need to include the following flag on the command line:

如果你已经安装了 Certbot 的 DNS 插件，并且为该域名配置了 DNS，那么可以使用与相应的 DNS 供应商匹配的插件来获得证书。点击 [这里](https://certbot.eff.org/docs/using.html#dns-plugins) 了解更多信息. 如果你想使用插件配合 Let's Encrypt 的 new ACMEv2 server 来颁发通配符证书, 你还需要在命令行中包含下面的标记:

`--server https://acme-v02.api.letsencrypt.org/directory`

### Automating renewal

> Certbot can be configured to renew your certificates automatically before they expire. Since Let's Encrypt certificates last for 90 days, it's highly advisable to take advantage of this feature. You can test automatic renewal for your certificates by running this command:

Certbot 可以配置为在到期之前自动更新. 强烈推荐使用自动更新的特性, 因为 Let's Encrypt 证书只能持续 90 天. 你可以运行下面的命令来测试你证书的自动更新:

`sudo certbot renew --dry-run`

> If that appears to be working correctly, you can arrange for automatic renewal by adding a [cron job](http://www.unixgeeks.org/security/newbie/unix/cron-1.html) or [systemd timer](https://wiki.archlinux.org/index.php/Systemd/Timers) which runs the following:

如果这个命令运行正确，那么你可以通过添加一个 cron job 或者 systemd timer 来自动更新你的证书时间, 像下面这样做：

`certbot renew`

> Note:
if you're setting up a cron or systemd job, we recommend running it twice per day (it won't do anything until your certificates are due for renewal or revoked, but running it regularly would give your site a chance of staying online in case a Let's Encrypt-initiated revocation happened for some reason). Please select a random minute within the hour for your renewal tasks.

注意：
如果你正在配置 cron 或 systemd，我们建议你每天运行两次(除非你的证书到期或被撤销，否则它不会做任何操作，但是定期运行这个命令可以让你的网站保持在线状态以防由于某些其它原因被 Let's Encrypt 撤销)。请给你的更新任务选择一个小时内的随机分钟进行。

> An example cron job might look like this, which will run at noon and midnight every day:

一个在每天中午和晚上都会运行的 cron job 可以像下面这样配置：

`0 0,12 * * * python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew`

> More detailed information and options about renewal can be found in the [full documentation](https://certbot.eff.org/docs/using.html#renewal).

关于更新证书更详细的信息请参考[完整文档](https://certbot.eff.org/docs/using.html#renewal), 在完整文档中你还可以学到一些有用的命令和参数,如
`certbot renew --pre-hook "service nginx stop" --post-hook "service nginx start"`
在每次 renew 前后执行相应的代码等.
