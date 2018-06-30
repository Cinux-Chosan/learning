# Redis

## 第三章  入门

### 3.1 热身

1. 获得符合规则的键名列表

    `KEYS pattern`

    pattern 支持 glob 风格的通配符。

    |符号|含义|
    |---| --- |
    |`?`|匹配一个字符|
    |`*`|匹配任意（包括`0`）个字符|
    |`[]`|匹配括号间的任一字符，可以使用`-`来表示范围，如`a[a-b]`可以匹配"`ab`"、"`ac`"、"`ad"`等|
    |`\`|转义字符，如匹配字符`x`使用`\x`，匹配`?`就使用`\?`|

    注意：**KEYS命令需要遍历Redis中所有键，当键数量较多时可能会影响性能，不建议在开发环境中使用**

2. 判断一个键是否存在

    `EXISTS key`

3. 删除键

    `DEL key [key2 ...]`

返回删除的个数

            DEL 不支持通配符，但是可以结合 Linux 的管道和 xargs 命令自己实现删除所有符合规则的键。比如要删除所有以 "user:" 开头的键，就可以执行redis-cli KEYS "user:*" | xargs redis-cli DEL。另外由于 DEL 命令支持多个键作为参数，所以还可以执行 redis-cli DEL `redis-cli KEYS "user:*"` 来达到同样的效果，但是性能更好。

### 3.2 字符串类型

一个字符串类型的键允许存储的数据最大容量是 512 MB

#### 命令

1. 赋值

    `SET key value`

2. 递增数字

    `INCR key`

3. 增加指定整数

    `INCRBY key increment`

    如: `INCRBY bar 2`

4. 减少指定整数

    `DECR key decrement`

5. 增加指定浮点数

    `INCRBYFLOAT key increment`

6. 向尾部追加

    `APPEND key value`

    如果不存在就设置这个值，返回追加过后的字符串总长度。

7. 获取字符串长度

    `STRLEN key`

8. 同时获得和设置多个键值

    `MSET key1 v1 key2 v2 ...`
    `MGET key1 key2 ...`

### 3.3 散列类型

#### 3.3.2 命令

1. 赋值与取值

    `HSET key field value`
    `HGET key field`
    `HMSET key field1 value1 field2 value2 ...`
    `HMGET key field1 field2 ...`
    `HGETALL key`

    这些命令都不需要判断字段是否存在, 如果不存在就会插入该字段和值(返回 1), 如果存在就更新值(返回 0)

2. 判断字段是否存在

    `HEXISTS key field`

    存在返回 1, 不存在返回 0

3. 当不存在时赋值

    `HSETNX key field value`

    NX 理解为 "if not exists"

4. 增加数字

    `HINCRBY key field increment`

    散列类型没有 `HINCR`, 只有 `HINCRBY`. 不过 `HINCRBY` 可以达到相同的功能.

5. 删除字段

    `HDEL key field1 field2 ...`

#### 3.3.4

1. 只获取字段名或字段值

    `HKEYS key`
    `HVALS key`

2. 获取字段数量

    `HELN key`

### 3.4 列表类型

#### 3.4.2 命令

1. 向列表两端增加元素

    `LPUSH key value1 value2 ...`
    `RPUSH key value1 value2 ...`

    返回增加元素过后的列表长度

2. 从两端弹出元素

    `LPOP key`
    `RPOP key`

3. 获取列表中元素个数

    `LLEN key`

4. 获取片段

    `LRANGE key start stop`

    支持负数索引( -1 表示右边第一个 ), 返回值包含两端元素

5. 删除列表中指定值

    `LREM key count value`

    count 为删除个数
    - 当 count > 0, 从左边删除 count 个值为 value 的元素
    - 当 count < 0, 从右边 |count| 个值为 value 的元素
    - 当 count = 0, 删除全部值为 value 的元素

6. 获取/设置指定索引的元素值

    `LINDEX key index`
    `LSET key index value`

    如果是负数, 就从右端开始

7. 只保留列表指定片段

    `LTRIM key start end`

    实处指定范围之外的所有元素

8. 向列表中插入元素

    `LINSERT key BEFORE|AFTER pivot value`

    先在列表中查找从左到右的值为 `pivot` 的元素, 然后根据第二个值来确定是插入到前面还是后面

9. 将元素从一个列表转到另一个列表

    `RPOPLPUSH source destination`

    先对 source 执行 `RPOP`(即从 source 右端弹出一个元素), 然后再把得到的值 `LPUSH` 到 destination 中去(放入到 destination 左端去).

### 3.5 集合类型 (Set)

    集合是无序且唯一的, 列表有序且可能有相同元素存在. 集合可以进行交集、差集、并集运算.

#### 3.5.2 命令

1. 增加/删除

    `SADD key member1 member2 ...`
    `SREM key member1 member2 ...`

    添加相同元素会忽略, 删除元素后返回删除成功的个数

2. 获取集合中所有元素

    `SMEMBERS key`

3. 判断元素是否在集合中

    `SISMEMBER key member`

    判断一个元素是否在集合中. 存在即返回 1, 不存在返回 0

4. 集合间运算

    `SDIFF key1 key2 ...`
    `SINTER key1 key2 ...`
    `SUNION key1 key2 ...`

    `SDIFF` 对集合进行差集运算, `SINTER` 对集合进行交集运算, `SUNION` 对集合进行并集运算.

5. 获得集合中元素个数

    `SCARD key`

6. 进行集合运算并存储结果

    `SDIFFSTORE destination key1 key2 ...`
    `SINTERSTORE destination key1 key2 ...`
    `SUNIONSTORE destination key1 key2 ...`

7. 随机获取集合中元素

    `SRANDMEMBER key [count]`

    - 如果未指定 count, 则随机从集合中获取一个元素
    - 如果 count > 0, 则获取 count 个不重复元素, 如果大于集合中元素个数, 则返回元素中全部元素.
    - 如果 count < 0, 则获取 count 个元素, 元素可能会相同

8. 从集合中弹出一个元素

    `SPOP key`

    由于集合是无序的, 因此随机弹出一个元素

### 3.6 有序集合 (Sorted set)

    有序集合在集合的基础上为每个元素关联了一个分数, 因此不仅可以完成插入、删除、判断元素是否存在等集合操作外, 还可以获取分数最高或最低的前 N 个元素、获取指定分数范围内的元素等与分数相关的操作.它与列表的差别如下:
    - 列表是链表来实现的, 获取两端比较快, 但是获取中间的元素会相对较慢
    - 有序集合使用散列表和跳表实现, 因此读取任意位置都很快.
    - 列表不能简单的调整某个元素的位置, 但是有序列表可以(通过改变元素分数)
    - 有序集合币列表更消耗内存(因为它是散列表, 需要存放散列值的位置)

#### 3.6.2 命令

1. 增加元素

    `ZADD key score member [score member] ...`

    向有序集合中添加一个元素和相应的分数(分数可以是浮点数, `+inf` 表示正无穷, `-inf` 表示负无穷), 如果已经存在该元素则会替换原有分数. 返回新加入集合的元素个数.

2. 获得元素分数

    `ZSCORE key member`

3. 获得排名在某个范围的元素

    `ZRANGE key start stop [WITHSCORES]`
    `ZREVRANGE key start stop [WITHSCORES]`

    返回按照分数从小到大的顺序返回索引从 start 到 stop 之间的所有元素(包含两端). `ZRANGE` 与 `LRANGE` 相似, 索引都是从 0 开始, 负数表示从后向前开始查找.

    如果同时需要获取元素的分数则需要指定 `WITHSCORES` 参数, 返回数据格式从 `元素1,元素2 ...` 变为 `元素1,分数1,元素2,分数2 ...`

    如果分数相同, 则会对值进行排序, 排序规则和其它语言类似.

    `ZREVRANGE` 和 `ZRANGE` 的唯一不同在于它是按照元素分数从大到小的顺序排列的.

4. 获取指定分数范围内元素

    `ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]`
    `ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]`

    从小到大的顺序返回分数在 `min` 和 `max` 之间的元素. 如果不希望包含端点值, 可以在分数前面加上 `(` 符号, 同时还支持 `+inf` 和 `-inf` 分别表示正负无穷, `WITHSCORES` 和前面一样, 表示需要得到分数. `offset` 和 `count` 代表偏移多少条数据和获取多少条数据.

    如获取分数在 80分(不包含)到正无穷范围内的元素:

    `ZRANGEBYSCORE scoreboard (80 +inf`

    `ZREVRANGEBYSCORE` 与 `ZRANGEBYSCORE` 相同, 且 `max` 和 `min` 位置也相反, 如:

    `ZREVRANGEBYSCORE scoreboard 100 0 LIMIT 0 3`

5. 增加某个元素

    `ZINCRBY key increment member`

    如想给 Jerry 加 4 分, 则 `ZINCRBY scoreboard 4 Jerry`

6. 获取集合中元素数量

    `ZCARD key`

7. 获得指定分数范围内元素个数

    `ZCOUNT scoreboard 90 100`

8. 删除一个或多个元素

    `ZREM key member1 member2 ...`

    返回成功删除的个数(不包含本身不存在的元素)

9. 按照排名范围删除元素

    `ZREMRANGEBYRANK key start stop`

    按照元素分数从小到大的顺序删除指定范围内的所有元素, 并返回删除的数量.

10. 按照分数范围删除元素

    `ZREMRANGEBYSCORE key min max`

    `ZREMRANGEBYSCORE` 命令会删除指定分数范围内所有元素. 返回删除的个数.

11. 获取元素的排名

    `ZRANK key member`
    `ZREVRANK key member`

    如: `ZRANK scoreboard Peter`

12. 计算有序集合的交集

    `ZINTERSTORE destination numkeys key1 key2 ... [WEIGHTS weight1 weight2 ...] [AGGREGATE SUM|MIN|MAX`

    计算多个有序集合的交集并将结果存储在 destination 键中(同样以有序集合类型存储), 返回值为 destination 键中的元素个数.

    destination 中的元素分数是由 AGGREGATE 参数决定的:
    - 当 AGGREGATE 为 SUM 时, destination 中的分数是参与计算的集合中每个元素分数之和
    - 当 AGGREGATE 为 MIN 时, destination 中的分数是参与计算的集合中分数的最小值
    - 当 AGGREGATE 为 MAX 时, destination 中的分数是参与计算的集合中分数的最大值

    `ZINTERSTORE` 还可以通过 `WEIGHTS` 参数设置每个集合的权重, 每个集合在参与计算时元素的分数会被乘上该集合的权重. 如:
    `ZINTERSTORE sortedSetsResult 2 sortedSets1 sortedSets2 WEIGHTS 1 0.1`

    另外还有并集运算 `ZUNIONSTORE`, 这里不再赘述.

## 第四章 进阶

### 4.1 事务

#### 4.1.1 概述

事务通过 `MULTI` 命令开始, 结束于 `EXEC` 命令.

如:

```sh
MULTI
SADD "user:1:following" 2
SADD "user:2:following" 1
EXEC
```

#### 4.1.2 错误处理

1. 如果是 redis 能够在执行前发现的错误(如语法错误等), 执行 `EXEC` 之后 redis 直接返回错误, 即使其中正确的命令也不会执行.
2. 如果是 redis 不能及时发现的错误(如需要在运行时发现命令和执行的对象类型不匹配等), 则会执行其中正确的命令(包括出错之后的命令)

redis 没有回滚功能, 因此要自己管理.

#### 4.1.3 WATCH 命令介绍

`WATCH` 命令可以监控一个或多个键, 一旦其中有一个键被修改(或删除), 之后的事务就不会执行(注意不是延迟到 WATCH 之后再执行). 监控一直持续到 `EXEC` 命令(事务中的命令是在 `EXEC` 之后执行的, 所以 `MULTI` 命令之后可以修改 `WATCH` 监控的键值)

### 4.2 过期时间

#### 4.2.1 命令介绍

1. 设置过期时间
    - `EXPIRE key seconds`
    - `PEXPIRE key milliseconds`
    - `EXPIREAT key timestamp`
    - `PEXPIREAT key milliseconds-timestamp`

    `EXPIRE` 和 `EXPIREAT` 命令以秒为单位设置一个键的过期时间, 到时间后 Redis 会自动删除它.

    `PEXPIRE` 和 `PEXPIREAT` 命令以毫秒为单位设置一个键的过期时间, 到时间后 Redis 会自动删除它.

    返回 `1` 表示设置成功, 返回 `0` 表示键不存在或设置失败.

2. 获取一个键到期剩余时间

    - `TTL key`
    - `PTTL key`

    TTL 获得的单位是秒(EXPIRE), PTTL 获得的单位是毫秒(PEXPIRE)

    返回剩余时间的秒数, 如果没有设置过期时间返回 `-1`, 如果键不存在返回 `-2`.

3. `PERSIST key`

    取消过期时间, 即恢复成永久时间.

    清除成功返回 `1`, 如果键不存在或本身就是永久时间则返回 `0`

    除 `PERSIST` 命令之外, 使用 `SET` 或者 `GETSET` 命令为键赋值也会同时清除键的过期时间. 其它只对键值进行操作的命令均不会影响键的过期时间.

#### 4.2.4 实现缓存

使用 Redis 作为数据缓存中心时，为了避免 Redis 占用过多内存，可以通过配置 Redis 的清理策略：修改配置文件的 maxmemory 参数以限制 Redis 最大可用内存大小（单位字节），如果超出限制，Redis就会根据 maxmemory-policy 参数指定的策略来删除不需要的键，直到 Redis 占用的内存小于指定内存。

maxmemory-policy 支持规则如下表，其中 LRU（Least Recnently Used）算法即“最近最少使用”，它认为最近最少使用的键在未来也会最少使用，当空间不足时就会删除这些键。

|规则|说明|
|---|---|
|volatile-lru|使用LRU算法删除一个键（只对设置了过期时间的键）|
|allkeys-lru|使用LRU算法删除一个键|
|volatile-random|随机删除一个键（只对设置了过期时间的键）|
|allkeys-random|随机删除一个键|
|volatile-ttl|删除过期时间最近的一个键|
|noeviction|不删除键，只返回错误|

#### 4.3.2 SORT命令

`sort key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern ...]] [ASC|DESC] [ALPHA] [STORE destination]`

SORT 命令可以对列表、集合、有序集合进行排序，可用 LIMIT 来限制输出条数，可通过 ASC 或 DESC 来指定排序规则。

如 `SORT mylist`，在没有指定 ALPHA 参数时，SORT 会尝试将所有元素转换成双精度浮点数来进行比较，如果无法转换则会提示错误，如：

```redis
LPUSH mylistalpha a c e d B C A
SORT mylistalpha   ## 错误：(error) ERR One or more scores can't be converted into double
SORT mylistalpha ALPHA  ## 正确
```

#### 4.3.3 BY 参数