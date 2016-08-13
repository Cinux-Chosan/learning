# BOM


> 全局变量会成为window的属性，但是全局变量和直接在window上面定义变量还是有差别的，全局变量不可使用delete删除，var age;delete age;会报错，但是delete window.age;是可以的。因为定义全局变量的时候，变量的[[Configurable]]被设置为false;

> 窗口关系及框架：每个框架都有自己的window对象，并且保存在frames集合中。可以通过索引或者框架名称来访问相应的window对象。每个window对象都有一个name属性表示框架的名称。

                            <html>
                              <head>
                                <title>Frameset</title>
                              </head>
                              <frameset rows="160,\*">
                                <frame src="frame.htm" name="topFrame">
                                <frameset cols="50%,50%">
                                  <frame src="anotherframe.htm" name="leftFrame">
                                  <frame src="yetanotherframe.htm" name="rightFrame">
                                </frameset>
                              </frameset>
                            </html>
>> 上例可以通过 window.frames[0]或者window.frames["topFrame"]来引用上方的框架。但是由于每个window是当前框架的实例，而top对象始终都是最高层框架，即浏览器窗口，所以最好是使用top来引用，而非window对象。

>> 另一个window对象是parent，顾名思义为当前框架的直接上层框架，某些情况下可能等于top，但没有框架的情况下，parent一定等于top。

>> 另外还有一个是self对象，它完全就是window对象，

>> 另外，由于每个window对象都包含原生类型的构造函数，因此每个框架都有一套自己的构造函数并且一一对应，但并不相等。如：top.Object == top.frames[0].Object;返回false。这个问题会影响到对跨框架传递的对象使用 instanceof 操作符。


> window.open()：既可以导航到一个特定的URL，也可以打开一个新的浏览器窗口，返回指向新窗口的引用。
>> 参数1： 要加载的URL

>> 参数2： 目标窗口，如果是框架名称，就会在该框架下加载第一个参数指向的URL，即 target属性值，如 <a href="http://www.baidu.com" target="topFrame"></a>在如果有窗口或者框架名叫 topFrame的情况下在该窗口加载参数1的URL，该参数还可以是_self或者_parent或者_top或者_blank。

>> 参数3： 特性字符串，包含了新建窗口或标签的属性，如高度宽度，以逗号分隔，但是整个字符串中不允许有空格，以下是一些默认设置：
>>> fullscreen: yes/no  是否最大化，仅限IE

>>> height: numeric  新窗口高度，不能小于100

>>> width: numeric  新窗口宽度，不能小于100

>>> left: numeric  非负值，新窗口左坐标

>>> top: numeric  非负值，新窗口上坐标

>>> loaction:  yes/no  是否在浏览器窗口显示地址栏，如果为no，地址栏可能被隐藏或者禁用

>>> menubar:  yes/no  是否在浏览器中显示菜单栏，默认no

>>> resizable:  yes/no  是否可改变新窗口大小，默认no

>>> scrollbars: yes/no   如果内容在视口内显示不下，是否允许滚动，默认no

>>> status:  yes/no  是否在浏览器窗口显示状态栏，默认no

>>> toolbar:  yes/no  是否在浏览器中显示工具栏，默认no



>> 参数4： 布尔值，代表是否取代浏览器历史记录中的当前加载页面，只在不打开新窗口的情况下使用

>> 用例1：

                window.open("http://www.wrox.com", "wroxWindow", "height=400,width=400,top=100,left=100,risizable=yes");

>> 用例2：

                var wroxWin = window.open("http://www.wrox.com", "wroxWindow", "height=400,width=400,top=100,left=100,risizable=yes");

                wroxWin.resizeTo(500,500);

                wroxWin.moveTo(200,200);

                wroxWin.close();   // 主窗口在没有用户同意的情况下是不能关闭的，但是弹出窗口可以。关闭之后，不再有其他用处，唯一的用处是检测其是否关闭：  wroxWin.closed; 返回true

>> 新创建的window对象又一个opener属性，其中用于保存打开它的原始窗口对象：wroxWin.opener == window; // true

>> 某些浏览器会在独立的进程中运行每个标签页，如果一个标签页打开另一个标签页时，两个window对象之间需要彼此通信，那么新标签页就不能运行在独立进程中，在chrome中将新标签页的opener设置为null即表示需要在单独的进程中运行新标签页。

                wroxWin.opener = null;   // 切断标签页之间的联系过后，无法恢复

>> 大多数浏览器都内置弹出窗口屏蔽程序，也有部分是第三方插件。如果是内置程序，大多数情况 window.open会返回null，使用以下方式检测：

                  var wroxWin = window.open("http://www.wrox.com", "_blank");
                  if (wroxWin == null) {
                    alert("The popup was blocked!");
                  }
>> 第三方插件可能会抛出错误，所以处理方式如下：

                  var blocked = false;
                  try{
                    var wroxWin = window.open("http://www.wrox.com", "_blank");
                    if (wroxWin == null) {
                      blocked = true;
                    }
                  } catch (e) {
                    blocked = true;
                  }
                  if (blocked) {
                    alert("The popup was blocked!");
                  }

> setTimeout():
>> 参数1：可以是一段javascript字符串（类似eval执行的字符串）或一个函数。该段代码在全局作用域中执行，因此函数中的this在飞严格模式为window对象，严格模式为undefined。

>> 参数2：表示将任务添加到javascript任务队列的剩余时间。如果任务队列为空，则立即执行，如果不为空，则按序执行。


> setInterval():间歇调用，参数同setTimeout()，但是会定时执行，一般情况下使用setTimeout()模拟 setInterval()的效果，因为setInterval()如果忘了取消会一直执行下去。另外，setInterval()中，后一次间歇调用可能会在前一个结束前启动。


> 系统对话框： alert(); confirm(); prompt(); print();  find();
>> alert()仅提示用户

>> confirm()需要用户确认

>> prompt()获得用户输入

>> print()调用打印服务

>> find()启动查找窗口


> location 对象：提供与当前窗口中加载的文档有关的信息，还提供一些导航功能。
>> location对象既是window对象的属性，也是document对象的属性。
>> 属性：
>>> hash: 返回URL中的hash值，即#号后跟的0或多个字符，如果URL不包含散列值，则返回空字符串，如 "#contents"

>>> host: 返回服务器名称和端口号，如 "www.wrox.com:80"

>>> hostname: 返回不带端口号的服务器名称

>>> href: 返回当前加载页面的完URL，location.toString()也返回该值。

>>> pathname: 返回URL中的目录和文件名，如 "/WileyCDA/"

>>> port: 返回URL中指定的端口号，如果无则返回空字符串

>>> protocol: 返回页面使用的协议，如 "http:"

>>> search: 返回URL中的查询字符串，以？开头，如 "?q=javascript"

>> 尽管location给出的属性能够访问大多数信息，但是对于访问查询字符串的具体信息并不方便。所以可以封装函数，处理单独的查询数据：

                    function getQueryStringArgs() {
                      var qstr = (location.search.length > 0 ? location.search.substring(1) : ""),
                        args = {},
                        items = qstr.length ? qstr.split("&") : [],
                        item = null,
                        name = null,
                        value = null,
                        i = 0,
                        len = items.length;

                        for (i = 0, i < len; ++i) {
                          item = items[i].splic("=");
                          name = decodeURIComponent(item[0]);
                          value = decodeURIComponent(item[1]);
                          if (name.length) {
                            args[name] = value;
                          }
                        }
                        return args;
                    }

>> 位置操作：每次修改除hash之外的location属性都会以新的URL重新加载页面。URL值如果不带协议类型（如 http://）则会直接加在当前URL后面。
>>> 常用的是使用　location.assign()来改变浏览器位置，

>>> 直接将location.href或者location设置为一个URL值，也会调用assign()。

>>> 假设初始URL为 http://www.wrox.com/WileyCDA/
>>>> 将URL修改为 "http://www.wrox.com/WileyCDA/#section1"
>>>>> location.hash = "#section1";
>>>> 将URL修改为 "http://www.wrox.com/WileyCDA/?q=javascript"
>>>>> location.search = "?q=javascript";
>>>> 将URL修改为 "http://www.yahoo.com/WileyCDA/"
>>>>> location.hostname = "www.yahoo.com";
>>>> 将URL修改为 "http://www.yahoo.com/mydir/"
>>>>> location.pathname = "mydir";
>>>> 将URL修改为 "http://www.yahoo.com:8080/WileyCDA/"
>>>>> location.port = 8080;

>>> IE8,FireFox1,Safari 2+,Opera 9+,Chrome修改hash值会在浏览器中生成一条新纪录。
>>> **当通过上述任一方式修改URL后，浏览器历史纪录中会生成一条新纪录，因此用户通过点击“后退”按钮都会导航到前一个页面，要禁用这种行为，可以使用location.replace()方法，这个方法只接受一个参数，即要导航到的URL，结果虽然会导致浏览器的位置改变，但不会在历史纪录中生成新纪录。调用replace()方法过后，用户不能返回到前一个页面。**

>>> 最后一个与位置有关的函数是location.reload()，如果不传递任何参数，则会以最有效的方式重载当前页面，即如果自上次请求以来并没有改变，页面就会从浏览器缓存中重新加载页面，如果要强制从服务器重新加载页面，就需要传递参数true。位于reload()之后的代码可能会也可能不会执行，这取决于网络延迟或者系统资源等因素，为此，最好将reload()放在代码的最后一行。

> navigator对象，用于识别客户端浏览器的属性。具体属性参考《javascript高级程序设计》P210，下列罗列出所有浏览器支持的属性：
>>> appCodeName: 浏览器的名称，通常都是Mozilla，即使在非Mozilla浏览器中也是如此。

>>> appName: 完整的浏览器名称。

>>> appVersion: 浏览器的版本，一般不与实际浏览器的版本对应。

>>> cookieEnabled: cookie是否可用。

>>> javaEnabled: 当前浏览器是否支持java。

>>> mimeTypes: 浏览器中注册的MIME类型数组。

>>> platform: 浏览器所在系统平台。

>>> plugins: 浏览器中安装的插件信息的数组，其中包括每一个插件的信息。

>>> userAgent: 浏览器的用户代理字符串。

>> 插件检测：检测浏览器是否安装了特定的插件，在非IE浏览器中，可以使用plugins数组来达到目的，该数组的每一项包含：
>>> name: 插件名字，一般来说name属性会包含检测插件必需的所有信息，但也不完全如此。

>>> description: 插件的描述

>>> filename: 插件的文件名

>>> length: 插件所处理的MIME类型的数量。

                  // 检测插件（IE无效）
                  function hasPlugin(name) {
                    name = name.toLowerCase();
                    for (var i = 0; i < navigator.plugins.length; ++i) {
                      if (navigator.plugins[i].name.toLowerCase().indexOf(name) > -1) {
                        return true;
                      }
                    }
                    return false;
                  }

>>>> 每个插件对象本身也是一个MimeType对象数组，这些对象可以通过方括号来访问，每个MimeType对象有4个属性，包括MIME类型的描述description、回指插件对象的enabledPlugin、表示与MIME类型对应的文件扩展名的字符串suffixes(以逗号分隔)和表示完整MIME类型字符串的type。

>>> IE不支持Netscape式的插件，在IE中检车插件的唯一方式就是使用专有的ActiveXObject类型，并尝试创建一个特定的插件实例，IE是以COM对象的方式实现插件的，而COM对象使用唯一标识符。因此要想检查特定的插件，就必须知道其COM标识符。例如Flash标识符是ShockwaveFlash.ShockwaveFlash：

                    // IE中检测插件
                    function hasIEPlugin(name) {
                      try {
                        new ActiveXObject(name);
                        return true;
                      } catch (e) {
                        return false;
                      }
                    }

                    hasIEPlugin("ShockwaveFlash.ShockwaveFlash");   // true

>>> 用于检测所有浏览器的插件:

                    function hasXPlugin(name) {
                      var result = hasPlugin(name);   // 先检测非IE
                      if (!result) {
                        result = hasIEPlugin(name + '.' + name);   // 貌似IE标识符都是以.号连接的两个相同名称
                      }
                      return result;
                    }

>> 注册处理程序，navigator中新增的registerContentHandler()和registerProtocolHandler()方法可以让一个站点指明它可以处理特定的类型信息。具体参考《javascript高级程序设计》P213

> screen对象，具体参考《javascript高级程序设计》P214

> history对象：保存着用户从窗口打开那一刻起的上网历史纪录。因为它是window的属性，所以每个窗口、标签页、框架都有自己的history对象与特定的window对象关联。出于安全方面的考虑，开发人员无法得知用户浏览过的URL，不过借由用户访问过的页面列表，同样可以在不知道实际URL的情况下实现 前进/后退
>> go(): 在用户的历史纪录中任意跳转，
>>> 参数表示跳转方向和跳转的页数，正数为向前（前进），负数为后退（后退），如 history.go(-2)表示后退两页。

>>> 参数可以为一个字符串，此时浏览器会跳转到历史记录中包含该字符串的第一个位置，可能后退也可能前进。具体要看哪个位置离得更近。如果历史纪录中不包含该字符串，则什么都不做。

>>> 可以使用back()和forward()来代替go()函数。

>>> history的length属性保存着历史纪录的数量，包括所有历史纪录，即所有向前向后的记录。对于加载到窗口、标签页或者框架中的第一个页面而言，history.length为0，所以可以通过该属性检查用户是否是一开始就打开了该页面：

                        if (history.length == 0) {
                          // 这应该是用户打开窗口后的第一个页面
                        }















































。
