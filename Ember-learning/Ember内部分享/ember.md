# Ember

## 什么是 Ember

Ember 是一个 MVC 前端框架. 它的设计目的就是帮助开发者能够快速的构建具有丰富交互的前端页面.

## 安装

1.先安装 `node`, 默认会安装 `npm`

2.`npm install -g ember-cli`

## 核心概念

### 路由

> 路由用于引导和管理页面的变化, 将 URL 保存的状态和页面之间进行映射.

URL 能够通过下面的方式进行设置:

- 用户第一次加载应用
- 用户手动改变 URL, 如点击返回按钮或者编辑地址栏
- 点击一个应用中的链接
- 一些其他可能导致 URL 改变的情况

不管 URL 是怎么设置的, Ember 路由都能将当前的 URL 映射到路由处理器上. 路由处理器可以处理以下事情:

- 渲染模板
- 加载数据
- 重定向 (如用户不能访问该页面的时候会进行跳转)
- 处理页面之间转换的事件

### 模板

Ember 使用的是 [`Handlebars`](http://www.handlebarsjs.com/) 模板引擎, 该模板引擎包含 HTML 标签和动态内容, 动态内容使用 `{{}}` 包含. 动态内容的值会和控制器或者组件中的值进行双向绑定, 即修改一端, 另一端也会跟着做出变化.

如:

```hbs
Hello, <strong>{{firstName}} {{lastName}}</strong>!
```

### 组件

组件用于将可重用的部分封装在一起, 包括HTML、样式、逻辑等.

创建一个组件:

`ember generate component my-component-name`

### 控制器

用于控制页面逻辑, 在 Ember 早期版本中常用, 现在的版本基本只用作绑定查询参数, 未来的版本将会废弃.

## 一个简单的应用

创建一个应用的基本步骤包括:

- 安装 Ember
- 新建应用
- 定义路由
- 编写 UI 组件
- 打包部署

### 安装 Ember

这里省略, 前面已经说了

### 新建应用

`ember new ember-quickstart`

新建过后将代码跑起来:

`cd ember-quickstart`
`ember serve`

如果看到下面的输出就表示成功了:

```sh
Livereload server on http://localhost:7020
Serving on http://localhost:4200/
```

### 定义路由

`ember generate route scientists`

会看到下面输出:

```sh
installing route
  create app/routes/scientists.js
  create app/templates/scientists.hbs
updating router
  add route scientists
installing route-test
  create tests/unit/routes/scientists-test.js
```

这段信息告诉我们 Ember 创建了:

- 当访问 `/scientists` 的时候, 会渲染的模板
- 给模板提供数据的 `Route` 对象
- 应用的路由入口在 `app/router.js`
- 该路由创建了一个单元测试

打开新创建的模板, 添加下面的代码测试一下:

```hbs
<h2>List of Scientists</h2>
```

然后再在页面中访问, 你将看到刚刚的修改.

如果我们在页面路由 `Route` 中添加一个 `model()` 方法:

```js
import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
  }
});
```

然后如下修改模板:

```hbs
<h2>List of Scientists</h2>

<ul>
  {{#each model as |scientist|}}
    <li>{{scientist}}</li>
  {{/each}}
</ul>
```

则会看到页面中渲染出了刚刚的数组.

[Ember guide](https://guides.emberjs.com/release/)