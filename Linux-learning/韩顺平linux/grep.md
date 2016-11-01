# 在文件中查找

## “grep”源于 ed（Linux的一个行文本编辑器）的 g/re/p 命令，g/re/p 是“globally search for a regular expression and print all lines containing it”的缩写，意思是使用正则表达式进行全局检索，并把匹配的行打印出来。


grep "查询的字符串" filename
# 结果中显示行数(-n)
grep -n  "this" a.java

- -v	反转查询，输出不匹配的行。例如，grep -v "test" demo.txt 将输出不包含"test"的行。
- -n	输出匹配的行以及行号。
- -l	输出匹配的行所在的文件名。
- -c	输出匹配的总行数。
- -i	不区分大小写进行匹配。
