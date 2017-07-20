# [Events](http://cordova.apache.org/docs/en/latest/cordova/events/events.html)

下面的这些事件由 cordova 提供给应用程序使用。

HTML 文件：

```html
<!DOCTYPE html>
<html>
    <head>
    <title>Device Ready Example</title>

    <script type="text/javascript" charset="utf-8" src="cordova.js"></script>
    <script type="text/javascript" charset="utf-8" src="example.js"></script>
    </head>
    <body onload="onLoad()">
    </body>
</html>
```

JS 文件：

```js
// example.js file
// Wait for device API libraries to load
// 加载文件的时候即绑定 deviceready事件
//
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
// 该事件表示设备 API 可以访问。其他 事件应该在这个事件之中添加
//
function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    // Add similar listeners for other events
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}

// Add similar event handlers for other events
```

注意： 应用程序通常应该使用 `document.addEventListener` 来在 `deviceready`事件处理函数之中添加事件。

[事件与支持的平台对照表](http://cordova.apache.org/docs/en/latest/cordova/events/events.html)

## deviceready

该事件在 Cordova 完全载入的时候触发，任何设备都支持该事件。它表明 Cordova 的设备 API 已经加载完成并准备好接受访问。

Corodva 由两部分代码库组成：原生和javascript 。当原生代码加载的时候，显示一个自定义的加载图片。然而，javascript 仅仅在 DOM 载入之后载入。这意味着在相应的原生代码变得可用之前，该 web app 可以调用对应的 Cordova javascript 函数。

`deviceready` 事件在 Cordova 完全载入的时候触发。一旦事件触发，你就可以安全的使用 Cordova API。应用程序通常在 HTML 文档 DOM 载入之后通过 `document.addEventListener` 来绑定事件处理函数。

`deviceready` 事件有些与众不同。Any event handler registered after the `deviceready` event fires has its callback function called immediately.

例：

```js
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    // Now safe to use device APIs
}
```

## pause

pause 事件在该应用被放到后台的时候触发。通常当用户切换到另外一个程序的时候当前应用会被移入后台程序队列。

例：

```js
document.addEventListener("pause", onPause, false);

function onPause() {
    // Handle the pause event
}
```

### IOS 怪癖

在`pause` 处理函数中，对任何 Cordova API 或通过 Objective-C实现的原生插件的调用都不起作用。任何伴随交互的调用如 alert 或者 `console.log()`，它们都仅仅在 app 恢复（resume） 的下一个运行循环才执行。

IOS 特定的 `resign` 事件作为 `pause` 的替代事件。and detects when users enable the **Lock** button to lock the device with the app running in the foreground. If the app (and device) is enabled for multi-tasking, this is paired with a subsequent `pause` event, but only under iOS 5. In effect, all locked apps in iOS 5 that have multi-tasking enabled are pushed to the background. For apps to remain running when locked under iOS 5, disable the app's multi-tasking by setting [UIApplicationExitsOnSuspend](http://developer.apple.com/library/ios/#documentation/general/Reference/InfoPlistKeyReference/Articles/iPhoneOSKeys.html) to `YES`. To run when locked on iOS 4, this setting does not matter.

## resume

`resume` 事件在当前系统将应用程序从后台移入前台的时候执行。

例：

```js
document.addEventListener("resume", onResume, false);

function onResume() {
    // Handle the resume event
}
```

### [IOS 怪癖](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#ios-quirks)

### [Android 怪癖](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#android-quirks)

## backbutton

当用户按下返回键的时候触发该事件。通过注册 `backbutton` 事件处理函数来覆盖默认的行为。不再需要调用任何其他方法来覆盖后退按钮的行为。

例：

```js
document.addEventListener("backbutton", onBackKeyDown, false);

function onBackKeyDown() {
    // Handle the back button
}
```

### [Window 怪癖](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#windows-quirks)

## menubutton

该事件在用户按下菜单按钮时触发。

例：

```js
document.addEventListener("menubutton", onMenuKeyDown, false);

function onMenuKeyDown() {
    // Handle the back button
}
```

## searchbutton

当用户在 Android 系统上按下了搜索按钮时触发。

例：

```js
document.addEventListener("searchbutton", onSearchKeyDown, false);

function onSearchKeyDown() {
    // Handle the search button
}
```

## startcallbutton

该事件在用户按下接听电话时触发。

例：

```js
document.addEventListener("startcallbutton", onStartCallKeyDown, false);

function onStartCallKeyDown() {
    // Handle the start call button
}
```

## endcallbutton

该事件在用户按下结束通话时触发。

例：

```js
document.addEventListener("endcallbutton", onEndCallKeyDown, false);

function onEndCallKeyDown() {
    // Handle the end call button
}
```

## volumedownbutton

该事件在用户按下“音量减”键时触发。

例：

```js
document.addEventListener("volumedownbutton", onVolumeDownKeyDown, false);

function onVolumeDownKeyDown() {
    // Handle the volume down button
}
```

## volumeupbutton

该事件在用户按下“音量增”键时触发。

例：

```js
document.addEventListener("volumeupbutton", onVolumeUpKeyDown, false);

function onVolumeUpKeyDown() {
    // Handle the volume up button
}
```

## activated

The event fires when Windows Runtime activation has occurred. See [MSDN docs](https://msdn.microsoft.com/en-us/library/windows/apps/br212679.aspx) for further details and activation types.

例：

```js
document.addEventListener("activated", activated, false);

function activated(args) {
    if (args && args.kind === Windows.ApplicationModel.Activation.ActivationKind.file) {
       // Using args.raw to get the native StorageFile object
        Windows.Storage.FileIO.readTextAsync(args.raw.detail[0].files[0]).done(function (text) {
            console.log(text);
        }, function (err) {
            console.error(err);
        });
    }
}
```

### [Windows 怪癖](http://cordova.apache.org/docs/en/latest/cordova/events/events.html#windows-quirks)
