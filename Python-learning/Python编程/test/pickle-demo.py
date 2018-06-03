# from data import db
# import pickle

# with open('people-pickle', 'bw') as f:
#     pickle.dump(db, f)

# with open('people-pickle', 'rb') as f:
#     data = pickle.load(f)
#     for key in data:
#         print(key, data[key])

# import glob

# for filename in glob.glob('*.py'):
#     print(filename)

# 使用 shelve
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