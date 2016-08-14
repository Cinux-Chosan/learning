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


























































































































.
