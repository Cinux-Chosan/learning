## 第一题

```js
var opt = {
  name: "Amy",
  name2: this.name,
  say: function() {
    return this.name;
  },
  say2: function() {
    setTimeout(function() {
      console.log(this.name);
    });
  },
  say3: function() {
    setTimeout(() => {
      console.log(this.name);
    });
  }
};

console.log(opt.name2); //1. 这里打印出什么？  --- window.name, ''
console.log(opt.say); //2. 这里打印出什么？ --- 函数 opt.say 的代码
opt.say2(); //3. 这里打印出什么？ --- 等同于 window.name，''
opt.say3(); //4. 这里打印出什么？ --- "Amy"
```

## 第二题 ===========================

<!--
实现一个方法genCssSelector，可以根据一个给定的元素生成一个CSS选择器，通过这个选择器可以快速定位到这个元素（document.querySelector(A)）
-->

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <div id="page">
      <div class="content main">
        <div class="refer">
          <ul>
            <li></li>
            <li></li>
            ...
          </ul>
        </div>
      </div>
    </div>
  </body>
</html>
```

根据上述 HTML 结构，完善如下 JavaScript 代码中的“your code here”部分，使得 click 事件中的注释要求符合预期：

```js
var genCssSelector = function(el) {
  // your code here
  function getSelector(el) {
    const { classList = [], id = "", tagName = "" } = el;
    let selector = tagName.toLowerCase();
    if (id) {
      selector += "#id";
    } else if (classList.length) {
      selector += `.${[...classList].join(".")}`;
    }
    return selector;
  }
  const selectors = [];
  let current = el;
  while (current) {
    selectors.unshift(getSelector(current));
    current = current.parentNode;
  }
  return selectors.join(" ");
};

document.addEventListener("click", function(e) {
  //点击li时，打印出：html body #page .content.main .refer ul li
  console.log(genCssSelector(e.target));
});
```

## 第三题

```js
// //  实现applyMiddleWare，达到如下示例的效果：

//  function rawMethod(a) {
//      return a + 1;
//  }
//  function middleware1(next) {
//      return function(a) {
//          return next(a) + 1;
//      };
//  }
//  function middleware2(next) {
//      return function(a) {
//          return next(a) + 1;
//      };
//  }
//  function middleware3(next) {
//      return function(a) {
//          return next(a) + 1;
//      };
//  }

//  var newMethod = applyMiddleWare(rawMethod, middleware3, middleware2);
//  var x = newMethod(1); // 调用顺序：middleware2 -> middleware3 -> rawMethod，结果：x=4

//  var newMethod2 = applyMiddleWare(newMethod, middleware1);
//  var y = newMethod2(10); // 调用顺序：middleware1 -> middleware2 -> middleware3 -> rawMethod，结果：y=14

function applyMiddleWare() {
  // your code here
  return (...params) => {
    const args = [...arguments]
    let index = args.length
    function next(...nextParams) {
      const wrapper = args[--index]
      return index ? wrapper(next)(...nextParams) : wrapper(...nextParams)
    }
    return next(...params)
  }
}
```

## 第四题

使用 React 或者 Vue 或者任何其他方式，实现如下组件，并且不失 input 原生组件能力。
[示例图](https://zos.alipayobjects.com/skylark/fa965c45-088f-4a07-9f41-58af0871c0cb/attach/8107/4cb06836ae8f268b/image.png)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      #input {
        border: 1px solid blue;
        width: 12em;
        height: 2em;
      }
      #wrapper {
        display: inline-block;
        position: relative;
      }
      #wrapper::after {
        content: attr(data-tip);
        position: absolute;
        right: 1em;
      }
    </style>
  </head>
  <body>
    <div id="wrapper" type="text" data-text="" data-max="12" data-tip="0/12">
      <input id="input" />
    </div>

    <script>
      const wrapper = document.getElementById("wrapper");
      const input = wrapper.querySelector("input");

      input.addEventListener("input", e => {
        const { dataset } = wrapper;
        const { max, text: dataText } = dataset;
        let text = e.target.value;
        if (text.length > max) {
          text = input.value = dataText;
        }
        Object.assign(dataset, {
          text,
          tip: `${text.length}/${max}`
        });
      });
    </script>
  </body>
</html>
```
