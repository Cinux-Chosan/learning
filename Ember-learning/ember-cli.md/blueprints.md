#

## Blueprints
Ember CLI 附带了很多 "Blueprints"，用于许多实体（models、controllers、components等）的代码片段生成。Blueprints 允许我们分享常见的Ember模式

`ember g --help` 或`ember help g` 查看可用的 blueprints 及其简介

## 生成 Blueprints

``` sh
ember generate route foo

installing
  create app/routes/foo.js
  create app/templates/foo.hbs
installing
  create tests/unit/routes/foo-test.js
```

## 自定义 Blueprint

项目中自定义的 Blueprint 优先于 Ember cli 提供的Blueprint，这使得可以通过生成同名的blueprint覆盖内置blueprint

`ember g Blueprint <name>`

``` sh
ember generate blueprint foo

installing
  create blueprints/.jshintrc
  create blueprints/foo/files/.gitkeep
  create blueprints/foo/index.js
```

## Pods

可以通过传入 `--pod` 参数来生成具有 pods 结构的内置 blueprint

``` sh
ember generate route foo --pod

installing
  create app/foo/route.js
  create app/foo/template.hbs
installing
  create tests/unit/foo/route-test.js
```

如果在 config/environment.js 里面有 `podModulePrefix` 属性，则通过 `--pod` 参数生成的路径会自动带上前缀。

``` sh
// podModulePrefix: app/pods
ember generate route foo --pod

installing
  create app/pods/foo/route.js
  create app/pods/foo/template.hbs
installing
  create tests/unit/pods/foo/route-test.js
```

pods结构支持以下blueprint：

  - adapter
  - component
  - controller
  - model
  - route
  - resource
  - serializer
  - template
  - transform
  - view

不支持pods 结构的blueprint会忽略 `--pod` 参数采用默认结构。

如果需要将默认结构设置为 pods，则可以在 .ember-cli 文件里面添加 `usePods` 属性并将其设置为 `true`。在 `uesPods` 默认为 `true` 的情况下，如果要生成或者销毁一个默认结构的 blueprint ，使用参数 `--classic`

``` sh
// .ember-cli
{
    "usePods": true
}
```

此时生成新 route:

``` sh
ember generate route taco

installing
  create app/taco/route.js
  create app/taco/template.hbs
installing
  create tests/unit/taco/route-test.js

ember generate route taco --classic

installing
  create app/routes/taco.js
  create app/templates/taco.hbs
installing
  create tests/unit/routes/taco-test.js
```

## Blueprint 结构

blueprint结构简单，以内置blueprint `helper` 为例：

``` sh
blueprints/helper
  ├── files
  │   ├── app
  │   │   └── helpers
  │   │       └── __name__.js
  └── index.js
```

随同创建的 test 在另一个 blueprint之中。test与该blueprint同名且具有`-test`前缀，它会伴随blueprint helper自动生成。

``` sh
blueprints/helper-test
├── files
│   └── tests
│       └── unit
│           └── helpers
│               └── __name__-test.js
└── index.js
```

支持 pods 结构的 blueprint看起来有一点不同，以内置 `controller` 为例：

``` sh
blueprints/controller
├── files
│   ├── app
│   │   └── __path__
│   │       └── __name__.js
└── index.js

blueprints/controller-test
├── files
│   └── tests
│       └── unit
│           └── __path__
│               └── __test__.js
└── index.js
```

## Files

`files` 包含要安装到目标目录中的所有文件的模板。

以下部分被称为令牌（token），在目录层级中就是以令牌（加扩展名）作为文件或文件夹名，在执行生成的时候，会自动修改令牌以适应不同的目录结构。简单理解为目录中的文件名占位符。

- **`__name__`** 代表在安装blueprint的时候取代的实体名。例如，当用户调用 `ember g controller foo`的时候，会在app/controller下面创建 foo.js，此时 `__name__`为`foo`，此时创建的文件为 app/controllers/foo.js；当使用`--pod`标志的时候，`ember g controller foo --pod`会在app目录下面创建foo目录，然后该目录内部创建controller.js，则 `__name__` 为 `controller`，即最后创建的文件为 app/foo/controller.js。

- **`__path__`** 代表在安装的时候的 blueprint 名。例如，当用户使用 `ember g controller foo`的时候，`__path__`为 `controller`；当使用 `--pod`标志的时候，`ember g controller foo --pod` 则 `__path__`为 `foo`（或者如果已经定义podModulePrefix的情况下为`<podModulePrefix>/foo`），此时`__name__`为controller，所以文件为 app/foo/controller.js。这主要是用于支持 pod 结构，并且仅在 blueprint 可以用在pod结构的时候必要。如果blueprint不需要提供pod 支持，则使用blueprint名字代替`__path__`即可。

- **`__root__`**

- **`__test__`**

## 模板变量

变量可以通过 `<%= someVariableName %>` 来插入到模板中

例如，内置的 blueprints `util` （`files/app/utils/__name__.js`） 看起来是下面这样：

``` js
export default function <%= camelizedModuleName %>() {
  return true;
}
```

`<%= camelizedModuleName %>` 会在安装的时候被替换为真正的值。

默认情况下提供了如下值：

  - dasherizedPackageName
  - classifiedPackageName
  - dasherizedModuleName
  - classifiedModuleName
  - camelizedModuleName

packageName 为 `package.json` 中定义的项目名

moduleName 为生成的实体名

## index.js

可以通过覆盖`index.js`中的钩子函数来自定义安装和卸载操作。`index.js`应该导出一个纯对象，它将会继承`Blueprint`类的 prototype 。必要时，可以通过 `_super` 属性获取原始 `Blueprint` 的 prototype

``` js
// index.js
module.exports = {
  locals: function(options) {
    // Return custom template variables here.
    return {};
  },

  normalizeEntityName: function(entityName) {
    // Normalize and validate entity name here.
    return entityName;
  },

  fileMapTokens: function(options) {
    // Return custom tokens to be replaced in your files
    return {
      __token__: function(options){
        // logic to determine value goes here
        return 'value';
      }
    }
  },

  beforeInstall: function(options) {},
  afterInstall: function(options) {},
  beforeUninstall: function(options) {},
  afterUninstall: function(options) {}

};
```

## Blueprint 钩子函数

如上所述，可以使用以下钩子函数来执行该自定义 blueprint 的对应操作：

  - locals
  - normalizeEntityName
  - fileMapTokens
  - beforeInstall
  - afterInstall
  - beforeUninstall
  - afterUninstall

### locals

使用 `locals` 来添加自定义模板变量。该方法接受一个参数 `options`，`options` 是一个包含常规选项和实体指定选项的对象。

当使用如下命令的时候：

```
ember g controller foo type:array --dry-run   /* 文档此处有错，官方文档上面是 --type=array，但实际测试应该是 type:array */
```

通过 `--` 传入的参数直接是挂在 `locals` 方法的参数 `options` 上的属性，通过 `type:array` 传入的参数为挂在options.entity.options上的属性。传入 `locals` 的object看起来是下面这个样子：

```
{
  entity: {
    name: 'foo',
    options: {
      type: 'array'
    }
  },
  dryRun: true
}
```

钩子函数 `locals` 必须返回一个对象或者可以resolve为object的Promise。 resolve过后的object将会与上述默认的 locals 进行合并。

### normalizeEntityName

使用钩子函数 `normalizeEntityName` 来添加自定义实体名的常规化和验证操作。默认情况下该方法不会改变实体名，但是确保实体名存在并且尾部没有斜杠。

参数：
  - 接受实体名作为第一个参数

返回值：
  - 返回的字符串将会被用于创建的新实体的名称（影响文件名以及模板中使用的 <%= xxxModuleName%>，xxx 为 dasherized、classified、camelized）。

默认代码:

``` js
normalizeEntityName: function(entityName) {
    // Normalize and validate entity name here.
    return entityName;
  },
```

### fileMapTokens

使用`fileMapTokens` 来添加自定义 fileMap tokens（令牌），这些令牌映射可以在 `mapFile`方法中使用，该钩子函数必须返回类似如下的对象：

``` js
{
  __token__: function(options){
    // logic to determine value goes here
    return 'value';
  }
}
```

返回值会与默认的 `fileMapTokens` 合并，并且可以覆盖任何默认的令牌（tokens）。

令牌被用在 `files` 目录中，并且会在调用 `mapFile` 的时候被替换为 `fileMapTokens` 定义的值。

### beforeInstall & beforeUninstall

### afterInstall & afterUninstall

### 重写 install

如果不希望你的 blueprint 安装 `files` 里面的内容你可以重写 `install`方法。

## [附录](https://ember-cli.com/extending/#detailed-list-of-blueprints-and-their-use)
