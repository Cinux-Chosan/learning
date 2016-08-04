#[assert模块](https://nodejs.org/dist/latest-v4.x/docs/api/assert.html)被锁住，不允许修改。


##assert(value[, message]) ：
>> alias of assert.ok() ：value为false则抛出异常

##assert.deepEqual(actual, expected[, message]) ：
>> 使用 == 枚举检查属于自己的属性，不检查原型链（\__prot__）、attached symbols、不可枚举的属性

##assert.equal(actual, expected[, message]) ：
>> 测试actual, expected的值是否相等

##assert.deepStrictEqual(actual, expected[, message]) ：
>> 同deepEqual，但是使用 ===

##assert.ifError(value) ：
>> 如果value为真，则将value抛出

##assert.fail(actual, expected, message, operator) ：
>> 根据提供的operator比较actual和expected的值是否满足条件，operator可以为 > < == === != !== 等

##assert.throws(block[, error]\[, message]) ：
>> block为一个函数，在该函数里面需要抛出一个异常，否则throws会抛出AssertionError:Missing expected exception
>> error可以为一个构造函数、正则表达式、验证函数。如果为构造函数，则判断block抛出的异常是否是该构造函数的实例，如果为正则表达式，会与block中抛出的异常信息进行匹配，成功则忽略，匹配失败则抛出异常，如果为函数，则将err作为对象传入
>> message 如果block没有抛出异常，则message会被追加到 AssertionError异常信息的末尾。

##assert.doesNotThrow(block\[, error][, message]) ：
>> 当调用该函数的时候，它会立即调用block函数。与assert.throws相反的是：如果block抛出的异常与error同类型，则抛出异常。
>> 如果错误类型不同，或者error未定义，则将错误传递给它的调用者

##assert.strictEqual(actual, expected[, message]) ：
>> 同equal，使用 ===

##assert.ok(value[, message]) ：
>> 同 assert.equal(!!value, true, message)

##assert.notStrictEqual(actual, expected[, message]) ：
>> 使用 !==

##assert.notEqual(actual, expected[, message]) ：
>> 使用 !=

##assert.notDeepStrictEqual(actual, expected[, message]) ：
>> 与deepStrictEqual相反

##assert.notDeepEqual(actual, expected[, message]) ：
>> 与deepEqual相反
