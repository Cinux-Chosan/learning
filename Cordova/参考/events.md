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
