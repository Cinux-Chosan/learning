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

请注意, 我们推荐设置 `secure: true`. 然而, 它需要是开启了 https 的网站. 对 secure cookie 来说 HTTPS 是必须的.如果设置了 `secure`, 通过 HTTP 访问你的网站不会设置 cookie. 如果 nodejs 程序运行在代理（如反向代理）之后同时还设置了 `secure: true`, 那么你还需要在 express 中设置`trust proxy`:

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

`cookie.secure` 选项也可以设置为特殊的 `auto` 值来使其根据连接自动匹配. 如果该站点既可用于 HTTP 也可用于 HTTPS, 请谨慎使用此设置, 因为一旦 cookie 设置为 HTTPS, 那么它将不再对 HTTP 可见。在当 Express 设置了 `trust proxy` 以简化开发和生产配置的时候非常有用。

#### genid

用于生成一个新 session ID 的函数。它需要返回一个字符串来作为新的 Session ID。该方法会接收 `req` 作为第一个参数，因为你可能希望在生成 session ID 的时候在 `req` 上关联一些有用的值。

默认值为使用 `uid-safe` 库来生成 ID 的函数。

**注意**: 请生成唯一 ID 的时候小心，否则可能发出会话冲突。
```js
app.use(session({
  genid: function(req) {
    return genuuid() // use UUIDs for session IDs
  },
  secret: 'keyboard cat'
}))
```

#### name

session ID cookie 的名字，在服务器给客户端发送的响应中设置 cookie 和从客户端发送过来的请求中读取 cookie 的时候都会用到它。

默认值是 `connect.sid`

**注意**: 如果你在同一个主机名上运行了多个 app（仅仅是名称，如 `localhost` 或 `127.0.0.1`;不同的 scheme 和端口并不会产生不同的主机名），然后你需要把它们相互区分开来，最简单的方法就是为每个 app 设置不同的 name.

#### proxy

在设置 secure cookie 的时候请信任反向代理（通过 `X-Forwarded-Proto`头）

默认值为 `undefined`

- `true`
  - 使用 `X-Forwarded-Proto`
- `false`
  - 所有头部都会被忽略并且只有在直接使用 TLS/SSL 连接的时候才会被认为是安全的(secure)
- `undefined`
  - 使用 express 的 `trust proxy`

#### resave
强制 session 回写到 session 存储，即使 session 在请求过程中并没有发生改变。这可能对于你的使用的存储来说是必要的，但是当同一个客户端发送两个并行请求到服务器并且其中一个请求对session做了改动的时候可能被另一个请求在结束的时候覆盖，即使它没有做任何改变（这种行为也取决于你使用何种存储）。

默认值为 `true`，但是已经不推荐使用默认值了，并且以后可能会有所改变。请根据你自己的情况合理使用该选项。通常情况下，你可能希望使用 `false`。

如何判断对于我的存储是否需要该选项？最好的方法就是检查你的存储是否实现了 `touch` 方法。如果是，那么你可以安全地设置为 `resave: false`。如果没有，并且你的存储在已经存储的 session
 上设置了超时日期，那么你可能更希望使用 `resave: true`;

#### rolling

强制在每个响应中设置 session identifier(标识符) cookie。超时会被重置为最初的 `maxAge`，即重置到期时间。

默认值为 `false`

**注意**: 当该选项被设置为 `true` 并且 `saveUninitialized` 选项设置为 `false`的时候，该 cookie 不会在响应中被设置为未初始化的 session。

#### saveUninitialized

强制一个 “uninitialized” session 保存进存储中。当一个新 session 没有发生改变的时候，它就是 uninitialized（未初始化的）。实现登录 session 的时候使用 `false` 会比较有用。减少服务器存储的使用量，或者在设置 cookie 之前符合需要权限的规则。设置 `false` 也将有助于客户在没有会话的情况下进行多个并行请求。

默认值是 `true`，但是默认值已经被废弃了，在一会默认值可能会发生改变。请根据你自己的情况合理选择使用。

**注意**: 如果你配合 PassportJS 一起使用 Session， Passport 将会给 session 添加一个空的 Passport 对象以便用户认证过后使用，这将会被视作 session 发生了改变，导致它被保存。这个情况在 PassportJS 0.3.0 已经得到了修复。

#### secret

**必选项**

用于签名 session ID cookie。可以是代表单个 secret 的字符串，也可以是多个 secret 的字符串数组。如果是数组，仅第一个元素会被用于签名 session ID cookie，而在请求中验证签名时将会考虑所有元素。

#### store

session store 实例，默认为一个新的 `MemoryStore` 的实例。

#### unset

控制 unset `req.session` 的结果（如通过`delete`设置为`null`等）。

默认值是`keep`.

- `destroy`
  - Session 会在服务端发送完响应过后被销毁/删除。
- `keep`
  - 存储中的 session 会被保留，但是请求过程中的修改会被忽略，不会被保存。

#### [req.session](https://www.npmjs.com/package/express-session#reqsession)