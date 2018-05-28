#!/usr/bin/env python 
#coding:utf-8
from random import random 
from math import ceil, floor
firstNums = list(range(1, 34))
all = []
while len(all) < 6:
    all.append(firstNums.pop(floor(random() * len(firstNums))))
all.sort()
all.append(ceil(random() * 33))
','.join([str(x) for x in all])
print(all)