# 安装

` npm i express-session`

# API

```js
var session = require('express-session');
```

## session(options)

使用给定的 `options` 创建 session 中间件.

**注意**: Session 数据并不保存在 cookie 中, 只保存 session ID. session 数据保存在服务端.

**注意**: 自从 1.5.0 版本之后, 不再依赖于 `cookie-parser`, 而是直接在 `req/res` 上读写 cookie. 在 `cookie-parser` 和该模块中使用不同的 `secret` 会导致问题发生.

**警告**: 默认的服务端 session 存储是 `MemoryStore`, 它故意不被设计为用于生产模式. 在大多数情况下它可能导致内存泄露. does not scale past a single process, 主要用于开发和调试.

### Options

express-session 在参数对象中接收以下选项:

#### cookie

session ID cookie 的配置对象, 默认值是 `{ path: '/', httpOnly: true, secure: false, maxAge: null }`

接下来是这个配置对象的选项:

##### cookie.domain

指定 `Set-Cookie` `Domain` 属性的值. 默认不会设置域名, 并且大多数客户端会认为 cookie 只适用于当前的域名.

##### cookie.expires

指定一个 `Date` 对象作为 `Set-Cookie` `Expires`  属性的值. 默认情况下不会设置过期时间. 并且大多数客服端会把它当做非持久 cookie 处理, 并在某些情况下(如在 web 浏览器应用退出的时候)删除它.

**注意**: 如果 `expires` 和 `maxAge` 同时设置, 则会使用后设置的一个.

**注意**: `expires` 选项不应该直接设置, 而是仅使用 `maxAge`

##### cookie.httpOnly

指定一个`boolean` 作为 `HttpOnly` `Set-Cookie` 属性;如果设置为真值, 则代表设置了 `HttpOnly` 属性. 否则代表不设置. 默认会设置 `HttpOnly` 选项.

**注意**: 在设置为`true` 的时候需要小心, 因为兼容的客户端不会允许客户端 JavaScript 通过 `document.cookie` 来访问这个 cookie 值.

##### cookie.maxAge

指定一个 `number` 类型的毫秒值作为 `Set-Cookie` `Expires` 属性的值. 它会计算当前服务器的时间加上 `maxAge` 毫秒作为 `Expires` 的时间. 默认情况下不会设置这个值.


**注意**: 如果同时设置了 `expires` 和 `maxAge`, 则后设置的会被使用.

##### cookie.path
指定 `Set-Cookie` `Path` 属性, 默认为 `/`, 即当前域名的根路径.

##### cookie.sameSite

指定一个 `boolean` 或者 `string` 值作为 `Set-Cookie` 的 `SameSite` 属性.

- `true`
  - 设置`SameSite` 属性为`Strict`, 强制严格相同
- `false`
  - 不设置`SameSite`
- `strict`
  - 同设置为 `true`
- `lax`
  - 与 `strict` 相反. 即非严格相同

更多关于强制等级的资料可以参考: [https://tools.ietf.org/html/draft-west-first-party-cookies-07#section-4.1.1](https://tools.ietf.org/html/draft-west-first-party-cookies-07#section-4.1.1)

**注意**: 该属性还未被标准化, 在将来可能会有改变. 同时也意味着许多客户端在它们理解该属性之前可能忽略该属性.

##### cookie.secure

指定一个 `boolean` 作为 `Set-Cookie` 的 `Secure` 值. 当设置为真的时候即表示设置了该值. 默认情况下不设置.

**注意**: 设置为 `true` 时需要小心, 如果浏览器不是通过 `HTTPS` 与服务器进行连接, 那么未来标准的浏览器不会将 cookie 发送回服务器端.

请注意, 我们推荐设置 `secure: true`. 然而, 它需要是开启了 https 的网站. 对 secure cookie 来说 HTTPS 是必须的.如果设置了 `secure`, 通过 HTTP 访问你的网站不会设置 cookie. 如果使用了代理访问 nodejs 程序同时设置了 `secure: true`, 那么你还需要在 express 中设置`trust proxy`:

```js
var app = express();
app.set('trust proxy', 1); // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
```

如果在生产环境使用了 secure cookie, 并且允许在开发环境进行测试, 则下面的例子演示了在 express 中基于 `NODE_ENV` 来开启这样的的配置:

``` js
var app = express();
var sess = {
  secret: 'Keyoboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);  // trust first proxy
  sess.cookie.secure = true;  // serve secure cookies
}

app.use(session(sess));
```

`cookie.secure` 选项也可以设置为特殊的 `auto` 值来使其根据连接自动匹配. 如果该站点既可用于 HTTP 也可用于 HTTPS, 请谨慎使用此设置, 因为一旦 cookie 设置为 HTTPS, 那么它将不再对 HTTP 可见.