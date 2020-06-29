# 类型系统

GraphQL 从对象中筛选字段

1、从一个 "root" 对象开始
2、选择对象上的 hero 字段
3、选择 hero 的 name 和 appearsIn 字段

我们需要一种方式来描述后端可以提供的对象数据，这就是 schema

每当有查询到来时，GraphQL 就会根据 schema 对数据进行验证

## 类型语言

我们称描述 schema 的语言为 GraphQL schema 语言

### 对象类型和字段

schema 的最基本元素就是对象类型，它表示当前 GraphQL 服务可以提供的数据类型。在 GraphQL Schema 语言中，我们可以像下面这样来表示它：

```graphql
type Character {
  name: String!
  appearsIn: [Episode!]!
}
```

- `Character` 就是一个 GraphQL 对象类型，它代表它提供了哪些字段
- `name` 和 `appearsIn` 就是 `Character` 的字段，意味着你在查询 Character 类型的时候只能查询这两个字段。
- String 是内置标量类型，后面加 `!` 表示它不能为空
- `[Episode!]!` 是 `Episode` 类型的数组。两个 `!` 分别表示数组元素和数组均不能为空

### 参数

GraphQL 对象类型中的每一个字段都可以有多个参数，如

```graphql
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```

## Query 和 Mutation 类型

schema 中的大多数类型都是普通对象，但是有两个比较特殊：

```graphql
schema {
  query: Query
  mutation: Mutation
}
```

每个 GraphQL 服务都有一个 query 类型和一个可选的 mutation 类型，它们和常规类型一样，但是它们很特殊，因为他们定义了 GraphQL 查询的入口。

如果你看到

```graphql
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

则表示 GraphQL 服务需要有一个包含 `hero` 和 `droid` 字段的 Query 类型：

```graphql
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

Mutation 也是一样的，这些类型会作为 mutation 的根字段以供查询的时候调用。

这里一定要再强调一下，Query 和 Mutation 除了作为 schema 的查询入口之外，和其他 GraphQL 对象类型是完全一样的，包括他的字段用于查询等。

### 标量类型

标量类型作为查询的叶子节点！如：

```graphql
{
  hero {
    name
    appearsIn
  }
}
```

GraphQL 自带有如下标量类型：

- Int： 32 位整型
- Float：双精度浮点型
- String： UTF-8 编码的字符串
- Boolean：true 或者 false
- ID：代表对象类型的唯一标识符，它最终会被序列化为字符串

在大多数 GraphQL 服务的视线中，允许自定义标量类型：

```graphql
scalar Date
```

关于自定义的标量类型如何序列化、反序列化和验证，这些都是你自己去处理。服务端和客服端都可能需要做相应处理。

### 枚举类型

枚举类型可以用于：

- 验证该类型的参数是否是枚举类型值之一
- 告诉类型系统字段值会属于枚举范围内的值

下面就是一个枚举类型的示例：

```graphql
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

这意味着我们无论将它用于 Schema 的任何地方，我们都期望它的值是 `NEWHOPE` `EMPIRE` `JEDI` 之一

### 列表和非空类型

只有对象类型、标量类型和枚举类型是你可以在 GraphQL 中定义的类型。

非空类型就是在类型后面加一个 `!`

```graphql
type Character {
  name: String!
  appearsIn: [Episode]!
}
```

此外，枚举类型还可以告诉类型系统某个字段的参数不能为空，GraphQL 就会对它进行校验。

```graphql
query DroidById($id: ID!) {
  droid(id: $id) {
    name
  }
}
```

当参数传递 `{ "id": null }` 就会报错。

### 接口

接口定义了一组实现该接口必须要满足的字段集合，假设有如下接口：

```graphql
interface Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}
```

那么如果有一个类型要实现这个接口，就需要实现其中的所有字段：

```graphql
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

。。。。。

### 联合类型

`union SearchResult = Human | Droid | Starship`
