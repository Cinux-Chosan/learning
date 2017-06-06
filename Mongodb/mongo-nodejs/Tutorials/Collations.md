# [Collations](http://mongodb.github.io/node-mongodb-native/2.2/tutorials/collations/)（排序规则）

Collations 提供了一系列用于特定语言的比较字符串的规则

例如，在加拿大法语（Canadian French）中，一个单词的最后一个中英决定了排序顺序。

考虑下面的单词：

>    cote < coté < côte < côté

使用 Canadian French 的排序结果将会是：

>    cote < côte < coté < côté

如果没有指定排序规则， MongoDB 使用简单的二进制排序，则排序结果为：

>   cote < coté < côte < côté

## 使用

你可以在创建集合的时候为它指定一个默认的排序规则和索引。或者为增删改查操作或聚合操作提供一个默认的排序规则。在支持排序规则的操作中， 如果没有指定其它的排序规则， 则 MongoDB 使用集合的默认排序规则。

### 排序规则参数

> collation: {
   locale: <string>,
   caseLevel: <bool>,
   caseFirst: <string>,
   strength: <int>,
   numericOrdering: <bool>,
   alternate: <string>,
   maxVariable: <string>,
   backwards: <bool>
}

The only required parameter is locale, which the server parses as an [ICU format locale ID](http://userguide.icu-project.org/locale). For example, use en_US to represent US English and fr_CA to represent Canadian French.

For a complete description of the available parameters, see the [MongoDB manual entry](https://docs.mongodb.com/manual/).
