
## 3 使用 Docker 镜像

### 3.1 获取镜像

`docker [image] pull NAME[:TAG]`

- NAME: 镜像仓库名称
- TAG: 镜像标签，默认使用 latest

如: `docker pull ubuntu:18.04`

镜像下载到本地之后就可以使用该镜像了，例如使用该镜像创建一个容器，在其中运行 bash 并输入 "Hello World" 命令:

`docker run -it unbuntu:18.04 bash` 运行并进入到 docker 镜像，然后执行 `echo "Hello World"` 即可，最后 `exit` 退出镜像。

### 3.2 查看镜像信息

#### 使用 images 列出镜像

- `docker images` 或者 `docker images ls`

#### 使用 tag 命令添加镜像标签

为了方便在后续工作中使用特定镜像，还可以使用 `docker tag` 命令来为本地镜像任意添加新的标签。例如，添加一个新的myubuntu:latest镜像标签：

`docker tag ubuntu:latest myubuntu:latest`

#### 使用 inspect 命令查看详细信息

`docker [image] inspect ubuntu:18.04`

#### 使用 history 命令查看镜像历史

`docker history ubuntu:18.04`

过长的命令会被自动截断，使用 `--no-trunc` 选项来输出完整命令。

### 3.3 搜寻镜像

`docker search [option] keyword`

- `-f` 过滤
- `--format string`: 格式化输出内容
- `--limit int`: 限制输出结果个数，默认为 25 个
- `--no-trunc`: 不截断输出结果

如搜索官方带 nginx 关键字的镜像: `docker search --filter=is-official=true nginx`

如搜索所有收藏数超过 4 的关键词包括 tensorflow 的镜像:`docker search --filter=stars=4 tensorflow`

### 3.4 删除和清理镜像

#### 删除镜像

- 使用标签删除: `docker rmi` 或者 `docker image rm` 加标签或 ID
  - `-f`: 强制删除镜像，即使有容器依赖它
  - `-no-prune`: 不要清理未带标签的父镜像

例如删除 myubuntu:latest 镜像：`docker rmi myubuntu:latest`

当有容器依赖于镜像时，不推荐使用 `-f` 参数来强制删除。应该先使用 `docker rm ID`删除所有以来的容器，再通过 `docker rmi ID`删除镜像。

`docker ps -a` 可以查看本机上存在的所有容器。


#### 清理镜像

使用Docker一段时间后，系统中可能会遗留一些临时的镜像文件，以及一些没有被使用的镜像，可以通过`docker image prune`命令来进行清理。支持选项包括：
- `-a, -all`：删除所有无用镜像，不光是临时镜像；
- `-filter filter`：只清理符合给定过滤器的镜像； 
- `-f, -force`：强制删除镜像，而不进行提示确认。

如清理临时的遗留镜像文件：`docker image prune -f`

### 3.5 创建镜像

创建镜像的方法主要有 3 种：
- 基于已有镜像创建
- 基于本地模板创建
- 基于 Dockerfile 创建

本节主要介绍 `commit`、`import` 和 `build` 命令。

#### 1. 基于已有容器创建

该方法主要使用 `docker [container] commit` 命令：`docker [container] commit [OPTIONS]CONTAINER [REPOSITORY [:TAG]]`，主要选项包括：

- `-a, --author=""`：作者信息；
- `-c, --change=[]`：提交的时候执行Dockerfile指令，包括`CMD|ENTRYPOINT|ENV|EXPOSE|LABEL|ONBUILD|USER|VOLUME|WORKDIR`等；
- `-m, --message=""`：提交消息；
- `-p, --pause=true`：提交时暂停容器运行。

##### 创建新镜像

- 首先，启动一个镜像，并在其中进行修改

如创建一个 test 文件后退出：

`docker run -it ubuntu:18.04 /bin/bash`

`touch test`

`exit`

假如此时容器 id 为 a925cb40b3f0

此时该容器与原 ubuntu:18.04 镜像相比已经发生了变化，可以使用 `docker [container] commit` 来提交一个新镜像：

`docker [container] commit -m "Added a new file" -a "Docker Newbee" a925cb40b3f0 test:0.1`

如果顺利完成，会得到新创建的镜像 ID，此时通过 `docker images` 查看本地镜像列表发现新创建的镜像已经存在了。

#### 2. 基于本地模板导入

用户也可以直接从一个操作系统模板文件导入一个镜像，主要使用`docker [container] import`命令。命令格式为`docker[image] import [OPTIONS] file|URL|-[REPOSITORY [:TAG]]`

要直接导入一个镜像，可以使用OpenVZ提供的模板来创建，或者用其他已导出的镜像模板来创建。OPENVZ模板的下载地址为http://openvz.org/Download/templates/precreated。例如，下载了ubuntu-18.04的模板压缩包，之后使用以下命令导入即可：

`cat ubuntu-18.04-x86_64-minimal.tar.gz | docker import - ubuntu:18.04`

然后通过 `docker images` 查看新导入的镜像就已经存在了。

#### 3. 基于 Dockerfile 创建

这是最常见的一种方式。Dockerfile 利用给定的指令描述基于某个父镜像创建新镜像的过程。

如基于 debian:stretch-slim镜像安装Python 3环境，构成一个新的python:3镜像：

```dockfile
FROM debian:stretch-slim

LABEL version="1.0" maintainer="docker user <docker_user@github>"

RUN apt-get update && \
    apt-get install -y python3 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

然后通过 `docker [image] build -t python:3 .` 命令编译即可生成一个 python:3 镜像

### 3.6 导出和载入镜像

本节介绍 `save` 和 `load` 命令。

用户可以使用`docker [image] save`和`docker [image] load`命令来存出和载入镜像。

#### 1. 导出镜像

如果要导出镜像到本地，可以使用 `docker [image] save` 命令，支持 `-o`、`-output` 参数来了导出到指定文件中。

例如导出本地的 ubuntu:18.04 镜像为文件 ubuntu_18.04.tar: `docker save -o ubuntu_18.04.tar ubuntu:18.04`

之后就可以通过复制 ubuntu_18.04.tar 文件将该镜像分享给他人。

#### 2. 载入镜像

可以使用 `docker [image] load` 将导出的 tar 文件再导入到本地镜像库。支持 `-i`、`-input` 选项来指定镜像路径。

例如从 ubuntu_18.04.tar 导入镜像到本地镜像列表，如：

`docker load -i ubuntu_18.04.tar` 或者 `docker load < ubuntu_18.04.tar`。

### 3.7 上传镜像

使用 `push` 命令上传镜像到仓库，命令格式为 `docker [image] pushNAME[:TAG] |[REGISTRY_HOST[:REGISTRY_PORT]/]NAME[:TAG]`

例如用户 user 上传本地的 test:latest 镜像，可以先添加新的标签 user/test:latest，然后使用push来上传镜像：

`docker tag test:latest user/test:latest`

`docker push user/test:latest`


## 4. 操作 Docker 容器

简单来说，容器是镜像的一个运行实例。镜像是静态的只读文件，而容器带有运行时需要的可写文件，容器中的应用程序处于运行状态。

本章将介绍如何创建、启动、终止、进入、删除容器以及通过导入、导出老实现容器迁移。

### 4.1 创建容器

本节介绍 `create`、`start`、`run`、`wait` 和 `logs` 命令。

#### 1. 新建容器

`docker [container] create` 创建容器：

`docker create -it ubuntu:latest`

使用 create 创建的容器处于停滞状态，可以使用 `docker [container] start` 来启动。

由于容器是整个 Docker 的核心，因此 create 和 run 等命令支持的选项十分多，具体选项参考官网或《docker 技术入门与实践第三版》4.1 创建容器。

#### 2. 启动容器

使用 `docker start af` 启动刚刚创建的 ubuntu 容器，此时通过 `docker ps` 命令可以查看到一个运行中的容器。

#### 3. 新建并启动容器

除了创建后在通过 start 启动之外，也可以创建并启动。

`docker [container] run` 等价于先 create 然后 start。

例如输出一个 "Hello World" 后终止的命令：

`docker run ubuntu /bin/echo "Hello World"`

其中 Docker 在后台执行的操作包括：

- 检查本地是否存在指定的镜像，不存在就从公有仓库下载；
- 利用镜像创建一个容器，并启动该容器；
- 分配一个文件系统给容器，并在只读的镜像层外面挂载一层可读写层；
- 从宿主主机配置的网桥接口中桥接一个虚拟接口到容器中去；
- 从网桥的地址池配置一个IP地址给容器；
- 执行用户指定的应用程序；
- 执行完毕后容器被自动终止。

例如启动一个 bash 允许用户进行交互：`docker run -it ubuntu:18.04 /bin/bash` 然后就可以进行交互了。

其中 `-t` 选项让 Docker 分配了一个伪终端（pseudo-tty）并绑定到容器的标准输出上。`-i` 则让容器的标准输入保持打开。更多命令参数通过 `man docker-run` 查看。

可以通过 `Ctrl + d` 或者 `exit` 退出容器。

对于所创建的 bash 容器，当用户退出 bash 进程之后容器也会退出。可以使用 `docker container wait CONTAINER [CONTAINER...]` 子命令来等待容器退出。

执行 docker run 的时候可能因为命令无法正常执行而直接报错退出，常见的错误代码：
- 125：参数不支持
- 126：命令无法执行，如权限出错
- 127：容器内命令无法找到

#### 4. 守护态运行

通过 `-d` 参数让容器在后台以守护态运行：

`docker run -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"`

容器启动后会返回一个唯一的 id，也可以通过 docker ps 或者 docker container ls 命令来查看容器信息。

#### 5. 查看容器输出

通过 `docker [container] logs ID` 命令来查看容器的输出内容，支持的选项包括：


- `-details`：打印详细信息；
- `-f, -follow`：持续保持输出；
- `-since string`：输出从某个时间开始的日志；
- `-tail string`：输出最近的若干日志；
- `-t, -timestamps`：显示时间戳信息；
- `-until string`：输出某个时间之前的日志。

