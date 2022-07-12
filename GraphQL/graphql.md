# GraphQL

## 类型

对象类型、标量以及枚举是 GraphQL 中你唯一可以定义的类型种类

---

### 对象类型

GraphQL 有两种类型的入口：

- `Query`：查询入口
- `Mutation`：增删改查入口

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

这两个类型除了用于定义入口外，和其它类型没有任何差别。

---

### 标量类型

GraphQL 自带一组默认标量类型：

- `Int`：有符号 32 位整数。
- `Float`：有符号双精度浮点值。
- `String`：UTF‐8 字符序列。
- `Boolean`：true 或者 false。
- `ID`：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读型。

大部分实现中也可以自定义标量类型： `scalar Date`

---

### 枚举类型

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

### 接口

接口用于抽象出通用的字段。

```graphql
# 定义接口
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

# 实现接口
type Human implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}
```

如果要查询一个只存在于特定对象类型上的字段，你需要使用内联片段，即 `...on SpecificType { 属性 }` 这种写法：

```graphql
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    # 内联片段，指定到特定的类型 Droid 上，因为只有 Droid 存在 primaryFunction 字段
    ... on Droid {
      primaryFunction
    }
  }
}
```

### 联合类型

多个类型聚合形成的类型：`union SearchResult = Human | Droid | Starship`，同样，查询时需要使用内联片段。

```graphql
{
  search(text: "an") {
    # __typename 用于获取其具体类型，即返回字段中会存在一个 __typename 属性的字符串，表示该数据在联合类型中的具体类型。
    __typename
    # 由于 Human 和 Droid 都基于 Character，因此可以在公共的接口中查询通用字段，但 Starship 不能共享该字段，需要单独声明
    ... on Character {
      name
    }
    ... on Human {
      height
    }
    ... on Droid {
      primaryFunction
    }
    ... on Starship {
      name
      length
    }
  }
}
```

---

### 输入类型

输入类型用于自定义参数类型，通过关键字 `input` 来声明，而非 `type`，它用于声明后台接收的参数的自定义类型：

```graphql
input ReviewInput {
  stars: Int!
  commentary: String
}
```

## Server 端

```graphql

type query {

}

# 参数对象必须使用 input + 名称 来定义
input CreateArticleInput {
    title: String!
    content: String!
    tagList: [String!]
}

# 添加、删除、修改类型需要定义在 Mutation 中
type Mutation {
    # 自定义类型需要使用 input 定义的类型
    createArticle (someParamas: String, article: CreateArticleInput): Article
}

```

## 客户端

```graphql
{
  # 查询带参数
  # 默认情况下返回的数据字段时 human，使用 aliasName: 可以将返回字段重命名为 aliasName 指定的名字
  aliasName: human(id: "1000") {
    name
    height
  }
}
```

- 片段：定义一组数据，用于其它地方进行引用，相当于抽离公共部分，[参考文档](https://graphql.cn/learn/queries/#fragments)
- 变量：变量使用 `$` 开头来定义，引用的时候也使用 `$` 开头的同名变量。一般在整个查询入口定义变量，在内部进行引用

```graphql
# { "graphiql": true, "variables": { "episode": JEDI } }
query HeroNameAndFriends($episode: Episode = "JEDI") {
  # 定义变量 $episode，并为其赋予默认值 JEDI，另外如果变量后面加了 ! 表示必须传入
  hero(episode: $episode) {
    # 使用变量 $episode
    name
    friends {
      name
    }
  }
}
```

- 指令：动态决定某些参数是否存在。[参考文档](https://graphql.cn/learn/queries/#directives)

  - `@include(if: Boolean)` 仅在参数为 `true` 时，包含此字段。
  - `@skip(if: Boolean)` 如果参数为 `true`，跳过此字段。
  - 服务端也可以定义新的指令，需要参考具体实现的文档，如 [阿波罗 apollo](https://www.apollographql.com/docs/apollo-server/)

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    # 使用指令，当 $withFriends 为 true 时包含 friends 的数据
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

自定义指令，写在后端 schema 中（一般具体实现的文档中会说明怎么自定义指令），然后再其它地方实现对应的指令逻辑：

```graphql
directive @upper on FIELD_DEFINITION # FIELD_DEFINITION 指定指令 @upper 只能用在字段定义上
```

- mutation：修改数据使用 mutation 类型

```graphql
# 使用 mutaiton，同样，后端需要定义 Mutation
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

一个 `mutation` 也能包含多个字段， `query` 也是如此。 `query` 和 `mutation` 之间名称之外的一个重要区别是：

`query` 是并行执行，而 `mutation` 是线性执行，一个接着一个。 这意味着如果我们一个请求中发送了两个 `incrementCredits` `mutation` ，第一个保证在第二个之前执行，以确保我们不会出现竞态。

## [Apollo](https://www.apollographql.com/docs/apollo-server/) 相关

- 查询链路：查询链路就是后台针对嵌套的字段来说，可以分别定义内部字段如何 resolve 从而获取数据，默认情况下顶层提供所有数据，相当于覆盖单独字段的处理逻辑
  - 优化：对于某些查询可能有多个数据源聚合到一个接口中，如果前端查询只用了其中一两个数据，会导致其它数据也一起被执行但不返回，可以通过定义每个字段各自的查询链路进行优化，只有前端需要的字段会进入对应的逻辑
- context：通过创建 ApolloServer 的时候传入 `context() { 返回一个对象 }`，返回的对象可以在所有的查询链路中获取到，通常用于共享数据等
- dataSource：用于聚合获取数据的相关逻辑，例如数据库操作等，更好的解耦每个 resolve 方法（因为数据库相关的操作单独抽离，不用写到每个 resolve 方法中）
- 可以通过自定义指令完成一些操作，如统一的大小写转换、身份认证等

## 参考资料

- [2021 最新 Node.js 系列教程之 GraphQL - bilibili 视频](https://www.bilibili.com/video/BV1fb4y117ya)
