# [Cordova App Templates](http://cordova.apache.org/docs/en/latest/guide/cli/template.html)

cordova 应用程序模板用于使用模板来创建一个新的 cordova 项目。

## 使用模板（Template）

模板允许你用已有的代码来启动项目。

![http://cordova.apache.org/static/img/guide/cli/template.png](http://cordova.apache.org/static/img/guide/cli/template.png)

在 npm 上面搜索关键字 `cordova:template` 来查找可以创建你项目的模板。通过给 `create` 命令指定 `--template` 标志。

下面的命令分别从 NPM 包、Git 仓库、本地路径来创建 cordova 项目：

``` sh
cordova create hello com.example.hello HelloWorld --template <npm-package-name>
cordova create hello com.example.hello HelloWorld --template <git-remote-url>
cordova create hello com.example.hello HelloWorld --template <path-to-template>
```

在成功使用模板创建项目之后，给项目添加需要的平台即可。

## 创建应用程序模板

创建模板之前必须先创建好项目。然后把你应用程序的内容放到下面的目录结构中。

```
template_package/
├── package.json      (optional; needed to publish template on npm)
├──   index.js        (required)
└── template_src/     (required)
    └── CONTENTS OF APP TEMPLATE
```

当你的模板被使用的时候，所有 `template_src` 目录中的内容将会被用于创建新的项目。所以请确保在该目录中包含所有必要的文件。详细内容参考 [示例](https://github.com/apache/cordova-template-reference)

注意：`index.js` 应该导出一个 `template_src` 的引用，并且 `package.json` 应该引用 `index.js`。详细内容参考 [示例](https://github.com/apache/cordova-template-reference)

最后在 `package.json` 中添加关键字 `"cordova:template"`

```
{
  ...
  "keywords": [
    "ecosystem:cordova",
    "cordova:template"
  ]
  ...
}
```

恭喜，你创建了一个用于创建 Cordova 项目的模板。现在你就可以发布到 npm 让每个人都可以使用了。
