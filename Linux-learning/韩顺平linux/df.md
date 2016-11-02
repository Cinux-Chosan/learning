# 查看文件与哪个分区有关联，df(即 disk free)
df /boot/        # 显示boot目录与分区的关联和使用情况 -h 显示人类可识别大小，即用 G 表示磁盘空间大小

# 查看df -i
df -i record.txt   # 查看该文件的 inode 信息而非 块使用情况


# du(即 disk usage) 查看特定目录空间的使用情况
du /etc
