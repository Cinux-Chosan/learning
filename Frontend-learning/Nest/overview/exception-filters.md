# 异常过滤器（Exception filters）

Nest 有自己的异常机制来处理整个程序中未捕获的异常。也就意味着如果某个异常没有被你的代码捕获和处理，那么将会被该机制捕获，然后会通过比较友好的方式响应客户端。

Nest 的全局异常过滤机制会处理 `HttpException` 类型或其子类类型的异常。如果某个异常不是 `HttpException` 类型及其子类型的，那么 Nest 就会直接返回如下格式给客户端：

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## 抛出标准异常

Nest 在 `@nestjs/common` 包中提供了 `HttpException` 类，它能够对一些典型的 HTTP REST/GraphQL 异常进行处理。

```ts
// cats.controller.ts

@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

当客户端访问该接口的时候就会得到如下异常：

```ts
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 异常构造函数接受两个参数：

- `response`：字符串或对象，表示响应的主体
- `status`：[HTTP 状态码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

默认情况下，JSON 响应主体包含两个部分：

- `statusCode`：通过上面的 `status` 参数指定
- `message`：基于 `statusCode` 的错误消息

如果你只是想指定 `message` 的类型，给 `response` 指定一个字符串即可，如果你希望覆盖整个响应主体，那就将 `response` 指定为一个对象。

第二个参数应该是一个合法的 HTTP 状态码，最好是通过 `@nestjs/common` 提供的 `HttpStatus` 枚举类型来指定。

下面是一个覆盖整个 HTTP 响应主体的例子：

```ts
// cats.controller.ts

@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}
```

访问上面的接口会得到如下响应内容：

```json
{
  "status": 403,
  "error": "This is a custom message"
}
```

## 自定义异常

虽然大多数情况下 Nest 内置的异常能够满足你的需要，不过总会出现一些你需要自定义异常的情况，自定异常非常简单，你只需要继承自 `HttpException` 并实现即可：

```ts
// forbidden.exception.ts

export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

使用起来也是和 Nest 内置的异常一毛一样：

```ts
// cats.controller.ts

@Get()
async findAll() {
  throw new ForbiddenException();
}
```

## 那些年 Nest 内置的异常

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`

## 异常过滤器

大多数异常都能够被前面提到的异常机制处理，但还有些情况你可能需要对异常机制有更加全面的控制，比如你希望在错误的时候打印异常信息或者修改异常响应的模板等。异常过滤器的设计目的就在于此：

为了获取请求信息，我们需要访问到平台的请求对象，另外为了修改响应主体，我们需要访问到平台响应对象：

```ts
// http-exception.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // 获取平台的响应对象
    const request = ctx.getRequest<Request>(); // 获取平台的请求对象
    const status = exception.getStatus();

    // 修改响应内容
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

所有的异常过滤器都必须实现 `ExceptionFilter<T>` 泛型，并在其内部实现 `catch(exception: T, host: ArgumentsHost)` 方法。

`@Catch(HttpException)` 给异常过滤器提供必要的元信息，它告诉 Nest 这个异常过滤器只针对 `HttpException` 异常。`@Catch()` 可以接收多个参数。

## ArgumentsHost 类型

现在我们来看看 `catch()` 的参数列表。`exception` 代表当前需要被处理的异常实例。`host` 参数是一个 `ArgumentsHost` 类型的实例对象。`ArgumentsHost` 是一个有用的工具对象，我们在后面的 [执行上下文](https://docs.nestjs.com/fundamentals/execution-context)一章会讲到它，这里我们只是用它来从抛出异常的控制器中获取 `Request` 和 `Response` 对象。

`ArgumentsHost` 在所有上下文中（如现在用到的 server 上下文，以及后面的 Microservices 和 websocket）均起作用。关于 `ArgumentsHost` 我们在后面的章节再做介绍。

## 绑定过滤器

现在我们来把 `HttpExceptionFilter` 绑定到控制器的 `create` 方法：

```ts
// cats.controller.ts

@Post()
@UseFilters(new HttpExceptionFilter())  // import { UseFilters } from "@nestjs/common"
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

`@UseFilters()` 和 `@Catch()` 差不多，它接收单个或多个过滤器实例。这里我们创建了 `HttpExceptionFilter` 的实例，其实你还可以只传入过滤器类，把实例化的工作交给框架处理：

```ts
// cats.controller.ts

@Post()
@UseFilters(HttpExceptionFilter) // 无需实例化，直接传入 Class
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

> 小提示：直接传入类型的方式比传入实例化对象的方式更加节约内存，因为这样 Nest 可以轻易的在多个模块中复用同一个实例

上面的示例只是将 `HttpExceptionFilter` 用于控制器的 `create()` 方法，但实际上还可以用于控制器级别或者全局：

```ts
// cats.controller.ts

@UseFilters(new HttpExceptionFilter()) // 控制器级别，使得 HttpExceptionFilter 可以用于任何该控制器中的路由处理函数
export class CatsController {}
```

```ts
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); // 全局级别使用 HttpExceptionFilter
  await app.listen(3000);
}
bootstrap();
```

> 小提示：`useGlobalFilters()` 不会给 gateway 和 hybrid 应用设置过滤器。

全局过滤器会被用于所有的控制器及其路由处理函数。但就依赖注入来说，由于全局过滤器是在模块的上下文之外注册的（上例使用 `useGlobalFilters()`），因此不能注入到模块中去。为了解决这个问题，你可以使用下面的方式在任何模块中直接注册全局过滤器：

```ts
// app.module.js

import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

使用这种方式只是在当前模块引入的全局过滤器，但过滤器依然是全局的，并不因此它就成了模块级别的过滤器。另外 `useClass` 也不是注册自定义 provider 的唯一途径，参考[这里](https://docs.nestjs.com/fundamentals/custom-providers)

## 捕获一切

如果要捕获所有未处理的异常而不用关心具体的异常类型，那么不给 `@Catch()` 传参即可：

```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";

@Catch() // 捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## 继承

通常你会根据自己的项目定制完整的异常过滤器，不过有时候你可能希望对一些全局异常过滤器进行扩展，并修改一些默认行为。

如果你希望将异常处理代理给底层过滤器，你需要继承 `BaseExceptionFilter` 并调用它的 `catch()` 方法：

```ts
// all-exceptions.filter.ts

import { Catch, ArgumentsHost } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host); // 调用底层的 catch 方法处理异常
    // 执行自己的逻辑
    // ...
  }
}
```

需要注意的是，继承自 `BaseExceptionFilter` 的方法或控制器级别的过滤器不要用 `new` 操作符来初始化，你应该把初始化的工作交给 Nest 去执行。

全局过滤器也可以通过以下两种方式了继承基本过滤器：

- 在实例化自定义全局过滤器的时候注入 `HttpServer` 引用

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter)); // 注入 HttpServer 引用

  await app.listen(3000);
}
bootstrap();
```

- 第二种方式就是使用上面提到的 [`APP_FILTER`](#绑定过滤器)
