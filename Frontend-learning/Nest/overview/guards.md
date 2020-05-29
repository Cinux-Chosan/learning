# 守卫（Guard）

守卫也是一个通过 `@Injectable()` 装饰的类。守卫类必须实现 `CanActivate` 接口。

守卫只有一个功能，那就是在运行时根据条件（比如权限、角色、ACLs 等）来决定请求是否需要被路由函数处理。这通常称为授权。授权和身份验证通常会一起使用。

在传统的 Expres 中，授权通常是通过中间件来完成的。中间件确实可以用于身份验证，但是从本质上来说，这有点愚蠢。因为中间件并不知道在调用 `next()` 之后会被哪个路由函数执行。换句话说，守卫可以访问到 `ExecutionContext` 实例，因此它知道接下来会执行什么。它们被设计为类似异常过滤器、管道和拦截器，在请求中的某个确定位置处理验证逻辑。这样可以让你的逻辑更加清晰。

> 小提示：守卫在所有中间件之后执行，但是会在任何拦截器和管道之前

## 使用守卫授权

```ts
// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
// 每个守卫都必须实现 CanActivate 接口以及 canActivate() 方法
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request); // validateRequest 中的逻辑可以简单也可以复杂
  }
}
```

`canActivate()` 需要返回一个布尔值来表明当前请求是否被允许。它可以同步或异步的返回结果（异步可以通过 Promise 或者 RxJS 的 Observable）。Nest 使用它返回的值来：

- 如果为 true，则请求继续往下执行
- 如果为 false，则该请求会被禁止

## 执行上下文

`canActivate()` 只接受单个参数，即 `ExecutionContext` 实例。`ExecutionContext` 继承自 `ArgumentsHost`。在 `ArgumentsHost` 的基础上， `ExecutionContext` 还提供了一些新的辅助方法来获取当前执行进程的详细信息，这些详细信息可以用于创建更加通用的守卫，使得它能够跨控制器、方法、执行上下文。关于执行上下文，你可以参考[ExecutionContext](https://docs.nestjs.com/fundamentals/execution-context)

## 基于角色的验证

我们来创建一个功能更加强大的守卫，它只允许特定的角色才有权访问接口。

```ts
// roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## 绑定守卫

像之前的管道和异常过滤器一样，守卫可以是控制器级别的、方法级别的或者全局的。下面我们使用 `@UserGuards()` 装饰器来设置一个控制器级别的守卫。该守卫可以接收一个或多个参数，这使得你只需要声明一次就可以设置一组守卫。

```ts
@Controller("cats")
@UseGuards(RolesGuard) // @UseGuards() 来自 @nestjs/common，同样，这里我们可以传入一个实例化后的 RolesGuard 对象
export class CatsController {}
```

如果我们希望 `RolesGuard` 只针对某个具体的方法，那么我们只需要把它放到方法前面即可。

和管道以及异常处理程序一样，如果要注册全局守卫，那就需要用到特定的方法 —— `useGlobalGuards`：

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

注意，还是和管道以及异常过滤器一样，`useGlobalGuards()` 方法在 hybrid 应用中不会为 gateway 和 micro service 设置守卫。在标准的非 hybrid 的 micro service 应用中，`useGlobalGuards()` 会全局挂载守卫。

还是和管道以及异常过滤器一样，就依赖注入而言，使用 `useGlobalGuards()` 并不能给模块注入依赖，因为它是在模块上下文之外执行的，同样如果要解决这个问题，可以在任一模块中通过下面的方式：

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## 给每个路由函数设置一个角色

目前我们的 `RolesGuard` 能够工作了，但是它现在并不只能。我们并没有用到守卫最重要的特性 —— [执行上下文](https://docs.nestjs.com/fundamentals/execution-context)。 现在我们的 `RolesGuard` 并不知道什么是角色以及哪些角色可以访问对应的路由。在控制器中，不同的路由可能具有不同的权限。一些路由可能只能让超级管理员访问，其他的对任何人开放。我们要如何将路由和角色以一种灵活和高复用的方式管理起来？

这就是自定义 metadata 的由来，你可以参考[这里](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata)。Nest 提供了 `@SetMetadata()` 装饰器来将 metadata 与路由处理函数关联。metadata 可以提供角色的信息，这可以帮助守卫来做决策：

```ts
// cats.controller.ts

@Post()
@SetMetadata('roles', ['admin'])  // 设置角色。 @SetMetadata() 来自 @nestjs/common
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

我们将 roles metadata（`roles` 是键名，`['admin']` 是确定的值） 关联到 `create()` 方法。不过像上面那样在路由中直接使用 `@SetMetadata()` 并不是最好的方法，正确的做法是像下面这样创建你自己的装饰器：

```ts
// roles.decorator.ts

import { SetMetadata } from "@nestjs/common";

export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

这种方式更加清晰明了。此时我们再将它用到 `create()` 方法上：

```ts
// cats.controller.ts

@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## 整理在一起

现在我们把前面提到的整理到一起。之前我们无论什么情况下都返回 `true`，让每个请求都通过了授权。现在我们希望根据当前用户的角色和实际的角色来动态决定返回值。为了获取路由的角色信息（即自定义的 metadata），我们需要用到 `@nestjs/core` 提供的 `Reflector` 辅助类：

```ts
// roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles); // 这里的逻辑可简单可复杂，看你自己的需要
  }
}
```

> 小提示：在 nodejs 中，通常的做法是将授权的用户附加到请求对象中。因此在上面的代码中，我们假设 `request.user` 包含了用户实例和用户的角色。在你的应用中，你可能需要自己在用于授权的守卫中将它们关联起来。

查看执行上下文一章的 [Reflection 和 metadata](https://docs.nestjs.com/fundamentals/execution-context#reflection-and-metadata) 了解更多关于 `Reflector` 的用法。

当没有足够权限的用户访问该接口时，会得到：

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

请注意，当一个守卫返回 `false` 后，框架会抛出 `ForbiddenException` 异常。如果你希望返回一个不同的错误信息，你可以抛出自定义的异常：

```ts
throw new UnauthorizedException();
```

守卫中抛出的任何异常都能够被异常处理机制捕获（全局或应用于当前上下文的任何异常过滤器）。
