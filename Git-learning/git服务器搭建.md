# CentOS


- 首先需要安装Git，可以使用yum源在线安装：
> yum install -y git

- 创建一个git用户，用来运行git服务
> adduser root   // 用户名，用于登陆

- 初始化git仓库：这里我们选择/data/git/learngit.git来作为我们的git仓库
> git init --bare learngit.git    // 使用 git init即可
>> 执行以上命令，会创建一个裸仓库，裸仓库没有工作区，因为服务器上的Git仓库纯粹是为了共享，所以不让用户直接登录到服务器上去改工作区，并且服务器上的Git仓库通常都以.git结尾。然后，把owner改为git：
>>> chown root:root learngit.git    //  第一个root为用户组，第二个root为用户名

- 在这里，Git服务器就已经搭得差不多了。下面我们在客户端clone一下远程仓库
> git clone root@192.168.8.34:/data/git/learngit.git

- 创建SSH Key
> 首先在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有id_rsa和id_rsa.pub这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：
>> ssh-keygen -t rsa -C "youremail@example.com"  

- Git服务器打开RSA认证
> 然后就可以去Git服务器上添加你的公钥用来验证你的信息了。在Git服务器上首先需要将/etc/ssh/sshd_config中将RSA认证打开，即：
>> 1.RSAAuthentication yes     

>> 2.PubkeyAuthentication yes     

>> 3.AuthorizedKeysFile  .ssh/authorized_keys

>>> 这里我们可以看到公钥存放在.ssh/authorized_keys文件中。所以我们在/home/git下创建.ssh目录，然后创建authorized_keys文件，并将刚生成的公钥导入进去。每个公钥占一行

- 禁用git用户的shell登陆
> 出于安全考虑，第二步创建的git用户不允许登录shell，这可以通过编辑/etc/passwd文件完成。找到类似下面的一行：
>> git:x:1001:1001:,,,:/home/git:/bin/bash  

> 最后一个冒号后改为：
>> git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell  
> 这样，git用户可以正常通过ssh使用git，但无法登录shell，因为我们为git用户指定的git-shell每次一登录就自动退出。
