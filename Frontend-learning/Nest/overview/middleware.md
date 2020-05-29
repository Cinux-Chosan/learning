# 中间件（Middleware）

中间件简单来说就是一个函数，但是它会在路由处理函数之前被调用，它能够访问到请求和响应对象。

Nest 的中间件默认等同于 Express 的中间件，正如 Express 官网对中间件的描述，中间件可以：

- 执行任何代码
- 对请求和响应对象进行修改
- 终止后续中间件执行
- 调用下一个中间件（函数）
- 如果当前中间件不需要终止请求继续传递给下一个中间件，那么它必须调用 `next()` 函数来将控制权交给下一个中间件处理。

在 Nest 中，你有两种实现中间件的方式：

- 使用函数
- 使用 `@Injectable()` 标注的类

使用函数没有什么特别的要求，但是使用类就必须实现 `NestMiddleware` 接口：

```ts
// logger.middleware.ts

import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // 实现 NestMiddleware 接口
  use(req: Request, res: Response, next: Function) {
    console.log("Request...");
    next();
  }
}
```

Nest 中的中间件和 Provider 一样完全支持依赖注入。同样是通过 `constructor` 来完成。

## 使用中间件

`@Module()` 参数中没有给中间件留位置，而是使用 Module 类的 `configure` 方法来设置中间件。包含中间件的模块必须实现 `NestModule` 接口，现在我们看看如何在根模块中设置 `LoggerMiddleware` 吧：

```ts
// app.module.ts

import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("cats");
  }
}
```

上面的例子中，我们给之前在 `CatsController` 中定义的 `cats` 路由指定了中间件 `LoggerMiddleware`，这样 `LoggerMiddleware` 会在所有 `cats` 路由之前被调用。如果我们希望更加严格的指定到某个具体的路由可以通过给 `forRoutes()` 指定 `path` 和 `method` 参数：

```ts
// app.module.ts

import { Module, NestModule, RequestMethod, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: "cats", method: RequestMethod.GET }); // 指定路由 GET /cats 才会使用到该中间件
  }
}
```

另外， `configure()` 方法可以是异步函数，即使用 `async/await`

## 路由通配符

路由也支持通配符模式，如下 `'ab*cd'` 可以匹配 abcd、 ab_cd、 abecd 等。`?`、 `+`、 `*` 和 `()` 可用于路由匹配，它们是正则表达式的一个子集，但是 `-` 和 `.` 会被解析为字面量。

```ts
forRoutes({ path: "ab*cd", method: RequestMethod.ALL });
```

> 小提示：`fastify` 使用了最新的 `path-to-regexp` 包，不再直接支持`*` 通配符，你应该使用参数，如：`(.*)`、 `:splat*`

## 中间件的消费者

消费者，即谁会用到中间件。

`MiddlewareConsumer` 是一个辅助类，它提供了一些列管理中间件的方法，所有方法都支持链式调用。`forRoutes()` 可以接收一个或多个字符串、一个 `RouteInfo` 对象、一个控制器类（Controller）甚至是多个控制器类。大多数情况你只是需要传入逗号分隔的多个控制器类：

```ts
// app.module.ts

import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { CatsModule } from "./cats/cats.module";
import { CatsController } from "./cats/cats.controller.ts";

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```

另外，`apply()` 可以接收单个或多个中间件。

## 排除指定路由

在某些情况我们可能只是希望某几个路由不使用该中间件，其它的都需要用到它，那么我们就可以将不需要用到中间件的这部分路由排除，这需要用到 `exclude()` 方法，它接收一个字符串、多个字符串或者 `RouteInfo` 对象：

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude({ path: "cats", method: RequestMethod.GET }, { path: "cats", method: RequestMethod.POST }, "cats/(.*)") // RouteInfo 方法
  .forRoutes(CatsController);
```

上面的示例将 `cats` 路由的 `GET`、 `POST` 方法以及子路由排除在外。其它的依旧可用，如 `PUT`、`DELETE` 等。

## 函数中间件

上面的中间件使用类的方式来做的，但是它既没有自己的属性，也没有额外的其它方法，那为什么不用函数的形式来做呢？实际上我们还真可以：

```ts
// logger.middleware.ts

export function logger(req, res, next) {
  console.log(`Request...`);
  next();
}
```

然后在根模块中使用：

```ts
// app.module.ts

consumer.apply(logger).forRoutes(CatsController);
```

> 小提示：在中间件不需要任何依赖的情况下，可以考虑使用函数的方式实现。

## 多个中间件

如果有多个中间件，只需要给 `apply()` 传入多个中间件即可。

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## 全局中间件

如果我们希望中间件一次性提供给所有路由使用，那么可以使用应用程序实例的 `use()` 方法（这和 express 一样）：

```ts
const app = await NestFactory.create(AppModule);
app.use(logger); // 注册为全局中间件，所有路由都会用到它
await app.listen(3000);
```
