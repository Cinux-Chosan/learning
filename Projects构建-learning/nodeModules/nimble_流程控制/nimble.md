# [Nimble](http://caolan.github.io/nimble/) 流程控制

js 流程控制模块，将 [underscore](http://documentcloud.github.com/underscore/) 和 [async](https://github.com/caolan/async) 库中最有用的特性通过简单的API相结合，并且大大减小了文件的大小。（gzip压缩过后只有837 bytes）

## Map

通过遍历数组的每个元素并且使用第二个函数对元素进行转换，将所有返回值组成一个新的数组

```js
_.map([1, 2, 3], function (val) {
    return val * 2;
});
```

得到

```
[2,4,6]
```

## Map object

``` js
.map({a:1, b:2, c:3}, function (val, key) {
    return key + '=' + val;
});
```

得到

```
["a=1","b=2","c=3"]
```

## Async map

通过给第二个函数添加一个回调函数 `callback` 并在完成时调用，就可以异步执行操作

``` js
_.map([1, 2, 3], function (val, callback) {
    callback(null, val * 2);
},
function (err, result) {
    console.log(result);
});
```

得到

```
[2,4,6]
```

## Filter

Filter 创建一个新的数组，该数组包含了所有通过第二个参数返回 true 的元素。

Filter 也可以像 map 一样接受 `objects` 或者是一个 `callback` 来异步执行操作。

``` js
_.filter([1, 2, 3], function (val) {
    return val % 2;
});
```

得到

```
[1,3]
```

## Reduce

Reduce 通过在每个元素上面调用参数二的 function 并且将返回值作为第一个参数继续调用参数二的 function 直到遍历完成整个数组并返回最终值。

Reduce 也可以接受 `objects` 和 使用一个 `callback` 来异步执行操作。

``` js
_.reduce([1, 2, 3], function (memo, val) {
    return memo + val;
}, 0);
```

得到

```
6
```

## Each

如果只是需要遍历 `list` 和 `object`，则使用 each 方法，each 也可以使用 `callback` 来异步执行操作。

``` js
_.each([1, 2, 3], function (val) {
    console.log(val);
});
```

得到

```
1
2
3
```

## Parallel

Parallel 将会在同一时间并行运行所有的异步函数，所有这些异步函数都放在一个数组中，该数组作为 Parallel 的第一个参数。

也可以给 Parallel 传递第二个参数，该参数为所有异步操作执行完成后的回调函数。

``` js
_.parallel([
    function (callback) {
        setTimeout(function () {
            console.log('one');
            callback();
        }, 25);
    },
    function (callback) {
        setTimeout(function () {
            console.log('two');
            callback();
        }, 0);
    }
]);
```

得到

```
"two"
"one"
```

## Series

Series 类似于 Parallel，只是每个函数都需要依赖前一个函数执行完成。

Series 接受一个回调函数作为所有操作完成的回调函数。

``` js
_.series([
    function (callback) {
        setTimeout(function () {
            console.log('one');
            callback();
        }, 25);
    },
    function (callback) {
        setTimeout(function () {
            console.log('two');
            callback();
        }, 0);
    }
]);
```

得到

```
"one"
"two"
```
