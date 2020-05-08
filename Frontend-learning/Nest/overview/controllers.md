# 控制器（Controllers）

控制器的工作是接收请求并将结果返回给客户端。Nest 的路由机制会将客户端发送过来的请求映射到对应的控制器中进行处理。通常一个控制器中会定义多个路由。

## 路由

在 Nest 中，我们使用 `@Controller()` 来创建控制器。

```ts
// cats.controller.ts

import { Controller, Get } from "@nestjs/common";

@Controller("cats") // 创建 controller，并给路由指定一个 "cats" 前缀
export class CatsController {
  @Get()
  findAll(): string {
    return "This action returns all cats";
  }
}
```

在 `@Controller()` 中指定路由前缀是可选的，但一般我们会通过指定前缀的方式将一组相关的路由组合在一起。

> 小提示：使用 CLI 创建 controller 的命令是 `nest g controller <控制器名>`
