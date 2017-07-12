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

### [Setting environment variables
](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#setting-environment-variables)
