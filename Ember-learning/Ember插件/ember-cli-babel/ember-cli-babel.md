# [Ember-cli-babel](https://www.npmjs.com/package/ember-cli-babel)

该插件使用了 [Babel](https://babeljs.io/) 和 [babel-preset-env](https://github.com/babel/babel-preset-env)

## 安装

``` sh
ember install ember-cli-babel
```

## 使用

该插件安装后可以不需要配置。默认情况下它会将项目下面的所有 `.js` 文件通过 Babel 转码成目标浏览器支持的代码（ember-cli >= 2.13：在 `config/targets.js`里面）。如果是没有 ES6 代码的 js 文件，则 Babel 转码器不会改变它的代码。

如果你需要自定义 `babel-preset-env` 来配置插件对代码的转换，你可以通过[这里](https://github.com/babel/babel-preset-env#options)查找配置参数。

例如：

- 直接配置 babel

``` js
// ember-cli-build.js

var app = new EmberApp({
  babel: {
    // enable "loose" mode
    loose: true,
    // don't transpile generator functions
    exclude: [
      'transform-regenerator',
    ]
  }
});
```

- 配置 ember-cli-babel

``` js
// ember-cli-build.js

var app = new EmberApp({
  'ember-cli-babel': {
    compileModules: false
  }
});
```


## Polyfill

Babel Polyfill 包含了 [regenerator runtime](https://github.com/facebook/regenerator/blob/master/runtime.js) 和 [core.js](https://github.com/zloirock/core-js)，但是许多转换用不到它们，如果需要完全的转换支持，则需要在项目中包含它们。[Babel 特性指引](https://babeljs.io/docs/tour/) 包含了如何引入 polyfill

可以通过在项目中的 `ember-cli-babel` 选项传入参数 `includePolyfill: true`：

``` js
// ember-cli-build.js

var app = new EmberApp(defaults, {
  'ember-cli-babel': {
    includePolyfill: true
  }
});
```

## 插件使用

那些需要额外定制的插件，需要让它们能够直接与本插件进行交互：

``` js
treeForAddon(tree) {
  let addon = this.addons.find(addon => addon.name === 'ember-cli-babel'); // find your babel addon

  let options = addon.buildBabelOptions({
    'ember-cli-babel'
  })

  return addon.transpileTree(tree, {
    'babel': {
      // any babel specific options
     },

    'ember-cli-babel': {
      // any ember-cli-babel options
    }
  });
}
```

## [Debug Tooling](https://www.npmjs.com/package/ember-cli-babel#debug-tooling)
