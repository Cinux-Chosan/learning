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
- yarn init
- yarn add [package] [@version / @tag]

> options:  
- default: add to dependencies
- --dev: add to devDependencies
- --peer: add to peerDependencies
- --optional: add to optionalDependencies


- yarn upgrade [package] [@version / @tag]
- yarn remove [package]
- yarn / yarn install
