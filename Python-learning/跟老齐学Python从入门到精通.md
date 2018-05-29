# Python

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

## 类

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

## 异常

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

```py
import sys

try:
  sys.exit(0) # sys.exit 会抛出 SystemExit 异常, 0 表示异常退出, 也可以使用字符串代表错误消息
except SystemExit as e:
  print('SystemExit:', e)
else:
  print('没有异常')
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

## 模块

### 引用模块

```py
import moduleName
# 如果模块太长， 希望简写
import someLongModule as m
```


如果是使用自定义模块, 需要指定引入路径:

```py
import sys
sys.path.append('/Users/zhangjianjun/Desktop/learning/Python-learning/libs'); # 指定模块所在目录
import mymod
```

如果不通过 `sys` 指定路径， 也可以放在 `sys.path` 中的某个目录中， 或者通过指定 `PYTHONPATH` 环境变量。

如果模块是被当做 python 程序直接执行, 此时 `__name__` 变量的值为 `'__main__'`, 如果是当做模块引入, 则此时 `__name__` 就是该模块的名字

### __all__

在模块中， 以单 `_` 开头的变量和方法为私有变量和方法， 不能直接引用。 通过 `from someModule import *` 的方式也不能引用它们， 但是可以通过 `import someModule` 然后使用模块名 `someModule._somePrivateProperty` 引用。

此时可以指定一个 `__all__` 变量， 如：

`__all__ = ['_private_variable', 'public_teacher']`

此时，整个模块就有且仅有这两个变量可以对外访问， 其它变量都将不可在外部访问。

事实上，当我们使用 `from pprint import *`的时候，就是将 `__all__` 里面的 方法引入，如果没有这个，就会将其他所有属性、方法等引入，包括那 些以双画线或者单画线开头的变量、函数，事实上这些东西很少在引入 模块时被使用。


### 包和库

包的概念比模块更大， 库的概念比包更大， 即库可能包含很多包， 包可能包含很多模块。

既然同一个包有多个模块，那么如何引用该目录中的模块？。解决方法就是在该目录中放一个空的 `__init__.py` 文件。 例如，建立一个目录，名曰：`package_qi`，里面依次放了`pm.py`和 `pp.py`两个文件，然后建立一个空文件`__init__.py` 接下来，需要导入这个包（package_qi）中的模块：

```py
import package_qi.pm
package_qi.pm.lang() # 'python'
```
但是更简便的方法是：

```py
from package_qi import pm
pm.lang() # 'python'
```

### 模块文档，源码

在模块文件的开始部分，在所有类、方法和import之前，写一个用三个引号（`'''` ）包裹的字符串，这就是文档

通过模块的 `someModule.__doc__` 可以查看文档
通过模块的 `someModule.__file__` 可以查看模块的位置，由此可以查看模块的源代码


### 第三方库

#### 安装

- 方法一：利用源码安装

一般从 github 或其他地方得到的源码里面， 会包含 `setup.py` 文件， 通过执行 `python setup.py install` 安装

- 方法二：pip安装

有一个网站专门用来存储第三方库，在这个网站上的所有软件包， 都能用`pip`或者`easy_install`这种安装工具来安装，网站的地址： https://pypi.python.org/pypi。

使用 `pip install someLibName` 安装第三方库。


## 标准库

### sys

- sys.argv
- sys.path
- sys.exit()
- sys.stdin, sys.stdout, sys.stderr

```py
import sys
sys.stdout = open('./test.md', '+w') # 将输出转到文件 test.md 中
print('# Python')
sys.stdout.close()
```

### copy

```py
import copy
copy.__all__ # ['Error', 'copy', 'deepcopy']
```

### os

- 操作文件: 重命名, 删除文件

```py
import os
os.rename('sorceFile', 'destFile') # 可用于目录
os.remove('pathToFile') # 同 unlink
```

- 操作目录

```py
import os

os.listdir('path') # 显示目录中的文件
os.getcwd() # 得到当前工作目录
os.chdir(os.pardir) # 改变当前工作目录, os.pardir 为父级目录, 即'..'
os.makedirs() # 创建目录, 相当于 mkdir -p , 即递归
os.removedirs() # 删除目录, 递归, 删除时需要目录为空, 可以使用 shutil 的 retree, 不为空时也可删除

import shutil
shutil.rmtree('path')

os.mkdir() # 创建一个, 不递归
os.rmdir() # 删除一个, 不递归
```

- 文件和目录属性

```py
import os
import time
st = os.stat('path') #
time.ctime(st[8]) # st[8] 为 st_mtime, 即最后修改时间, 显示 'Mon May 28 13:07:07 2018'
```

- 执行命令

```py
import os
os.system('ls /') # 执行 'ls /' 命令
os.system('/usr/bin/firefox') # 打开 firefox , 不过可能由于系统不同和路径不同, 导致执行失败, 但是有一个 webbrowser 模块专门可以做这件事
import webbrowser
webbrowser.open('http://www.chosan.cn')
```

### heapq

heap 即堆, q 是 queue

使用堆时, 添加和删除它都会自动排序, 相关内容自行了解

### `deque`

`deque` 即 dbouble-ended-queue, 双端队列

python 中, 普通的 list 没有像 JavaScript 中的 `shift` 函数.

此时就可以使用 `deque` 模块

```py
# 常规方法
L.pop(0) # 代替shift
L.insert(0, value) #代替unshift

# unsift还可以使用下面的方式
L = [value1, value2] + L
# 或
T = [value1,value2] # 这种列表运算可能性能上会有牺牲
T.extend[L]
L = T
```

```py
from collections import deque
lst = [1, 2, 3]
qlst = deque(lst)
qlst.append(5) # 从右边添加
qlst.appendleft(7) # 从左边添加
qlst.pop() # 5
qlst.popLeft() # 7
qlst.remove(3) # 删除列表中的 3
qlst.rotate(-1) # 假想将列表首尾连接, 形成一个圆环, 一开始指针在 0 的位置, rotate(n) 表示将指针向左移动 3 (相当于圆环顺时针转 3), 为负则向右移动(圆环逆时针转), 由于首尾相连, 所以超出左右边界会自动从另一端算起
```

### calendar

```py
import calendar
calendar.isleap(year) # 判断某年是否是闰年
calendar.leapdays(yearStart, yearEnd) # 返回从 yearStart 到 yearEnd 的闰年总数, 包括 yearStart 不包括 yearEnd
calendar.monthcalendar(year, month) # 返回一个嵌套列表, 每个二级列表代表一个星期, 如果二级列表中没有本月日期则为 0 (可能该星期跨月了)
calendar.monthrange(year, month) # 返回一个元祖, 里面有两个整数, 第一个整数为该月第一天从周几开始(0 - 6), 第二个数代表该月有多少天
calendar.weekday(year, month, day) # 根据年月日获取该日期为星期几, 0 - 6
```

### time

```py
import time
time.time() # 获取当前时间戳
time.localtime() # 得到的结果为时间元祖, 默认参数为 time.time()
# time.struct_time(tm_year=2018, tm_mon=5, tm_mday=29, tm_hour=17, tm_min=59, tm_sec=1, tm_wday=1, tm_yday=149, tm_isdst=0), 依次为 (年, 月, 日, 时, 分, 秒, 一周中第几天, 一年中第几天, 夏令时)
time.gmtime() # 类似 localtime, 得到的时间是本地时间, 如果需要国际化, 最好使用格林威治时间
time.asctime() # 参数格式必须为时间元祖, 默认参数是 time.localtime() 的值, 得到的是当前日期时间和星期
time.ctime() # 默认参数是 time.time(), 跟 asctime 相同, 只不过参数是时间戳
time.mktime() # 参数为时间元祖, 将时间元祖转换为时间戳, 类似于 localtime() 的逆过程
time.strftime() # 将时间元祖按照指定格式转换为字符串, 默认取 localtime(), format 格式参照网络表格
# 例如:
time.strftime('%y/%m/%d') # '18/05/29'
time.strptime() # 将字符串转换为时间元祖
# 例如:
time.strptime(time.strftime('%y/%m/%d'), '%y/%m/%d') # time.struct_time(tm_year=2018, tm_mon=5, tm_mday=29, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=1, tm_yday=149, tm_isdst=-1)
```

### datetime

datetime 中有如下几个类:

- datetime.date: 日期类, 常用属性有 year/month/day
- datetime.time: 时间类, 常用有 hour/minute/second/microsecond
- datetime.datetime: 日期时间类
- datetime.timedelta: 时间间隔, 即两个时间点之间的时间长度
- datetime.tzinfo: 时区类

#### date 类

```py
import datetime
today = datetime.date.today() # datetime.date(2018, 5, 29)
print(today) # 2018-05-29
print(today.ctime()) # Tue May 29 00:00:00 2018
print(today.timetuple()) # time.struct_time(tm_year=2018, tm_mon=5, tm_mday=29, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=1, tm_yday=149, tm_isdst=-1)
today.year # 2018
today.month # 5
today.day # 29
to = today.toordinal() # 736843
print(datetime.date.fromordinal(to)) # 2018-05-29
import time
print(datetime.date.fromtimestamp(time.time())) # 2018-05-29

d1 = datetime.date(2018, 3, 1)
print(d1) # 2018-03-01

d2 = d1.replace(year= 2009, day=29)
print(d2) # 2009-03-29
```

#### time 类

```py
t = datetime.time(1,2,3) # datetime.time(1, 2, 3)
print(t) # 01:02:03
t.hour # 1
t.minute # 2
t.second # 3
t.microsecond # 0
t.tzinfo # None
```

#### timedelta 类

主要用来做时间运算

```py
import datetime
now = datetime.datetime.now()
after5Hours = now + datetime.timedelta(hours=5)
after2Weeks = now + datetime.timedelta(weeks=2)
timeDelta = after2Weeks - after5Hours
print(now) # 2018-05-29 19:12:10.082722
print(after5Hours) # 2018-05-30 00:12:10.082722
print(after2Weeks) # 2018-06-12 19:12:10.082722
print(after2Weeks - after5Hours) # 13 days, 19:00:00
```

### urllib

urllib 用户读取互联网数据。

- urlopen（url，data=None，proxies=None）
  - url：即需要访问的 url 地址
  - data：需要post的数据
  - proxies：设置代理

```py
import urllib.request # python2 中为 urllib
# 使用 urlopen打开网络文件，就像 open 打开本地文件一样
req = urllib.request.urlopen('http://chosan.cn')
print(req.read())
```

- read()、readline()、readlines()、fileno()、close()：都与文件操作一 样，这里不再赘述。
- info()：返回头信息。 
- getcode()：返回http状态码。 
- geturl()：返回url。

#### 对 url 编码、解码

python3 中， 部分方法在 urllib.parse 中：

```py
import urllib.parse
urllib.parse.__all__ # ['urlparse', 'urlunparse', 'urljoin', 'urldefrag', 'urlsplit', 'urlunsplit', 'urlencode', 'parse_qs', 'parse_qsl', 'quote', 'quote_plus', 'quote_from_bytes', 'unquote', 'unquote_plus', 'unquote_to_bytes', 'DefragResult', 'ParseResult', 'SplitResult', 'DefragResultBytes', 'ParseResultBytes', 'SplitResultBytes']
```

- quote（string[，safe]）：对字符串进行编码。参数 safe 指定了不需 要编码的字符。
- unquote（string）：对字符串进行解码。 
- quote_plus（string[，safe]）：与 `urllib.request.quote` 类似，但这个方法 用 `+` 来替换空格，而 `quote` 用 `%20` 来代替空格。 在python3 的 urllib.request 中无此项
- unquote_plus（string）：对字符串进行解码。 在python3 的 urllib.request 中无此项
- urlencode（query[，doseq]）：将 dict 或者包含两个元素的元组 列表转换成 url 参数。例如 `{'name':'laoqi'，'age':40}` 将被转换 为`name=laoqi&age=40`。 
- pathname2url（path）：将本地路径转换成url路径。
- url2pathname（path）：将url路径转换成本地路径。

```py
import urllib.request
du = "http://www.itdiffer.com/name=python book" 
urllib.request.quote(du) # 'http%3A//www.itdiffer.com/name%3Dpython%20book'
urllib.request.
```

虽然 urlopen()能够建立类文件对象，但是，不等于将远程文件保存在本地存储器中，urlretrieve()就是满足这个需要的。先看实例

- urlretrieve(url[, filename[, reporthook[, data]]])
  - url：文件所在的网址。
  - filename：可选。将文件保存到本地的文件名，如果不指定，urllib 会生成一个临时文件来保存。
  - reporthook：可选。是回调函数，当链接服务器和相应数据传输完 毕时触发本函数。 
  - data：可选。用post方式所发出的数据。

函数执行完毕，返回的结果是一个元组 `（filename，headers）`， filename是保存到本地的文件名，headers 是服务器响应头信息。

```py
import urllib.request
# me.jpg是一张存在于服务器上的图片，地址是： http://www.itdiffer.com/images/me.jpg，把它保存到本地存储器中，并且 仍命名为me.jpg。注意，如果只写这个名字，表示存在启动Python交互 模式的那个目录中，否则，可以指定存储具体目录和文件名。
urllib.request.urlretrieve("http://www.itdiffer.com/images/me.jpg","me.jpg")
```

#### urllib2

urllib2是另外一个模块，它跟urllib有相似的地方——都是对url相关 的操作，也有不同的地方。

利用urllib2模块可以建立一个 Request对象，建立Request对象的方法就是使用Request类。

```py
req = urllib2.Request("http://www.itdiffer.com")
response = urllib2.urlopen(req) 
page = response.read()
```

```py
import urllib.parse
import urllib2
url = 'http://www.itdiffer.com/register.py'
values = {'name' : 'qiwsir', 'location' : 'China', 'language' : 'Python' }
data = urllib.parse.urlencode(values)
req = urllib2.Request(url, data)       # 发送请求同时传data表单
response = urllib2.urlopen(req)        # 接受反馈的信息
the_page = response.read()           　# 读取反馈的内容
```

通过 Request 对象， 可以添加 headers 等， 在网站中，有的会通过User-Agent来判断访问者是浏览器还是别的 程序，如果通过别的程序访问，它有可能拒绝。这时候我们编写程序去 访问，就要设置headers了。设置方法是：


```py
headers = { 'User-Agent' : 'Mozilla/4.0 (compatible; MSIE 5.5; Windows NT)' }
req = urllib2.Request(url, data, headers)
response = urllib2.urlopen(req)
```

建立了Request对象之后，它的最直接应用可以作为urlopen()方法的 参数。

除了上面的演示之外，urllib2模块的东西还有很多，比如还可以：

- 设置HTTP Proxy
- 设置Timeout值
- 自动redirect
- 处理cookie

### JSON

- 基本操作

```py
import json
json.__all__ # ['dump', 'dumps', 'load', 'loads', 'JSONDecoder', 'JSONDecodeError', 'JSONEncoder']

data = [{"name":"qiwsir", "lang":("python", "english"), "age":40}] 

# json 序列化
# dumps 提供了可选参数， sort_keys=True 时按照字典排序, indent 指定缩进
# 元祖变为了列表
jsonData = json.dumps(data) # '[{"name": "qiwsir", "lang": ["python", "english"], "age": 40}]'

# json 反序列化
# 列表还是列表
json.loads(jsonData) # [{'name': 'qiwsir', 'lang': ['python', 'english'], 'age': 40}]
```

- 大JSON字符串

如果数据不是很大，那么上面的操作足够了，但现在是“大数据”时 代了，随便一个什么业务都在说自己是大数据，显然不能总让JSON很 小。前面的操作方法是将数据都读入内存，如果数据量太大了内存会爆 满，这肯定是不行的。怎么办？JSON提供了load()函数和dump()函数解 决这个问题，注意，跟已经用过的函数相比是不同的，请仔细观察。

```py
import tempfile        #临时文件模块
data = [{"name":"qiwsir", "lang":("python", "english"), "age":40}]
f = tempfile.NamedTemporaryFile(mode='w+')
json.dump(data, f)
f.flush()
print(open(f.name, "r").read()) # [{"lang": ["python", "english"], "age": 40, "name": "qiwsir"}]
```