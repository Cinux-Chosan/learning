


>> 基本数据类型： Number
>>> 可以通过给其toString()传入参数来表示按什么进制返回数据：

                var n = 12;
                n.toString(2);  // "1100"
>>> 可以通过 toFixed() 来按指定小数位数返回数值的字符串表示：

                var num = 10;
                num.toFixed(2);  // "10.00"

>> 基本数据类型： string
>>> charAt() , charCodeAt() 。 fromCharCode()根据提供的编码还原成字符或字符串，与charCodeAt()相反。

>>> concat() 连接，不修改原字符串

>>> slice()，substring()，substr():不修改原字符串。第一个参数为起始位置，前两者的第二个参数是表示最后一个字符之后的位置，而substr()的第二个参数表示从第一个字符开始的长度。

>>> indexOf() , lastIndexOf()

>>> toLowerCase() , toLocalLowerCase(), tuUpperCase() , toLocalUpperCase()

>>> match(), search(), replace() 关于字符串的正则表达式，参考《javascript高级程序设计》p126

>>>

##char 4 —— 变量、作用域和内存问题
>> typeof null 为 "object"

>> js的5种基本类型： undefined, null, boolean, number, string。

>> 检测对象用 variable instanceof constructor，如 arr instanceof Array。但是由于可能存在多个框架，所以可能存在多个Array构造函数，所以使用Array.isArray()来判断比较好。

>> 每个执行环境都有一个与之对应的变量对象，环境中定义的所有变量和函数都保存在这个对象中，虽然我们编码的时候无法访问到它，但是解析器处理数据时会使用它。最开始只有一个arguments对象。函数的作用域链至少包含两个对象，即arguments和全局对象。

>> with(...) {}给括号内的作用域前端添加了变量对象，但是与with最接近的环境是它所在的函数环境，使用var声明的变量会被添加到最接近的环境变量中。即with内使用var声明的变量会出现在with语句缩在的环境中。

>> **如果与非对象进行操作运算，会在对象上调用 valueOf()方法以取得基本类型的值。**

>> 为了消除循环引用带来的负面效果，最好手动断开原声JavaScript对象与DOM元素之间的连接，即 myObj.element = null;主要是解除全局对象、全局对象的属性、循环引用变量的引用。

---
##char 5 —— 引用类型
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
                morePeople.indexOf(person);  // 0 , 自身相等

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

> Global对象
>> URI编码：
>>> encodeURI()和 encodeURIComponent()：encodeURI不会对本身属于URI特殊字符进行编码，如冒号，斜线，而encodeURIComponent会编码任何非标准字符。例如：

                var uri = "https://github.com/Cinux-Chosan/no data"
                encodeURI(uri)
                "https://github.com/Cinux-Chosan/no%20data"
                encodeURIComponent(uri)
                "https%3A%2F%2Fgithub.com%2FCinux-Chosan%2Fno%20data"
>>> 所以encodeURI可以用于整个URI，而encodeURIComponent只能用于URI后面的附加字符串。

>>> 与之对应的是 decodeURI()和decodeURIComponent()

>>> eval()：非严格模式下，eval()中的代码会被解析并且插入原位置，所以它能访问外部作用域，外部作用域也能访问它里面的变量和函数。但是严格模式下会报错。

>>> window承担了Global对象的角色，如果需要获取Global对象，可以使用如下代码：

                var global = function(){return this;}();
>>> 因为没有给函数明确指定this的情况下，this的值都等于Global对象。（call(),apply()或者将函数添加为对象方法）

> Math对象：Math是个对象，不是一个类。
>> min() 和 max() ; 传入一组值，返回对应值： var max = Math.max(1,2,3); // 3。
>>> 要找数组中的最大最小值，使用apply()，否则会返回 NaN：

                var arr = [1,2,3,4];
                var max = Math.max.apply(Math, arr);

>> ceil() , floor() , round()

>> random()返回 [0, 1) 的随机数。
>>> 值 = Math.floor(Math.random() * 可能的总值 + 第一个可能的值)


##char 6 —— 面向对象的程序设计
> 属性类型： 内部属性，是为了实现javascript引擎用的，因此在javascript中不能直接访问它们。为了表示属性是内部值，ECMA-262规范将它们放在两对方括号中，例如：[[Enumerable]]。
>> 数据属性：数据属性包含一个数据值，它有4个描述其行为的特性：
>>> [[Configurable]]：表示能否通过delete删除属性从而可以重新定义属性，能否修改属性的特性或者能否把属性修改成为访问器属性，默认为 true。

>>> [[Enumerable]]：表示能否通过for-in循环返回该属性。默认为 true。

>>> [[Writable]]：表示能否修改属性的值。默认为 true。

>>> [[Value]]：包含属性的值，读取和写入都操作该值，默认为 undefined。

>>> 修改以上属性，使用 Object.defineProperty()方法。接受三个参数：属性所在的对象、属性的名字，描述符对象(包含上面四个属性中一个或多个属性的对象)。在调用该方法的时候，如果不指定，除了[[Value]]，其它三个都为false。但是直接在对象上定义的属性(obj.propertyName = value)的特性默认为true。

>>> [[Configurable]]一旦被设置为false，就不能再设置为true了。

>> 访问器属性：不包含数据值，但是包含一对 getter和setter。它们负责在读取和写入数据前的一些操作和转换。也有4个特性：
>>> [[Configurable]]: 表示能否通过delete删除属性从而重新定义属性，或者能否修改属性的特性，或者能否把属性修改为数据属性。对于直接在对象上定义的属性，默认为true。

>>> [[Enumerable]]: 表示能否通过for-in循环返回属性。对于直接在对象上定义的属性，默认为true。

>>> [[Get]]: 在读取该属性时调用的函数，默认undefined。

>>> [[Set]]:　在写入该属性时调用的函数，默认为undefined。

>>> 访问其属性不能直接定义，必须使用Object.defineProperty()来定义，示例如下：

                          var book = {
                            _year: 2004,
                            edition: 1
                          };
                          Object.defineProperty(book, 'year', {
                            get: function() {
                              return this._year;
                            },
                            get: function(newValue) {
                              if (newValue > 2004) {
                                this._year = newValue;
                                this.edition += newValue - 2004;
                              }
                            }
                            });

                            book.year = 2005;
                            book.edition;  // 2
>>> 如上例所示，属性以下环线(\_)开头，说明该属性需要通过对象的方法来访问，相当于是私有属性，不能直接调用（但是在浏览器中测试，可以直接取值和设置值）。例中的_year是数据属性，而通过Object.defineProperty定义的year则为访问器属性。只指定get意味着不能写入，只指定set则意味着不能读取，非严格模式下，只有set会返回undefined，严格模式会报错。

>>> 在使用该方法之前，如果要定义访问器属性，一般都是用两个非标准的方法： \__defineGetter__() 和 \__defineSetter__()。如：

                            book.__defineGetter__("year", function() {
                              return this._year;
                              });


>>> 定义多个属性，使用Object.defineProperties()：

        var book = {};
        Object.defineProperties(book, {
          _year: {
            value: 2004
          },
          edition: {
            value: 1
          },
          year: {
            get: function() {
              return this._year;
            },
            set: function(newValue) {
              if (newValue > 2004) {
                this._year = newValue;
                this.edition += newValue - 2004;
              }
            }
          }
        });


>>> 读取属性的特性，使用 Object.getOwnPropertyDescriptor()方法，可以取得给定属性的描述符。接收两个参数：属性所依附的对象和属性名称，返回值为一个对象。如果是数据属性，该对象属性有 configurable, enumerable, writable, value；如果是访问器属性，该对象属性有 configurable, enumerable, get, set。

                var book = {};
                Object.defineProperties(book, {
                  _year: {
                    value: 2004
                  },

                  edition: {
                    value: 1
                  },

                  year: {
                    get: function() {
                      return this._year;
                    },

                    set: function(newValue) {
                      if (newValue > 2004) {
                        this._year = newValue;
                        this.edition += newValue - 2004;
                      }
                    }
                  }
                });

                var descriptor = Object.getOwnPropertyDescriptor(book, "_year");
                descriptor.value;  // 2004
                descriptor.configurable;  // false ,不可配置。
                typeof descriptor.get;  // "undefined"

                var descriptor = Object.getOwnPropertyDescriptor(book, "year");
                descriptor.value;  // undefined
                descriptor.enumerable;  // false
                typeof descriptor.get;  // function


> 创建对象：

>> 使用 new 创建对象新实例，会经历 4 个步骤：
>>> 创建一个新对象；

>>> 将构造函数的作用域赋值给新对象（因此this就指向了这个新对象）；如constructor.call(o);

>>> 执行构造函数代码。

>>> 返回新对象。

>> 对象都有一个constructor属性，指向其构造函数。

>> 对于没有使用new 操作符而直接使用构造函数，该函数内部并没有创建新对象并返回该对象，而是调用 this创建属性，那么所有属性会被赋值给window，因为此时函数的this是window。

>> 对于没有使用new操作符，可以使用 var o = new Object(); constructor.call(o, params);的形式来创建对象。

>> 继承：每个函数都有一个 prototype属性，该属性为一个指针，指向一个对象。这个对象的用途就是包含可以由特定类型的所有实例共享的属性和方法，说简单一点，就是所有对象共享原型对象上的方法和属性。

>> 无论什么时候，创建一个新函数，就会根据一组特定的规则成为该函数创建一个 prototype属性，这个属性指向函数的原型对象。在默认情况下，所有原型对象都会自动获得一个 constructor属性，这个属性包含一个指向 prototype 属性所在函数的指针。如：Person.prototype.constructor === Person;

>> 创建一个自定义的构造函数过后，其原型对象默认只会取得 constructor 属性。至于其它方法，都是从 Object继承而来的。当调用构造函数创建一个新实例后，该实例的内部将包含一个指针[[Prototype]]，指向构造函数的原型对象，注意：这个连接时存在于实例与构造函数的原型对象之间，而不是实例与构造函数之间。[[Prototype]]没有标准的访问方式，但是Firefox, Safari和 Chrome在每个对象上都支持一个__proto__属性。

>> **注意注意注意：对于构造函数，其属性为prototype，对于对象实例，其属性为 [[Prototype]]，[[Prototype]]通过对象的属性__proto__访问。其实他们都是同一个东西**

>> 通过prototype（或者[[Prototype]]，即\__proto__）的属性isPrototypeOf()方法可以来确定两个对象的 [[Prototype]] 或者 对象的[[Prototype]]与构造函数的prototype属性是否是同一个：

                Person.prototype.isPrototypeOf(person1);  // true
                person1.__proto__.isPrototypeOf(person2);  // true

>> ES5 还新增了一个方法叫 Object.getPrototypeOf()用来返回 [[Prototype]]的值。

>> 原型最初只有一个constructor属性，而该属性也是共享的，因此可以通过对象实例访问。

>> 可以通过对象实例访问原型链中的值，但是却无法通过对象实例修改原型中的值，因为在当前对象上调用原型链上的同名属性，会在当前对象上创建该属性，因此会覆盖原型链上的同名属性，即在查找属性的时候，在本对象上找到了该属性，就不会再继续查找原型链，相当于把原型链上的该属性屏蔽掉了，但是只限于当前对象实例。这样做只是限制我们直接在对象上读取该属性，但是还是可以通过原型链访问，因为该属性并没有被修改。通过delete操作符删除当前对象的同名属性过后，又可以恢复我们在该对象上直接访问原型链上的属性，如果name属性在原型链上，delete person.name并不会操作到原型链上的name属性。

>> 检测一个属性是实例属性，还是原型链属性，使用从Object继承而来的hasOwnProperty()方法。只有当实例上存在该属性，而非原型链上存在该属性，该函数才会返回true。同理，要取得原型对象上的属性描述符，需要在原型对象上调用 Object.getOwnPropertyDescriptor()。

>> in操作符：单独使用时，如果对象能访问到某个属性，无论是在当前对象实例中还是原型链中，只要能访问到，就返回true。

                // 检测函数是否属于原型链上的函数
                function hasPrototypeProperty(obj, propName) {
                  return !obj.hasOwnProperty(name) && (name in obj);
                }

>> 在使用 for-in 循环时，返回的所有能够通过对象访问的（无论实例中的属性还是原型链中的属性）、可枚举的属性（即[[Enumerable]] 为 false）。根据规定，所有开发人员定义的属性都是可枚举的属性（IE8即更早的版本是例外）。

>> 要获取对象上的所有可枚举实例属性，可以使用ES5的 Object.keys()方法。如果想要获得所有实例属性，无论是否可枚举，使用 Object.getOwnPropertyNames()。

>> 更简单的原型语法：由于每次添加一个属性就需要敲一遍 Person.prototype。为了减少不必要的输入，常见的做法是使用一个包含所有属性和方法的对象字面量来重写原型对象：

                        function Person(){};
                        Person.prototype = {
                          name: 'Nicholas',
                          age: 23,
                          sayName: function() {
                            alert(this.name);
                          }
                        };
>> 但是这样做的话，prototype上的constructor不等于Person，而是创建它的 Object。此时虽然通过instanceof还能返回正确结果，但是无法通过constructor确定对象的类型了。如果constructor的值非常重要，可以手动将它恢复成Person:

                        function Person(){};
                        Person.prototype = {
                          constructor: Person,
                          name: 'Nicholas',
                          age: 23,
                          sayName: function() {
                            alert(this.name);
                          }
                        };
>> 手动恢复的constructor的[[Enumerable]]为true ,而默认情况下原生的constructor的值应该是 false，此时可以通过 Object.defineProperty()来配置该constructor。


>> 寄生模式： 在函数内通过 new Object()创建一个新对象实例，然后在对象实例上进行操作，最后返回该对象。在外部调用该函数的时候，通过new操作符调用。（如果函数没有返回内容，则new操作符会创建一个对象实例，如果有返回值，则会返回该返回值）

                      function Person(name, age) {
                        var o = new Object();
                        o.name = name;
                        o.age = age;
                        o.sayName = function() {
                          alert(this.name);
                        };
                        return o;
                      }
                      var friend = new Person("Nicholas", 29);  // 如果Person内部没有返回值，new操作符会返回一个对象实例，如果有返回值，使用new将得到该返回值
                      friend.sayName();  // "Nicholas"
>> 寄生模式带来的问题就是，返回的对象与构造函数的原型属性之间没有关系，不能用instanceOf来确定类型

>> 稳妥的构造函数：禁止或者不使用this和new。通过方法调用传入构造函数的属性。

                    function Person(name, age) {
                      var o = new object();  
                      o.sayName = function() {
                        alert(name);
                      };
                      return o;   
                    }

                    var person = Person("Nicholas", 23);
                    person.sayName();  // 这里只能通过sayName来访问传入的属性

> 继承：通过原型链，让原型链保存父类的实例。

> 默认原型链： 默认所有引用类型都是继承自 Object。所以默认会有Object.prototype属性作为最底层的父类Object用于保存toString()、valueOf() 方法的地方。

> 确定原型和实例的关系： instanceOf 和 isPrototypeOf(); 只要是原型链出现过的构造函数，都会返回true。

> 借用构造函数（最常用的一种方式）：在子类构造函数中调用超类的构造函数。函数只是在特定环境中执行的对象，因此通过使用apply()和call()方法也可以在新创建的对象上执行构造函数。比如超类的构造函数中有一句 this.isShow = false;通过在子类的构造函数中调用 SuperType.call(this);相当于在子类的该部分插入了 this.isShow = false;从而实现继承。

                    function SuperType() {
                      this.colors = ["red", "blue", "green"];
                    }

                    function SubType() {
                      SuperType.call(this);
                    }

                    // instance1.hasOwnProperty('colors');返回true
                    var instance1 = new SubType();    
                    instance1.colors.push("black");
                    instance1.colors;  // "red,blue,green,black"

                    var instance2 = new SubType();
                    instance2.colors;  // "red,blue,green"


> 组合继承：由于借用构造函数执行了所有父类构造函数的代码，方法在构造函数中定义，函数复用就无从谈起，数据也会被共享，考虑到种种问题，所以将原型链和借用构造函数结合 —— 在父类的构造函数中定义属性（这样就不会共享属性），在父类的原型（prototype）上定义方法（将方法共享）。

                    function SuperType(name) {
                      this.name = name;
                      this.colors = ["red", "blue", "green"];
                    }

                    SuperType.prototype.sayName = function() {
                      alert(this.name);
                    };

                    function SubType(name, age) {
                      // 继承属性，由于是第二次调用超类构造函数，所以是屏蔽超类属性
                      SuperType.call(this, name);   // 第二次调用超类构造函数
                      this.age = age;
                    }

                    // 继承方法
                    SubType.prototype = new SuperType();   // 第一次调用超类构造函数
                    SubType.prototype.constructor = SubType;
                    SubType.prototype.sanAge = function() {
                      alert(this.age);
                    };

                    var instance1 = new SubType("Nicholas", 29);
                    instance1.colors.push("black");
                    instance1.colors;   // "red,blue,green,black"
                    instance1.sayName();   // "Nicholas"
                    instance1.sanAge();   // 29

                    var instance2 = new SubType("Greg", 29);
                    instance2.colors;   // "red,blue,green"
                    instance2.sayName();   // "Greg"
                    instance2.sayAge();   // 27


> 原型式继承 《javascript高级程序设计P169》,传入一个对象作为原型对象，如果继承自它的对象没有覆盖它的属性，就会以它的属性作为默认值（因为搜索该属性的时候，如果子类实例没有覆盖对应属性，就会搜索到它上面）。

                      function obj(o) {
                        function F(){};
                        F.prototype = o;
                        return new F();
                      }

                      var person = {
                        name: "Nicholas",
                        friends: ["Shelby", "Court", "Van"]
                      };

                      var anotherPerson = obj(person);
                      anotherPerson.name = "Greg";   // 覆盖原型上的name属性
                      anotherPerson.friends.push("Rob");

                      var yetAnotherPerson = obj(person);
                      yetAnotherPerson.name = "Linda";
                      yetAnotherPerson.friends.push("Barbie");

                      person.friends;   // "Shelby,Court,Van,Rob,Barbie"
                      anotherPerson.name;   // "Greg"
                      yetAnotherPerson.name;   // "Linda"

>> ES5新增了 Object.create()方法规范化了原型式继承。该方法接受两个参数，一个是用作新对象原型的对象，一个是为新对象定义额外属性的对象（可选）。在传入一个参数的情况下，Object.create() 和上面的 obj()相同。 第二个参数与Object.defineProperties()的第二个参数格式相同，每个属性都是通过自己的描述符定义的，会覆盖原型对象上的同名属性：

                      var person = {
                        name: "Nicholas",
                        friends: ["Shelby", "Court", "Van"]
                      };

                      var anotherPerson = Object.create(person, {
                        name: {
                          value: "Greg"
                        }
                      });

                      anotherPerson.name;   // "Greg"

> 寄生式继承：创建一个用于封装的继承过程的函数，该函数内部以某种方式来增强对象，最后再像真的做了所有工作一样返回对象。

                      function createAnother(origin) {
                        var clone = obj(origin);   // obj为原型式继承中的示例函数
                        clone.sayHi = function() {
                          alert("Hi");
                        };
                        return clone;
                      }

> 寄生组合式继承：避免调用两次SuperType，还避免了在SubType.prototype上面创建不必要的多余的属性。与此同时，还能保持原型链不变，因此还能够正常使用instanceOf和isPrototypeOf()，被认为是最理想的继承方式。

                      function inheritPrototype(subType, superType) {
                        // obj为原型式继承中的示例函数
                        var prototype = obj(superType.prototype);
                        prototype.constructor = subType;
                        subType.prototype = prototype;
                      }

                      function SuperType(name) {
                        this.name = name;
                        this.colors = ["red", "blue", "green"];
                      }

                      SuperType.prototype.sayName = function() {
                        alert(this.name);
                      };

                      function SubType(name, age) {
                        SuperType.call(this, name);
                        this.age = age;
                      };

                      inheritPrototype(SubType, SuperType);

                      SubType.prototype.sayAge = function() {
                        alert(this.age);
                      };






























































































































































































































































































































































。
