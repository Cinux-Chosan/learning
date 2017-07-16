# [Config.xml](http://cordova.apache.org/docs/en/latest/config_ref/index.html)


Config.xml 是 Cordova 的全局配置文件，包含了 Cordova 多个方面的行为表现。它是一个与平台无关的 XML 文件，根据 W3C的 [Web App包（Widgets）](http://www.w3.org/TR/widgets/) 规范来制定。并且扩展了一些用于指定 Cordova 合兴 API、插件、平台相关的设置。

如果是使用 Cordova CLI 创建的项目，这个文件可以在项目的顶级目录中找到:

`app/config.xml`

注意，3.3.1~0.2.0 版本之前，这个文件在 `app/www/config.xml` 中。并且现在任然支持在这里。

当使用 CLI 来构建项目的时候，会复制该文件的多个版本到不同的 `platforms/` 子目录中。例如：

```
app/platforms/ios/AppName/config.xml
app/platforms/blackberry10/www/config.xml
app/platforms/android/res/xml/config.xml
```

除了下面的各种配置选项外，你还可以为每个目标平台配置一个应用程序的核心镜像的集合。参考 [自定义 icon](http://cordova.apache.org/docs/en/latest/config_ref/images.html)。

# Widget

config.xml 文档的根元素。

| 属性（类型） | 描述与作用     |
| :------------- | :------------- |
| id(string)       | **必须** <br> 指定应用程序的反向域标识符     |
| version(string) | **必须** <br> 采用 `主/从/补丁` 格式表示的完整版本号 |
| android-versionCode(string) (android) | Android 的替代版本。设置应用程序的[版本号](http://developer.android.com/tools/publishing/versioning.html)，如果需要了解如何修改此属性，参考[Android 指南](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-the-version-code) |
| defaultlocale (ios) | 指定应用的默认语言。as an IANA language code. |
| ios-CFBundleVersion(string) (ios) | ios 的替代版本，参考 [iOS versioning](https://developer.apple.com/library/ios/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102364) |
| osx-CFBundleVersion(string) (OS X) | OS X 的替代版本，参考 [OS X versioning](https://developer.apple.com/library/prerelease/mac/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102364) |
| windows-packageVersion(string) (windows) | Windows 的替代版本，参考 [Windows versioning](https://msdn.microsoft.com/en-us/library/windows/apps/br211441.aspx) |
| packageName(string) (windows) | 默认：Cordova.Example <br>  Windows 包名|
| xmlns(string) | **必须** <br> config.xml 文档的命名空间 |
| xmlns:cdv(string) | **必须** <br> 命名空间前缀  |

例：

```xml
<!-- Android -->
<widget id="io.cordova.hellocordova" version="0.0.1" android-versionCode="13" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
</widget>

<!-- iOS -->
<widget id="io.cordova.hellocordova" version="0.0.1" ios-CFBundleVersion="0.1.3" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
</widget>

<!-- Windows -->
<widget id="io.cordova.hellocordova" version="0.0.1" windows-packageVersion="0.1.3" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
</widget>

<!-- OS X -->
<widget id="io.cordova.hellocordova" version="0.0.1" osx-CFBundleVersion="0.1.3" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
</widget>
```

## name

指定 app 的正式名。它将出现在设备的屏幕或者 app-store 中

例：

``` xml
<widget ...>
   <name>HelloCordova</name>
</widget>
```

## description

指定出现在 app-store 列表中的元数据

例：
``` xml
<widget ...>
   <description>A sample Apache Cordova application</description>
</widget>
```
