#char 7 —— 函数表达式

> 个人理解： 一个函数被创建了，它所引用的外层作用域的变量就一直引用着，并不是等到它被调用的时候才会去获取那个变量，而是在自己的作用域有了一个对外层对应变量的引用。即创建函数的时候（非调用时，即调用之前）如果发现函数内部有引用外层作用域的变量，就会在函数内部的[[Scope]]内部属性上面建立了对外面变量的引用，在调用之前，已经有一个外层作用域被保存在[[Scope]]，当调用执行函数的时候，才会根据引用去获得所引用变量的值，并且在调用的时候会首先推入自己的 arguments 作为活动对象。

> FireFox，Safari，Chrome，Opera 给函数定义了一个非标准的name属性，即：

                            function f() {};
                            f.name == 'f';
> 以下代码为无效代码，浏览器可能会尝试修复该代码，但是不同的浏览器可能方式不一样，就会导致结果不一致：

                            if (condition) {
                              function sayHi() {
                                alert("Hi!")
                              }
                            } else {
                              function sayHi() {
                                alert('Yo!');
                              }
                            }

> 递归，为了解决函数名的引用被改变从而导致出现问题，在函数体内最好使用arguments.callee来指向当前函数，但是由于严格模式下无法通过脚本访问arguments.callee，可以使用命名函数表达式来达成相同效果：

                            var factorial = (function f(num) {
                              if (num <= 1) {
                                return 1;
                              } else {
                                return num * f(num-1);
                              }
                            });

> 闭包：闭包就是有权访问另一个函数作用域中变量的函数。创建闭包的常用方式，就是在一个函数内部创建另一个函数：

> 其实，**作用域链** 本质上是一个指向变量对象的 **指针列表**，它只引用但不包含变量对象。

> 在 **创建** 函数的时候，会创建一个预先包含全局变量对象的作用域链，保存在内部的[[Scope]]属性中；在 **调用** 函数的时候，会为函数创建一个执行环境，然后通过复制函数的[[Scope]]属性中的对象构建起执行环境的作用域链，此后，又一个活动对象 —— 变量对象被创建并被推入执行环境作用域链的前端。此时作用域链中包含两个变量对象：本地活动对象 和 全局变量对象。

> 闭包与变量：以下代码，由于每个函数的作用域链都保存着createFunction()的活动对象，所以它们的引用都是同一个变量 i，当 createFunction()函数返回的时候，变量 i 的值是10，所以在返回的每个函数内部，i的值也都是10：

                            function createFunction() {
                              var ret = new Array();
                              for(var i = 0; i < 10; i++) {
                                ret[i] = function() {
                                  return i;
                                };
                              }
                              return ret;
                            }

> 可以通过创建一个匿名立即执行函数来强制让闭包的行为符合预期（即返回一个函数数组，函数内部的变量为当时传入的 i 的值）：

                            function createFunction() {
                             var ret = new Array();
                             for(var i = 0; i < 10; i++) {
                               ret[i] = function(num) {
                                 return function() {
                                   return num;
                                 };
                               }(i);
                             }
                             return ret;
                            }

> 访问包含函数的 this， 需要将 this 额外保存，否则内部函数只能通过　this 调用自己的this。

> IE9之前，垃圾回收机制不同，会导致一个问题：如果闭包的作用域链中保存着一个HTML元素，那么久意味着该元素无法被销毁：

                            // 由于 匿名函数一直引用了外层函数的 element，而 element 又引用页面一个元素，如果该元素不被销毁，那么element的引用数至少也是 1，导致内存永远不会被回收
                            function assignHeader() {
                              var element = document.getElementById('someElement');
                              element.onclick = function() {
                                 alert(element.id);
                              }
                            }

> 修改方案：

                            function assignHeader() {
                              var element = document.getElementById('someElement');
                              var　id = element.id;   // 消除可能的循环引用
                              element.onclick = function() {
                                 alert(id);
                              }
                              element = null;   // 消除引用
                            }

> 闭包模仿块级作用域语法：

                            (function(){
                              // 块级作用域区域
                            })();
        //　函数声明不能直接带()，但是函数表达式可以。所以要加上外层括号将它转换成函数表达式，所以上面是对的，下面是错的。

                            function(){
                              // 块级作用域区域
                            }();            //   出错！！


          // 在任何只需要临时变量的情况下，都可以使用私有作用域：
                            function outputNumbers(count) {
                              (function() {
                                for (var i = 0; i < count; i++) {
                                  alert(i);
                                }
                                })();
                                alert(i);   // 出错！！
                            }

> 闭包实现私有变量和函数（类似与C++的private变量和函数），特殊情况可以隐藏字段只供函数内部使用：

                            function MyObj() {
                              // 私有成员不使用 this 声明
                              var privateVariable = 10;        
                              function privateFunction() {
                                return false;
                              }

                              // 公有成员使用 this 声明，除了通过该函数，外部无法访问privateVariable 和 privateFunction
                              this.publicMethod = function () {    
                                privateVariable++;
                                return privateFunction();
                              };
                            }

> 模块模式（单例）：利用内部作用于始终指向外部同一个变量这个特性，可以创建单例。所谓单例，指的就是只有一个实例对象，javascript以对象字面量的方式来创建单例对象：

                            var singleton = {
                              name: value,
                              method: function() {
                                // 方法代码
                              }
                            };

> 添加私有变量和特权来增强单例：

                            var singleton = function() {
                              // 私有变量和属性
                              var privateVariable = 10;
                              var privateFunction() {
                                return false;
                              }
                              return {
                                publicProperty: true,
                                publicMethod: function() {
                                  privateVariable++;
                                  return privateFunction();
                                }
                              };
                            }();

《javascript高级程序设计》P189 模块模式（单例）


























































。
