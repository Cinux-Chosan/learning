# 使用私有模块(Working with private modules)

使用私有的包的时候,你可以轻松的使用 npm 仓库来托管自己的私有代码和使用 npm 命令行来管理它。这易与同时使用私有模块和公共模块。

## 准备条件

你需要使用版本大于 2.7.0 的 npm，并且你需要重新登陆 npm。

``` sh
sudo npm install -g npm
npm login
```

## 设置你的包

所有私有包都是有其作用域的。

作用域是 npm 的新特性。如果一个包的名字以 `@` 符号开头，则它就是一个作用域包(scoped package)，作用域就是从 @ 符号开始到 / 结束的这一段名字。

如：

`@scope/project-name`

当你以个人用户的身份登陆私有模块的时候，你的作用域就是你的用户名。

如：

`@username/project-name`

如果你使用 npm init 来初始化你的包，你可以这样传入域名：

`npm init --scope=<your_scope>`

如果你大多数时间使用的是相同的域，你可以希望给它设置默认的配置：

`npm config set scope <your_scope>`

## 发布包

`npm publish`

默认情况下，作用域包作为私有包发布。你可以参考 [作用域文档](https://docs.npmjs.com/getting-started/scoped-packages) 来了解更多。

一旦发布了该包，你在包的网页上应该能看到一个私有标志。

![](https://docs.npmjs.com/images/private-modules/private-flag.png)

## 给其他人分配访问权限

如果你想把权限分配给其它人，他们首先需要订阅这个私有包。一旦他们订阅了，你就可以给他们读写的权限。

你可以在访问页面控制这个包的访问权限。可以通过点击链接 Collaborators 或者 `+` 按钮到达这个页面。

![](http://npmblog-images.surge.sh/static-pages/collaborators-page.png)

通过输入用于名然后敲回车来添加用户。

![](http://npmblog-images.surge.sh/static-pages/add-collaborator.gif)

你还可以用下面的命令行来添加用户：

`npm owner add <user> <package_name>`

## 安装私有模块

安装私有模块之前，你必须确保自己有私有模块的访问权限。然后你就可以使用作用域包名来安装：

`npm install @scope/project-name`

引用的时候也需要这样：

```js
var proj = require('@scope/project-name');
```

## 将私有模块转换成共有模块

所有作用域包默认都是私有的，它可以确保你不小心把一些信息泻露出去。你可以在访问页面改变它：

![](http://npmblog-images.surge.sh/static-pages/make-private-ui.gif)

你也可以通过命令行来管理：

`npm access restricted <package_name>`

该包将从网站上的列表中删除，在几分钟内使其私有化。
