# 表单脚本

> 表单类型HTMLFormElement继承自 HTMLElement，它扩展了某些属性作为自己的独有属性和方法：
- acceptCharset ：服务器能够处理的字符集；等价于 HTML 中的 accept-charset 特性。
- action ：接受请求的 URL；等价于 HTML 中的 action 特性。
- elements ：表单中所有控件的集合（ HTMLCollection ） 。
- enctype ：请求的编码类型；等价于 HTML 中的 enctype 特性。
- length ：表单中控件的数量。
- method ：要发送的 HTTP 请求类型，通常是 "get" 或 "post" ；等价于 HTML 的 method 特性。
- name ：表单的名称；等价于 HTML 的 name 特性。
- reset() ：将所有表单域重置为默认值。
- submit() ：提交表单。
- target ：用于发送请求和接收响应的窗口名称；等价于 HTML 的 target 特性。

> 取得form的引用方式多样，可以通过document.getElementById来访问，或者document.forms中包含了所有的表单，可以通过索引或者name属性来获取。可以同时为表单指定id和name属性，但它们的值不一定相同。

## 提交表单
> 使用input或者button都可以提交表单，只需将type设为submit即可。而带有图像的按钮可以将type设为image并且给予src属性即可。

> 表单提交之前会触发submit事件，可以在该事件内验证数据，如果验证不通过，可以通过preventDefault()阻止默认事件来阻止提交表单数据。

> 在js中可以随时通过表单的submit()方法来提交，

## 重置表单
> 通过type为reset的input或button来重置表单，同理，会触发reset事件，也可以使用preventDefault()来取消重置。

> 同样，调用form.reset()也能重置表单，但是与submit()不同的是，reset()会触发reset事件。

## 表单字段
> 每个表单都有一个elements属性，包含一个有序列表，包含表单中的所有字段，elements中的顺序跟它们的标签顺序相同。同样可以通过索引或者name属性来访问每个表单元素。

> 如果有多个表单空间都在使用同一个name属性，那么通过name属性访问则会返回一个NodeList，NodeList包含这些同名的表单元素，然后通过NodeList的下标访问即可。但是如果通过索引访问表单的elements则只会返回第一个元素。

### 共有的表单元素属性（除了fieldset元素）：
- disabled ：布尔值，表示当前字段是否被禁用。
- form ：指向当前字段所属表单的指针；只读。
- name ：当前字段的名称。
- readOnly ：布尔值，表示当前字段是否只读。
- tabIndex ：表示当前字段的切换（tab）序号。
- type ：当前字段的类型，如 "checkbox" 、 "radio" ，等等。
- value ：当前字段将被提交给服务器的值。对文件字段来说，这个属性是只读的，包含着文件在计算机中的路径。

>> 除了 form 属性之外，可以通过 JavaScript 动态修改其他任何属性。

> 同样除了fieldset，所有表单字段都有type属性，单选列表的type为'select-one'，而多选列表的type为'select-multiple'，其它字段则为正常的type值。

> 每个表单字段都有focus()和blur()字段方法，但是如果给页面中type为hidden或者通过CSS的display和visibility隐藏的元素设置focus()则会引发错误。在HTML5中可以使用autofocus属性，但是最好是先检测一下：

    if (element.autofocus !== true){    // 在支持的浏览器中，autofocus属性返回true，不支持的则为空字符串
      element.focus(); console.log("JS focus");
    }  

### 共有的表单字段事件
- blur：字段失去焦点时触发
- change：对于input或textarea标签，当它们失去焦点且value值有改变时触发。对于select元素，在其选项改变时触发。
- focus：当前字段获得焦点时触发。
> 不管是用户改变了焦点，还是通过调用blur()和focus()，都会触发blur或focus事件。

## 文本框脚本
> input:
>> 要表现文本框，必须将 input 元素的 type 特性设置为 "text" 。而通过设置 size 特性，可以指定文本框中能够显示的字符数。通过 value 特性，可以设置文本框的初始值，而 maxlength 特性则用于指定文本框可以接受的最大字符数。如果要创建一个文本框，让它能够显示 25 个字符，但输入不能超过 50 个字符，可以使用以下代码：
    <input type="text" size="25" maxlength="50" value="initial value">

> textarea:
>> textarea 元素则始终会呈现为一个多行文本框。 要指定文本框的大小， 可以使用 rows
和 cols 特性。其中， rows 特性指定的是文本框的字符行数，而 cols 特性指定的是文本框的字符列数（类似于 inpu 元素的 size 特性） 。与 input 元素不同，extarea不能指定最大字符数。如textarea 的初始值必须要放＜textarea＞ 和 ＜/textarea＞ 之间，下面的例子所示。
     
     <textarea rows="25" cols="5">initial value</textarea>  

### 选择文本
> input和textarea都支持select()方法，该方法会选中框中所有的文字，但是并不一定会将焦点设置到该文本框内，但是在focus的时候选中文本却是一种很好的体验。

> select事件：选择了文本框中文本的时候，就会触发该元素的select事件。同时，select()方法也会触发select事件。

> 取得选中文本：select事件只告诉我们什么时候选择了文本，但并没有告诉我们选择了什么，但是可以通过元素的selectionStar和selectionEnd来获取选择的文本偏移量，例如：

    var input = document.getElementById('input1');
    var selectText = input.value.substring(input.selectionStar, input.selectionEnd);

> 设置选中文本：HTML5为选择文本提供了解决方案，使用setSelectionRange()方法，该方法接收两个参数，即要选择的第一个字符索引和要选择的最后一个字符之后的字符索引。要看到选择的文本，必须在调用 setSelectionRange() 之前或之后立即将焦点设置到文本框。 IE的方案参考《JavaScript高级程序设计》P422

> 操作剪切板：
- beforecopy ：在发生复制操作前触发。
- copy ：在发生复制操作时触发。
- beforecut ：在发生剪切操作前触发。
- cut ：在发生剪切操作时触发。
- beforepaste ：在发生粘贴操作前触发。
- paste ：在发生粘贴操作时触发。

> beforecopy、beforecut、beforepaste可以在向剪切板发送或者接收数据的时候修改数据，如果要阻止相应的操作，需要取消copy、cut、paste事件。

> 如果要访问剪切板中数据，使用clipboardData对象，IE中该对象为window对象的属性，而 Firefox、Safari、Chrome中，这个对象是相应的event对象的属性，不过在这三个浏览器中，只有在处理剪切板事件期间访问该对象才有效，这是为了防止对剪切板的未授权访问。
>> clipboardData对象有三个方法：getData()，setData()，clearData()
- getData()用于向剪切板获取数据，参数为需要获得的数据的格式
- setData()用于向剪切板中写数据，第一个参数也是数据类型，第二个参数为文本

更多具体用例，参考《javascript高级程序设计》P424操作剪切板


## HTML5约束验证API
> 约束验证API可以在完全不用javascript插手的情况下验证数据，即浏览器会根据规则进行验证，为了使用验证，需要在HTML中的特定字段指定一些约束，然后浏览器根据约束进行验证。

>> 必填：required
    
    <input type="text" name="username" required />
    
    // 检测
    var isUsernameRequired = document.forms[0].elements["username"].required

    // 检测是否支持
    var isRequiredSupported = "required" in document.createElement("input");

参考《javascript高级程序设计》p430

## 选择框脚本
通过select和option创建。是HTMLSelectElement类的实例。
- add(newOption, relOption) ：向控件中插入新 ＜option＞ 元素，其位置在相关项（ relOption ）之前。
- multiple ：布尔值，表示是否允许多项选择；等价于 HTML 中的 multiple 特性。
- options ：控件中所有 ＜option＞ 元素的 HTMLCollection 。
- remove(index) ：移除给定位置的选项。
- selectedIndex ：基于 0 的选中项的索引，如果没有选中项，则值为 -1 。对于支持多选的控件，只保存选中项中第一项的索引。
- size ：选择框中可见的行数；等价于 HTML 中的 size 特性。

> 选择框的 type 属性不是 "select-one" ，就是 "select-multiple" ，这取决于 HTML 代码中有

> 没有 multiple 特性。选择框的 value 属性由当前选中项决定，相应规则如下。
- 如果没有选中的项，则选择框的 value 属性保存空字符串。
- 如果有一个选中项，而且该项的 value 特性已经在 HTML 中指定，则选择框的 value 属性等于选中项的 value 特性。即使 value 特性的值是空字符串，也同样遵循此条规则。
- 如果有一个选中项，但该项的 value 特性在 HTML 中未指定，则选择框的 value 属性等于该的文本。
- 如果有多个选中项，则选择框的 value 属性将依据前两条规则取得第一个选中项的值。


## 表单序列化程序 《javascript高级程序设计》P436

## 富文本操作  《javascript高级程序设计》P438


  
  
  
  
  
 
 
 
 
