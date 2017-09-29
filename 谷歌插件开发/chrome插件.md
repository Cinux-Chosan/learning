[chrome 插件（扩展程序）](https://developer.chrome.com/extensions)

# 什么是插件

插件是一些小的软件程序，它们可以修改或增强 Chrome 浏览器的功能。你可以使用如 HTML, Javascript, CSS 这样的前端技术来编写插件。

插件没有用户界面。例如，图片 ![](https://developer.chrome.com/static/images/index/gmail-small.png) 展示了 [Google Mail Checker extension](https://developer.chrome.com/samples#google-mail-checker) 插件的图标。

插件将所有文件捆绑成一个文件提供给用户下载和安装。这里的捆绑意味着它不像一般的web应用，插件不需要依赖于网络上的内容。

你可以使用 [Chrome 开发者列表](https://chrome.google.com/webstore/developer/dashboard) 来将插件发布到 [Chrome 网络应用商城]，更多的信息参考 [store developer documentation](http://code.google.com/chrome/webstore)

#### 我该如何开始？

1、阅读 [入门教程](https://developer.chrome.com/getstarted)
2、查看 [概述](https://developer.chrome.com/overview)
3、保持追踪 [Chromium blog](http://blog.chromium.org/)
4、订阅 [chromium-extensions group](http://groups.google.com/a/chromium.org/group/chromium-extensions)

#### 精选视频

- [Technical videos](http://www.youtube.com/view_play_list?p=CA101D6A85FE9D4B)
- [Developer snapshots](http://www.youtube.com/view_play_list?p=38DF05697DE372B1)

# 入门教程：构建Chrome扩展程序

扩展程序让你不用了解原生代码就可以添加功能到 Chrome。你可以使用你现有已经掌握的那些来自web开发过程中比较熟悉的技术来开发它。如果你以前写过 web 页面，那么你应该可以很快的学会如何来编写一个插件。说干就干，通过一个简单的扩展程序的结构来用于实践，这个扩展程序使用当前页面的url作为搜索项来从Google搜索图片。
