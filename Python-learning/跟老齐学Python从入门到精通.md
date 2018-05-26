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
````

最后，如果用Python3，这种编码的烦恼会少一点。