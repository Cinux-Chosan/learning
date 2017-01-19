# [DEVELOPING ADDONS AND BLUEPRINTS](https://ember-cli.com/extending/#detailed-list-of-blueprints-and-their-use)

插件（addon）使得分享公共代码变得很容易。

本文以一个虚构的插件 `ember-cli-x-button` 为例：

## 安装

插件可以通过 `install` 安装。 `ember install <package name>`

## 探索

Emebr CLI 将会检索应用程序的每个依赖并且搜索它们的 `package.json` 文件中的 `keywords`属性是否存在 `ember-addon`字段来确定该插件是否存在。

``` js
"keywords": [
  "ember-addon",
  ...
]
```

## 插件的使用场景

Ember CLI 插件的API当前支持如下场景：
  - 对使用应用程序的`ember-cli-build.js`中创建的EmberApp执行操作
  - 在默认的注册库上执行预处理
  - Providing a custom application tree to be merged with the consuming application
  - Providing custom express (server) middlewares
  - Adding custom/extra blueprints, typically for scaffolding application/project files
  - Adding content to consuming applications
  - Adding content to the consuming application’s tests directory (via `test-support/`)

## Addon CLI options

Ember CLI 有 addon 命令：

`ember addon <addon-name> <options...>`

**注意** : 插件不能在一个已经存在的应用程序里面创建。

## 创建插件

创建一个基本的插件 `ember addon <addon-name>`，将会看到类似于如下的输出：

``` sh
ember addon ember-cli-x-button
version x.y.zz
installing
  create .bowerrc
  create .editorconfig
  create tests/dummy/.jshintrc
  ...
  create index.js

Installing packages for tooling via npm
Installed browser packages via Bower.
```

## 插件公约

约定大于配置

## 插件项目结构

  - `app/` - 与应用程序的名字空间合并，因为应用程序默认也是 app/
  - `addon/` - 插件名字空间的一部分
  - `blueprints/` - 插件带来的 blueprints，他们以文件夹进行分离
  - `public/` - 在应用程序中可以通过 `/your-addon/*` 访问的静态文件
  - `test-support/` - 与应用程序的 `tests/` 进行合并
  - `tests/` - test infrastructure including a “dummy” app and acceptance test helpers.
  - `vendor/` - vendor specific files, such as stylesheets, fonts, external libs etc.
  - `ember-cli-build.js` - 编译配置
  - `package.json` - Node meta-data, dependencies etc.
  - `index.js` - main Node entry point (as per npm conventions)

## Package.json

刚创建好的插件的 `package.json` 看起来可能是下面这个样子：

``` js
{
  "name": "ember-cli-x-button", // addon name
  "version": "0.0.1", // version of addon
  "directories": {
    "doc": "doc",
    "test": "test"
  },
  "scripts": {
    "start": "ember server",
    "build": "ember build",
    "test": "ember test"
  },
  "repository": "https://github.com/repo-user/my-addon",
  "engines": {
    "node": ">= 0.10.0"
  },
  "keywords": [
    "ember-addon"
    // add more keywords to better categorize the addon
  ],
  "ember-addon": {
    // addon configuration properties
    "configPath": "tests/dummy/config"
  },
  "author": "", // your name
  "license": "MIT", // license
  "devDependencies": {
    "body-parser": "^1.2.0",
    ... // add specific dev dependencies here!
  }
}
```

让我们添加一些元数据来分类该插件：

``` js
"keywords": [
  "ember-addon",
  "x-button",
  "button"
]
```

#### 依赖其它插件的情况

如果你的插件依赖其他插件，则安装依赖并添加到 `package.json` 中

``` js
// ...
"dependencies": {
  "ember-ajax": "^0.7.1"
}
```

使用该插件的应用程序将会自动安装和绑定这些依赖。

#### 插件的入口

一个插件将会采用 npm 约定，查找 `index.js` 作为入口，除非在 `package.json` 中通过 `main` 属性指定了一个入口。推荐使用 index.js 作为入口

生成的 `index.js` 是一个简单的 js 对象，你可以根据自己的需要进行定义和扩展。

``` js
// index.js
module.exports = {
  name: 'ember-cli-x-button'
};
```

当 build 过程执行的时候，插件的 `included` 钩子函数将会被调用，允许你修改和执行某些操作。

``` js
// index.js
module.exports = {
  name: 'ember-cli-x-button',
  included: function(app, parentAddon) {
    this._super.included.apply(this, arguments);
    var target = (parentAddon || app);
    // Now you can modify the app / parentAddon. For example, if you wanted
    // to include a custom preprocessor, you could add it to the target's
    // registry:
    //
    //     target.registry.add('js', myPreprocessor);
  }
};
```

导出的对象会继承 `Addon` 类，所以任何在 `Addon` 类上面存在的钩子函数都可能被覆盖重写。

#### 配置ember插件属性

默认情况下，`package.json`中的`ember-addon` 具有 `configPath` 属性，用于指定`config` 目录来测试虚拟应用程序。

可选：你可以指定你的插件必须在其他插件运行之前启动还是之后，所有这些属性可以是一个字符串或者字符串数组，字符串代表其它插件在其 package.json 中定义的名称。

可选： 你可以为 `defaultBlueprint` 指定一个不一样的名字。它默认为 `package.json` 中的名字。这个 blueprint 将会在你的插件使用 `ember install` 命令安装的时候自动执行。

可选： 你可以指定 `demoURL` 属性来演示你插件的功能，像 [`Ember Addons`](http://emberaddons.com/) 和 [`Ember Observer`](http://emberobserver.com/) 将会显示该 `demoURL` 的链接。

``` json
"ember-addon": {
  // addon configuration properties
  "configPath": "tests/dummy/config",
  "before": "single-addon",
  "defaultBlueprint": "blueprint-that-isnt-package-name",
  "demoURL": "http://example.com/ember-addon/demo.html",
  "after": [
    "after-addon-1",
    "after-addon-2"
  ]
}
```

#### [Addon ember-cli-build](https://ember-cli.com/extending/#addon-ember-cli-build)
