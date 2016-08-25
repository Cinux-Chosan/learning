# Event

> 事件分为事件捕获、目标阶段、事件冒泡，它们的顺序也是如此
>> 默认情况下是在冒泡阶段处理父级元素的事件

>> 元素的addEventListener接受三个参数：事件名，事件函数，布尔值（true表示捕获阶段处理，false表示冒泡阶段处理），事件函数的this为该Dom元素

>> removeEventListener接收的参数与addEventListener相同，这意味着通过addEventListener添加的匿名函数将无法移除。

>> IE中使用attachEvent()和detachEvent()，它们接收两个参数，带有on开头的事件名和处理函数，该事件处理函数会在全局运行，所以它的this === window，并且后添加的事件会先执行

> 事件处理函数内部的this始终等于currentTarget，而target则只包含事件的实际目标，即currentTarget指向当前执行事件的对象，这个事件有可能是target传递过来的

> preventDefault()取消默认行为，只有cancelable为true才可调用preventDefault()

> stopPropagation()立即停止事件在DOM的传播

> event.eventPhase表明事件处于哪个阶段，1为捕获，2为目标阶段，3为冒泡阶段

> IE中的事件对象，如果是DOM0方式添加的事件处理程序，则event对象作为window对象的一个属性存在，即   var event = window.event; 如果是通过attachEvent()添加的，则会有一个event对象作为参数传入。也可以通过window.event来访问

> UI事件
>> load: 页面完全加载后在window上面触发，所有框架加载完成时在框架上面触发，图像加载完成时在＜img＞元素上触发，或者当嵌入的内容加载完毕时在＜object＞元素上面触发。可以通过addEventListener给window添加load事件，或者通过＜body onload="funcName"＞来添加，一般来说window上面的任何事件都可以在＜body＞中通过相应特性来添加，因为HTML中无法访问window元素。

> unload: 与load相反

> abort用户停止下载过程时，如果嵌入的内容还没有加载完成，则在＜object＞元素上触发。

> error: 发生JavaScript错误时在window上触发，无法加载图片时在＜img＞元素上触发，当无法加载嵌入内容时在＜object＞上触发，或者有一个或多个框架无法加载时在框架集上面触发

> slect: 当用户选择文本框中的一个或多个字符时触发

> resize: 窗口或框架大小变化时在window或框架上面触发

> scroll: 当用户滚动带有滚动条的元素时在该元素上触发。＜body＞元素包含所加载页面的滚动条

> 判断浏览器是否支持DOM2级事件：
    var isSupported = document.implementation.hasFeature("HTMLEvents", "2.0");
    var isSupported = document.implementation.hasFeature("UIEvent", "3.0"); //是否支持3.0







p365
