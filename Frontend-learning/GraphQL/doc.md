# GraphQL

## 类型系统

## Query 和 Mutation 类型

```js
schema {
  query: Query
  mutation: Mutation
}
```

每个 GraphQL 服务必须有一个 Query 类型，但 Mutation 类型是可选的。

他们和常规的 Object 类型一样，但他们定义了每个 GraphQL 查询的入口。

因此一个这样的查询

```ts
query {
  hero {
    name
  }
  droid(id: "2000") {
    name
  }
}
```

对应如下的 GraphQL 服务:

```ts
type Query {
  hero(episode: Episode): Character
  droid(id: ID!): Droid
}
```

Mutation 和 Query 一样。

## 标量类型

GraphQL 与生俱来一些标量类型：

- `Int`: A signed 32‐bit integer.
- `Float`: A signed double-precision floating-point value.
- `String`: A UTF‐8 character sequence.
- `Boolean`: true or false.
- `ID`: The ID scalar type represents a unique identifier, often used to refetch an object or as the key for a cache. The ID type is serialized in the same way as a String; however, defining it as an ID signifies that it is not intended to be human‐readable.

## 枚举类型

```ts
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

## 列表和非空（Lists and Non-Null）

通过添加 `!` 来指定非空。

```js
type Character {
  name: String!
  appearsIn: [Episode]!
}
```