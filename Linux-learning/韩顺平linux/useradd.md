# 添加用户
useradd username
# 设置或修改密码(如果没有username，就是给当前用户设置密码)
passwd username
# 删除用户(默认不删除用户目录，带-r 参数为删除用户主目录)
userdel [-r] username
# 创建用户，并同时指向用户组
useradd -g groupname username
