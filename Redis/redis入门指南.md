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
