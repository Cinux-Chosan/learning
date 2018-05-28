import sys
sys.path.append(".")
import functools
def add(*args):
  return functools.reduce(lambda x,y: x+y, args)
