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


location对象P207















































































。
