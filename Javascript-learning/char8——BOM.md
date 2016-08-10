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


> window.open：P199




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
