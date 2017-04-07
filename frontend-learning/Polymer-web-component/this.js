exports.exports_name = "exports name";
module.exports = {
  namexxx: "xxx"
};

function A() {
  this.name = "AAA";
  global.array_func = () => console.log(this.name);
  global.func = function() {
    console.log(this.name);
  };
  this.fc = function(f) {
    console.log("********************************* BEGIN **********************************");

    console.log(this);

    f.call(this);

    f();

    global.array_func();

    global.func()

    console.log("********************************* END ************************************");

  };
  return this;
}

var a = new A;

global.name = "this is global";

this.name = "this is exports";

console.log(this.exports_name);

a.fc(() => console.log(this.name));

console.log("\n-------------------------------------- line-divider -------------------------------------");

a.fc((function() {
  console.log(this == global);
  this.name = "bbb";
  return () => console.log(this.name);
})());

console.log("\n-------------------------------------- line-divider -------------------------------------");

console.log(this);

console.log("\n-------------------------------------- line-divider -------------------------------------");

let array_func = (function() {
  console.log(this == global);
  this.name = "ccc";
  return () => console.log(this.name);
})();

a.fc(array_func);

console.log("\n-------------------------------------- line-divider -------------------------------------");

a.fc((function() {
  this.name = "ddd";
  console.log(this == global);
  return function() {
    console.log(this.name);
  };
})());






















































































// node在编译模块的过程中，会对获取的 javascript 文件内容进行头尾包装，在头部添加 (function (exports, require, module, __filename, __dirname)) {\n ，在尾部添加了 \n});  在执行之后，模块的 exports 属性被返回给了调用方