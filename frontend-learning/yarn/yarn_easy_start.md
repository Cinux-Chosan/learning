# [yarn](https://yarnpkg.com)


- yarn 为了在不同的机器上表现出相同的行为（如：安装相同版本依赖），仅依赖 `package.json` 是不够的，所以它会在项目下面 **自动** 生成一个 `yarn.lock` 文件来保存额外信息，它会在执行 add/upgrade/remove 操作的时候自动更新该文件，我们完全不需要手动修改它。

- yarn 需要在项目根目录生成 `yarn.lock` 文件。在安装依赖期间，yarn 仅使用顶级 `yarn.lock` 文件，顶级 `yarn.lock` 文件包含了整个依赖树的所有版本锁定信息，任何在依赖中的 `yarn.lock` 文件都会被忽略。

- 在项目中，需要将 `yarn.lock` 文件添加到版本控制系统中（如：git、mercurial）去，因为其他人在使用 yarn 安装依赖的时候需要使用 `yarn.lock` 来锁定到与你相同的版本。
