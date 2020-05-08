# 模块（Modules）

一个 module 就是一个以 `@Module()` 装饰的类。`@Module()` 用于 nest 组织代码结构。

`@Module()` 装饰器接受一个对象来描述该模块：

| 属性          | 描述                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `providers`   | provider 列表，其中的 provider 会被 nest 依赖注入器实例化并且在当前模块共享                                            |
| `controllers` | controller 列表，表明当前模块需要实例化的 controller                                                                   |
| `imports`     | 该模块依赖的其他模块列表，其它模块可以暴露它们的 provider 供该模块使用                                                 |
| `exports`     | `providers` 列表的子集，表明当前模块可以暴露给其他模块使用的 provider，其它模块 `import` 该模块即可使用对应的 provider |

我们先来看看模块长什么样：

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsModule } from "./cats/cats.module";

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
```

这是 Nest 中的根模块，每个 Nest 应用至少要有一个模块 —— 根模块（使用 cli 会自动创建该模块）。

## 什么是功能模块？

默认情况下我们只有一个模块 —— 根模块。但所有的 `controller`、`provider` 都放在根模块势必会导致根模块臃肿不易维护。因此我们需要把相关功能的 `controller` 和 `provider` 拆分出来独立成一个模块，这就是功能模块。简而言之，功能模块就是把一系列相关功能组织在一起的模块。比如用户相关的功能可以组织为一个功能模块，它有自己的 `module` 文件来组织 `controller`、`provider` 等。又比如关于猫相关的功能我们也可以抽成如下独立的模块：

```ts
// cats/cats.module.ts

import { Module } from "@nestjs/common";
import { CatsController } from "./cats.controller";
import { CatsService } from "./cats.service";

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {}
```

然后我们需要在根模块中引入：

```ts
import { CatsModule } from "./cats/cats.module";

@Module({
  // ...
  imports: [CatsModule] // 引入 CatsModule 模块
})
export class AppModule {}
```

> 小提示： 创建功能模块的命令是 `nest g module <模块名>`

## 什么是共享模块？

Nest 中模块默认为单例，因此我们可以在不同模块之间共享它们的 provider。

每个模块天生就是一个共享模块。如果你希望别的模块能使用该模块的 provider，那么将对应的 provider 加入到 `exports` 中即可（注意：`exports` 是 `providers` 的子集），此后所有其他模块只需要在自己的 `imports` 中添加该模块的引用即可使用到该模块 `exports` 中的功能啦。

## 再导出

`imports` 中的模块可以通过 `exports` 再次导出。

```ts
@Module({
  imports: [CommonModule], // 先引入
  exports: [CommonModule] // 再导出
})
export class CoreModule {}
```

## 依赖注入

模块类还可以注入 provider，这可以用于配置模块。

```ts
// cats.module.ts

@Module({
  // ...
  providers: [CatsService]
})
export class CatsModule {
  constructor(private catsService: CatsService) {}
}
```

由于存在[循环依赖](https://docs.nestjs.com/fundamentals/circular-dependency)的关系，模块类不能作为 provider 被注入。

## 全局模块

如果你有一系列 provider 希望在任何地方都可以用到，那么可以考虑把它们统一放到一个模块中，并使用 `@Global()` 把该模块注册成为全局模块：

```ts
@Global() // 注册为全局模块
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

此后 `CatsService` 可以在任何地方使用，而不需要在其他模块引入。

## 动态模块尝鲜

动态模块可以让你动态注册和配置 provider。这里我们只是对动态模块做一个简单的概览，后面我们会单独对动态模块进行讲解。我们先来看看动态模块长什么样子吧：

```ts
import { Module, DynamicModule } from "@nestjs/common";
import { createDatabaseProviders } from "./database.providers";
import { Connection } from "./connection.provider";

@Module({
  // ...
  providers: [Connection]
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      // global: true,  // 如果你希望该动态模块注册为全局模块
      module: DatabaseModule,
      providers: providers,
      exports: providers
    };
  }
}
```

> 小提示: `forRoot` 可以同步或异步（如通过 `Promise`）返回一个动态模块。

上面的代码默认定义了一个 `Connection` provider。但是它还会根据传给 `forRoot` 的 `entities` 和 `options` 参数动态创建了一些 provider。动态创建的 provider 和默认 provider 会进行合并（即不是覆盖）。

然后我们通过下面的方式来引用和配置动态模块：

```ts
// ...
import { User } from "./users/entities/user.entity";

@Module({
  // ...
  imports: [DatabaseModule.forRoot([User])] // 引用动态模块并传参
  // exports: [DatabaseModule] // 如果你希望再次导出动态模块
})
export class AppModule {}
```

动态模块我们后面会专门有一个主题来讲解，这里就先尝尝鲜啦。^\_^

关于模块的知识就先介绍到这里啦，感谢阅读。
