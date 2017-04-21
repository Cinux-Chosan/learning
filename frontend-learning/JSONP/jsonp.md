# JSONP

## 原理

- 浏览器会进行同源检查,这导致了跨域问题,然而这个跨域检查还有一个例外那就是HTML的`<Script>`标记;我们经常使用`<Script>`的src属性,脚本静态资源放在独立域名下或者来自其它站点的时候这里是一个url;这个url响应的结果可以有很多种,比如JSON,返回的Json值成为`<Script>`标签的src属性值.这种属性值变化并不会引起页面的影响.按照惯例，浏览器在URL的查询字符串中提供一个参数，这个参数将作为结果的前缀一起返回到浏览器;简单说了，就是通过 `<script>` 标签的 src 提供查询参数给后端，后端会返回对应的数字，但是由于 `<script>` 标签会立即执行，所以如果后端返回字符串包含本地函数名，如返回 'sayName(Chosan)'，本地作用于内正好有一个 sayName 函数，则会在本地立即执行 sayName(Chosan)。

## jQuery 使用JSONP：

### $.getJSON

jQuery 的 getJSON 函数，在发出请求之前会给 Url 的第一个 `?` 替换成jQuery 随机生成的函数名，并且会将提供给 getJSON 的回调函数与该函数名绑定。

例如：

``` js
$.getJSON('http://ticket.zhubajie.la/ordersync-manager-service/jira/getStatus?orderNo=2020974&callbackparam=?', r => console.log(r));
```

发出的请求Url可能是：

http://ticket.zhubajie.la/ordersync-manager-service/jira/getStatus?orderNo=2020974&callbackparam=jQuery1710487493280783317_1492753899821

callbackparam 的值 jQuery1710487493280783317_1492753899821 会被后端接收，后端处理并返回字符串 jQuery1710487493280783317_1492753899821(data) 会在客户端浏览器立即执行。由于 jQuery 已经将随机函数名 jQuery1710487493280783317_1492753899821 与回调函数 r => console.log(r) 进行绑定，所以执行的是 console.log(data);

### 使用 jquery 的 ajax()

``` js
$.ajax({
      type: 'get',
      url: `http://ticket.zhubajie.la/ordersync-manager-service/jira/getStatus?orderNo=2020974`,
      dataType: 'jsonp',
      jsonp: 'callbackparam',   // 指定后端接收函数名的参数，该属性的值会被替换到上例的 callbackparam 位置
      // jsonpCallback: 'receive',    // 自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据。 该属性的值会被替换到上例的 jQuery1710487493280783317_1492753899821 位置
      success: data => {
        console.log(data.name)
      },
      error: r => {
        console.log('fail');
      }
    });

function receive(data) {
  console.log(data.age);
}
```
