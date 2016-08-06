


##char 4
>> typeof null 为 "object"

>> js的5种基本类型： undefined, null, boolean, number, string。

>> 检测对象用 variable instanceof constructor，如 arr instanceof Array。但是由于可能存在多个框架，所以可能存在多个Array构造函数，所以使用Array.isArray()来判断比较好。

>> 每个执行环境都有一个与之对应的变量对象，环境中定义的所有变量和函数都保存在这个对象中，虽然我们编码的时候无法访问到它，但是解析器处理数据时会使用它。最开始只有一个arguments对象。函数的作用域链至少包含两个对象，即arguments和全局对象。

>> with(...) {}给括号内的作用域前端添加了变量对象，但是与with最接近的环境是它所在的函数环境，使用var声明的变量会被添加到最接近的环境变量中。即with内使用var声明的变量会出现在with语句缩在的环境中。

>> **如果与非对象进行操作运算，会在对象上调用 valueOf()方法以取得基本类型的值。**

>> 为了消除循环引用带来的负面效果，最好手动断开原声JavaScript对象与DOM元素之间的连接，即 myObj.element = null;主要是解除全局对象、全局对象的属性、循环引用变量的引用。

---
##char 5
> 数组：
>> 数组的toString()返回以逗号间隔的字符串，valueOf()返回的还是数组。但是在使用console.log等来输出数组的时候，会自动调用数组的toString()来构造字符串，实际上是调用了数组中每一项的toString()。

>> concat()：创建一个与当前数组相同的新数组，将参数追加在尾部，然后返回新数组，参数可以是数组或非数组，也可以多个参数。如果没有参数，则返回原数组的副本。

>> slice()：基于当前数组的一个或者多个项创建一个新数组。
>>> 1 个参数，则返回从该参数下标到末尾组成的新数组。

>>> 2 个参数，则返回从参数1到参数2（不包括参数2，即[1,2)）的新数组。

>> splice()：splice的英文意思是 粘接，而slice是切片。
>>> 删除： 2个参数。删除的位置和项数

>>> 插入： 3个参数。起始位置，0（删除0项），...插入的项

>>> 替换： 3个参数。起始位置，删除的项数，...插入的项（删除数与插入数不必相等）。

>>> 该函数的所有操作都会在原数组上修改。返回值为从原数组中删除的项组成的数组，未删除则返回空数组。

>> indexOf() 和 lastIndexOf()：
>>> 使用 === ，所以会有如下注意事项：

        var person = { name: "zjj" };
        var people = [ {name: "zjj"} ];
        var morePeople = [person];
        people.indexOf(person); // -1 , 两个不同对象使用 == 或者 === 均返回false,此处使用 ===
        morePeople.indexOf(person);  //0 , 自身相等

>> 基本的迭代方法有：every(), filter(), forEach(), map(), some()。它们都接受两个参数，function(item, index, array){...} 和函数作用域对象（即影响this的值）。

>> 归并方法：reduce()和reduceRight()。接受参数为函数function(前一个值，当前值，索引，数组对象)，迭代执行直到访问完数组所有项。首次执行从第二项开始，所以当前值是第二个，前一个值是第一个，以后每次的前一个值是上一次该函数调用的返回值。


> [Date类型](p98 "javascript高级程序设计") 、 [regExp类型](p103 "javascript高级程序设计")  

> Function类型
>> 函数是对象，var sum = new Function(...params, string body);即最后一个参数始终是代表函数体的字符串。

>> 直接声明的函数，解析器在执行环境中加载数据时，率先读取函数声明，并使其在执行任何代码之前可用。但是使用var f1 = function() {...} 这样方式声明的函数，只有等到执行到该行代码，才会被解释执行。

>> 函数作为返回值：（在根据对象属性排序中非常有用）

        function createComparisonFunction(propertyName) {
          return function(obj1, obj2) {
            var value1 = obj1[propertyName];
            var value2 = obj2[propertyName];
            return value1 - value2;
          }
        }
        arr.sort(createComparisonFunction('name'));

>> 函数内部属性：arguments 和 this。
>>> 其中arguments有callee属性，该属性为指向拥有arguments对象的函数指针。另外，还有一个是caller，它保存着调用当前函数的函数的引用，如果是全局作用域中调用当前函数，它的值为 null，也可以使用 arguments.callee.caller，因为 callee指向的也是当前函数。

>>> 严格模式中，访问arguments.callee和arguments.caller都会报错，也不能给函数的caller赋值。非严格模式中访问arguments.caller始终返回undefined。这些规则都是为了加强语言的安全性，这样第三方代码就不能在相同的环境里窥探其他代码了。

>> 函数的属性和方法： length，
>>> length表示函数定义时的参数个数。

>>> prototype：不可枚举，所以通过 for...in无法发现该属性。

>>> 每个函数都包含两个非继承而来地方法： apply() 和 call()。它们的作用可以用于传递参数和扩充函数的作用域。
>>>> apply()接受2个参数：作用域 和 参数数组，第二个参数可以是Array实例，也可以是arguments对象：

        function sum(num1, num2) {
          return num1 + num2;
        }
        function callSum1(num1, num2) {
          return sum.apply(this, arguments);
        }
        function callSum2(num1, num2) {
          return sum.apply(this, [num1, num2]);
        }
        alert(callSum1(10, 10));   // 20
        alert(callSum2(10, 10));   // 20

>>>> call()与apply()的不同之处在于参数形式不同，但是结果都是一样。call需要明确传入参数，即第一个参数还是this，后面的参数会直接原样传递给函数。

>>>> bind()：该方法会创建并返回一个函数实例，该函数实例的this被绑定到传入bind()的参数上。

        window.color = "red";
        var o = { color: "blue"};
        function sayHello() {
          alert(this.color);
        }
        var objSayHello = sayHello.bind(o);
        objSayHello(); // blue  ，原因是通过bind返回的新函数实例objSayHello的this值为传入的参数 o，所以不管在哪里调用，都会显示 "blue"

>>> 函数继承的 toString()和toLocalString()都会返回函数代码的字符串。而继承的valueOf()则返回函数代码，非字符串。

>> 基本包装类型：在读取基本数据类型的值的时候，会在后台创建相应的基本包装类型，以方便调用一些方法来操作数据，比如 var str1 = "xxx"; var str2 = str1.subString(2);当读取数据的时候，后台会自动完成如下处理：
    (1):创建一个类型的实例； var str1 = new String("xxx");
    (2):在实例上调用指定方法；  var str2 = str1.subString(2);
    (3):销毁实例。   str1 = null;
>> 引用类型与基本包装类型的区别在于生命周期，使用 new 创建的引用类型实例，在离开当前作用于前，一直存在于内存中，而自动创建的包装类型则只会存在于一行代码的执行瞬间，而后立即被销毁。

>> Object构造函数会根据传入的值的类型，返回相应的包装类型的实例：

        var obj = new Object("xxx");
        obj instanceof String;   // true

>> 需要注意：使用 new 调用基本包装类型的构造函数，与直接调用转型函数不一样：

        var value = "25";
        var number = Number(value);  //转型函数
        typeof number;  // "number"

        var obj = new Number(value);  //构造函数
        typeof obj;  // "object"   
















































































































































































































































































































































































































































。
