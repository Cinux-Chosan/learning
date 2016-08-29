# Event

> 事件分为事件捕获、目标阶段、事件冒泡，它们的顺序也是如此，事件冒泡的前提是目标元素还存在于文档中，如果在事件处理程序中删除目标元素也能阻止事件冒泡。
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
>> load: 页面完全加载后在window上面触发，所有框架加载完成时在框架上面触发，图像加载完成时在＜img＞元素上触发，或者当嵌入的内容加载完毕时在＜object＞元素上面触发。可以通过addEventListener给window添加load事件，或者通过＜body onload="funcName"＞来添加，一般来说window上面的任何事件都可以在＜body＞中通过相应特性来添加，因为HTML中无法访问window元素。  **＜img＞不一定要加到文档后才开始下载，而是只要设置了src属性就会开始下载，而＜script＞则需要在添加了src属性并且被添加到文档中才会开始下载**

> unload: 与load相反

> abort用户停止下载过程时，如果嵌入的内容还没有加载完成，则在＜object＞元素上触发。

> error: 发生JavaScript错误时在window上触发，无法加载图片时在＜img＞元素上触发，当无法加载嵌入内容时在＜object＞上触发，或者有一个或多个框架无法加载时在框架集上面触发

> slect: 当用户选择文本框中的一个或多个字符时触发

> resize: 窗口或框架大小变化时在window或框架上面触发

> scroll: 当用户滚动带有滚动条的元素时在该元素上触发。＜body＞元素包含所加载页面的滚动条

> 判断浏览器是否支持DOM2级事件：
    var isSupported = document.implementation.hasFeature("HTMLEvents", "2.0");
    var isSupported = document.implementation.hasFeature("UIEvent", "3.0"); //是否支持3.0






> clientX和clientY是相对于视口的事件坐标，而pageX和pageY则是相对于页面来说，所以pageX和pageY是从页面的边缘开始算。而screenX和screenY则是相对于整个屏幕的坐标。

> 修改键：shiftKey, ctrlKey, altKey, metaKey。即如果有按下shift键，则event.shiftKey === true

> mouseover和mouseout的事件对象有一个相关元素属性relatedTarget，如果某一个元素触发了mouseout事件，则与之同时触发mouseover事件的元素就是相关元素，即relatedTarget所指的元素,IE中则是fromElement(mouseover)和toElement(mouseout)中保存着相关元素。

> mousedown 和 mouseup的event对象中存在一个button属性。

> DOM2规范在event对象中还提供了detail属性，它表示在给定属性上面单击了多少次，同一元素上相继发生mousedown和mouseup为一次单击，每次单击detail都会递增，mousedown和mouseup之间移动了鼠标，则detail被重置为0

> 鼠标滚轮事件：
>> mousewheel：任何元素上都能触发，并且最终会冒泡到document或者window对象上。它的event除了包含鼠标事件的所有信息，还包含wheelDelta属性，该属性是120的倍数，正负表示方向。

> keydown -> keypress -> keyup
>> 触发顺序如上

>> 如果按下一个字符不放，会重复触发keydown和keypress直到松开为止，如果按下的为非字符键不放，则触发的是keydown，松开则是keyup

>> keydown和keyup的event事件包含keyCode，而charCode只有在keypress事件才会有。使用的时候，应该先检查是否有charCode，如果没有再使用keyCode，得到字符编码后可以使用String.fromCharCode()将其转换成实际字符。

>> DOM3不再包含charCode，取而代之的是key和char，key为对应按键的文本字符，如'k'，如果是功能键则为'Shift'或者'Down'之类的，char在按下功能键时返回null

> textInput：文本框有内容插入的时候触发。
>> event.data：用户输入的实际字符，如's','S'等

>> event.inputMethod（IE支持）：
- 0：浏览器不确定是怎么输入的
- 1：键盘输入
- 2：粘贴
- 3：拖放
- 4：IME输入
- 5：通过表单中选择某一项输入的
- 6：手写输入
- 7：语音输入
- 8：多种方法组合输入
- 9：通过脚本输入


> 变动事件：DOM中某一部分发生变化时触发：
>> DOMSubtreeModified: DOM结构中任何变化都会触发，其他任何事件出发后也会触发

>> DOMNodeInserted: 有节点插入时触发

>> DOMNodeRemoved: 有节点从父元素移除时触发

>> DOMNodeInsertedIntoDocument: 在一个节点被直接插入document或者通过子树间接插入之后触发，该事件在DOMNodeInserted之后触发

>> DOMNodeRemovedFromDocument: 节点被直接从document移除或者间接从文档中移除之前触发，该事件在DOMNodeRemoved之后触发

>> DOMAttrModified: 特性被修改之后触发

>> DOMCharacterDataModified: 在文本节点值发生变化时触发

> contextmenu事件：给页面添加右键菜单，该事件会冒泡，可以给document指定事件处理程序，在处理程序中调用 event.preventDefault()可以阻止打开默认的右键菜单，使用html代码写一个自定义菜单#myDiv，然后通过右键点击触发该事件从而显示或隐藏菜单。
    var div = document.getElementById('myDiv');
    document.addEventListener('contextmenu', function(e){
      e.preventDefault();
      var menu = document.getElementById('myMenu');
      menu.style.visibility = 'visible';
      menu.style.left = event.clientX+'px';
      menu.style.top = event.clientY+'px';
    });


> beforeunload事件：该事件发生在window对象上，在页面卸载前触发，可以用来取消或阻止页面卸载，如果需要显示一个弹窗，需要将event.returnValue设置为要显示给用户的字符串（IE及firefox），同时作为函数的返回值（safari和chrome）

> DOMContentLoaded事件：window的load事件会在一切都加载完毕时触发，而DOMContentLoaded事件则是在形成完整的DOM树之后就会触发，不理会图像，javascript文件，css文件或其它资源是否已经加载完毕，所以该事件始终先于window的load事件触发，支持在页面下载的早期执行js添加事件代码，从而用户可以更早的与页面进行交互。对于不支持该事件的浏览器，可以添加一个0毫秒超时调用，即setTimeout的超时为0。

> readystatechange：最好使用DOMContentLoaded事件来处理，因为DOMContentLoaded事件支持率更高。p390

> pageshow && pagehide
>> pageshow在页面显示时触发，无论是否来自bfcache（firefox的back-forward cache，将整个页面连同js的执行状态压栈到内存，为了加快“前进”“倒退”的速度），重新加载页面时，pageshow会在load之后，事件目标虽然是document，但是必须将事件处理程序加在window。

>> pagehide在页面卸载时触发，先于unload，如同pageshow一样，也需要将它的事件添加到window上

>> pageshow 和 pagehide的事件对象都具有 persisted，在pageshow中，该属性代表是否保存在bfcache中，或者是否在被卸载过后将会保存在bfcache中。


> hashchange：当URL中#后面的hash值改变的时候，会触发该事件。该事件必须添加在window对象上。检测该对象是否支持：

    var isSupported = ('onhashchange' in window) && (document.documentMode === undefined || document.documentMode > 7);

# 移动设备事件
> p395

> deviceorientation：加速计检查到设备方向变化时，在window上触发。告诉开发人员设备移动方向。

> devicemotion：告诉开发人员设备什么时候移动，而不仅仅是方向的变化。例如可以通过该事件检测移动设备是不是正在往吓掉或者是否被移动的人拿在手里。

> 触摸事件

> 事件委托：由于每个事件都会在内存中添加一个对象，这样数量越多，性能就越低，由于大部分事件都会冒泡到document对象，而且访问document对象又特别快，所以给document对象绑定事件处理程序来处理它内部的对象事件是非常高效的一种做法：
    
    var list = document.getElementById("myLinks");
    EventUtil.addHandler(list, "click", function(event){
      event = EventUtil.getEvent(event);
      var target = EventUtil.getTarget(event);
      switch(target.id){
        case "doSomething":
          document.title = "I changed the document's title";
        break;
        case "goSomewhere":
          location.href = "http://www.wrox.com";
        break;
        case "sayHi":
          alert("hi");
        break;
      }
    });
    
> 由于页面操作可能删除页面中某些带有事件的元素，所以可能导致事件对象残留在内存中，尤其是使用innerHTML来替换了页面中这些带有事件的页面元素，所以在移除之前最好将事件置空，如 btn.onclick = null;另外就是在页面卸载的时候，也可能造成内存中带有空事件的情况，可以在onunload事件中将它们移除。

> 《JavaScript高级程序设计》P405: 模拟事件：通过createEvent()方法创建event对象，事件分为UIEvents, MouseEvents, MutaionEvents, HTMLEvents，创建了事件对象之后，通过dispatchEvent()方法触发事件。具体几种事件的模拟，参考P406






