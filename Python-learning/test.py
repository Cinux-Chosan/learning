#!/usr/bin/env python
#coding:utf-8
from random import random
from math import floor
firstNums = list(range(1, 34))
all = [firstNums.pop(floor(random() * len(firstNums))) for tmp in range(6)]
all.sort()
all.append(1 + floor(random() * 16))
print(all)