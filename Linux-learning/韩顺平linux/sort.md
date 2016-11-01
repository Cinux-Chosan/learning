# sort 命令在 Linux 中非常有用，它将文件中的各行按字母或数进行排序。sort命令既可以从特定的文件，也可以从stdin获取输入。

对 foot 文件的各行进行排序：
        $sort food
          Afghani Cuisine
          Bangkok Wok
          Big Apple Deli
          Isle of Java
          Mandalay
          Sushi and Sashimi
          Sweet Tooth
          Tio Pepe's Peppers

- -n	按照数字大小排序，例如，10会排在2后面；-n 选项会忽略空格或 tab缩进。
- -r	降序排序。sort 默认是升序排序。
- -f	不区分大小写。
- +x	对第x列（从0开始）进行排序。

# 配合 grep
ls -l | grep "Aug" | sort +4n
上面的命令，对当前目录中八月份修改的文件按照大小排序；+4n 表示对第5列按照数字大小排序。
