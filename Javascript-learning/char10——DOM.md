# DOM

> Node类型：js中所有节点类型都继承自Node类型，因此所有节点类型都共享着相同的基本属性和方法。
>> 属性：
>>> nodeType：表明节点类型，值被定义为12个常量，任何节点都属于其中某一种；

>>> nodeName：对于元素节点，nodeName中始终都保存着元素的标签名，而nodeValue始终未null；

>>> childNodes：其中保存着一个NodeList对象，它有length属性，但并不是Array，它是根据DOM结构动态执行查询的结果，因此DOM中的变化能够自动反映在NodeList中。
>>>> nodeList 中的节点可以通过下标访问，也可以通过item()。

>>> parentNode：指向文档树中的父节点。

>>> previousSibling：指向前一个同胞节点，第一个节点的该属性为null；

>>> nextSibling：指向后一个同胞节点，最后一个节点的该属性为null；

>>> firstChild：childNodes的第一个值；

>>> lastChild：childNodes的最后一个值；

>>> ownerDocument：该属性指向表示整个文档的文档节点，通过该属性不必在节点层次中通过层层回溯到达顶端。

>> 操作节点的函数：
>>> appendChild()：向childNodes列表的末尾添加一个节点，该操作内部会更新各个节点的关系到最新状态，最后返回传入的新增的节点。
>>>> 如果传入的节点已经是文档中的节点，由于同一个节点不能出现在文档中的多个位置，所以调用appendChild()会将该节点变成父节点的最后一个子节点。
>>> insertBefore()：接受两个参数，被插入的节点和作为参照的节点，如果参照的节点是null则该方法等同于appendChild()；
>>>> e.g.：someNode.insertBefore(newNode, someNode.firstChild);
>>> replaceChild()：接受两个参数，插入的节点和被替换的节点。返回被替换的节点。从技术上讲，被替换的节点还出现在文档中，但是它在文档中已经没有了自己的位置。

>>> removeChild()：接受一个参数，即要移除的节点。返回被移除的节点。被移除的文档同replaceChild()一样也还属于文档，但是已经没有自己的位置了。

>>> cloneNode()：参数如果为true，则赋值该节点及其子节点，如果没有传入参数或者为false，则只复制该节点本身，但它们都不会复制事件处理程序。

                      var deepList = myList.cloneNode(true);
                      deepList.childNodes.length;   // 子节点的length，如果cloneNode参数为false，则为0

>>> normalize()：由于解析器的实现或者DOM操作等原因，可能会出现文本节点不包含文本，或者接连出现两个文本节点的情况，该方法会查找这两种情况，如果找到空节点则删除，如果两个相邻的文本节点，则合并。

> Document 类型：
>> document是HTMLDocument的一个实例，HTMLDocument继承自Document类型。文档类型是只读的。
>>> 属性：
>>>> nodeType为9

>>>> nodeName为"#document"

>>>> nodeValue为null

>>>> parentNode为null

>>>> ownerDocument为null

>>>> 其子节点可能是一个DocumentType（最多一个）, Element（最多一个）, ProcessingInstruction或Comment

>>>> 虽然其子节点可能是一个DocumentType（最多一个）, Element（最多一个）, ProcessingInstruction或Comment，但是还有两个内置的访问其子节点的快捷方式：

>>>>> documentElement：该属性始终指向＜html＞元素，即 document.all[0] === document.documentElement === document.childNodes[0] === document.firstChild 并不一定满足情况，因为现在由于大部分H5页面最外层都为＜!DOCTYPE html＞，所以document.childNodes[0]和 document.firstChild 并不一定是＜html＞，document.childNodes中包含所有HTML标签元素，包括注释在内。

>>>> body：对＜body＞的引用

>>>> doctype：对＜!DOCTYPE＞的引用，但是各个浏览器可能不一致，导致并不是在所有浏览器中都能得到想要的结果。

>>> 作为HTMLDocument的实例，document对象还有一些标准的Document对象所没有的属性：
>>>> title：包含＜title＞的文本，可以获取和设置标题
>>> URL，domain，referrer,这些属性与网页请求有关，它们都存在于请求HTTP的头部，只不过是通过这些属性让我们能够在javascript中进行访问：
>>>> URL：包含完整的URL，即地址栏中显示的URL，document.URL

>>>> domain：只包含页面的域名，document.domain

>>>> referrer：保存着链接到当前页面的那个页面的URL，document.referrer

>>>> 以上三个属性，只有domain可以设置，但是只能将子域名往上设置，如p2p.wrox.com可以设置为wrox.com但是不能从wrox.com设置为p2p.wrox.com
>>>>> **当页面中包含其他子域的框架或者内嵌框架的时候，可以通过设置document.domain来相互访问对方包含的javascript对象，否则由于安全限制，来自不同子域的页面无法通过javascript通信。例如，如果页面加载自www.wrox.com，其中包含一个内嵌框架，框架内的页面加载自p2p.wrox.com，由于document.domain字符串不一样，内外两个页面之间无法相互访问对方的javascript对象，但是如果将这两个页面的document.domain都设置为wrox.com，则他们之间就可以通信了。**

>> 查找元素：通过document.getElementById()、getElementsByTagName()和 getElementsByName()：
>>> getElementById()接收一个ID字符串作为参数，如果没有id属性为该参数的元素，则返回null。

>>> getElementsByTagName()接收一个代表所要选取的标签名的参数，如果要取得所有元素，通过传入"*"即可，返回值类似于NodeList，该函数返回的是一个HTMLCollection对象，作为一个动态集合，同样可以使用下标或者item()来获取其中的项。
>>>> HTMLCollection对象中还有一个方法namedItem()，接收一个参数，如果HTMLCollection对象中某项的name属性与该参数对应，则返回该项。通过下标访问的时候，在HTMLCollection实现的内部，如果是数值索引，则调用item()，如果是字符串索引则调用namedItem()；

>>> getElementsByName()返回带有给定name属性的所有元素，对于单选按钮比较方便，因为多个单选按钮的name属性相同。

>> 特殊集合（它们都是HTMLCollection对象的实例）：document.anchors，document.links，document.applets，document.forms，document.images:
>>> document.anchors: 包含文档中所有带有name属性的＜ａ＞元素；

>>> document.links: 包含文档中所有带href的＜a＞元素。

>>> document.applets:　文档中所有的＜applet＞元素，因为不再推荐使用＜applet＞所以也不推荐使用这个集合。

>>> document.forms: 返回文档中所有的＜form＞元素，与document.getElementsByTagName("form")得到的结果相同。

>>> document.images: 包含文档中所有的＜img＞元素，与document.getElementsByTagName("img")得到的结果相同。

>> DOM一致性检测：
>>>由于DOM分为多个级别和多个部分，所以需要检测浏览器实现了DOM的哪些部分，document.implementation属性就是为此提供相应信息和功能的对象，与浏览器对DOM的实现直接对应。DOM1级只为它规定了一个 hasFeature()方法。

>>>> document.implementation.hasFeature(): 接受两个参数，即要检测的DOM功能的名称和版本号。如果浏览器支持，则返回true。
>>>> document.implementation.hasFeature('XML', '1.0'); 与此同时还有Core, HTML, Views, StyleSheets, CSS, CSS2, Events等。参考《javascript高级程序设计》P259

>>> 文档写入： document对象提供方法 write(), writeln(), open(), close()。
>>>> write()原样写入，writeln()会在末尾添加一个 '\n'；还可以使用它们来动态包含外部资源，但是字符串中不能直接包含＜/script＞，这样会导致字符串被解析为脚本块的结束，它会与前面的非字符串＜script＞标签闭合。解决办法为"＜\/script＞"。

>>>> 如果文档加载结束过后调用write()和writeln()则会重写整个页面，因为直接写入＜body＞

## Element类型
> Element类型用于表现XML或HTML元素，提供了对元素标签名，子节点及其特性的访问，它具有如下特征：
>> nodeType为 1

>> nodeName为元素的标签名

>> nodeValue为null

>> parentNode可能是 Document或者Element

>> 子节点可能是Element, Text, Comment, ProcessingInstruction， CDATASection，EntityReference

>> 节点的tagName与nodeName返回相同值。

                    <div id="myDiv"></div>

                    var div = document.getElementById('myDiv');
                    div.tagName == div.nodeName;   // true

## HTMLElement类型
> 所有HTML元素都由HTMLElement类型直接或其子类型间接表示，该类型直接继承自Element并添加了一些属性。
>> id：元素的id标识符

>> title：元素的附加说明信息

>> lang：元素的语言代码

>> dir：语言方向，"ltr"(left-to-right)或"rtl"(right-to-left)

>> className：元素的class特性，即CSS类。

                    <div id="myDiv" class="bd" title="body text" lang="en" dir="ltr"></div>
                    var div = document.getElementById('myDiv');
                    div.id;   // "myDiv"
                    div.className;   // "bd"
                    div.title;   // "body text"
                    div.lang;   // "en"
                    div.dir;   // "ltr"
>> 可以取值，也可以为它们设置值。

> getAttribute()，setAttrbute()，removeAttribute():

                    div.getAttribute('id');  // 还有class, title, lang, dir

>> getAttribute()也可以取得自定义属性，如：
var value = div.getAttribute('my_special_attr');   // 返回元素的该属性，但是由于HTML5规定自定义特性应该加上   data- 前缀

>>> 有两个属性比较特殊：style 和 事件处理程序（如 onclick）
>>>> 虽然有对应的属性名，但是通过  someNode.style与 someNode.getAttribute('style')得到的值并不一样，直接通过  someNode.getAttribute('style')得到的直接是一个元素标签里面的属性的字符串值，而通过  someNode.style 得到的是一个对象，它包含了所有的css属性以及它们的值，如果在标签中的style属性有的值，会在这个对象中通过数字作为key，属性名作为value组成键值对。

>>>> 事件处理程序，直接通过 名字访问，得到的是函数代码，通过 getAttribute() 访问得到的是字符串。

>>> setAttrbute()：接收两个参数，属性名和属性值。 如果已经存在，则会替换原有值。

>>> removeAttribute()：接受一个参数，即要删除的特性名


## attributes 属性：
> Element类型是使用attributes属性的唯一一个DOM节点类型。attributes属性包含一个NamedNodeMap，与NodeList类似，也属于动态集合。元素的每一个特性都由一个Attr节点表示，每个节点都被保存于NamedNodeMap中：
>> getNamedItem(name): 返回nodeName属性等于name的节点

>> removeNamedItem(name): 从列表移除nodeName等于name的节点，返回被移除属性的Attr节点

>> setNamedItem(node): 向列表中添加节点并以nodeName作为索引

>> item(pos): 返回位于pos处的节点

>> attributes中的每个节点的nodeName为属性名，nodeValue为属性值。

                      someNode.attributes.getNamedItem('id').nodeValue;   // 取得someNode节点的id属性值
                      someNode.attributes['id'].nodeValue;   // 同上
                      someNode.attributes['id'].nodeValue = value;   // 设置 id 值

                      var oldAttr = someNode.attributes.removeNamedItem('id');

每个特性节点都有一个名为specified的属性，如果该属性为true，则表示要么是在HTML中指定了相应特性，或者是通过setAttrbute()方法设置了该特性。IE中所有未设置过的特性的该值都为false，而其他浏览器根本不会为这类特性生成相应的特性节点。所以都返回true

## 创建元素
> document.createElement():
>> 传入参数可以是标签名，也可以是完整的标签，传入完整的标签可以避免一些问题，比如不能设置动态创建的＜iframe＞的name属性，以及动态创建的一批name相同但是却毫无关系的单选标签，和动态创建表单按钮的reset方法或者类型等。

                      var div1 = document.createElement("div");   
                      div1.id = "myDiv";
                      // 下面的方法可以避免一些问题，但相对来说比较麻烦。
                      var div2 = document.createElement("<div id=\"myDiv\"></div>");

## 元素的子节点
> 不同浏览器对待子节点的处理不同，

                      <ul id="myList">
                        <li>Item 1</li>
                        <li>Item 2</li>
                        <li>Item 3</li>
                      </ul>
> 以上代码，IE会返回3个子节点，其他浏览器返回7个子节点（3个li和4个文本节点，4个文本节点为不同标签之间的空格，即第一个为ul与第一个li之间，第二个为第一个li与第二个li之间）
            <ul id="myList"><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
> 上述代码则在任何浏览器中都返回3个子节点，因为标签之间没有空格

# Text 类型
> nodeType: 3

> nodeName: #text

> nodeValue: 文本内容，与 data 属性返回相同的值

> parentNode: Element

> length: 等于nodeValue.length和data.length

> appendData(text): 添加文本text

> deleteData(offset, count):

> insertData(offset, text):

> replaceData(offset, count, text):

> splitText(offset): 从offset位置将当前文本节点分成两个文本节点

> substringData(offset, count):

## 创建文本节点 document.createTextNode(text)

> element.normalize()合并多个文本节点；（进行DOM操作的时候可能插入多个文本节点，虽然视觉上看不到，但是通过父元素的childNodes.length并不一定为 1）

> element.firstChild.splitText() 与nomalize()相反，切分文本节点为多个文本节点。参数为切分的位置。

## Comment 注释类型
> nodeType: 8

> nodeName: "#comment"

> nodeValue: 注释内容

> parentNode: Document 或 Element

> 无子节点

> 与Text继承自相同基类。可以通过 document.createComment()创建注释节点。IE8中将注释节点视为标签名为 "!" 的元素，即意味着IE8中可以通过getElementsByTagName来取得注释节点。IE9则没有将它视为元素，但可以通过HTMLCommentElement的构造函数来表示注释。

P275 documentFragment类型






























































.
