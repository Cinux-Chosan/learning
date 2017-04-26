# 安装

``` sh
apm i terminal-plus
```

安装可能出错，需要安装 node-gyp

``` sh
npm i -g node-gyp
```

如果有多个 python 版本，这需要给 node-gyp 设置特定的 python 版本（报错则安装）。

``` sh
node-gyp --python /path/to/python2.7
```

如果 `node-gyp` 被 npm 调用， 并且又安装了多个 python 版本，这需要设置 npm 的 python（安装 terminal-plus 报错需要设置该项）:

``` sh
npm config set python /path/to/executable/python2.7
```
