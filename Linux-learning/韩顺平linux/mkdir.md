# 创建目录
mkdir mydir  
mkdir /tmp/log  # 在tmp下创建目录
mkdir mydir /tmp/log  # 创建多个目录
# 如果上级目录不存在，默认会报错，如果需要创建每一级目录，-p
mkdir -p /tmp/log
