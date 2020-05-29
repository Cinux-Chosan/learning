# Provider

Provider 是 Nest 中的一个基本概念。许多 Nest 中的 Clas 都可以被看错 Provider —— services、 repositories、 factories、 helpers 等。

Provider 的核心思想是依赖注入，也就意味着对象可以彼此建立各种依赖关系。我们通过 `@Injectable()` 来创建 Provider 。

在前面的章节，我们创建了一个 `CatsController`，它负责处理请求，但如果有更复杂的逻辑，就应该由它转交给 Provider 来处理了。

## Service

我们来设计一个 Service，它负责帮助 `CatsController` 存储和查找数据：

```ts
// cats.service.ts

import { Injectable } from "@nestjs/common";
import { Cat } from "./interfaces/cat.interface";

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

> 小提示：创建 service 的命令是 `nest g service cats`

此时我们定义好了这个 Service，

```ts
// cats.controller.ts

import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./interfaces/cat.interface";

@Controller("cats")
export class CatsController {
  constructor(private catsService: CatsService) {} // CatsService 通过控制器的构造函数注入

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

## 依赖注入

## 自定义 Provider

## 可选 Provider

## Property-based injection

## 注册 Provider

目前为止，我们只是定义了 `CatsService`，我们还需要通过模块来告诉 Nest 这儿有个 `CatsService` 要实例化并执行依赖注入逻辑，注册的逻辑很简单 —— 把 `CatsService` 加入到模块的 `providers` 列表。

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService], // 注册
})
export class AppModule {}
```

现在 Nest 就知道去初始化 `CatsService` 并注入到 `CatsController` 中去。

## 手动注册 Provider
