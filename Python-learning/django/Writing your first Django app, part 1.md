# django

## Writing your first Django app, part 1

- 确认是否安装了 django:

```sh
python -m django --version
```

- 创建 Django 项目:

```sh
django-admin startproject mysite # 以 mysite 为例
```

创建好过后, 目录结构:

      mysite/  # 项目根目录, 即项目的容器, 只是用来装项目代码的, 想要什么名字随便改
          manage.py  # 用它来与 Django 进行交互的命令行工具
          mysite/  # 一个 python package, 它的名字就是这个 package 的名字, 用来引用它里面的模块
              __init__.py  # 空文件, 用来告诉 python 这个目录是一个 package
              settings.py  # Django 项目配置文件
              urls.py  # 声明 Django 项目的 url 映射
              wsgi.py  # 兼容 WSGI 服务器的入口

- 运行项目

```sh
python manage.py runserver  # 启动过后, 访问  http://127.0.0.1:8000/ 查看
```

忽略这个警告:

      You have unapplied migrations; your app may not work properly until they are applied.
      Run 'python manage.py migrate' to apply them.

**注意, 这个服务器主要是用于测试环境进行开发测试的, 千万千万不要用于生产环境, 生产环境应该使用 Apache, Nginx 等服务器, Django 主要是开发 web 框架, 而非 web 服务器软件**


如果需要使用其他端口号:

```sh
python manage.py runserver 8080
```

如果需要绑定到其他 ip, 可以把它和端口号一起作为参数:

```sh
python manage.py runserver 0:8000  # 0 是 0.0.0.0 的缩写, 它可以绑定到当前主机的任意 ip (每个主机可能有多个 ip)
```

该服务器会在修改项目代码过后自动重启!

- 在项目内创建我们的应用, 如 poll 应用:

Django 中的每个应用都是一个 python package, Django 提供了自动生成 app 目录结构的工具.

      项目和应用(Projects vs. apps)
      项目和应用的区别在哪儿?
      应用此处特指 web 应用, 指一个做一些类似于下面事情的 web 应用程序 : 博客系统, 投票程序.
      项目是一系列的配置和应用的集合
      一个项目可以包含多个应用, 一个应用可以属于多个项目

你的应用可以在 python 模块搜索目录中的任意一个中, 不过我们应该将它放到项目容器中, 这样方便代码的编写和维护. 在此处, 我们将 poll 应用放到 `manage.py` 同级目录中, 这样它就能当做项目的顶级目录而非 mysite(新建的 Django 项目名) 项目的子目录

执行创建代码:

```sh
python manage.py startapp polls
```

生成如下目录结构:

      polls/
          __init__.py
          admin.py
          apps.py
          migrations/
              __init__.py
          models.py
          tests.py
          views.py

这个目录就是管理 poll 应用的目录.

- 编写视图

```py
# polls/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")
```

如果需要调用该视图, 需要把它映射到一个 URL 上, 此时就需要一个 URLconf

在 poll 目录中创建一个 `urls.py`, 现在目录结构是这样:

      polls/
          __init__.py
          admin.py
          apps.py
          migrations/
              __init__.py
          models.py
          tests.py
          urls.py
          views.py

`urls.py`:

```py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
```

下一步就是要在根 URLconf 中配置指向 `polls.urls` 模块的 URLconf. 在外层目录的 `mysite/urls.py` 中, 引入 `django.urls.include`, 使用该 include 方法在 urlpatterns 列表中插入一条指向其他 URLconf 的记录:

```py
# mysite/urls.py
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),
]
```

`include()` 函数能够然你引用其他的 URLconf, 每次遇到 `include()` 的时候, 它就将 URL 划分开, 将匹配的那一段传入指定的 URLconf 中做进一步处理.

`include()` 的目的是使得 URL 映射更加简单和适配性更好, 因为在 polls 中自己管理自己的 URLconf, 那么它既可以把代码放到 “/polls/” 中, 也可以放到 “/fun_polls/”, 或者 under “/content/polls/”, 程序都能运行

- `path()` 方法接收四个参数, `route` 和 `view` 是必须的, `kwargs` 和 `name` 是可选的:
  - route: route 是一个包含 URL 模式的字符串, 处理请求的时候, Django 会从 `urlpatterns` 的第一项开始往下查找, 直到找到一个匹配的 url 模式(该模式不包括 url 中的域名和参数)
  - view: 当 Django 找到一个匹配的模式, 它就使用 `HttpRequest` 对象作为第一个参数调用指定的方法, 并捕获 route 中的值
  - kwargs: 传递到视图中的字典参数
  - name: 给 URL 命名, 这样你就可以在其他地方引用这个 url 了, 尤其是在模板中。这个强大的特性允许你在只"触摸"单个文件的情况下对项目的URL模式进行全局更改
