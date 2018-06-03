
# Python 编程

## 第一章： 先睹为快

后面的例子假设当前目录下有一个 `data.py` 文件用来存放有以下记录：

```py
# data.py
zjj = { 'name': 'ZhangJianjun', 'age': 25, 'pay': 3000, 'jod': 'dev' }
wq = { 'name': 'WenQiang', 'age': 26, 'pay': 3200, 'jod': 'dev' }
llj = { 'name': 'LuoLingjia', 'age': 24, 'pay': 3040, 'jod': 'dev' }
db = {}
db['zjj'] = zjj
db['wq'] = wq
db['llj'] = llj
```

- 使用 pickle 序列化数据

```py

from data import db  
import pickle

with open('people-pickle', 'bw') as f:  # 写入数据，需二进制模式
    pickle.dump(db, f)

with open('people-pickle', 'rb') as f:  # 二进制模式读取数据
    data = pickle.load(f)
    for key in data:
        print(key, data[key])
```

- 使用 shelve 序列化数据：比 pickle 更高层次， 可以使用键来访问记录

```py
## 存数据
from data import zjj, wq
import shelve
db = shelve.open('people-shelve')
db['zjj'] = zjj
db['wq'] = wq
db.close()

## 取数据
import shelve
db = shelve.open('people-shelve')
for key in db:
    print(key, db[key])
db.close()
```

- 使用 glob 匹配文件

```py
import glob

for filename in glob.glob('*.py'):
    print(filename)
```