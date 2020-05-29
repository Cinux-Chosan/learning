# 管道（Pipe）

管道同样是通过 `@Injectable()` 装饰的类。一个管道应该实现 `PipeTransform` 接口

Nest 中，管道有如下两个典型的应用场景：

- 数据转换：将输入的数据转换成期望得到的输出
- 数据验证：如果输入的数据合法，则不做任何改变。否则抛出一个异常。

两种情况下，管道都需要操作传递给控制器路由函数的参数。Nest 会在调用路由函数之前插入管道，你可以在管道中执行任何数据转换和验证逻辑。如果管道中抛出异常，则后面的路由处理函数就不会再执行了。另外管道是运行在异常处理机制中的，能够被当前上下文或全局异常过滤器捕获。

## 内置管道

Nest 与生俱来 5 个管道：

- `ValidationPipe`
- `ParseIntPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`

它们都来自 `@nestjs/common`。下面我们以 `ValidationPipe` 和 `ParseIntPipe` 举例。

先来看看一个什么都不做的管道：

```ts
// validation.pipe.ts

import { PipeTransform、Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value; // 原样返回
  }
}
```

`PipeTransform<T, R>` 是一个泛型接口，`T` 代表输入 `transform()` 的类型是 `T`，`R` 代表 `transform()` 返回值是 `R` 类型。

每个管道都必须实现 `transform()` 方法，它有两个参数：

- `value`
- `metadata`

`value` 是当前处理的参数（在路由处理函数收到该参数之前），而 `metadata` 就是一些元数据，它有以下属性：

```ts
export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom";
  metatype?: Type<unknown>;
  data?: string;
}
```

这些属性描述了当前处理的参数：

| 属性名   | 描述                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| type     | 表明参数是 body `@Body()`、 query `@Query()`、 param `@Param()` 或者是[自定义参数](https://docs.nestjs.com/custom-decorators) |
| metatype | 参数的原始类型，如 `String` 类型，注意如果你使用的 js 或者没有在路由处理函数中声明类型，那么这个值就是 `undefined`            |
| data     | 传给装饰器的字符串，如 `@Body('string')`，如如果没有传入参数则为 `undefined`                                                  |

由于 Typescript 接口在编译完成之后会被移除，因此如果方法的参数类型是以接口的方式定义而非类，则 `metatype` 的值就是 `Object`。

## 使用验证的场景

以 `CatsController` 的 `create()` 方法为例：

```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

CreateCatDto 定义如下：

```ts
// create-cat.dto.ts

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

我们的目的是要确保任何传给 create 方法的参数包含一个合法的请求体。因此我们需要验证它是否符合 `CreateCatDto` 的模型。尽管我们可以放到 create 方法中去做，但这无疑破坏了单一性原则。另一个方式是创建一个验证器类（validator class）并代理给任务（task）去处理，但是这样一来我们就需要在每个方法的前面使用该验证器。那创建一个用于验证的中间件怎样？好办法，但你无法创建一个可以用于整个应用的泛型中间件（因为中间件不关心执行上下文，包括路由处理函数和它的参数）。

事实证明，我们选择管道来做是非常明智的选择。

## 验证对象模型

验证对象的方式有很多。其中一种常用的方式就是基于模型的验证。[`Joi`](https://github.com/hapijs/joi) 库允许你以相当直接的方式来创建模型，接下来让我们来看一个使用 Joi 的管道的例子。

首先你需要安装对应的包：

- `npm i --save @hapi/joi`
- `npm i --save-dev @types/hapi__joi`

下面，我们会创建一个类，它构造函数的参数是一个数据模型。然后我们使用 `schema.validate()` 方法来验证数据：

```ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ObjectSchema } from "@hapi/joi";

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value); // 验证数据
    if (error) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }
}
```

## 绑定管道

绑定管道的意思就是将他们与控制器或者路由函数关联。我们使用 `@UsePipes()` 装饰器并创建一个管道实例并传入一个验证模型。

```ts
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## 验证器类

> 小提示：这一部分内容需要用到 TypeScript，如果你的项目是用 JavaScript 写的那就无法使用。

我们来看看另一种实现验证的方法。

Nest 可以很好的与 [class-validator](https://github.com/typestack/class-validator) 相结合。这个库允许你使用基于装饰器的验证。我们先来安装这个库：

`npm i --save class-validator class-transformer`

安装完成之后，我们可以给 `CreateCatDto` 类添加一些装饰器：

```ts
// create-cat.dto.ts

import { IsString, IsInt } from "class-validator";

export class CreateCatDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
```

你可以在[这里](https://github.com/typestack/class-validator#usage) 了解更多 class-validator 装饰器。

现在我们再来创建一个 `ValidationPipe` 类：

```ts
// validation.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

> 小提示：上面用到了 [class-transformer](https://github.com/typestack/class-transformer) 库，它和 class-validator 是同一个作者

来看看上面的例子：

首先，请注意 `transform()` 是 `async` 函数。Nest 支持同步或者异步方式的验证器，因为 [class-validator 可能会使异步的](https://github.com/typestack/class-validator#custom-validation-classes)。

其次，我们在 `toValidate()` 中检验一个类型是否是 JavaScript 类型，如果不是，那我们没有必要在验证这一步对它进行处理。

然后我们使用 `plainToClass()` 来将 JavaScript 对象转换成类型对象以便进行验证。请求携带过来的参数主体在被反序列化之后是没有任何类型信息的。Class-validator 需要使用到我们之前在 DTO 中定义的验证装饰器，因此我发需要执行这个转换操作。

最后，就像前面提到的，验证器管道要么原样返回输入值，要么抛出一个异常。

最后一步就是绑定 `ValidationPipe`。管道和异常过滤器类似，都可以绑定到方法、控制器或者全局范围，此外管道还可以是参数级别的，也就意味着它可以直接绑定到具体的参数中，下面看个例子：

```ts
// cats.controller.ts

@Post()
async create(
  @Body(new ValidationPipe()) createCatDto: CreateCatDto ) { // 直接将管道绑定到 @Body() 装饰器中
  this.catsService.create(createCatDto);
}
```

当验证逻辑仅涉及一个指定参数时，参数级别的管道很有用。

此外，如果要将一个管道应用到方法上，需要用到 `@UsePipes()` 方法，它也来自 `@nestjs/common`：

```ts
// cats.controller.ts

@Post()
@UsePipes(new ValidationPipe())
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

在上面的例子中，立即创建了一个 `ValidationPipe` 的实例。或者你可以直接传入 `ValidationPipe` 类，将实例化的逻辑交由 Nest 进行处理，并且开启依赖注入：

```ts
// cats.controller.ts

@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

由于 `ValidationPipe` 被设计为尽可能通用，因此我们可以将它用于管局管道，这样每个路由处理函数都会用到它。

```ts
// main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

> 小提示：在 [hybrid 应用](https://docs.nestjs.com/faq/hybrid-application)中 `useGlobalPipes()` 方法不会为 gateway 和 micro service 设置管道。在标准的（即非 hybrid）micro service 应用中，`useGlobalPipes()` 才会全局挂载管道。

全局管道会被用于整个应用程序的每个控制器和路由函数。但就依赖注入而言，全局管道在模块的上下文之外（使用 `useGlobalPipes()`）注册的，因此无法完成依赖注入。为了解决这个问题，你可以直接在任何模块中使用下面的方式来注入全局管道：

```ts
// app.module.ts

import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

同异常过滤器一样，这样的做法只是引入了全局管道，并非表示该管道就成了模块管道。且 `useClass` 也不是解决自定义 provider 的唯一途径，参考 [这里](https://docs.nestjs.com/fundamentals/custom-providers)

## 转换的例子

验证并非管道的唯一使用场景，正如本章一开始我们说的那样，它还能用于转换数据 —— 将输入转换成预期的输出。

转换函数返回的值会完整的覆盖之前的参数值，当有时候客户端传递过来的数据需要执行转换的时候就非常有用了 —— 例如在传给路由处理函数之前需要将字符串转数字，或者一些缺少必要的信息的场景下赋予默认值。

我们来看个例子，`ParseIntPipe` 将字符串转成数字：

```ts
// parse-int.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException("Validation failed");
    }
    return val;
  }
}
```

然后我们可以轻易的将该管道用于参数上：

```ts
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
```

你还可以创建一个 `ParseUUIDPipe` 来转换 UUID：

```ts
@Get(':id')
async findOne(@Param('id', new ParseUUIDPipe()) id) {
  return this.catsService.findOne(id);
}
```

或者直接将 id 转换成用户实体：

```ts
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {  // 将 id 转换成用户数据
  return userEntity;
}
```

## 内置的验证管道

幸运的是，Nest 已经为你提供了 `ValidationPipe`，其中包括 `ParseIntPipe`、 `ParseBoolPipe`、`ParseArrayPipe` 和 `ParseUUIDPipe`，并且它们提供的功能还远不止上文描述到的那样，你可以参考 [这里](https://docs.nestjs.com/techniques/validation)。
