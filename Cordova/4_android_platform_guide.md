# 安卓平台指南

该入门手册将讲述如何设置 SDK 环境来在安卓设备上部署Cordova app，如何在开发过程中选择性的使用安卓相关的命令行。不管在开发中你是想使用平台相关的 shell 工具还是跨平台的 Cordova CLI ，你都需要安装安卓 SDK。如果想要比较这两种开发途径，请查看 [预览（Overview）](http://cordova.apache.org/docs/en/latest/guide/overview/index.html#development-paths)。查看 CLI 的详细内容，看 [Cordova CLI Reference](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html)

## 必备条件

安卓 Cordova 需要 Android SDK，它可以被安装在 OS X，Linux，Windows 系统上，请参考 [System Requirements](http://developer.android.com/sdk/index.html#Requirements)
。Cordova 的最新 Android 包支持 Android [API Level](http://developer.android.com/guide/topics/manifest/uses-sdk-element.html#ApiLevels) 25。以前的 cordova-android 和 Android API 的对应关系如下表：

| cordova-android 版本 | 支持的 Android API Levels |
| :------------- | :------------- |
| 6.X.X |	16 - 25 |
| 5.X.X |	14 - 23 |
| 4.1.X |	14 - 22 |
| 4.0.X |	10 - 22 |
| 3.7.X |	10 - 21 |

值的提醒的是，这里列出的版本是指 Cordova的 Android 包的版本 —— [cordova-android](https://github.com/apache/cordova-android)，而非 Cordova CLI。在项目目录中使用命令 `cordova platform ls` 来查看你的 Cordova 项目安装的 Cordova Android 包版本。

这里有一个通用规则，Cordova 不支持在 [distribution dashboard](http://developer.android.com/about/dashboards/index.html) 统计中使用率低于 5% 的 Android 平台发布版本。

## 安装必备条件

### Java Development Kit（SDK）

安装 [Java Development Kit (JDK) 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 或更高版本。

在 Windows 上安装的时候，你需要根据 JDK 的安装路径设置环境变量 `JAVA_HOME`。参考 [环境变量设置](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables)

### Android SDK

安装 [Android Studio](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables)。详细的安装说明在Android开发者网站上。

### 添加 SDK 包

安装完 Android SDK 过后，你必须安装你需要使用的 [API level](http://developer.android.com/guide/topics/manifest/uses-sdk-element.html#ApiLevels) 包。推荐安装 cordova-android 支持的最高的 SDK 版本。参考 [Requirements and Support](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#requirements-and-support)

打开 Android SDK Manager（控制台运行 `android` 或者 `sdkmanager`），安装接下来的几项：

- 你需要的Android 版本对应的 Android Platform SDK
- Android SDK build-tools 19.1.0 或更高版本。
- Android Support Repository（在"Extras"下面）

更多详细信息查看安卓文档上的 [Installing SDK Packages](https://developer.android.com/studio/intro/update.html)

### [设置环境变量](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables)

Cordova CLI 工具需要配置一些环境变量使某些功能能够正常运行。 CLI 也许会为你设置这些变量，但是某些情况还是需要你手动来设置它们。下面的几个环境变量需要设置：

- 设置环境变量 `JAVA_HOME` 指到 JDK 安装的目录。
- 设置环境变量 `ANDROID_HOME` 指到 Android SDK 的安装目录。
- 建议你添加 Android SDK 的 `tools`、`tools/bin`以及`platform-tools` 目录到 `PATH` 中。

#### OSX 和 Linux

在 Mac 或者Linux 上面，你可以设置一个文本编辑器来创建或者修改 `~/.bash_profile` 文件。在这个文件中新增一行通过 `export` 来设置环境变量：

`export ANDROID_HOME=/Development/android-sdk/`

添加类似于下面的一行来更新 `PATH` 变量（用本地 Android SDK 的安装路径替代）：

`export PATH=${PATH}:/Development/android-sdk/platform-tools:/Development/android-sdk/tools`

在终端中重新载入修改后的 ~/.bash_profile 中的设置：

`source ~/.bash_profile`

#### [Windows](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#windows)

下面的步骤可能非常依赖于 Windows 的版本。在做了任何改变之后都请关闭然后重新打开任意命令提示窗口来查看变化是否生效。

- 点击左面左下角的开始按钮
- 搜索“环境变量”，点击 “编辑系统环境变量”
- 点击“环境变量”按钮

##### 创建环境变量
- 点击“新建”按钮，然后输入环境变量的名称和值。

##### 设置PATH 变量
- 选择环境变量`PATH`，点击“编辑”按钮
- 天假完整的路径到 `PATH`中，例如（替换成你本地的安装路径）

```
C:\Development\android-sdk\platform-tools
C:\Development\android-sdk\tools
```

## 项目配置

### 设置仿真器

如果你希望在 Android 模拟器中运行测试程序，你首先需要创建一个 Android 虚拟（Virtual）设备（Device）（AVD），查看 [管理 AVDs](https://developer.android.com/studio/run/managing-avds.html)、 [配置仿真器](https://developer.android.com/studio/run/emulator.html#about)、 [设置硬件加速](https://developer.android.com/studio/run/emulator-acceleration.html)

一旦你的 AVD 配置正确，你就可以通过运行下面的命令来在仿真器中运行 Cordova 应用：

`cordova run --emulator`

### 配置 Gradle

Cordova 使用 [Gradle](http://www.gradle.org/) 来构建 Android 项目。如果希望查看如何使用 Ant 来构建项目，请参考较老版本的文档。Android SDK tools 25.3.0 废弃了使用 Ant 来构建项目。

#### <a id="set-gradle-properties">设置 Gradle Properties</a>

通过设置 Cordova 暴露出来的 [Gradle properties](https://docs.gradle.org/current/userguide/build_environment.html) 的值来配置 Gradle 如何构建项目。有下面的 properties 可以设置：

| Property | 作用     |
| :------------- | :------------- |
| `cdvBuildMultipleApks`       | 如果设置该属性，则会生成多个 APK 文件：每个本地平台都会生成生成一个 APK，由平台自身库的类型进行支持（x86. ARM. 等），如果你的项目使用了大量的本地库文件提供的功能，则这个特性非常有用，它将会大大的提高生成 APK 的文件大小。如果没有设置该属性，则只会生成应用于所有设备的单个 APK       |
| `cdvVersionCode` | 覆盖在 `AndroidManifest.xml` 中设置的 versionCode |
| `cdvReleaseSigningPropertiesFile` | 默认为：`release-signing.properties`，是包含发布版本的签名信息的文件路径（参考 [APP签名](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#signing-an-app)） |
| `cdvDebugSigningPropertiesFile` | 默认为：`debug-signing.properties`，包含调试版本的签名信息文件的路径（参考[APP签名](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#signing-an-app)）。在你需要于其它开发者共享签名信息的时候非常有用 |
| `cdvMinSdkVersion` | 覆盖在 `AndroidManifest.xml` 中设置的 `minSdkVersion` 的值。在基于 SDK 版本生成多个 APK 的时候非常有用 |
| `cdvBuildToolsVersion` | 覆盖自动检测生成的 `android.buildToolsVersion` 的值 |
| `cdvCompileSdkVersion` | 覆盖自动检测生成的 `android.compileSdkVersion` 的值 |

你可以用下面四种方式之一来设置这些 properties：
- 像下面这样设置环境变量：
```
$ export ORG_GRADLE_PROJECT_cdvMinSdkVersion=20
$ cordova build android
```
- 在运行 Cordova 的 `build` 或者 `run` 的时候加上 `--gradleArg` 标识
`cordova run android -- --gradleArg=-PcdvMinSdkVersion=20`
- 通过在 Android platform 目录中放置一个叫 `gradle.properties` 的文件，然后在它里面像下面这样设置
```
# In <your-project>/platforms/android/gradle.properties
cdvMinSdkVersion=20
```
- 通过在文件 [build-extras.gradle](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#extending-build-gradle) 中像下面这样设置
```
// In <your-project>/platforms/android/build-extras.gradle
ext.cdvMinSdkVersion = 20
```

后面两种通过在 Android platform 目录中添加额外文件的方式不建议采用，因为它可能轻易的被覆盖或丢失。较好的方式是，在使用 build 命令的时候通过 `before_build` [hook](http://cordova.apache.org/docs/en/latest/guide/appdev/hooks/index.html) 将这两个文件从其它地方拷贝到这个目录中。

#### 扩展 build.gradle

如果你需要自定义 `build.gradle`文件，你不应该直接编辑它，而是创建一个叫 `build-extras.gradle` 的兄弟文件。该文件将会被 `build.gradle` 包含。该文件必须放在 android platform 目录中（`<your-project>/platforms/android`）。因此还是建议你通过于 `before_build`[hook](http://cordova.apache.org/docs/en/latest/guide/appdev/hooks/index.html) 关联的脚本将它拷贝进去。

例：

```
// Example build-extras.gradle
// This file is included at the beginning of `build.gradle`
ext.cdvDebugSigningPropertiesFile = '../../android-debug-keys.properties'

// When set, this function allows code to run at the end of `build.gradle`
ext.postBuildExtras = {
    android.buildTypes.debug.applicationIdSuffix = '.debug'
}
```

注意，插件也可以通过下面的方式包含 `build-extras.gradle`文件：
```xml
<framework src="some.gradle" custom="true" type="gradleReference" />
```

### 设置 Version Code

如果要修改生成的 apk 的 [version code](https://developer.android.com/studio/publish/versioning.html)，则可以通过设置应用中的 [config.xml](http://cordova.apache.org/docs/en/latest/config_ref/index.html) 文件中 `widget` 元素的 `android-versionCode` 属性。如果没有设置 `android-versionCode`，则version code 将使用 `version` 属性。例如：如果 version 是 `MAJOR.MINOR.PATCH` 这样的格式：
`versionCode = MAJOR * 10000 + MINOR * 100 + PATCH`

如果应用开启了 Gradle Property `cdvBuildMultipleApks`（参考[设置 Gradle Properties](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-gradle-properties)），则 version code 也会被乘以 10，最后一个数字用来表明构建的 apk 体系结构（ the architecture the apk was built for）。不管版本号来自 `android-versionCode` 属性或者是使用 `version` 来生成，该乘法规则都会发生。注意：将一些 plugin 添加到项目中的时候（包括including cordova-plugin-crosswalk-webview）可能会自动设置 Gradle property。


注意： 当更新property `android-versionCode` 的时候，直接从构建的 apk 来增加版本号是不明智的选择。你应该基于 `config.xml` 文件中的 `android-versionCode` 属性来增加版本，因为 property `cdvBuildMultipleApks` 导致版本号在构建的时候乘以 10，并且使用这个是的时候下一次版本号就变成了 100 倍（10 * 10）。

## App 签名

首先，你应该看 [Android app 签名要求](https://developer.android.com/studio/publish/app-signing.html)

### 使用 Flag

你需要使用下面的一些参数来签名 app：

| Parameter | Flag     | 作用 |
| :------------- | :------------- | :-------------|
| Keystore | --keystore | 保存了一组 key 的二进制文件路径 |
| Keystore Password | --storePassword | keystore 的密码 |
| Alias | `--alias` | 指定用于签名的私钥的id |
| Password | `--password` | 指定私钥的密码 |
| Type of the Keystore | `--keystoreType` | 默认：基于文件扩展名 pkcs12 或者 jks 自动检测 |

这些参数可以在命令行运行 [Cordova CLI](http://cordova.apache.org/docs/en/latest/reference/cordova-cli/index.html) `build` 或者 `run` 的时候指定。

**注意：** 你应该使用 `--` 来表明这些平台特异性的参数。例如：

`cordova run android --release -- --keystore=../my-release-key.keystore --storePassword=password --alias=alias_name --password=password
`

### 使用 build.json

另外，你需要在 build 配置文件（`build.json`）中指定它们，就像在命令行使用 `--buildConfig` 参数一样。下面有一个 build 配置文件：

``` json
{
    "android": {
        "debug": {
            "keystore": "../android.keystore",
            "storePassword": "android",
            "alias": "mykey1",
            "password" : "password",
            "keystoreType": ""
        },
        "release": {
            "keystore": "../android.keystore",
            "storePassword": "",
            "alias": "mykey2",
            "password" : "password",
            "keystoreType": ""
        }
    }
}
```

发布版本的签名中，密码（password）可以缺省，在 build 的时候会提示输入密码。

`build.json` 中同样支持混合和匹配的命令行参数。命令行的参数优先级较高。这样在运行命令行的时候指定参数覆盖 `build.json` 中的配置会非常方便。

### 使用 Gradle

你也可以通过 Gradle properties `cdvReleaseSigningPropertiesFile` 和
 `cdvDebugSigningPropertiesFile` 指向一个 `.properties` 文件来指定 签名的 properties（参考 [设置 Gradle Properties](#set-gradle-properties)）
，文件格式如下：

```
storeFile=relative/path/to/keystore.p12
storePassword=SECRET1
storeType=pkcs12
keyAlias=DebugSigningKey
keyPassword=SECRET2
```

`storePassword` 和 `keyPassword` 为可选参数，如果缺省的话会提示输入。

## [Debugging](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#debugging)

Android SDK 自带了调试工具。参考[安卓开发者文档debugging部分](https://developer.android.com/studio/debug/index.html)。此外，Android 开发者文档的 [web app 调试](http://developer.android.com/guide/webapps/debugging.html) 部分介绍了如何调试运行在 webview 中的 app。

### [在 Android Studio中打开项目](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#opening-a-project-in-android-studio)

Cordova Android 项目可以在 Android IDE —— [Android Studio](https://developer.android.com/studio/index.html) 中直接打开。在使用 Andriod Studio 内置的 debugging/profiling 工具时或者开发 Android 插件的时候非常有用。但是请注意，不建议在该 IDE 中编辑代码。它会编辑你项目中 `platforms` 目录中的代码（非`www`），修改的内容很容易被覆盖。较好的方法是编辑 `www` 目录，通过运行 `cordova build` 将修改复制到目录中。

Plugin 开发者希望在 IDE 中编辑本地代码，那么在通过`cordova plugin add` 将插件添加到项目的时候就需要使用 `--link` 标识，它会让`platforms` 目录中文件的修改映射到 plugin 的源文件夹中（反之亦然）。

下面的步骤在 Android Studio 中打开 Cordova Android 项目：

* 启动 Android Studio
* 选择 `Import Project(Eclipse ADT,Gradle,etc)`

![](http://cordova.apache.org/static/img/guide/platforms/android/asdk_import_project.png)

* 选择Android platform 目录（`<your-project>/platforms/android`）

![](http://cordova.apache.org/static/img/guide/platforms/android/asdk_import_select_location.png)

* `Gradle Sync` 问题你可以直接选择 `Yes`

一旦导入完成，你就可以直接在 Android Studio 中构建和运行 app。参考[Android Studio Overview](https://developer.android.com/studio/intro/index.html) 和 [Building and Running from Android Studio](https://developer.android.com/studio/run/index.html)

![](http://cordova.apache.org/static/img/guide/platforms/android/asdk_import_done.png)

## 以平台为中心的工作流（[Platform Centered Workflow](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#platform-centered-workflow)）

*待后续翻译*


## 升级

升级 `cordova-android` 包的版本，参考[这里](http://cordova.apache.org/docs/en/latest/guide/platforms/android/upgrade.html)

## 生命周期指南

### Cordova 和 Android

Android 应用程序通常由用户交互的一系列活动（[activities](http://developer.android.com/reference/android/app/Activity.html)）组成。活动可以被看作是构成应用程序的各个屏幕（活动可以被看作是构成应用程序的各个屏幕）。app 中不同的任务（task）经常都有自己的活动。每个活动在进入或离开用户的设备的过程中都有自己的生命周期。

相反，Android 平台上的 Cordova 应用运行在一个嵌入在单个 Android 活动中的 Webview 中。这个活动的生命周期通过文档（document）事件暴露出来。这些事件不能确保符合 Android 的生命周期，但是它们可以为保存和恢复程序状态做引导。这些事件大致按下表映射到 Android 的回调：

| Cordova 事件 | Android 中大致相同的事件    | 事件的意义 |
| :------------- | :------------- | :------------ |
| `deviceready`      | `onCreate()`  | 应用程序启动（非从后台启动） |
| `pause` | `onPause()` | 应用程序被移到后台 |
| `resume` | `onResume()` | 应用程序从后台返回到前台 |

Cordova 的其它平台都有一个类似的生命周期模型，并且在用户设备中当类似的操作（action）发生的时候都会触发与之类似的事件。但是由于 Android 原生活动的原因，Android 端可能面临一些独特的挑战。

### 是什么使得 Android 有所不同

在Android中，操作系统可以选择在后台杀死活动，以便在内存不足的情况下释放资源。但是不幸的是，当你应用程序所驻留的活动被杀死，你应用程序驻留的 webview 也被销毁了。这种情况下你应用程序管理的任何状态都将消失。当用户再次回到你的应用程序的时候，活动和 webview 都将被操作系统重新创建。但是 Cordova 应用的状态不会自动重新载入。由于这种原因，你的应用程序就必须注意这些生命周期事件，并管理程序的状态，以确保应用程序中用户的上下文在离开应用程序时不会丢失。

### 发生在什么时候？

只要你的应用程序离开用户的视线之后，就很容易被系统销毁。这里有两种主要的发生场景，第一种也是最多的情况就是当用户按了 home 键或者切换到其它应用。

然而，还有第二种情况，那就是一些插件的引入。如上所述，Cordova 应用经常受到包含 Webview 的当活动的限制。然而，插件启动的其它活动的实例可能临时将 Cordova 的应用程序移到后台。这些其他活动通常是为了在设备上安装本地应用程序执行特定任务而启动。例如，无论相机活动时候在设备上安装，[Cordova 相机插件](http://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html) 都会为照相功能启动。单用户想要使用照相功能的时候，复用已经安装的照相应用程序将会使得你的应用看起来更像一个本地应用。不幸的是，当本地活动把你的 app 移到后台的时候，操作系统就有可能杀死你的应用程序。

为了更加清晰的了解第二种情况，我们以使用照相机插件的流程为例。假设您有一个应用程序，要求用户获取一个资料的照片。如果一切正常，那么 app 中的事件会按照下面的方式运行：

* 用户于 app 交互，此时需要照相
* 相机插件启动本地相机活动
  * Cordova 活动被放入后台（触发 *pause* 事件）
* 用户照相
* 照相活动完成
  * Cordova 活动移到前台（触发 *resume* 事件）
* 用户回到开始照相时的状态

然而，这些事件流可能由于设备内存低而中断。如果操作系统杀死了活动，上面的事件顺序就像下面这样：

* 用户于 app 交互，此时需要照相
* 相机插件启动本地相机活动
  * 操作系统销毁 Cordova 活动（触发 *pause* 事件）
* 用户照相
* 照相活动完成
  * 操作系统重新创建 Cordova 活动（触发 *deviceready* 和 *resume* 事件）
* 用户感到很困惑，为什么他们突然到了程序的登陆界面。

这种情况下，操作系统杀死了后台的程序，并且程序没有在生命周期中管理它自己的状态。当用户返回 app 的时候， Webview 被重新创建，这个应用程序似乎又时从头开始了（用户在这里就感到困惑）。事件的顺序就如同用户按下了 home 键或者切换到其它应用一样。防止出现这种情况的关键在于在活动的生命周期中管理自己的状态（记录和恢复）。

### 谨慎对待生命周期

在上面的例子中，javascript 事件用斜体字标记。这些事件提供了保存和恢复程序状态的机会。你应该在你应用程序的 `bindEvents` 函数中注册回调函数来通过响应生命周期事件从而保存状态。保存什么、如何保存都由你自己定夺，但是你应该确保保存了足够恢复用户到他们离开时的确切状态的信息。

上述例子中还有一个因素只适用于第二次讨论的情况（如插件启动了一个额外的活动）。当用户照相完成的时候，不仅应用程序状态丢失，而且照片也丢失了。通常，照片会通过 相机插件 注册的回调函数传递给你的应用程序。然而，当 Webview 被销毁，回调函数也就永远丢失了。幸运的是，cordova-android 5.1.0 以上提供了一种当应用 resume 的时候获取插件调用结果的方法。

### 检索插件回调结果（cordova-android 5.1.0+）

当操作系统销毁被移到后台的 Cordova 活动的时候。任意等待的回调函数也丢失了。这意味着如果你给启动了新活动的插件传递了回调函数（如相机插件），回调在应用被重新创建的时候不会执行。然而，再从 cordova-android 5.1.0 以后， `resume` 事件内容将会包含来自启动了额外活动的插件请求的任何等待中的插件结果。

`resume` 事件内容使用下面的格式：

```
{
    action: "resume",
    pendingResult: {
        pluginServiceName: string,
        pluginStatus: string,
        result: any
    }
}
```

内容的字段定义：

* `pluginServiceName`：返回结果的插件名（如"Camera"）。这个值可以在插件的 plugin.xml 文件中的 `<name>` 标签找到
* `pluginStatus`：插件调用的状态（后面介绍）
* `result`：插件调用的结果

`pendingResult` 字段中的 `pluginStatus` 可能的值如下：
* `"OK"` - 插件调用成功
* `"No Result"` - 插件调用结束，没有任何结果值
* `"Error"` - 插件调用导致了一些常规错误
* 其它错误
  * `"Class not found"`
  * `"Illegal access"`
  * `"Instantiation error"`
  * `"Malformed url"`
  * `"IO error"`
  * `"Invalid action"`
  * `"JSON error"`

请注意，`result` 字段和 `pluginStatus` 返回值的意义取决于插件。字段的意义和值请参考你所使用的插件 API 。

#### 例

下面是一个简单的应用示例，它使用 `resume` 和 `pause` 事件来管理状态。它使用 Apache 相机插件来演示如何检索从 `resume` 事件返回的内容检索插件的结果。`resume` 的 `event.pendingResult` 对象需要 cordova-android 5.1.0 +

```js
// This state represents the state of our application and will be saved and
// restored by onResume() and onPause()
var appState = {
    takingPicture: true,
    imageUri: ""
};

var APP_STORAGE_KEY = "exampleAppState";

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        // Here we register our callbacks for the lifecycle events we care about
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    onDeviceReady: function() {
        document.getElementById("take-picture-button").addEventListener("click", function() {
            // Because the camera plugin method launches an external Activity,
            // there is a chance that our application will be killed before the
            // success or failure callbacks are called. See onPause() and
            // onResume() where we save and restore our state to handle this case
            appState.takingPicture = true;

            navigator.camera.getPicture(cameraSuccessCallback, cameraFailureCallback,
                {
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.FILE_URI,
                    targetWidth: 250,
                    targetHeight: 250
                }
            );
        });
    },
    onPause: function() {
        // Here, we check to see if we are in the middle of taking a picture. If
        // so, we want to save our state so that we can properly retrieve the
        // plugin result in onResume(). We also save if we have already fetched
        // an image URI
        if(appState.takingPicture || appState.imageUri) {
            window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
        }
    },
    onResume: function(event) {
        // Here we check for stored state and restore it if necessary. In your
        // application, it's up to you to keep track of where any pending plugin
        // results are coming from (i.e. what part of your code made the call)
        // and what arguments you provided to the plugin if relevant
        var storedState = window.localStorage.getItem(APP_STORAGE_KEY);

        if(storedState) {
            appState = JSON.parse(storedState);
        }

        // Check to see if we need to restore an image we took
        if(!appState.takingPicture && appState.imageUri) {
            document.getElementById("get-picture-result").src = appState.imageUri;
        }
        // Now we can check if there is a plugin result in the event object.
        // This requires cordova-android 5.1.0+
        else if(appState.takingPicture && event.pendingResult) {
            // Figure out whether or not the plugin call was successful and call
            // the relevant callback. For the camera plugin, "OK" means a
            // successful result and all other statuses mean error
            if(event.pendingResult.pluginStatus === "OK") {
                // The camera plugin places the same result in the resume object
                // as it passes to the success callback passed to getPicture(),
                // thus we can pass it to the same callback. Other plugins may
                // return something else. Consult the documentation for
                // whatever plugin you are using to learn how to interpret the
                // result field
                cameraSuccessCallback(event.pendingResult.result);
            } else {
                cameraFailureCallback(event.pendingResult.result);
            }
        }
    }
}

// Here are the callbacks we pass to getPicture()
function cameraSuccessCallback(imageUri) {
    appState.takingPicture = false;
    appState.imageUri = imageUri;
    document.getElementById("get-picture-result").src = imageUri;
}

function cameraFailureCallback(error) {
    appState.takingPicture = false;
    console.log(error);
}

app.initialize();
```

html:

```html
<!DOCTYPE html>

<html>
    <head>
        <meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://ssl.gstatic.com 'unsafe-eval'; style-src 'self' 'unsafe-inline'; media-src *">
        <meta name="format-detection" content="telephone=no">
        <meta name="msapplication-tap-highlight" content="no">
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
        <link rel="stylesheet" type="text/css" href="css/index.css">
        <title>Cordova Android Lifecycle Example</title>
    </head>
    <body>
        <div class="app">
            <div>
                <img id="get-picture-result" />
            </div>
            <Button id="take-picture-button">Take Picture</button>
        </div>
        <script type="text/javascript" src="cordova.js"></script>
        <script type="text/javascript" src="js/index.js"></script>
    </body>
</html>
```

### 测试活动的生命周期

Android提供了一个开发者设置，用于测试低内存中的活动破坏。在设备或者仿真器的开发者选项菜单开启 `Don't keep activities` 选项来模拟低内存场景。你应该经常使用此设置进行一些测试，以确保应用程序能够正确地维护状态。
