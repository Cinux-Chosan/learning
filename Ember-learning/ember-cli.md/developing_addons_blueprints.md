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

你可以通过使用不同的钩子函数来拉取插件、npm包、bower包，它们会被自动安装并添加到package.json和bower.json里面。他们遵循以下规则：
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

这将会替换当前环境下运行的应用程序的 `{{content-for 'environment'}}`部分。 每个在 **`index.html`** 中的 `{{content-for}}` 标签都会调用 `contentFor` 函数。

#### 写入命令行

每个插件都会收到一个父级应用程序的命令行输出流。如果你想在插件的 `index.js` 中输出信息到命令行，你应该使用 `this.ui.writeLine` 而不是 `console.log`。这将会使得许多Ember命令输出的信息遵循 `--silent` 标志。

``` js
// index.js
module.exports = {
  name: 'ember-cli-command-line-output',

  included: function(app) {
    this._super.included.apply(this, arguments);
    this.ui.writeLine('Including external files!');
  }
}

```

#### 高级定制（Advanced customization）

如果想超出内置的定制范畴，更灵活的定制组建，则在插件的 index.js 文件里面可以使用以下钩子函数：

```
includedCommands: function() {},
blueprintsPath: // return path as String
preBuild:
postBuild:
treeFor:
contentFor:
included:
postprocessTree:
serverMiddleware:
lintTree:
```

它们的文档可以在此处查看: https://ember-cli.com/api/classes/Addon.html

高级定制的使用示例可以在这里查看: https://github.com/poetic/ember-cli-cordova/blob/master/index.js

如果作为服务器的中间件使用，可以查看这里：https://github.com/rwjblue/ember-cli-inject-live-reload/blob/master/index.js


#### [Testing the addon with QUnit](https://ember-cli.com/extending/#testing-the-addon-with-qunit)

#### 在 dummy app 测试中创建文件

在 `test/dummy/app`目录中你可以生成大多数 ember-cli 内置的 Blueprint。要在 dummy 中创建文件，需要添加参数 `--dummy`，否则会直接创建在插件的当前 app 目录而非 app/test/dummy/app 目录下面。

`ember g <blueprint-name> <instance-name> --dummy`

如:

`ember g component taco-button --dummy`

会生成如下:

```
tests/
  dummy/
      app/
        components/
          taco-button.js
        templates/
          components/
            taco-button.hbs
```

注意以上示例不会生成 addon-import 和 component-test。 `--dummy` 选项生成 Blueprint 的时候假设处在一个无插件项目中（non-addon project）。

如果要自己创建可以在 dummy 目录中生成的 blueprint，最主要的步骤就是 blueprint 包含 `__root__` 目录的路径。

```
blueprints/
  x-button/
    index.js
    files/
      __root__/     <-- normally "app/"
        components/
          __name__/
```

#### 创建 blueprint

blueprint 是一系列模板文件（并非特指template.hbs文件，在blueprint中的所有文件都是模板文件）和可选安装逻辑的集合。它用于根据一些参数和选项来指定生成特定的文件。更多详细信息可以参考 [generators-and-blueprints](https://ember-cli.com/extending/#generators-and-blueprints)。一个插件可以有 1 到 n 个 blueprint。

在插件中生成 blueprint:

`ember generate blueprint <blueprint-name>`

按照惯例，插件的主 blueprint 跟插件具有相同的名称。

`ember g blueprint <addon-name>`

在本例中:

`ember g blueprint x-button`

这将会为插件生成一个 `blueprints/x-button` 目录，你可以在这里为 blueprint 定义你的逻辑和模板。你也可以为单个 addon 定义多个 blueprints，最后加载的 blueprint 将会覆盖与之同名的、来自 Ember 或者其它 addon 的 blueprints（将会根据 package 的加载顺序决定）。

#### blueprints 公约

blueprint 默认在 addon 的 `blueprints` 目录下面。

如果你的 blueprint 在 addon 的其他目录，你需要通过指定 `blueprintsPath` （在上面的高级定制中有出现该属性）告诉 ember-cli 去哪里寻找它们。

blueprint遵循与Yeoman 或者 Rails 的 generator相似的约定和结构。

如果要深入 blueprint 的设计，请参考 [Ember CLI blueprints](https://github.com/ember-cli/ember-cli/tree/master/blueprints)

#### blueprint 目录结构

```
blueprints/
  x-button/
    index.js
    files/
      app/
        components/
          __name__/
```

注意：制定 `__name__` 文件或目录将会创建 `__name__` 被替代为你传递给 blueprint 的第一个参数的文件或者目录。

`ember g x-button my-button`

将会在你运行该命令的 application 中创建文件夹 `app/components/my-button`

#### 开发的时候链接到插件

在开发和测试的时候，你可以在 addon 项目的顶层运行 `npm link`，这可以使你的 addon 在本地可以通过名字访问。

然后在运行的应用程序项目顶层运行 `npm link <addon-name>` 来将它链接到项目的 `node_modules` 目录中，并将 addon 添加到 `package.json` 中。此时 addon 的任意改变都会直接反应到链接到该 addon 的项目中。

但是需要注意的是 `npm link` 不会像 `install` 一样运行默认的 blueprint，所以你将不得不手动通过 `ember g` 来执行。

为了在开发过程中对插件文件的修改也能实时反应到页面中（实时刷新页面），则需要使用 `isDevelopingAddon` 这个钩子函数：

``` js
// addon index.js
isDevelopingAddon: function() {
  return true;
}
```

当通过 npm link 来测试 addon 的时候，你需要在 `package.json` 中使用 addon name 来添加一个入口，即将 addon 的信息添加到 package.json 中：
` "<addon-name>":"version"`，本例中使用 `"ember-cli-x-button": "*"`，现在你就可以在项目中运行 `ember g <addon-name>` 了。

#### 发布 addon

使用 npm 或者 git 来发布 addon，方法如同常规的 npm package。

```
npm version 0.0.1
git push origin master --follow-tags
npm publish
```

#### 使用私有 repository

你可以将 addon 的代码上传到私有的 git 仓库（但是需要有效的 git URL）并使用 `ember install` 来安装。

如果你使用的是 [`bitbucket.org`](https://bitbucket.org/) 则 URL 的格式可以参考[这里](https://confluence.atlassian.com/bitbucket/use-the-ssh-protocol-with-bitbucket-cloud-221449711.html#UsetheSSHprotocolwithBitbucketCloud-RepositoryURLformatsbyconnectionprotocol)。

当使用 `git+ssh` 格式的时候， `ember install` 命令将会需要一个有效的 ssh key来获取读取仓库的权限。可以通过运行下面的代码来测试：

`git clone ssh://git@github.com:user/project.git.`

当使用 `git+https` 格式的时候， `ember install` 命令将会让你提供账号和密码。

#### [安装和使用插件](https://ember-cli.com/extending/#install-and-use-addon)

#### 更新 addon

你可以像通过 `ember init` 来更新 Ember app一样更新 addon。


#### 完整的示例

[Creating a DatePicker Ember CLI addon](http://edgycircle.com/blog/2014-creating-a-datepicker-ember-addon)

#### [In-Repo-Addons](https://ember-cli.com/extending/#in-repo-addons)
