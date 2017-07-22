# [Cordova Command-line-interface (CLI) Reference](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html)

## 语法

`cordova <command> [options] -- [platformOpts]`

## 全局命令列表

这些命令在任何时候都可以用

| 命令 | 描述与作用 |
| :------------- | :------------- |
| create | 创建一个Cordova项目 |
| help | 得到某个命令的帮助信息 |
| telemetry | 开启或关闭遥测（telemetry collection）收集 |

## 项目命令列表

这些命令在当前目录是一个有效的Cordova 项目的时候可以用。

| 命令 | 描述与作用 |
| :------------- | :------------- |
| info | 生成项目信息 |
| requirements | 检查平台已经安装的必须信息和缺少的信息 |
| platform | 管理项目平台 |
| plugin | 管理项目插件 |
| prepare | 项目构建的时候，将文件拷贝到平台中 |
| compile | 构建平台 |
| clean | 清除构建的项目 |
| run | 运行项目（包含 prepare 和 compile） |
| serve | 用本地 webserver 运行项目（包含 prepare） |   


## 命令参数

这些命令参数适用于所有 cordova-cli 命令。

| 参数选项 | 描述与作用 |
| :------------- | :------------- |
| -d 或 --verbose | 向shell 输出详细信息。如果你使用 cordova-cli 作为一个 node module，你也可以通过 `cordova.on('log', function(){})` 或者 `cordova.on('warn', function() {})` 来订阅 `log` 和 `warn` 事件 |
| -v 或 --version | 输出 cordova-cli 的安装版本信息 |
| --no-update-notifier | 禁用更新检查。另外设置 `~/.config/configstore/update-notifier-cordova.json` 中的 `"optOut": true`或者将 `NO_UPDATE_NOTIFIER`环境变量设置为任意值。参考[update-notifier 文档](https://www.npmjs.com/package/update-notifier#user-settings) |
| --nohooks | 抑制 hook 的执行（使用正则表达式作为参数） |
| --no-telemetry | 禁用当前命令的遥测收集 |

## 平台指定参数（Platform-specific options）

某些确定的命令有专用于某个平台的参数（`platformOpts`）
