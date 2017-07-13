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
