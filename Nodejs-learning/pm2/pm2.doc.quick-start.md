# 快速入门

In seconds, this Quick Start tutorial will show you how to set up to production a Node.js application with PM2.

本文带你了解如何快速设置带有PM2的Node.js应用程序。

## 安装

- 使用 yarn: `yarn global add pm2`
- 使用 npm: `npm install pm2 -g`
- 使用 debian 操作系统的安装脚本: `apt update && apt install sudo curl && curl -sL https://raw.githubusercontent.com/Unitech/pm2/master/packager/setup.deb.sh | sudo -E bash -`

如果使用的是 docker, 参考这篇[指南](https://pm2.io/doc/en/runtime/integration/docker/)

### CLI 自动完成

Complete your installation with the CLI autocompletion:

使用 CLI 自动完成代码来完成安装:

`pm2 completion install`

## 管理多个进程

PM2 keeps a list of your processes to be able to start, restart and stop them easily.

PM2 维护了一个进程列表, 让你可以轻松的启动, 重启, 停止它们.

All your app are started in the background, letting you access to the command line. Use the PM2 CLI to interact with your apps.

为了让你能够访问命令行, 所有的应用都在后台启动. 然后使用 PM2 CLI 来与你的应用进行交互.

### 进程列表

Add processes to your process list with the start and delete commands.

使用 start 和 delete 命令将进程添加到进程列表中。

```sh
# start and add a process to your list
pm2 start app.js

# show your list
pm2 ls

# stop and delete a process from the list
pm2 delete app
```

Default process name is the filename without `.js` (eg: `app` for `app.js`). Use `--name` or `-n` to change.

默认的进程名就是不包含扩展名 `.js` 的文件名. 或者通过 `--name` 或者 `-n` 来指定.

### 用例

Once in your process list, use the process name to interact with your application.

在进程列表中, 通过进程名来与你的应用进行交互.

```sh
# stop the process (kill the process but keep it in the process list)
pm2 stop app

# start the process
pm2 start app

# both stop and start
pm2 restart app
```

You can then setup a [startup script](https://pm2.io/doc/en/runtime/guide/startup-hook/), to automatically start your process list across machine restarts.

你可以设置一个 [启动脚本](https://pm2.io/doc/en/runtime/guide/startup-hook/) 在机器重启时自动启动你的进程列表.

## 访问日志

Access your logs in realtime with `pm2 logs app`.

实时访问日志使用 `pm2 logs app`

Consult your logs history files in the `~/.pm2/logs` folder.

在 `~/.pm2/logs` 文件中查阅日志历史

## 集群化

The cluster mode scales your app accross all CPUs available, without any code modifications.

集群模式不需要修改任何代码就可以在所有可用 CPU 之间扩展你的应用.

      Before using the load balancer, make sure your application is stateless, meaning that no local data is stored in the process (sessions/websocket connections, session-memory and related).

      使用负载均衡之前，请确保你的应用程序是无状态的，这意味着没有本地数据存储在进程中（session/ WebSocket连接，session-memory等）。

To start in cluster mode, pass the `-i` option followed by the number of clusters that you want:

若要在群集模式下启动，请通过 `-i` 选项指定集群簇数：

`pm2 start app.js -i 4`

or, to automatically detect number of CPUs available:

或者自动检测可用 CPU 数:

`pm2 start app.js -i max`

Use reload instead of restart for 0-seconds downtime reloads:

使用 `reload` 命令而不是 `restart` 可以实现 0 秒重新加载:

`pm2 reload app`

## 使用 CLI 做更多操作

Use the tabulation to autocomplete and discover new commands:

使用 tab 键自动完成命令和查看匹配的命令:

![tab 键查看命令](https://pm2.io/doc/img/runtime/autocomplete.png)

Use the `--help` flag to get more informations:

使用 `--help` 获取帮助:

![使用帮助](https://pm2.io/doc/img/runtime/help.png)

## 下一步

[Ecosystem File](https://pm2.io/doc/en/runtime/guide/ecosystem-file/)