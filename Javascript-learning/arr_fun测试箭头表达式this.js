exports.exports_name = "exports name";
module.exports = {
    namexxx: "xxx"
};

function A() {
    this.name = "aaa";
    global.array_func = () => console.log(this.name);
    this.fc = function(f) {
        console.log("********************************* BEGIN ************************************");

        console.log(this);

        console.log("********************************* 11111 ************************************");

        f.call(this);

        console.log("********************************* 22222 ************************************");

        f();

        console.log("********************************* 33333 ************************************");

        global.array_func();  // global.array_func 在 A 中定义，所以 this 为 A 中的 this.name

        console.log("********************************* END ************************************");

    };
    return this;
}

var a = new A;

global.name = "this is glob";

this.name = "this is exports";   // exports === this

console.log(this.exports_name);   // 此时会输出第一行的 "exports name"，


a.fc(() => console.log(this.name)); // 函数的 this 为动态的，自己的this会覆盖其他的this变量，或者说箭头函数的 this 是在它声明时的处在的上下文环境的 this 而非调用时的 this。当前箭头函数中的this为 exports 对象 {}

console.log("\n------------------------------------------------------------------------------------------");

a.fc((function() {
  console.log(this == global);   // true
  this.name = "bbb";   // 由于函数直接调用this会被绑定在 global上，此时this和global为同一个东西。所以这里会覆盖前面的 global.name = "this is glob"，等同于 global.name = "bbb"
  return () => console.log(this.name); // bbb  匿名函数 this为　global，箭头函数没有 this，也不可通过 call 动态绑定this，所以它的 this为它当前上下文环境的 this，即 global
})());

console.log("\n------------------------------------------------------------------------------------------");

console.log(this); // 模块中顶层 this 为 {}，即 exports 对象

console.log("\n------------------------------------------------------------------------------------------");

let array_func = (function() {
  console.log(this == global);    // true   匿名函数，global 为 this
  this.name = "bbb";      //  等同于 global.name = "bbb"
  return () => console.log(this.name);    // 箭头函数没有 this，在它内部访问 this 会指向它上层的 this
})();

a.fc(array_func);

console.log("\n------------------------------------------------------------------------------------------");

a.fc((function() {
    this.name = "bbb";
    console.log(this == global);
    return function() {
        console.log(this.name);  // 匿名函数 this为 global，可通过 call 动态绑定 this
    };
})());




/* 总结，
 - 箭头函数没有自身的this，它的this为定义时候的上下文环境的this，匿名函数和函数有自己的this，直接调用函数而非绑定在其它对象上调用时，函数的this为全局变量，node为global，浏览器端为 window，node 模块中最外层 this 为 exports 对象，最初的exports实际上就是 {};
   - 箭头函数没有自己的 this，它的 this为它所处的上下文环境的this，即外层的 this，并且是在定义的时候确定的，而非调用的时候。所以在箭头函数中使用 this.name ，this.name被解析为一个变量，相当于是直接传入它所指的值，而不是在运行函数时候动态解析。箭头函数无法使用 call 进行 this 绑定。
   - 匿名函数调用时候的 this 为 global，使用 call 可以动态绑定函数和匿名函数的 this
   - 在 node 中的 .js 文件里面直接定义的箭头函数里面使用 this.xxx，此时的 this 为 exports 对象，由于 exports 最初为 {}，所以 console.log(this) 为 {}，且 exports === this。此时在箭头函数里面使用 this.xxx ，会引用到 exports的 xxx 属性
*/
