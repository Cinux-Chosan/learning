


> char 4
>> typeof null 为 "object"

>> js的5种基本类型： undefined, null, boolean, number, string。

>> 检测对象用 variable instanceof constructor，如 arr instanceof Array。但是由于可能存在多个框架，所以可能存在多个Array构造函数，所以使用Array.isArray()来判断比较好。

>> 每个执行环境都有一个与之对应的变量对象，环境中定义的所有变量和函数都保存在这个对象中，虽然我们编码的时候无法访问到它，但是解析器处理数据时会使用它。最开始只有一个arguments对象。函数的作用域链至少包含两个对象，即arguments和全局对象。

>> with(...) {}给括号内的作用域前端添加了变量对象，但是与with最接近的环境是它所在的函数环境，使用var声明的变量会被添加到最接近的环境变量中。即with内使用var声明的变量会出现在with语句缩在的环境中。

>> **如果与非对象进行操作运算，会在对象上调用 valueOf()方法以取得基本类型的值。**

>> 为了消除循环引用带来的负面效果，最好手动断开原声JavaScript对象与DOM元素之间的连接，即 myObj.element = null;主要是解除全局对象、全局对象的属性、循环引用变量的引用。

---

> 数组：
>> 数组的toString()返回以逗号间隔的字符串，valueOf()返回的还是数组。但是在使用console.log等来输出数组的时候，会自动调用数组的toString()来构造字符串，实际上是调用了数组中每一项的toString()。

>> concat()：创建一个与当前数组相同的新数组，将参数追加在尾部，然后返回新数组，参数可以是数组或非数组，也可以多个参数。如果没有参数，则返回原数组的副本。
