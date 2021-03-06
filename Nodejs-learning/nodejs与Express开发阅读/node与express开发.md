# Node与Express开发

有用的网址：
[express-API](http://expressjs.com/api.html)

[前端模板引擎选择](http://garann.github.io/template-chooser/)

[Twitter Bootstrap](http://getbootstrap.com)

https://html5boilerplate.com/

>非常出色的 HTML5
18 ｜ 第 3 章
Boilerplate（http://html5boilerplate.com/） ，它能生成一个很不错的空白 HTML5 网站。最近
HTML5 Boilerplate 又新增加了可定制的功能，其中一个定制选项包含 Twitter Bootstrap，
这个是我高度推荐的前端框架

https://codio.com/


https://git-scm.com/  
https://try.github.io/levels/1/challenges/1

https://docs.npmjs.com/files/package.json.html

Node 模块的官方文档（http://nodejs.org/api/modules.html）

一个监控工具，在它发现 JavaScript 被修改后会自动重启服务器。
nodemon（https://npmjs.org/package/nodemon）非常受欢迎，并且它还有一个 Grunt 插件
（https://www.npmjs.org/package/grunt-nodemon）


---

          使用第三方主题。像 Themeforest（http://themeforest.net/category/site-
          templates）和 WrapBootstrap（https://wrapbootstrap.com/）这样的网站有几百种 HTML5 即
          Handlebars 模板引擎 ｜ 73
          用模板，它们可以用来开发你的第一个模板。使用第三方主题要从考虑主文件（通常是
          index.html）入手，将它重命名为 main.handlebars（也可以任意命名你的布局文件） ，将静
          态资源（CSS 样式文件、JavaScript 脚本、图片）放在公共目录下。然后，你需要编辑模
          板文件并指出在什么地方放置 {{{body}}} 表达式

---

首先我们需要一个测试框架，这里用的是 Mocha。我们先把这个包添加到项目中：
npm install --save-dev mocha

因为 Mocha 要在浏览器中运行，所以我们要把 Mocha 资源放在 public 目录下，以便让客
户端访问到。我们会把这些资源放在子目录 public/vendor 中：
mkdir public/vendor
cp node_modules/mocha/mocha.js public/vendor
cp node_modules/mocha/mocha.css public/vendor


---

测试通常需要一个 assert （或 expect ）函数。Node 框架中有这个函数，但浏览器中没有，
所以我们要用 Chai 断言库：
npm install --save-dev chai
cp node_modules/chai/chai.js public/vendor

---

          如果你需要的信息没在文档中，有时就不得不深入研究 Express 源码（https://github.com/
          visionmedia/express/tree/master） 。我鼓励你这么做，它并没有想象中那么可怕。下面是
          Express 源码的路径说明。
          lib/application.js •
          Express 主接口。如果想了解中间件是如何接入的，或视图是如何被渲染的，可以看
          这里。
          lib/express.js •
          这是一个相对较短的 shell，是 lib/application.js 中 Connect 的功能性扩展，它返回一个
          函数，可以用 http.createServer 运行 Express 应用。
          lib/request.js •
          扩展了 Node 的 http.IncomingMessage 对象，提供了一个稳健的请求对象。关于请求对
          象属性和方法的所有信息都在这个文件里。
          lib/response.js •
          扩展了 Node 的 http.ServerReponse 对象，提供响应对象。关于响应对象的所有属性和
          方法都在这个文件里。
          lib/router/route.js •
          提供基础路由支持。尽管路由是应用的核心，但这个文件只有不到 200 行，你会发现它
          非常地简单优雅。
          在你深入研究 Express 源码时，或许需要参考 Node 文档（http://nodejs.org/api/http.html） ，
          尤其是 HTTP 模块部分。

---

### express支持handlebars：


第五章未阅读

## 第六章: 请求和响应对象

---

如果想查看浏览器发送的信息，可以
创建一个非常简单的 Express 路由来展示一下：
              app.get('/headers', function(req,res){
              res.set('Content-Type','text/plain');
              var s = '';
              for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n';
              res.send(s);
              });

---

返回服务器信息
存在一个问题，那就是它会给黑客一个可乘之机，从而使站点陷入危险。非常重视安全的
服务器经常忽略此信息，甚至提供虚假信息。禁用 Express 的 X-Powered-By 头信息很简单：
              app.disable('x-powered-by');

---


# 请求对象

          请求对象（通常传递到回调方法，这意味着你可以随意命名，通常命名为 req 或 request ）的生命周期始于 Node 的一个核心对象 http.IncomingMessage 的实例。Express 添加了一些
          附加功能。我们来看看请求对象中最有用的属性和方法（除了来自 Node 的 req.headers 和
          req.url ，所有这些方法都由 Express 添加） 。
          req.params •
          一个数组，包含命名过的路由参数。我们将在第 14 章进行详细介绍。
          req.param(name) •
          返回命名的路由参数，或者 GET 请求或 POST 请求参数。建议你忽略此方法。
          req.query •
          一个对象，包含以键值对存放的查询字符串参数（通常称为 GET 请求参数） 。
          req.body •
          一个对象，包含 POST 请求参数。这样命名是因为 POST 请求参数在 REQUEST 正文中传
          递，而不像查询字符串在 URL 中传递。要使 req.body 可用，需要中间件能够解析请求
          正文内容类型，我们将在第 10 章进行详细介绍。
          req.route •
          关于当前匹配路由的信息。主要用于路由调试。
          req.cookies/req.singnedCookies •
          一个对象，包含从客户端传递过来的 cookies 值。详见第 9 章。
          req.headers •
          从客户端接收到的请求报头。
          req.accepts([types]) •
          一个简便的方法，用来确定客户端是否接受一个或一组指定的类型（可选类型可以是
          单个的 MIME 类型，如 application/json 、一个逗号分隔集合或是一个数组） 。写公共
          API 的人对该方法很感兴趣。假定浏览器默认始终接受 HTML。
          req.ip •
          客户端的 IP 地址。
          req.path •
          请求路径（不包含协议、主机、端口或查询字符串） 。
          req.host •
          一个简便的方法，用来返回客户端所报告的主机名。这些信息可以伪造，所以不应该用
          于安全目的。
          请求和响应对象 ｜ 53
          req.xhr •
          一个简便属性，如果请求由 Ajax 发起将会返回 true 。
          req.protocol •
          用于标识请求的协议（ http 或 https ） 。
          req.secure •
          一个简便属性，如果连接是安全的，将返回 true 。等同于 req.protocol==='https' 。
          req.url/req.originalUrl •
          有点用词不当，这些属性返回了路径和查询字符串（它们不包含协议、主机或端口） 。
          req.url 若是出于内部路由目的，则可以重写，但是 req.orginalUrl 旨在保留原始请求
          和查询字符串。
          req.acceptedLanguages •
          一个简便方法，用来返回客户端首选的一组（人类的）语言。这些信息是从请求报头中
          解析而来的。
# 响应对象
          响应对象（通常传递到回调方法，这意味着你可以随意命名它，通常命名为 res 、 resp 或
          response ）的生命周期始于 Node 核心对象 http.ServerResponse 的实例。Express 添加了一
          些附加功能。我们来看看响应对象中最有用的属性和方法（所有这些方法都是由 Express
          添加的） 。
          res.status(code) •
          设置 HTTP 状态代码。Express 默认为 200（成功） ，所以你可以使用这个方法返回状态
          404（页面不存在）或 500（服务器内部错误） ，或任何一个其他的状态码。对于重定向
          （状态码 301、302、303 和 307） ，有一个更好的方法： redirect 。
          res.set(name,value) •
          设置响应头。这通常不需要手动设置。
          res.cookie（name,vaue,[options]）,res.clearCookie(name,[options]) •
          设置或清除客户端 cookies 值。需要中间件支持，详见第 9 章。
          res.redirect([status],url) •
          重定向浏览器。默认重定向代码是 302（建立） 。通常，你应尽量减少重定向，除非永
          久移动一个页面，这种情况应当使用代码 301（永久移动） 。
          res.send(body),res.send(status,body) •
          向客户端发送响应及可选的状态码。Express 的默认内容类型是 text/html 。如果你想改
          为 text/plain ，需要在 res.send 之前调用 res.set('Content-Type','text/plain\') 。如
          果 body 是一个对象或一个数组，响应将会以 JSON 发送（内容类型需要被正确设置） ，
          不过既然你想发送 JSON，我推荐你调用 res.json 。
          res.json(json),res.json(status,json) •
          向客户端发送 JSON 以及可选的状态码。
          res.jsonp(json),req.jsonp(status,json) •
          向客户端发送 JSONP 及可选的状态码。
          res.type(type) •
          一个简便的方法，用于设置 Content-Type 头信息。基本上相当于 res.set('Content-
          Type','type') ，只是如果你提供了一个没有斜杠的字符串，它会试图把其当作文件的
          扩展名映射为一个互联网媒体类型。比如， res.type('txt') 会将 Content-Type 设为
          text/plain 。此功能在有些领域可能会有用（例如自动提供不同的多媒体文件） ，但是
          通常应该避免使用它，以便明确设置正确的互联网媒体类型。
          res.format(object) •
          这个方法允许你根据接收请求报头发送不同的内容。这是它在 API 中的主要用途，我们
          将会在第 15 章详细讨论。这里有一个非常简单的例子： res.format({'text/plain':'hi
          there','text/html':'<b>hi there</b>'}) 。
          res.attachment([filename]),res.download(path,[filename],[callback]) •
          这两种方法会将响应报头 Content-Disposition 设为 attachment ，这样浏览器就会选
          择下载而不是展现内容。你可以指定 filename 给浏览器作为对用户的提示。用 res.
          download 可以指定要下载的文件，而 res.attachment 只是设置报头。另外，你还要将
          内容发送到客户端。
          res.sendFile(path,[option],[callback]) •
          这个方法可根据路径读取指定文件并将内容发送到客户端。使用该方法很方便。使用静
          态中间件，并将发送到客户端的文件放在公共目录下，这很容易。然而，如果你想根据
          条件在相同的 URL 下提供不同的资源，这个方法可以派上用场。
          res.links(links) •
          设置链接响应报头。这是一个专用的报头，在大多数应用程序中几乎没有用处。
          res.locals,res.render(view,[locals],callback) •
          res.locals 是一个对象，包含用于渲染视图的默认上下文。 res.render 使用配置的模
          板引擎渲染视图（不能把 res.render 的 locals 参数与 res.locals 混为一谈，上下文
          在 res.locals 中会被重写，但在没有被重写的情况下仍然可用） 。 res.render 的默认响
          应代码为 200，使用 res.status 可以指定一个不同的代码。视图渲染将在第 7 章深入
          讨论




---

## 使用 body-parser

> 引入中间件: npm insall --save body-parser

> app.use(require('body-parser')());

> 一旦引入了 body-parser ，你会发现 req.body 变为可用。



























.
