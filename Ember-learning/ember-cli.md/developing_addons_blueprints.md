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

导出的对象会继承 `Addon` 类，所以任何在 `Addon` 类上面存在的钩子函数都可以被覆盖重写。

#### 配置ember插件属性

默认情况下，`package.json`中的`ember-addon` 具有 `configPath` 属性，用于指定`config` 目录来测试虚拟应用程序。

可选：你可以指定你的插件必须在其他插件运行之前（before字段）启动还是之后(after字段)，所有这些属性可以是一个字符串或者字符串数组，字符串代表其它插件在其 package.json 中定义的名称。

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

插件的 `ember-cli-build.js` 仅仅是用来配置在 `tests/dummy/` 目录下的虚拟引用程序。它不会被包含它的应用程序所引用到。

 如果你需要使用 `ember-cli-build.js`，你需要制定一个相对于插件根目录的路径。例如，配置 `ember-cli-less` 来在 dummy app 中使用 `app.less`：

 ``` js
 // ember-cli-build.js
 var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

 var app = new EmberAddon({
   lessOptions: {
     paths: ['tests/dummy/app/styles/'],
     outputFile: 'dummy.css'
   }
 });

 module.exports = app.toTree();
 ```

#### 插件组件

实际上插件的代码在 `addon/components/x-button.js` 中

``` js
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',

  setupXbutton: Ember.on('didInsertElement', function() {
    // ...
  }),

  teardownXbutton: Ember.on('willDestroyElement', function() {
    this.get('x-button').destroy();
  }),
});
```

为了让外部应用程序能够直接使用组件提供的模板，你需要通过插件的 `app/components/` 目录来桥接该组件，使之能在外部引用。仅仅是重新 export 你的组件即可：

``` js
// app/components/x-button.js
export { default } from 'ember-cli-x-button/components/x-button';
```

这样的设置允许其他用户在外部应用程序名字空间（app/）里面继承和修改该组件。这就意味着安装过该插件（`x-button`）的用户可以在template中通过`{{x-button}}`来使用该组件而不需要额外的配置。


#### 默认的 blueprint

与该插件具有相同名称的blueprint（unless explicitly changed, see above）将会在插件安装的时候自动运行（in development, it must be manually run after linking）。在这里，你需要将你插件的 bower 依赖绑定到客户端应用程序上以便他们能够正常安装。

要创建该 blueprint，需要添加文件 `blueprints/ember-cli-x-button/index.js`。

``` js
// blueprints/ember-cli-x-button/index.js
module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    return this.addBowerPackageToProject('x-button'); // is a promise
  }
};
```

#### 使用依赖

你可以通过使用不同的钩子函数来拉取插件、npm包、bower包。他们遵循以下规则：
  - `addAddon(s)ToProject` 添加插件到项目的 package.json 中并且如果提供了 defaultBlueprint ，则会运行 defaultBlueprint
  - `addBowerPackage(s)ToProject` 添加一个 package 到项目的 `bower.json`
  - `addPackage(s)ToProject` 添加一个 package 到项目的 `package.json`

每一项都返回一个 promise，所以它们都可以用promise的then：

``` js
// blueprints/ember-cli-x-button/index.js
module.exports = {
  normalizeEntityName: function() {}, // no-op since we're just adding dependencies

  afterInstall: function() {
    // Add addons to package.json and run defaultBlueprint
    return this.addAddonsToProject({
      // a packages array defines the addons to install
      packages: [
        // name is the addon name, and target (optional) is the version
        {name: 'ember-cli-code-coverage', target: '0.3.9'},
        {name: 'ember-cli-sass'}
      ]
    })
    .then(() => {
      // Add npm packages to package.json
      return this.addPackagesToProject([
        {name: 'babel-eslint'},
        {name: 'eslint-plugin-ship-shape'}
      ]);
    })
    .then(() => {
      return this.addBowerPackagesToProject([
        {name: 'bootstrap', target: '3.0.0'}
      ]);
    });
  }
};
```

#### 导入依赖文件

如前所述，在 build 的过程中，插件主入口（index.js）的钩子函数 `included`会自动运行。在这里你可以使用 `import` 语句来添加依赖文件。Note that this is a separate step from adding the actual dependency itself—done in the default blueprint—which merely makes the dependency available for inclusion.

``` js
// index.js
module.exports = {
  name: 'ember-cli-x-button',

  included: function(app) {
    this._super.included.apply(this, arguments);

    app.import(app.bowerDirectory + '/x-button/dist/js/x-button.js');
    app.import(app.bowerDirectory + '/x-button/dist/css/x-button.css');
  }
};
```

上例使用了钩子函数 `included`，该函数被 `EmberApp` 的构造函数调用，并且使其能够通过变量 `app` 访问外部应用程序。当外部程序的 `ember-cli-build.js` 正在被 Ember CLI 用于 build 或者 serve 的时候，插件的 `included` 函数会被调用并传入 `EmberApp` 实例对象。

#### 导入静态文件

导入图片或者字体等静态文件，需要将他们放入 `/public`。外部应用程序通过一个与插件同名的目录进行访问。

例如，如果要添加一张图片，需要将它保存到 `/public/images/foo.png`，然后在外部app通过如下访问：

``` css
.foo {background: url("/your-addon/images/foo.png");}
```

#### 内容

如果你想直接添加内容到页面，你可以使用 `content-for` 标签。如 `app/index.html`中的 `{{content-for 'head'}}`，Ember CLI 在 build 期间使用它来插入自己的内容。插件可以使用 钩子函数 `contentFor` 来插入插件自己的内容。

``` js
// index.js
module.exports = {
  name: 'ember-cli-display-environment',

  contentFor: function(type, config) {
    if (type === 'environment') {
      return '<h1>' + config.environment + '</h1>';
    }
  }
};
```

这将会替换当前环境下运行的应用程序的 `{{content-for 'environment'}}`部分。 每个在 `index.html` 中的 `{{content-for}}` 标签都会调用 `contentFor` 函数。

#### 写入命令行

每个插件都会被发送一个父级应用程序的命令行输出流。如果你想在插件的 `index.js` 中输出信息到命令行，你应该使用 `this.ui.writeLine` 而不是 `console.log`。
