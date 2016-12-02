# yarn

## yarn features
- Ultra Fast (超快)
  - yarn 缓存每一个下载过的包，并且并行化所有操作来最大化资源利用率，比以往都快

- Mega Secure (超安全)
  - 在执行代码之前，Yarn使用校验和来验证每个已安装的软件包的完整性。

- Super Reliable (超可靠)
  - 保证各个系统之间的一致性

- Offline Mode (离线模式)
  - 之前安装过的包，可以在没有网络的情况下再次安装

- Deterministic (确定性)
  - 不依赖于包的安装顺序，相同的依赖在不同的机器上也会采用相同的方式安装

- Network Performance (网络性能良好)
  - yarn 高效的将请求列队，避免瀑布效应。

- Multiple Registries (多注册库)
  - 不管是从 npm 或者是 bower 安装的包，都保持工作流程相同

- Network Resilience (具有网络弹性)
  - 单个请求失败不会导致安装失败，在失败过后会重新尝试请求资源

- Flat Mode (平面模式)
  - 将不匹配的版本转换为某一个合适版本，避免重复创建

总结： 安全，可靠，快速

## [install](https://yarnpkg.com/en/docs/install)

## Usage

### Common Usage
- `yarn init [--yes / -y]`
- `yarn add [package] [@version / @tag]`

  - options:
    - `default`: add to dependencies
    - `--dev`: add to devDependencies
    - `--peer`: add to peerDependencies
    - `--optional`: add to optionalDependencies


- `yarn upgrade [package] [@version / @tag]`
- `yarn remove [package]`
- `yarn / yarn install`
  - options:
    - `default`: 安装所有依赖
    - `--flat`: 只安装一个依赖的某一个版本
    - `--force`: 强制重新下载所有包
    - `--production` / `--prod`: 仅安装生产依赖(production devDependencies)

- `yarn global`

  - 与其他命令配合使用
    - `yarn global add [package] [@version / @tag]` 自动全局安装指定包
    - `yarn global bin`  显示 yarn 的 bin 目录位置
    - `yarn global ls`  列出所有已经安装的包
    - `yarn global remove`  移除当前的某个不再使用的包
    - `yarn global upgrade`  根据指定范围升级某个包到最新版本


## [命令参考](https://yarnpkg.com/en/docs/cli)

- `yarn cache clean`  ###

  - yarn 会在全局 cache 中保存每一个安装过的包，在 `yarn` 或者 `yarn install` 之后与运行可以清除本地缓存文件文件，相关命令： `yarn cache ls`；  `yarn cache dir`

- `yarn check`  ###

 - 检查已安装的包与package.json里面所指定的版本是否一致，参数 `--integrity` 会检查 hash 值来确定该包是否被篡改

- `yarn clean`  ###

  - 移除 node_modules 中不需要的文件，释放磁盘空间，一旦使用该命令，就会创建一个 .yarnclean 文件，并且应该被添加到版本控制器，之后在 `yarn install` 或者 `yarn add` 的时候会自动执行

- `yarn config`  ###
  - `yarn config set <key> <value> [-g|--global]`
  - `yarn config get <key>`
  - `yarn config delete <key>`
  - `yarn config list`   ### 显示当前配置信息

- `yarn info <package> [<field>]`   ###

  - 查看某个包的信息，可以指定版本号，或者信息中的某个字段， `field` 即为单个字段， `--json` 返回 JSON 数据

- `yarn licenses ls`  ###

  - 列出按字母排序的包和每个包的 license，参数 `yarn licenses generate-disclaimer` 返回单个及 license 信息

- `yarn link <package>`  ###

  - 创建包的软链接，取消链接  `yarn unlink <package>`

- `yarn login`   ###

  - 登陆  npm rigistry，退出 `yarn logout`

- `yarn outdated`   ###

  - 列出所有依赖的版本信息，包括当前版本，需要的版本和最新版本，`yarn outdated [package...]`

- `yarn owner`   ###

  - 指定包的管理者，一个包可能有多个管理者，
    - `yarn owner ls <package>`   ###  列出某个包的所有 owner
    - `yarn owner add <user> <package>`  ### 为某个包添加 owner
    - `yarn owner rm <user> <package>`   ### 移除某个包的某个 owner

- `yarn pack`   ###

  - 创建一个依赖的 gzip 压缩包，`yarn pack --filename <filename>` 给压缩包指定名称

- `yarn publish`   ###

  - 一旦包被发布，你将永远不能改变它的版本号，所以在发布之前需谨慎，从npmjs.com移除发布的包，使用 `npm unpublish <package> [--force]`
    - `yarn publish`   ### 发布在当前目录的 package.json 中定义的包
    - `yarn publish [tarball]`   ### 发布由gzip过后的 .tgz 包
    - `yarn publish [folder]`   ### 发布 folder 中的包
    - `yarn publish --tag <tag>`   ### 给发布的包打上 tag
    - `yarn publish --access <public|restricted>`   ### 指定包发布为public 还是受限制的 restricted

- `yarn remove <package...>`

  - 移除指定包，并更新 package.json 和 yarn.lock 文件

- `yarn run`

  - 运行 package.json 中的 scripts 对象

  - 可以通过 `--` 传递额外参数给 scripts 中的命令，如 `yarn run test -- -o --watch` ，则 `-o` 和 `--watch` 会传递给 scripts 中定义的该项目命令

  - 如果 scripts 中没有指定命令，运行 `yarn run` 将会列出可以执行的所有 scripts 命令

- `yarn self-update`   ###

  - 将 yarn 更新到最新版本

- `yarn tag`   ###

  - 添加，移除或者罗列某个包的 tags
    - `yarn tag add <package>@<version> <tag>`   ### 给某个版本添加 tag
    - `yarn tag rm <package> <tag>`   ### 移除包的 tag
    - `yarn tag ls [<package>]`   ###  罗列包的所有 tag，如果没指定包，则罗列当前目录的包

- `yarn team`   ###

  - 管理团队组织，更改团队成员，可通过配置 `--registry = <registry url>` 使该命令会直接操作当前注册库，
    - `yarn team create <scope:team>`   ### 创建一个新团队
    - `yarn team destroy <scope:team>`   ### 销毁一个已经存在的团队
    - `yarn team add <scope:team> <user>`   ### 给某个已经存在的团队添加成员
    - `yarn team rm <scope:team> <user>`   ### 移除团队的某个成员
    - `yarn team ls <scope>|<scope:team>`   ### 如果是在组织(organization)上执行该命令，将会返回组织中的所有团队，如果是团队名(team)，则返回指定团队的所有用户

- `yarn run test`   ###

  - 运行 scripts 的 test 命令，可以简写为 `yarn test`

- `yarn upgrade`   ###

  - 基于package.json指定的版本范围，升级所有依赖到范围的最新版本，同时也会创建 yarn.lock 文件
    - `yarn upgrade [package]`   ### 升级某个指定的包
    - `yarn upgrade [package@version]`   ###
    - `yarn upgrade [package@tag]`   ###
    - `yarn upgrade [package] --ignore-engines`   ### 忽略yarn的文件校验

- `yarn version`   ###

  - 根据提示更新你自己创建的包的版本信息，在git仓库中执行该命令将会按照 v0.0.0 的格式创建git tag，你可以根据 `yarn config set` 来禁止创建git tag，参考[Git tags](https://yarnpkg.com/en/docs/cli/version#toc-git-tags)
    - `yarn version --new-version <version>`   ### 根据 version 创建一个新的版本
    - `yarn version --no-git-tag-version`  ### 仅创建一个新版本，不创建 git tag

- `yarn why <query>`

  - 指明某个包为何被安装，是因为其他包依赖与它，或是因为它被列在了 package.json 清单中。
  - 参数 `<query>` 可以是 包名， 包目录 或者是 包目录下面的某个文件
