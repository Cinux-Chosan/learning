# Graphql Query Language

## 字段

GraphQL 的目的是从后端提供的对象中筛选字段。

## 参数

GraphQL 中的每个字段都可以有一组自己的参数。

```graphql
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}
```

这里给

上面的例子中，使用了自定义的枚举类型

## 变量

## 别名

```graphql
{
  hero(episode: EMPIRE) {
    name
  }
}
```

上面这么写我们只能查一条 hero 数据出来，要是我们还需要一个 episode 为 JEDI 的 hero 岂不是不得不再查询一次？何不一次性将两个 hero 查出来呢？别名就派上用场了。先看一个别名的例子：

```graphql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}
```

上面的 `empireHero` 和 `jediHero` 都是 hero 的别名，返回值的字段名就是别名的名字，而非 hero，为啥这么写呢？因为如果我们用 hero 作为字段名，那只能查一条 hero 数据，并且返回值的字段名就叫 hero，那要是我们就需要查多条 hero 呢？这其实在后端分别执行了两次查询，都是针对 hero 的查询，但是参数不一样，返回值也就不一样，这样的结果是查询出了两条并行的 hero 数据，一个字段叫 `empireHero`，一个字段叫 `jediHero`，但它们都是针对后端 schema 中的 hero 进行查询。

## 片段

片段和 JavaScript 中的对象结构一毛一样

```graphql
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

片段中使用变量

```graphql
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}
​
fragment comparisonFields on Character {
  name
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

## 操作名

```graphql
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

上面的 `query` 是操作类型， `HeroNameAndFriends` 就是操作名称。

操作类型有 `query`、`mutation` 和 `subscription`，但如果不写默认是 `query`：

- query 用于表明你希望查询数据
- mutation 用于表明你希望修改数据，即对数据有增删改查等操作
- subscription

操作名称真的就只是一个名称，可有可无，它并不会真正影响查询结果。但起一个具有描述性的名称将更易于调试和记录日志。

## 变量

前面我们看到的 “参数” 实际上更像是被硬编码在查询语句中的值。

但是我们并不希望这个参数被写死，而是希望运行时动态决定，那么我们就可以用变量了

变量和函数的参数有些类似，你传什么参数，函数内部就用什么值，但是模板是固定的。

```graphql
query HeroNameAndFriends($episode: Episode) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

上面的 `$episode` 就是变量。

将之前`参数`那里用到的模板中的静态值替换成 `$` 开头的变量名即可，然后我们需要像第一行那样声明这个变量（跟函数有什么区别，我感觉一毛一样的啊），之后就可以在内部使用了。（有没有感觉它真的就是函数）

但我们要怎么使用这个变量呢？变量当然要赋值才行，在 GraphQL 中，变量是通过另一个参数一起传给后端的，这个参数一般叫 `valuables`，它一般是一个普通的 JSON 对象，字段就是不带 `$` 的参数名，值就是你希望传的值，后端收到模板和值之后会对应起来。

### 变量声明

变量声明就像是函数参数声明一样，只不过要用 `$` 打头，冒号后面是它的类型。

所有的变量必须是标量、枚举或者 input 对象类型之一。因此如果你希望传递一个复杂的对象，你就需要知道服务端如何定义的这个 input 对象类型。

### 变量默认值

变量的默认值和函数参数默认值类似，使用 `=` 来设置默认值即可：

```graphql
# 下面的 JEDI 就是默认值
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

## 指令

GraphQL 包含两个指令：

- `@include(if: Boolean)` 当 if 后面的值为 true 时，希望查询结果中包含该字段
- `@skip(if: Boolean)` 和 include 相反。

```graphql
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
    }
  }
}
```

```js
{
  "episode": "JEDI",
  "withFriends": false
}
```

指令满足了动态决定字段的情况，以上面这个举例：如果是在个人信息详情页，我们需要展示用户的朋友，因此需要 `friends` 字段，但是如果在其它页面只需要显示用户头像和名称，那完全用不着 `friends` 字段。

## mutation

就像一般约定 GET 不会修改数据一样，GraphQL 中的 query 也是如此，query 只用于查数据不用于改数据，如果要改数据，我们就用到 mutaiton：

```graphql
mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}
```

```js
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}
```

返回的数据

```js
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```

有没有注意到，`review` 参数不是一个标量，而是一个对象！

其实很好理解，由于我们是要修改这个对象，因此肯定要把对象的数据传递到后端，但是又不能直接写在 GraphQL 查询语句里面，因为这里面表明的是你希望返回的数据，而不是你传给后端让它们改的数据。

怎么做呢，这就是一个 GraphQL 中的 input 类型。

关于 input 类型，我们在 schema 里面会具体说明，你只要知道它类似以前的 post 请求的 body 中的数据即可，就是传递给后端的，只不过 GraphQL 不方便直接表示在 query 中而已。

mutation 中的字段仍然是表示希望后端返回的字段。

在 query 中的字段在后端是并行查询的，在 mutation 中是串行的。这很好理解，query 不会修改数据，因此我们希望所有的数据尽快返回给前端，同步执行是最快的，这样就不用一个字段等待另一个字段了。但是在 mutation 中，由于前面的操作可能会修改数据库导致查询出来的数据可能是修改之前的，因此并行是最好的。

## 内联片段

GraphQL 中也支持定义 interface 和 union 类型，即接口和联合类型。

如果一个 query 中的字段返回的是接口或者联合类型，则需要使用内联片段来访问对应类型的数据：

```graphql
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
    ... on Human {
      height
    }
  }
}
```

```js
{
  "ep": "JEDI"
}
```

由于 hero 返回的是 `Character` 类型，`Human` 和 `Droid` 都实现了 `Character` 接口，并且 hero 可能是 `Human` 或者 `Droid` 类型，这取决于 episode 参数。如果直接获取字段，则只能获取 `Character` 中的字段，因为它在 `Human` 和 `Droid` 中是共用的，但是特定类型的字段就需要使用内联片段了，`... on Droid` 就是内联片段，只有它才有 primaryFunction，如果返回的类型是 `Droid` 则会包含该字段，`... on Human` 同理。

## meta 字段

假设在某些情况下，你根本不知道请求回来的数据是什么类型，因此你需要一种方式可以检测到数据的类型，这就要用到 `__typename` 字段，它是一个元字段，任何时候你都可以使用 `__typename` 来获取对象类型。

```graphql
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}
```

获得的数据是

```js
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
```

在上面的查询中，因为只查询了 name 字段，由于 `Human` `Droid` 和 `Starship` 都实现了该字段，因此你根本不清楚 search 中每个对象具体是属于什么类型，此时 `__typename` 就能获取到。

GraphQL 中还有其他 meta 字段，参考[https://graphql.org/learn/introspection/](https://graphql.org/learn/introspection/)
