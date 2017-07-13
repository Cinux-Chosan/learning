# 安卓平台入门

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

#### 设置Gradle Properties

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
