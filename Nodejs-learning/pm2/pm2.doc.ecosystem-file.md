# 生态文件

When deploying on multiple server or when using multiple CLI arguments, an alternative to the command line become more conveninent for starting your apps.

当在多个服务器上部署或者当使用多个 CLI 参数的时候, 命令就会变得复杂, 因此我们需要寻找一种可替代方案.

The purpose of the ecosystem file is to gather options and environment variables of all your applications.

生态文件的目的就是集合所有应用的选项和环境变量.

## 创建模板

Generate an `ecosystem.config.js` template with:

通过这个命令创建一个 `ecosystem.config.js` 模板:

`pm2 init`

This will generate:

它生成这样一个文件:

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

For more information about available properties, check the [ecosystem file reference](https://pm2.io/doc/en/runtime/reference/ecosystem-file/).

可用参数请查看 [ecosystem file 参考手册](https://pm2.io/doc/en/runtime/reference/ecosystem-file/)

## 使用生态文件

### 用例

Inside the folder, add all the applications to your process list with:

在这个文件夹内, 使用下面这个命令添加应用到你的进程列表:

`pm2 start`

You can also load the ecosystem from an other folder with:

你还可以从其它目录加载生态文件:

`pm2 start ~/my-app/ecosystem.config.js`

### 只使用特定的应用程序

Use your ecosystem file only on a specific application with the option `--only <app_name>`:

通过指定 `--only <app_name>` 在指定应用上使用生态文件:

`pm2 start --only app`

## 环境变量

You can declare multiple, each entry must be format according to `env_<environment-name>`.

你可以声明多个环境变量, 每个条目格式应该是这样 `env_<environment-name>`

Here, the app process can be start with two environments: `development` and `production`.

这里, app 进程可以使用两个环境变量: `development` 和 `production` :

```js
module.exports = {
  apps : [{
    name: "app",
    script: "./app.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
```

Select one of them with the `--env` flag:

使用 `--env` 来选择它们:

```sh
pm2 start ecosystem.config.js
pm2 start ecosystem.config.js --env production
```

## 不变的环境

Once added to your process list, the process environment is immutable.

进程一旦加入到进程列表, 进程环境就不能改变了.

The process environment is generated when you add a process to your process list, using:

当你添加一个进程到进程列表时, 就生成了进程的环境:

- the current environment
- the ecosystem file

- 当前环境
- 生态文件

Thus, if you restart your process list having a different current environment or having a new ecosystem file, the process environment doesn’t change.

因此，如果重新启动具有不同当前环境或具有新生态系统文件的进程列表时，进程环境不会更改。

This behavior has been made to ensure consistency across restarts of your app.

此行为是为了确保应用重新启动时的一致性。

### 更新环境

If you want to force an update, you must use `--update-env` :

如果你如果你想强制更新，你必须使用 `--update-env` ：

```sh
# refresh the environment
pm2 restart ecosystem.config.js --update-env

# switch the environment
pm2 restart ecosystem.config.js --env production --update-env
```

## 下一步

[进程管理](https://pm2.io/doc/en/runtime/guide/process-management/)