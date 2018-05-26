- id()
    - 查看变量在内存中的地址。
- repr()
    - 将对象转化为供解释器读取的形式。
- r 接字符串
    - 表示 r 后面的字符串为原始字符串，所以其中的类似于 `\n` 这些转义字符会保留字面上的意思，而非转义符
- 关于Python的内 建函数，下面都列出来了，供参考:
    - abs()、divmod()、input()、open()、staticmethod()、all()、 enumerate()、int()、ord()、str()、any()、eval()、isinstance()、pow()、 sum()、basestring()、execfile()、issubclass()、print()、super()、bin()、 file()、iter()、property()、tuple()、bool()、filter()、len()、range()、 type()、bytearray()、float()、list()、raw_input()、unichr()、callable()、 format()、locals()、reduce()、unicode()、chr()、frozenset()、long()、 reload()、vars()、classmethod()、getattr()、map()、repr()、xrange()、 cmp()、globals()、max()、reversed()、zip()、compile()、hasattr()、 memoryview()、round()、import()、complex()、hash()、min()、set()、 apply()、delattr()、help()、next()、setattr()、buffer()、dict()、hex()、 object()、slice()、coerce()、dir()、id()、oct()、sorted()、intern()。
- `ord()`
    - `ord()` 是一个内建函数，能够返回某个字符（注意，是一个字符，而 不是多个字符组成的串）所对应的ASCII值（是十进制的），与之相反的是 `chr()`


### 字符串格式化

```py
# 方法1
"Suzhou is more than {0} years. {1} lives in here.".format(2500, "qiwsir")
# 方法2
"Suzhou is more than {year} years. {name} lives in here.".format(year=2500, name="qiwsir")
# 方法3
"Suzhou is more than %d years. %s lives in here." % (2500, "qiwsir")
# 方法4
"I love %(program)s" % {"program": "Chosan"} 
```

### 字符串编码

Python2默认的编码是ASCII

- encode()：将对象的编码转换为指定编码格式（称作“编码”）
- decode()：encode 的逆过程（称 作“解码”）。

#### 避免中文是乱码

经验一，在开头声明：

```py
# -*- coding: utf-8 -*
```

有朋友问我“-*-”有什么作用，那个就是为了好看，爱美之心人皆 有，更何况程序员？当然，也可以写成：

```py
# coding:utf-8
```

经验二，遇到字符（节）串，立刻转化为unicode，不要用str()，直 接使用unicode()：

```py
unicode_str = unicode('中文', encoding='utf-8') 
print(unicode_str.encode('utf-8'))
```

经验三，如果对文件操作，打开文件的时候，最好用codecs.open替 代open（关于文件的操作，请参阅后续内容。）

```py
import codecs codecs.open('filename', encoding='utf8')
```

最后，如果用Python3，这种编码的烦恼会少一点。

### 序列反转

```py
# 不推荐使用
alst = [1,2,3,4,5,6]
alst[::-1]
```

```py
# 推荐使用
list(reversed(alst))
```

判断一个对象是 不是可迭代的

```py
astr = "python"
hasattr(astr,'__iter__') # False
```

### 列表

`append` 和 `extend` 都是原地修改列表， 但是 append 是整体追加， 而 extend 需要的参数是可迭代的， 并且会将该参数逐个追加到列表中。

```py
 lst = [1,2,3] 
 lst.append(["qiwsir","github"]) 
 lst [1, 2, 3, ['qiwsir', 'github']]      #append的结果 
 len(lst) 4

 lst2 = [1,2,3] 
 lst2.extend(["qiwsir","github"]) 
 lst2 [1, 2, 3, 'qiwsir', 'github']       #extend的结果 
 len(lst2) 5
```

`count(el)`

统计列表中某个元素出现的次数

`index(el)`

返回给定元素在该列表中首次出现的位置

`insert(index, el)`

将 el 插入列表中索引为 index 的位置

`remove(el)`

移除列表中首次出现的 el 元素，如果不存在就会抛出异常，所以删除之前最好判断一下 `el in someList` 是否为 `True`

`pop([index])`

如果不写参数， 那么就是移除最后一个元素， 如果给参数， 那么就是移除参数指定位置的元素

`revese()`

将列表元素位置反转

`sort(key=None, reverse=False)`

对列表进行排序， 还可以使用 `sorted(someList[, key=fnComputeKey])`

如果传入 参数 key， 那么参数 key 返回的值用于排序。

```py
someList.sort(reverse=True)  # 默认从小到大， reverse 为 True 则从大到小
```

[排序相关知识](https://wiki.python.org/moin/HowTo/Sorting?highlight=%28SORT%29)

#### 元祖

一般认为元组有这些特点，并且也是它使用的情景：

- 元组比列表操作速度快。如果定义了一个值的常量集，并且唯一要 用它做的是不断地遍历（遍历是一种操作，读者可以看后面的for循 环）它，请使用元组代替列表。
- 如果对不需要修改的数据进行“写保护”，可以使代码更安全，这时使用元组而不是列表。如果必须要改变这些值，则需要执行元组到 列表的转换。 
- **元组可以在字典（另外一种对象类型，请参考后面的内容）中被用 作key，但是列表不行。因为字典的 key 必须是不可变的，元组本身 是不可改变的**。 
- 元组可以用在字符串格式化中。