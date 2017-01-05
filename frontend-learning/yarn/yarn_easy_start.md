# [yarn](https://yarnpkg.com)


- yarn 为了在不同的机器上表现出相同的行为（如：安装相同版本依赖），仅依赖 `package.json` 是不够的，所以它会在项目下面 **自动** 生成一个 `yarn.lock` 文件来保存额外信息，它会在执行 add/upgrade/remove 操作的时候自动更新该文件，我们完全不需要手动修改它。

- yarn 需要在项目根目录生成 `yarn.lock` 文件。在安装依赖期间，yarn 仅使用顶级 `yarn.lock` 文件，顶级 `yarn.lock` 文件包含了整个依赖树的所有版本锁定信息，任何在依赖中的 `yarn.lock` 文件都会被忽略。

- 在项目里，需要将 `yarn.lock` 文件添加到版本控制系统中（如：git、mercurial）去，因为其他人在使用 yarn 安装依赖的时候需要使用 `yarn.lock` 来锁定到与你相同的版本。


## 常用命令

### 添加模块

#### yarn add

- yarn add <package...>  
  - 安装模块到 dependencies

- yarn add <package...> [--dev / -D]
  - 安装模块到 devDependencies

#### yarn global

`yarn global`作为其他命令的前缀，它可以配合 `add`、`bin`、`ls`、`remove`运行。

- yarn global add <package>
  - 全局安装模块

- yarn global remove <package>
  - 全局移除模块

- yarn global upgrade <package>
  - 升级全局模块

### yarn 管理

#### yarn cache

yarn 会将每一个安装的包全局缓存，这样在下次安装或者离线安装的时候比较快速。

- yarn cache dir
  - 打印全局缓存目录，修改该目录路径使用 `yarn config set cache-folder <path>`，执行命令时临时修改使用 `yarn <command> --cache-folder <path>`

- yarn cache ls
  - 打印所有缓存的包信息

- yarn cache clean
  - 清理缓存文件，在执行了 `yarn` 或者 `yarn install` 过后运行，可以删除所有缓存
