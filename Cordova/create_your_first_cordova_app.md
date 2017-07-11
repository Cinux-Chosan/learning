# Create your first Cordova app

这部分展示了如何创建基于 JS/HTML 的 Cordova 应用，然后使用 `cordova` 提供的命令行接口（CLI）将应用部署到本地的移动平台。先洗的 Cordova 命令行参考 [CLI reference](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html)

## 安装 Cordova CLI

Cordova 命令行工具作为一个 npm 包发布。

安装步骤：

- 下载 [Node.js](https://nodejs.org/en/download/)，它可以提供 `node` 和 `npm` 命令。
- （可选）下载安装 [git 客户端](http://git-scm.com/downloads)，CLI 使用 git 命令来获取 git 仓库的代码（有的资源在 git 上）。
- 使用 `npm` 命令安装 `cordova`。
  - OS X 和 Linux：
    `sudo npm i -g cordova`
    在 OS X 或者 Linux 上面给命令添加 sudo 前缀是为了访问如`/usr/local/share`这样的有权限限制的目录。如果使用 `nvm/nave` 工具或者对安装目录具有写权限，你可以缺省 `sudo`。还有其它缺省 `sudo` 来使用 `npm` 的[方法](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears)。
  - Windows：
    `C:\>npm i -g cordova`

`-g` 是全局安装（为了使用 cordova 命令），否则它会被安装在单请阿目录的 node_modules 目录里面。

## 创建 App

`cordova create hello com.example.htllo HelloWorld`

该行命令创建了一个 cordova app，它已经具有了必要的目录结构。默认情况下 `cordova create` 生成了一个基于 web 的应用，它的主页将展示的是 `www/index.html` 文件。

#### 额外参考：
- [Cordova create command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-create-command)
- [Cordova project directory structure](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#directory-structure)
- [Cordova project templates](http://cordova.apache.org/docs/en/latest/guide/cli/template.html#)

## 添加支持的平台

所有的后续命令都需要进入项目的目录或子目录以后再运行。

`cd hello`

我们将添加 `ios` 和 `android` 平台，确保它们被写入 `config.xml` 和 `package.json` 文件。

`cordova platform add ios`
`cordova platform add android`

查看当前有哪些平台：

`cordova platform ls`

运行命令来添加和删除平台会影响项目中的 `platform` 目录。平台会在该目录下面创建子目录。

注意，当使用 CLI 来创建应用的时候，你不需要编辑任何在 `/platform/` 目录中的文件。该目录中的文件将会在构建或者重新安装了一些插件的时候被复写。

#### 额外参考：
- [Cordova platform command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-platform-command)

## 安装构建项目的必须环境

运行或者构建app需要安装每个平台的 SDK。如果使用 `browser` 平台则不需要 SDK。

检查平台的环境安装情况：
``` sh
$ cordova requirements
Requirements check results for android:
Java JDK: installed .
Android SDK: installed
Android target: installed android-19,android-21,android-22,android-23,Google Inc.:Google APIs:19,Google Inc.:Google APIs (x86 System Image):19,Google Inc.:Google APIs:23
Gradle: installed

Requirements check results for ios:
Apple OS X: not installed
Cordova tooling for iOS requires Apple OS X
Error: Some of requirements check failed
```

#### 额外参考
- [Android platform requirements](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support)
- [iOS platform requirements](http://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html#requirements-and-support)
- [Windows platform requirements](http://cordova.apache.org/docs/en/latest/guide/platforms/win8/index.html#requirements-and-support)

## 构建 App

默认情况下，`cordova create` 生成了一个基于web的应用。任何初始化的代码都应该作为定义在 `www/js/index.js`中的 [deviceready](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready)事件的一部分。

运行下面的命令将会构建本地设置的所有的平台：

`cordova build`

也可以指定平台，如指定 ios 平台：

`cordova build ios`

#### 额外参考
- [Cordova build command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-build-command)

## 测试 App

移动平台的 SDKs 经常带有对应平台的仿真器，可以在仿真器中对应用进行测试。运行下面的命令将会重新构建 app 并在对应的仿真器中模拟应用：

`cordova emulate android`

![](http://cordova.apache.org/static/img/guide/cli/android_emulate_init.png)

`cordova emulate` 命令刷新仿真器镜像来运行最新的应用，它可以从主屏幕启动。

![](http://cordova.apache.org/static/img/guide/cli/android_emulate_install.png)

另外，您可以将手机插入电脑并直接测试应用程序：

`cordova run android`

在运行该命令之前，你需要按照每个平台不同的程序设置测试设备。

#### 额外参考

- [Setting up Android emulator](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-up-an-emulator)
- [Cordova run command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-run-command)
- [Cordova emulate command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-emulate-command)

## 添加插件

你可以利用标准的 web 技术来编辑默认生成的 app。但是如果你想访问移动端的硬件设备，你需要添加一些对应的插件。

插件暴露出了 Javascript API 来调用原生的 SDK 提供的功能。插件一般发布在 npm 上，你可以在[插件搜索页面](http://cordova.apache.org/plugins/)查找对应的插件。Apache Cordova 有一些开源项目来提供了一些核心的 API，它们在 [Core Plugin APIs](http://cordova.apache.org/docs/en/latest/guide/support/index.html#core-plugin-apis)。你也可以使用 CLI 来打开搜索页面：

`cordova plugin search camera`

运行命令来将插件添加到 `config.xml` 和 `package.json`：

```sh
$ cordova plugin add cordova-plugin-camera
Fetching plugin "cordova-plugin-camera@~2.1.0" via npm
Installing "cordova-plugin-camera" for android
Installing "cordova-plugin-camera" for ios
```

插件也可以使用目录或者 git 仓库的方式来添加。

注意： CLI 为每个平台添加对应的插件代码。如果你想开发在[预览页面讨论过的](http://cordova.apache.org/docs/en/latest/guide/overview/index.html)更加底层的 shell 工具或者平台 SDK，你可以运行 Plugman 工具为每个平台独立添加插件。（参考[使用Plugman来管理插件](http://cordova.apache.org/docs/en/latest/plugin_ref/plugman.html)）

使用 `plugin ls` 或者 `plugin list`、`plugin` 来查看当前已经安装的插件，以标识符展示：

```sh
$ cordova plugin ls
cordova-plugin-camera 2.1.0 "Camera"
cordova-plugin-whitelist 1.2.1 "Whitelist"
```

#### 额外参考

- [Cordova plugin command reference documentation](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html#cordova-plugin-command)
- [Cordova plugin search page](http://cordova.apache.org/plugins/)
- [Core Plugin APIs](http://cordova.apache.org/docs/en/latest/guide/support/index.html#core-plugin-apis)

## 使用 merges 来自定义每个平台

尽管 cordova 能够轻易的将 app 部署到不同的平台，但是有时候你需要添加一些自定义修改。这种情况下，你不想挨个修改 `platforms` 目录下面的各个 `www` 目录的源文件，因为它们通常被顶级 `www` 目录中的跨平台源替换。

所以，顶级的 `merges` 目录提供了一个可以将指定资源部署到指定平台的地方。`merges`中每个指定平台的子目录映射了 `www` 的目录结构树，则允许你覆盖或者添加需要的文件。例如，这里展示了如何使用 `merges` 来增加安卓设备的默认字体大小：

- 编辑 `www/index.html`问加，添加一个额外的 CSS 文件，这里使用 `overrides.css`：

```html
<link rel="stylesheet" type="text/css" href="/css/master.css" />
```
- 可选的创建一个空文件 `www/css/overrides.css`，它可以避免非安卓平台在构建的时候提示文件丢失的错误。
- 在 `merges/android` 中创建 css 子目录。然后添加相应的 `overrides.css` 文件。在 `www/css/index.css` 中指定覆盖文字大小默认为 12像素的 CSS 代码：
```css
body { font-size: 14px; }
```

当你重新构建项目的时候， Android 平台的文字使用自定义大小 14px，其它平台保持不变。

你也可以使用 `merges` 来添加 `www` 目录中没有的文件。例如，一个应用程序可以在iOS界面中包含一个反向按钮图形放在 `merges/ios/img/back_button.png`。安卓平台也可以捕获对应返回按钮的 [backbutton](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#backbutton) 事件。

## 跟新 Cordova 和项目

使用下面的命令来更新 cordova:

`sudo npm update -g cordova`

指定版本：

`sudo npm i -g cordova@3.1.0-0.2.0`

运行 `cordova -v` 来查看当前的 cordova 版本。查看最新发布的 cordova 版本使用命令：

`npm info cordova version`

更新你所希望的平台：

`cordova platform update android --save`
`cordova platform update ios --save`

等等。
