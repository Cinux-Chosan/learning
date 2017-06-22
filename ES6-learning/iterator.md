# Iterator

Iterator 用于提供统一的遍历接口。

如果需要实现 Iterator，实现对象的 Symbol.iterator 属性，该方法返回一个 Iterator 对象，即实现了 next 方法的对象。

for...of 会默认调用元素的 iterator，如果传入的是对象，for...of 会调用对象的 Symbol.iterator， iterator 在它的原型链上也实现了 Symbol.iterator 方法，它值行后返回自身：

`Array.prototype[Symbol.iterator]()` 和 `Array.prototype[Symbol.iterator]()[Symbol.iterator]()[Symbol.iterator]()` 返回的还是 Iterator 对象的实例。

``` js
      var g = Array.prototype[Symbol.iterator]()
      g == g[Symbol.iterator]()[Symbol.iterator]() //true
```

### 调用Iterator接口的场合

#### 解构赋值

- 对数组和Set结构进行解构赋值时，会默认调用Symbol.iterator方法。

#### 扩展运算符

- 扩展运算符（...）也会调用默认的iterator接口。对象如果要使用扩展运算符，需要实现 Symbol.iterator

#### yield*

- yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。生成器（Generator）实际上就是一个遍历器生成函数。

      let generator = function* () {
        yield 1;
        yield* [2,3,4];
        yield 5;
      };

#### 其他场合

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。下面是一些例子。
- for...of
- Array.from()
- Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
- Promise.all()
- Promise.race()


字符串默认也实现了 Iterator， [...'zhang'] 为 ['z', 'h', 'a', 'n', 'g']
