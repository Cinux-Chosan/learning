#!/usr/bin/env python #coding:utf-8

import sys
import pprint
sys.path.append("./libs")
import mymod

print(mymod.add(333, 2))
pprint.pprint(sys.path)