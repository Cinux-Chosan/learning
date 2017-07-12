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

http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-gradle-properties
