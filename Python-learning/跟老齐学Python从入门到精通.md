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

### 元祖

一般认为元组有这些特点，并且也是它使用的情景：

- 元组比列表操作速度快。如果定义了一个值的常量集，并且唯一要 用它做的是不断地遍历（遍历是一种操作，读者可以看后面的for循 环）它，请使用元组代替列表。
- 如果对不需要修改的数据进行“写保护”，可以使代码更安全，这时使用元组而不是列表。如果必须要改变这些值，则需要执行元组到 列表的转换。 
- **元组可以在字典（另外一种对象类型，请参考后面的内容）中被用 作key，但是列表不行。因为字典的 key 必须是不可变的，元组本身 是不可改变的**。 
- 元组可以用在字符串格式化中。


### 字典

#### 创建字典


```py
# 方法 1
person = {"name":"qiwsir", "site":"qiwsir.github.io", "language":"python"}

# 方法 2
name = (["first", "Google"], ["second", "Yahoo"])
website = dict(name) # {'second': 'Yahoo', 'first': 'Google'}
# 或者
ad = dict(name="qiwsir", age=42) # {'age': 42, 'name': 'qiwsir'}

# 方法 3

website = {}.fromkeys(("third","forth"),"facebook") # {'forth': 'facebook', 'third': 'facebook'}
```

#### 字典的基本操作

- `len（d）`，返回字典（d）中的键值对的数量。 
- `d[key]`，返回字典（d）中的键（key）的值。 
- `d[key]=value`，将值（value）赋给字典（d）中的键（key）。 
- `del d[key]`，删除字典（d）的键（key）项（将该键值对删除）。 
- `key in d`，检查字典（d）中是否含有键为key的项

#### 字符串格式化输出

```py
city_code = {"suzhou":"0512", "tangshan":"0315", "hangzhou":"0571"}
" Suzhou is a beautiful city, its area code is %(suzhou)s" % city_code # ' Suzhou is a beautiful city, its area code is 0512'
```

#### 字典的函数

- `copy` 和 `deepcopy``：copy` 会复制一份新的字典出来， 但是其中的引用值不会被复制，修改引用值的时候会影响到其原字典中的值， `deepcopy` 会将引用值也拷贝一份

```py
# 使用引用值， 需要import copy模块
import copy
z = copy.deepcopy(x)
```

- `clear`：清空字典中所有元素

- `get` 和 `setdefault`：
  - 使用 `get` 比直接使用下标访问更加靠谱， 如果元素不存在， 下标会报错， 而 `get` 会返回`None`，除此之外， get的第二个参数还可以设置如果不存在时返回的默认值。
  - `setdefault` 是先要执行 D.get（k，d）操作， 就跟前面一样，如果键 k 不在字典中，就返回默认值 d，然后在字典中增加这个键值对

- `items/iteritems`，`keys/iterkeys`，`values/itervalues`

```py
dd = {"name":"qiwsir", "lang":"python", "web":"www.itdiffer.com"}
dd_kv = dd.items() # [('lang', 'python'), ('web', 'www.itdiffer.com'), ('name', 'qiwsir')]
dd_iter = dd.iteritems()
list(dd_iter) # [('lang', 'python'), ('web', 'www.itdiffer.com'), ('name', 'qiwsir')]
```

- `pop` 和 `popitem`
  - `D.pop（k[，d]）`：删除元素 k，如果不存在并且指定了 d 作为默认值， 则返回 d，否则报错
  - `D.popitem()` 不是删除最后一个，dict 没有顺序，也就没有最后和最先了，它是随机删除一个，并将所删除的元素返回

- `update`：合并

```py
d2 {'song': 'I dreamed a dream'}
d2.update([("name","qiwsir"), ("web","itdiffer.com")])
d2 {'web': 'itdiffer.com', 'name': 'qiwsir', 'song': 'I dreamed a dream'}
```

- `has_key`：判断字典中是否存在某个键

### 集合

集合类似于 list 和 dict 的杂合。

集合中无重复元素，并且无序，不能通过数字索引进行访问。

创建集合可以使用 `{el1, el2, ...}` 或者 `set()`，不过需要注意的是， 使用 `{}` 这种可能不小心会创建成 dict，创建集合的元素必须是不可变的

可以使用 `list()` 和 `set()` 在列表和集合之间进行转换。

- add和update

- pop，remove，discard，clear
  - `pop()` 是从集合中随机选一个元素删除并将这个值返回，但是不 能指定删除某个元素
  - `remove()` 删除指定元素， 如果不存在则抛出异常
  - `discard()` 删除指定元素， 如果不存在则不做任何操作
  - `clear()` 清空

#### 不可变集合 `frozenset()`

#### 集合的运算

- 元素与集合的关系：使用 `in`
- 集合与集合的关系：
  - （1）A是否等于B，即两个集合的元素是否完全一样，使用 `A == B`
  - （2）A是否是B的子集，或者反过来，B是否是A的超集，即A的元 素是否也都是B的元素，且B的元素比A的元素数量多。
    - 判断集合A是否是集合B的子集，可以使用 `A < B`，返回 True 则是子 集，否则不是。另外，还可以使用函数 `A.issubset（B）` 判断。
  - （3）A、B的并集，即 A、B 所有元素
    - `A | B` 也可使用函数 `A.union（B）`
  - （4）A、B的交集，即A、B所公有的元素
    - `A & B` 也可使用函数 `A.intersection(B)`
  - （5）A相对B的差（补），即A相对B不同的部分元素
    - `A - B` 也可使用函数 A.difference(B)
  - （6）A、B的对称差集，即 `(A - B) | (B - A)`，与交集相反
    - `A.symmetric_difference(B)`

## 语句

### import

```py
# 方法 1
import math
# 方法 2
form math import pow, pi
# 方法 3
from math import *
```

### 三元表达式

`Y if X else Z`

- 如果 X 为真，那么就返回 Y，否则返回 Z。

### 方法

- `range（start，stop[，step]）`
- `zip(sequence1, sequence2[, ...])`：参数为多个序列， 返回一个序列，其中每个元素都包含参数中的所有序列对应索引上的值的元祖，返会的列表长度等于最小序列的长度

```py
c = [1,2,3] 
d = [9,8,7,6] 
zip(c,d) # [(1, 9), (2, 8), (3, 7)]
```

### 循环
`for ... else ...` 和 `while ... else ...`
```py
for el in someList:
  # do something
  pass
else:
  # do something else
  pass
```

```py
while isTruthy:
  # do something
  pass
else:
  # do something else
  pass
```

## 文件

- 读取

```py
f = open('./test.py', 'r')  # r 为默认模式，即只读
for line in f:
    print(line, end="")
f.close()  # 不要忘记关闭文件描述符
```

### with 

```py
with open("test.py","r") as f:
    print f.read()
```

### 状态

```py
import os
file_stat = os.stat("test.py")   # 查看这个文件的状态 
```

```py
import os
import time
print(time.localtime(os.stat('test.py').st_atime))
```

### read/readline/readlines

- read([size])
- readline([size])
- readlines([size])：读取出来是包含每一行的数组 

读大文件：可以使用循环和 realine 配合来完成， 也可以使用 fileinput 模块：

```py
import fileinput
for line in fileinput.input("test.py"):
    pass
```

### seek() 移动文件指针

`seek（offset[，whence]）`

whence的值： 

- `0`，默认值，表示从文件开头开始计算指针偏移的量。这时offset必须是大于等于 0 的整数。 
- `1`，表示从当前位置开始计算偏移量。offset如果是负数，则表 示从当前位置向前移动，整数表示向后移动。 
- `2`，表示相对文件末尾移动。

### 迭代

- `iter() ... next()`
  - `iter()`：参数需要是一个符合迭代协议的对象或者是一个序列对象， 返回值是一个迭代器对象。与`next()`配合使用

文件操作中， `open()` 得到的就是一个迭代器，可以直接通过迭代器的 `next()` 获取文件内容。python3中迭代器没有 `next()` 方法， 需要使用 python 内置的 `next(someIterator)`


```py
# 快速获取文件内容组成列表（仅供参考）：
list(open('test.py')
[ line for line in open('208.txt') ]
open('test.py').readlines()
```

## 函数

- lambda：`lambda arg1, arg2, ...argN : expression using arguments`
  - lambda x, y: x + y
- map：`map（function，iterable，...）`
  - 如果参数很多，则对那些参数并行执行function。

```py
lst1 = [1,2,3,4,5] 
lst2 = [6,7,8,9,0] 
map(lambda x, y: x+y, lst1, lst2)   #  [7, 9, 11, 13, 5]
```

- reduce：`reduce（function，iterable[，initializer]）`：Python 3中，reduce()已经从全局命名空间中移除，放到了functools模块 中，如果要是用，需要用from functools import reduce引入之。
- filter：`filter（function，iterable）`

# 类

- 第一种定义方法：

```py
class BB(object): 
    pass 
```

- 第二种定义方法，在类的前面写上：`__metaclass__==type`，然后定 义类的时候，就不需要在名字后面写（object）了

```py
__metaclass__ = type
class CC:
    pass
cc = CC()
cc.__class__ # <class '__main__.CC'>
type(cc) # <class '__main__.CC'>
```

**类暂时略过！**


# 异常

```py
try:    
    do something 
except:    
    do something 
else:    
    do something
finally:    
    do something
```

## assert语句

- 简单说就是断定什么东西必然是什么，如果不是，就抛出错误。

```py
assert 1==1 
assert 1==0 # Traceback (most recent call last):  File "<stdin>", line 1, in <module> AssertionError
```

这就是断言assert的作用。什么是使用断言的最佳时机？
如果没有特别的目的，断言应该用于如下情况： 

- 防御性的编程。 
- 运行时对程序逻辑的检测。 
- 合约性检查（比如前置条件，后置条件）。 
- 程序中的常量。 检查文档。
