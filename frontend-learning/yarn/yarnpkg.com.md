# yarn

## yarn features
- Ultra Fast (超快)
> yarn 缓存每一个下载过的包，并且并行化所有操作来最大化资源利用率，比以往都快

- Mega Secure (超安全)
> 在执行代码之前，Yarn使用校验和来验证每个已安装的软件包的完整性。

- Super Reliable (超可靠)
> 保证各个系统之间的一致性

- Offline Mode (离线模式)
> 之前安装过的包，可以在没有网络的情况下再次安装

- Deterministic (确定性)
> 不依赖于包的安装顺序，相同的依赖在不同的机器上也会采用相同的方式安装

- Network Performance (网络性能良好)
> yarn 高效的将请求列队，避免瀑布效应。

- Multiple Registries (多注册库)
> 不管是从 npm 或者是 bower 安装的包，都保持工作流程相同

- Network Resilience (具有网络弹性)
> 单个请求失败不会导致安装失败，在失败过后会重新尝试请求资源

- Flat Mode (平面模式)
> 将不匹配的版本转换为某一个合适版本，避免重复创建

总结： 安全，可靠，快速

## [install](https://yarnpkg.com/en/docs/install)

## Usage

### Common Usage
- yarn init [--yes / -y]
- yarn add [package] [@version / @tag]

> options:
- default: add to dependencies
- --dev: add to devDependencies
- --peer: add to peerDependencies
- --optional: add to optionalDependencies


- yarn upgrade [package] [@version / @tag]
- yarn remove [package]
- yarn / yarn install

> options:
- default: 安装所有依赖
- --flat: 只安装一个依赖的某一个版本
- --force: 强制重新下载所有包
- --production / --prod: 仅安装生产依赖(production devDependencies)

- yarn global

> 与其他命令配合使用
- yarn global add [package] [@version / @tag] 自动全局安装指定包
- yarn global bin  显示 yarn 的 bin 目录位置
- yarn global ls  列出所有已经安装的包
- yarn global remove  移除当前的某个不再使用的包
- yarn global upgrade  根据指定范围升级某个包到最新版本


## [命令参考](https://yarnpkg.com/en/docs/cli)

- yarn cache clean  ###

> yarn 会在全局 cache 中保存每一个安装过的包，在 yarn 或者 yarn install 之后与运行可以清除本地缓存文件文件，相关命令： yarn cache ls；  yarn cache dir

- yarn check  ###

> 检查已安装的包与package.json里面所指定的版本是否一致，参数 --integrity 会检查 hash 值来确定该包是否被篡改

- yarn clean  ###

> 移除 node_modules 中不需要的文件，释放磁盘空间，一旦使用该命令，就会创建一个 .yarnclean 文件，并且应该被添加到版本控制器，之后在 yarn install 或者 yarn add 的时候会自动执行

- yarn config  ###

>
- yarn config set \<key> \<value> [-g|--global]
- yarn config get \<key>
- yarn config delete \<key>
- yarn config list   ### 显示当前配置信息

- yarn info \<package> [\<field>]   ###

> 查看某个包的信息，可以指定版本号，或者信息中的某个字段， field 即为单个字段， --json 返回 JSON 数据

- yarn licenses ls  ###

> 列出按字母排序的包和每个包的 license，参数 yarn licenses generate-disclaimer 返回单个及 license 信息
