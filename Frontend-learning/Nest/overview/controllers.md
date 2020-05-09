# 控制器（Controllers）

控制器的工作是接收请求并将结果返回给客户端。Nest 的路由机制会将客户端发送过来的请求映射到对应的控制器中进行处理。通常一个控制器中会定义多个路由。

## 路由

在 Nest 中，我们使用 `@Controller()` 来创建控制器。

```ts
// cats.controller.ts

import { Controller, Get } from "@nestjs/common";

@Controller("cats") // 创建 controller，并给路由指定一个 "cats" 前缀
export class CatsController {
  @Get() // 表示接下来的函数用于处理 Get 请求
  findAll(): string {
    return "This action returns all cats";
  }
}
```

> 小提示：使用 CLI 创建 controller 的命令是 `nest g controller <控制器名>`

上面的例子中，我们在 `@Controller()` 中指定了当前控制器的路由前缀为 `"cats"`，由于我们没有在 `@Get()` 中添加路由路径，因此最终的路由就是 `/cats`，Nest 会将请求 `GET /cats` 映射到 `findAll()` 中进行处理，此处它直接返回给客户端一个字符串。

> 小提示 1：完整的路由是由`<路由前缀>/<路径>` 构成，例如我们在 `@Controller("customers")` 中指定了路由前缀为 `"customers"`，然后在 `@Get("profile")` 中指定路由路径为 `"profile"`，则完整的路由就是 `/customers/profile`。

> 小提示 2：在 `@Controller()` 中指定路由前缀是可选的，但一般我们会通过指定前缀的方式将一组相关的路由组合在一起。

> 小提示 3：除了 `@Get()` 和 `@Post`，Nest 还为我们提供了 `@Put()`、 `@Delete()`、 `@Patch()`、 `@Options()`、 `@Head()` 和 `@All()`

另外，由于 Nest 底层使用了其他平台（如 Express，也可以使用 Fastify），因此在 Nest 中你有两种处理请求的方式（但任一时间针对单个路由你只能选择其一）：

| 方式             | 描述                                                                                                                                                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 标准模式（推荐） | 1. 在此模式下，如果处理请求的函数返回数组或对象，则会被序列化为 JSON 字符串，如果是返回原始数据类型（如 String，Number，Boolean）则直接返回给客户端；<br/> 2. 默认情况下 Get 请求的响应状态码为 200，Post 为 201，你可以轻易的使用 `@HttpCode(...)` 来指定状态码。 |
| Library-specific | 这种模式表示我们希望使用底层平台的 Response 对象。 我们可以通过 `@Res()` 来获取该对象（例如 `findAll(@Res() response`） ，值得注意的是，如果你打算这么做，那你就需要使用该对象暴露的平台方法来完成响应，如 Express 中你应该 `response.status(200).send()` 。       |

## 请求对象

通常在编写业务代码时，我们需要获取到当前请求的详细数据（例如 queryString，Http Header），但这些数据又通常保存在底层平台的请求对象中，因此我们可以通过 `@Req()` 来告诉 Nest 我们需要用到它：

```ts
// cats.controller.ts

import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("cats")
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    // ← 获取底层平台的请求对象
    return "This action returns all cats";
  }
}
```

尽管可以直接访问到底层平台的请求对象，但通常并不需要我们手动来完成，Nest 为我们提供了如装饰器：

|                           |                                   |
| ------------------------- | --------------------------------- |
| `@Request()`              | `req`                             |
| `@Response(), @Res()`     | `res`                             |
| `@Next()`                 | `next`                            |
| `@Session()`              | `req.session`                     |
| `@Param(key?: string)`    | `req.params / req.params[key]`    |
| `@Body(key?: string)`     | `req.body / req.body[key]`        |
| `@Query(key?: string)`    | `req.query / req.query[key]`      |
| `@Headers(name?: string)` | `req.headers / req.headers[name]` |
| `@Ip()`                   | `req.ip`                          |

> 小提示：在后面的章节，我们会学习到如何定义自己的装饰器

## 路由通配符

```ts
@Get('ab*cd')  // 'ab*cd' 可以匹配 abcd, ab_cd, abecd 等
findAll() {
  return 'This route uses a wildcard';
}
```

在路由中，我们可以使用 `?`、 `+`、 `*` 和 `()`，它们是正则表达式的一个子集，另外 `-` 和 `.` 会直接当做字面量看待。

## 状态码

`Get` 默认返回 `200`， `Post` 默认返回 `201`，但是我们可以使用 `@HttpCode(...)` 来指定：

```ts
import { HttpCode } from '@nestjs/common'
// ...
@Post()
@HttpCode(204)  // 指定返回 204
create() {
  return 'This action adds a new cat';
}
```

## Http Header

我们可以通过 `@Header()` 来自定义 header 属性：

```ts
import { Header } from '@nestjs/common'
// ...
@Post()
@Header('Cache-Control', 'none')  // 自定义 header 属性
create() {
  return 'This action adds a new cat';
}
```

## 重定向

```ts
@Get()
@Redirect('https://nestjs.com', 301)  // 状态码为可选参数
```

有时候你可能需要在代码中动态决定重定向的 url，这种情况你可以在路由处理函数中返回如下格式的对象：

```ts
{
  "url": string,
  "statusCode": number
}
```

返回对象的方式的优先级高于 `@Redirect()` 的方式。

## 路由参数

```ts
@Get(':id')  // 指定路由参数
findOne(@Param() params): string {  // 获取路由参数
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

我们在 `@Get(:id)` 中指定路由参数为 `:id`，当收到请求 `GET /cats/1` 时 id 参数的值即会被解析为 `1`。然后我们通过 `@Param() params` 来获取参数，如果只希望获取特定的参数，那么可以直接在 `@Param("id") id` 中指定，如下：

```ts
@Get(':id')
findOne(@Param('id') id): string {  //  直接指定获取 id 参数
  return `This action returns a #${id} cat`;
}
```

## 子域名路由

`@Controller` 中可以指定 `host` 参数来匹配特定的域名，此时如果需要添加路由前缀，可以通过 `path` 参数来指定

```ts
@Controller({ host: "admin.example.com" })
export class AdminController {
  @Get()
  index(): string {
    return "Admin page";
  }
}
```

由于 Fastiy 缺少对嵌套路由的支持，因此在使用子路由时默认使用 Express 适配器。

```ts
@Controller({ host: ":account.example.com" }) // 动态捕获 host 中的值
export class AccountController {
  @Get()
  getInfo(@HostParam("account") acc: string) {
    // ← 获取捕获的值
    return acc; // acc 值为 "account"
  }
}
```

## 异步处理

Nest 异步处理可以使用 Promise 或 [RxJS Observable stream](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)

- Promise 方式：

```ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

- [RxJS Observable stream](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) 方式

```ts
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

## POST 请求参数

前面说到，我们使用 `@Body()` 来获取 Post 请求参数：

```ts
// cats.controller.ts

@Post()
async create(@Body() createCatDto: CreateCatDto) { // 通过 @Body() 获取 Post 参数
  return 'This action adds a new cat';
}
```

但由于我们是使用的 typescript，我们需要先定义 CreateCatDto，由于 class 会编译为实例而 interface 会在编译阶段删除，因此我们推荐使用 class 方式：

```ts
// create-cat.dto.ts

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

## 错误处理

后面的章节会专门针对错误处理进行讲解

## 如何运行代码

到目前为止我们只是定义了 CatsController，但 Nest 并不知道它的存在，因此我们需要通过**模块**来告诉 Nest，现在我们只有一个根模块 —— `AppModule`。

> 小提示：为什么我们要通过模块来告诉 Nest 某个 Controller 的存在呢？因为在 Nest 中，每个 Controller 总是需要属于某个特定的模块。

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";

@Module({
  controllers: [CatsController] // 在根模块中加入 CatsController 后 Nest 就会自动取实例化和挂载它
})
export class AppModule {}
```

## 完整示例

```ts
// cats.controller.ts

import { Controller, Get, Query, Post, Body, Put, Param, Delete } from "@nestjs/common";
import { CreateCatDto, UpdateCatDto, ListAllEntities } from "./dto";

@Controller("cats")
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return "This action adds a new cat";
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return `This action removes a #${id} cat`;
  }
}
```
