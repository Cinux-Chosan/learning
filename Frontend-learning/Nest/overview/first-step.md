# 第一步

我会通过带领你创建一个基本的 CRUD 应用来了解 Nest 的核心功能。

## 前置条件：

- `TypeScript`，后面的示例都是使用 `TypeScript` 举例的
- `Node >= 10.13.0`

## 开始

1.  安装 nest cli：`npm i -g @nestjs/cli`
2.  创建 nest 项目：`nest new project-name`

其中核心文件如下：

            ├── src
            |  ├── app.controller.ts
            |  ├── app.module.ts
            |  └── main.ts

| 文件名              | 描述            |
| ------------------- | --------------- |
| `app.controller.ts` | controller 示例 |
| `app.module.ts`     | 程序的根模块    |
| `main.ts`           | 程序入口        |

我们来看看 `main.ts` 中的内容：

```ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // 创建 nest 应用实例
  await app.listen(3000);
}
bootstrap();
```

这里的代码相当简单，使用 `NestFactory.create` 根据根模块配置创建一个应用实例并启动应用。

## 平台

Nest 旨在创建一个平台无关的框架。底层可以使用任何 HTTP 平台，但需要在 HTTP 平台和 Nest 之间创建一个适配器。目前提供了 [Express](https://expressjs.com/) 和 [fastify](https://www.fastify.io/) 的适配器，默认使用 Express。

| HTTP 平台          | 描述                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `platform-express` | Express 是大多数开发者了解的框架，它的生态已经相当繁荣，因此我们默认采用它作为底层平台                                   |
| `platform-fastify` | Fastify 是一个高性能，低开销的框架，高度专注于提供最大的效率和速度，如果你真的很关心性能，那么可以考虑使用它作为底层平台 |

在 Nest 中，Express 对应 `NestExpressApplication` 类型，Fastify 对应 `NestFastifyApplication` 类型，如果在调用 create 的时候传入了指定的类型，那么应用实例将包含对应类型的特定方法（但一般不需要指定具体类型，除非你真的很需要使用底层平台的 API）：

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule); // 指定创建 express 类型
```

## 启动应用

执行 `npm start` 即可启动，并在 `http://localhost:3000/` 查看效果，如果正常启动，你应该能看到页面上输出 `Hello World!`
