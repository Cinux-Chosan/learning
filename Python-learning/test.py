import sys

sys.stdout = open('./test.md', '+w')

print('# Python')

sys.stdout.close()