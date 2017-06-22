# Generator

任意一个对象的Symbol.iterator方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。由于Generator函数就是遍历器生成函数，因此可以把Generator赋值给对象的Symbol.iterator属性，从而使得该对象具有Iterator接口。

      var myIterable = {};
      myIterable[Symbol.iterator] = function* () {
      yield 1;
      yield 2;
      yield 3;
      };

      [...myIterable] // [1, 2, 3]


### next方法的参数

yield句本身没有返回值(此处是指函数内部的 yield 值行完成过后是没有返回值返回给等号左边的变量)，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield语句的返回值。

```js
function* f() {
  for(var i=0; true; i++) {
    var reset = yield i;
    if(reset) { i = -10; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: -9, done: false }

```

### for...of

for...of循环

for...of循环可以自动遍历Generator函数时生成的Iterator对象，且此时不再需要调用next方法。
``` js
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}

for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```
上面代码使用for...of循环，依次显示5个yield语句的值。这里需要注意，一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象，所以上面代码的return语句返回的6，不包括在for...of循环之中。


``` js
//下面是一个利用Generator函数和for...of循环，实现斐波那契数列的例子。
function* fibonacci() {
  let [prev, curr] = [0, 1];
  for (;;) {
    [prev, curr] = [curr, prev + curr];
    yield curr;
  }
}

for (let n of fibonacci()) {
  if (n > 1000) break;
  console.log(n);
}
```

### Generator.prototype.throw()

Generator函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在Generator函数体内捕获。
generator的throw方法(非 javascript 的throw 语句)被捕获以后，会附带执行下一条yield语句。也就是说，会附带执行一次next方法。返回 try...catch 之后的 yield。但是在 try 语句块里面的 yield 不会再值行。
后续再次调用该生成器的 next()，返回的是 try...catch 之后的 yield，由于 throw 会自动值行一次 next，所以再吃调用 next 是从 try...catch 之后的第二次 yield 开始。
也可以看出，只要Generator函数内部部署了try...catch代码块，那么遍历器的throw方法抛出的错误，不影响下一次遍历。
一旦Generator执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了, 测试的时候发现它会将最近一次成功的值作为错误对象抛出。如果此后还调用next方法，将返回一个value属性等于undefined、done属性等于true的对象，即JavaScript引擎认为这个Generator已经运行结束了。

```js
      var g = function* () {
        try {
          yield;
        } catch (e) {
          console.log('内部捕获', e);
        }
      };

      var i = g();
      i.next();

      try {
        i.throw('a');
        i.throw('b');
      } catch (e) {
        console.log('外部捕获', e);
      }
      // 内部捕获 a
      // 外部捕获 b
```

上面代码中，遍历器对象i连续抛出两个错误。第一个错误被Generator函数体内的catch语句捕获。i第二次抛出错误，由于Generator函数内部的catch语句已经执行过了，不会再捕捉到这个错误了，所以这个错误就被抛出了Generator函数体，被函数体外的catch语句捕获。


``` js
function* g() {
  yield 1;
  console.log('throwing an exception');
  throw new Error('generator broke!');
  yield 2;
  yield 3;
}

function log(generator) {
  var v;
  console.log('starting generator');
  try {
    v = generator.next();
    console.log('第一次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第二次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  try {
    v = generator.next();
    console.log('第三次运行next方法', v);
  } catch (err) {
    console.log('捕捉错误', v);
  }
  console.log('caller done');
}

log(g());
// starting generator
// 第一次运行next方法 { value: 1, done: false }
// throwing an exception
// 捕捉错误 { value: 1, done: false }  //测试的时候发现它会将最近一次成功的值作为错误对象抛出
// 第三次运行next方法 { value: undefined, done: true }
// caller done
```

### Generator.prototype.return()

Generator函数返回的遍历器对象，还有一个return方法，可以返回给定的值，并且终结遍历Generator函数。 return 可以接收参数。如果有参数，返回的对象的 value 为参数值，done为true，如果没有参数，这value为 undefined。
如果Generator函数内部有try...finally代码块，那么return方法会推迟到finally代码块执行完再执行。

``` js
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers()
g.next() // { done: false, value: 1 }
g.next() // { done: false, value: 2 }
g.return(7) // { done: false, value: 4 }
g.next() // { done: false, value: 5 }
g.next() // { done: true, value: 7 }
```

### yield*语句

如果在Generater函数内部，调用另一个Generator函数，默认情况下是没有效果的。需要使用 yield*

可以简单总结为：如果没有 `*`，则相当于 yield 一个值，如果有 `*`，则相当于调用 yield 后面元素的 iterator。只要实现了 Iterator 的都可以用 yield * 进行遍历。yield* 后面的Generator 的 return 值能赋值给 yield* 等号左边的变量，但是 yield* 后面的常规函数则不行。

```js
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

### Generator函数的this

Generator函数总是返回一个遍历器，ES6规定这个遍历器是Generator函数的实例，也继承了Generator函数的prototype对象上的方法。但是，如果把g当作普通的构造函数，并不会生效，因为g返回的总是遍历器对象，而不是this对象。Generator函数也不能跟new命令一起用，会报错。


```js
function* g() {}

g.prototype.hello = function () {
  return 'hi!';
};

let obj = g();

obj instanceof g // true
obj.hello() // 'hi!'
```

```js
function* g() {
  this.a = 11;
}

let obj = g();
obj.a // undefined
```

由于 Generator 不能和 new 一起用作构造函数，那如果需要 Generator 返回一个正常的对象实例，既可以用 next 又能有 this，下面列举两个方法：

1、首先，生成一个空对象，使用bind方法绑定Generator函数内部的this。这样，构造函数调用以后，这个空对象就是Generator函数的实例对象了。

``` js
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

obj.a // 1
obj.b // 2
obj.c // 3
```

上面代码中，首先是F内部的this对象绑定obj对象，然后调用它，返回一个Iterator对象。这个对象执行三次next方法（因为F内部有两个yield语句），完成F内部所有代码的运行。这时，所有内部属性都绑定在obj对象上了，因此obj对象也就成了F的实例。
上面代码中，执行的是遍历器对象f，但是生成的对象实例是obj，有没有办法将这两个对象统一呢？
一个办法就是将obj换成F.prototype。

```js
function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var f = F.call(F.prototype);

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```

再将F改成构造函数，就可以对它执行new命令了。

``` js
function* gen() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}

function F() {
  return gen.call(gen.prototype);
}

var f = new F();

f.next();  // Object {value: 2, done: false}
f.next();  // Object {value: 3, done: false}
f.next();  // Object {value: undefined, done: true}

f.a // 1
f.b // 2
f.c // 3
```
