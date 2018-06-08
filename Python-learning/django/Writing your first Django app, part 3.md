# Writing your first Django app, part 3

这部分主要讲解如何创建公共接口: "View" (视图)

## 总览

从某种程度来讲, 视图就是页面, 它通常由一个函数将一个指定的模板转换成前端浏览器能够识别的页面.

在我们的 poll 应用中, 我们有以下四个视图:

- 问题首页 - 显示最新的问题
- 问题详情页 - 显示问题内容和用于投票的表单
- 问题结果页 - 显示某个问题的投票结果
- 投票操作 - 处理每个问题的投票选项

在 Django 中, web 页面和其它内容都通过 views 传递. 每个 view 代表一个普通的 Python 函数. Django 会检查请求的 URL 来选择与之匹配的函数处理该请求.

URL 模式就是常规的 URL 的 path 部分: 例如 `/newsarchive/<year>/<month>/`

为了从 URL 找到对应的视图函数, Django 使用 `URLconfs`, `URLconfs` 将 URL 模式映射到对应的视图.

本文只是介绍 `URLconfs` 的基本使用, 熟悉过后可以通过 [URL dispatcher](https://docs.djangoproject.com/en/2.0/topics/http/urls/) 了解更多.

## 编写更多的视图

现在, 我们添加更多的视图函数到 `polls/views.py` 中:

```py
# polls/views.py
def detail(request, question_id):
    return HttpResponse("You're looking at question %s." % question_id)

def results(request, question_id):
    response = "You're looking at the results of question %s."
    return HttpResponse(response % question_id)

def vote(request, question_id):
    return HttpResponse("You're voting on question %s." % question_id)
```

在 `polls.urls` 模块中添加更多的 `path()` 调用来映射视图和 URL:

```py
# polls/urls.py
from django.urls import path

from . import views

urlpatterns = [
    # ex: /polls/
    path('', views.index, name='index'),
    # ex: /polls/5/
    path('<int:question_id>/', views.detail, name='detail'),
    # ex: /polls/5/results/
    path('<int:question_id>/results/', views.results, name='results'),
    # ex: /polls/5/vote/
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```

在浏览器中查看 `/polls/34/`, 它会调用 `detail()` 方法并且显示任何你在 URL 中携带的 ID. `/polls/34/results/` 和 `/polls/34/vote/` 也是一样.

当请求到来时, 以 `/polls/34/` 为例, Django 将会加载 `mysite.urls` 模块, 因为 `ROOT_URLCONF` 中指向了它. 它会查找变量名为 `urlpatterns` 的变量并且按顺序遍历它里面的每个路由(即映射). 找到与请求 url 匹配的路由后, 如 `polls/`, 它会删去 `polls/` 和它前边的部分, 把剩下的部分发送到 `polls.urls` 的 URLconf 中去进一步处理. 这里, 它匹配上了 `<int:question_id>/`, 然后就触发像下面这样的视图函数调用:

```py
detail(request=<HttpRequest object>, question_id=34)
```

`question_id=34` 来自于 `<int:question_id>`, 使用角括号 `<>` “捕获” URL 的一部分，并将其作为关键字参数发送给视图函数. `:question_id>` 定义匹配模式的名称, `<int:` 部分作为一个转换器, 它决定以何种模式与 URL 中的这一部分 path 进行匹配.

没必要添加 URL 中的其余部分, 如 `.html` - 处分你希望这样, 这种情况下你可以写成下面这样:

```py
path('polls/latest.html', views.index),
```

但是最好别这么做, 很蠢(原文就是这么说的)!

## 写点有实际用处的视图

每个视图都能负责做以下两件事之一: 返回一个包含了响应内容的 `HttpResponse` 对象, 或者抛出一个如 `Http404` 这样的异常, 剩下的都由你来决定了.

你的视图函数能选择性的读取数据库, 或者使用 Django 提供的模板系统, 或者使用第三方的 Python 模板系统, 或者生成一个 PDF 文件, 或者输出 XML 文件, 或者在线生成一个 ZIP 文件, 使用任何你想使用的 Python 库做任何你想做的事情.

Django 需要的只是一个 `HttpResponse` 或者一个 异常.

为了方便起见, 我们使用 Django 自己的数据库 API, 也就是在本系列文章的第二篇中介绍的那样. 下面是一个新的 `index()` 视图, 它根据发布日期展示了系统中最新的 5 个 poll 问题:

```py
# polls/views.py
from django.http import HttpResponse

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    output = ', '.join([q.question_text for q in latest_question_list])
    return HttpResponse(output)

# Leave the rest of the views (detail, results, vote) unchanged
```

这里有个问题, 页面被硬编码在视图函数中, 如果你希望改变页面的展示, 你就必须改变视图函数中的代码. 因此, 我们使用 Django 模板系统来做前后端分离.

首先, 在 `polls` 目录中创建一个 `templates` 目录, 让 Django 在这个目录中查找模板.

项目配置中的 `TEMPLATES` 用于告诉 Django 如何加载和渲染模板, 默认情况下, `BACKEND` 配置为 `DjangoTemplates`, `APP_DIRS` 为 `True`. `DjangoTemplates` 按照惯例会查询每个 `INSTALLED_APPS` 中指定的应用中的 `templates` 子目录.

在 `templates` 目录中, 创建一个叫 `polls` 的子目录, 在 `polls` 中创建一个 `index.html`, 即 `polls/templates/polls/index.html`, 前面已经说了模板加载器是如何工作的, 因此你可以在 Django 中使用 `polls/index.html` 引用该模板.

      模板命名空间

      现在我们可以直接把模板放到 `polls/templates` 目录中了(而不是创建其他的 polls 子目录), 但是这并不是一个好主意. Django 会选择它匹配的第一个模板, 如果你在其他应用中有一个与之同名的模板, Django 将会无法区分它们. 我们需要给 Django 指出哪一个是正确的, 最简单的方法就是通过命名空间来区分. 也就是说, 通过将这些模板放到一个与应用同名的目录中就可以了.

现在就可以把代码放到模板中去了:

```py
# polls/templates/polls/index.html
{% if latest_question_list %}
    <ul>
    {% for question in latest_question_list %}
        <li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
    {% endfor %}
    </ul>
{% else %}
    <p>No polls are available.</p>
{% endif %}
```

现在更新我们的 `index` 视图函数, 让它使用模板:

```py
# polls/views.py
from django.http import HttpResponse
from django.template import loader

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    template = loader.get_template('polls/index.html')
    context = {
        'latest_question_list': latest_question_list,
    }
    return HttpResponse(template.render(context, request))
```

这段代码加载模板 `polls/index.html` 并且传入上下文 context。 context 是一个字典对象, 它将模板中的变量与 Python 对象进行映射.

通过在浏览器中访问 `/polls/` 就能看到之前添加的一些问题了.

### render()

由于经常需要加载模板, 将 context 填充进模板然后返回 `HttpResponse` 对象作为渲染模板的结果. Django 提供了如下快捷方式:

```py
# polls/views.py
from django.shortcuts import render

from .models import Question

def index(request):
    latest_question_list = Question.objects.order_by('-pub_date')[:5]
    context = {'latest_question_list': latest_question_list}
    return render(request, 'polls/index.html', context)
```

如果我们这样使用, 就不再需要 import `loader` 和 `HttpResponse` 了

`render()` 方法使用 `request` 对象作为第一个参数, 模板名作为第二个参数, 一个上下文字典作为第三个可选参数. 返回一个通过指定上下文渲染出的指定模板的一个 `HttpResponse` 对象.

## 404

现在编写展示指定问题详情的视图:

```py
# polls/views.py
from django.http import Http404
from django.shortcuts import render

from .models import Question
# ...
def detail(request, question_id):
    try:
        question = Question.objects.get(pk=question_id)
    except Question.DoesNotExist:
        raise Http404("Question does not exist")
    return render(request, 'polls/detail.html', {'question': question})
```

新概念: 如果请求的 ID 不存在, 抛出一个 `Http404` 异常.

我们后面会更详细的讲解 `polls/detail.html` 模板中的内容, 但是如果你现在就想使用起来, 那么可以先像下面这样占个位:

```html
 <!-- polls/templates/polls/detail.html -->
{{ question }}
```

### get_object_or_404()

由于经常都会把 `get()` 和 `Http404` 一起配合使用, Django 就提供了一种快捷方式, 下面展示如何使用:

```py
# polls/views.py
from django.shortcuts import get_object_or_404, render

from .models import Question
# ...
def detail(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    return render(request, 'polls/detail.html', {'question': question})
```

`get_object_or_404()` 方法使用一个 Django model 作为第一个参数, 一个数字作为关键字参数, 他们会传给 model 管理器的 `get()` 方法, 如果不存在, 就会抛出一个 `Http404` 异常

      小提示

      为什么我们使用辅助函数 `get_object_or_404()` 而不是在更高的级别自动捕获 `ObjectDoesNotExist` 异常, 或者使用 model API 抛出 Http404 来替代 ObjectDoesNotExist?

      因为那会将模型图层耦合到视图图层。Django最重要的设计目标之一是保持松耦合。在Django.shortcuts 模块中引入了一些可控的耦合。

同时还有一个 `get_list_or_404()` 方法, 和 `get_object_or_404()` 差不多 - 它使用 `filter()` 代替 `get()`, 如果列表为空则抛出 `Http404`.

## 使用模板系统

回到 `detail()` 视图中, 使用指定的 question 上下文变量:

```html
<!-- polls/templates/polls/detail.html -->
<h1>{{ question.question_text }}</h1>
<ul>
{% for choice in question.choice_set.all %}
    <li>{{ choice.choice_text }}</li>
{% endfor %}
</ul>
```

模板系统使用点号`.`语法来获取变量属性. 在 `{{ question.question_text }}` 中, Django 首先在对象 question 上做字典查询, 如果失败了, 就会尝试进行属性查询 - 这里就是这样的. 如果属性查询同样失败, 那么它会尝试列表索引查询。

在 `{% for %}` 循环中的方法调用: `question.choice_set.all` 被解释为 Python 代码: `question.choice_set.all()`, 它返回可迭代的 Choice 对象给 `{% for %}` 标签使用.

关于模板的更多内容, 请查看 [template guide](https://docs.djangoproject.com/en/2.0/topics/templates/)

## 删除模板中的硬编码URL

记住, 在 `polls/index.html` 模板中使用链接指向一个 question 的时候, 链接是被硬编码的:

```html
<li><a href="/polls/{{ question.id }}/">{{ question.question_text }}</a></li>
```

使用硬编码的问题在于这样做耦合性太高, 如果需要修改项目的 URL 会变得相当困难. 然而, 如果在 `polls.urls` 模块的 `path()` 中定义了名字, 就可以通过在模板中使用 `{% url %}` 结合名字来指向 URL 而不需要硬编码到模板中:

```html
<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>
```

这样做就会去查找 `polls.urls` 模块中 URL 的定义, 下面就是如何定义的这个 URL 名字:

```py
# the 'name' value as called by the {% url %} template tag
path('<int:question_id>/', views.detail, name='detail'),
```

如果你希望改变 URL, 如改成 `polls/specifics/12/`, 就只需要在 `polls/urls.py` 中修改即可:

```py
# added the word 'specifics'
path('specifics/<int:question_id>/', views.detail, name='detail'),
```

## 命名空间 URL 名

现在这个项目只有一个应用, 即 polls, 在真实的 Django 项目中, 会有更多的应用. Django 如何区分他们的 URL 呢? 例如, polls 应用有一个 detail 视图, 可能本项目的另一个在 blog 也有这样一个视图, 那么Django 如何知道模板中的 `{% url %}` 标记是指向的哪一个呢?

答案就是给你的 URLconf 添加一个名字空间. 在 `polls/urls.py` 文件中, 添加一个变量 `app_name` 来设置名字空间:

```py
# polls/urls.py
from django.urls import path

from . import views

app_name = 'polls'
urlpatterns = [
    path('', views.index, name='index'),
    path('<int:question_id>/', views.detail, name='detail'),
    path('<int:question_id>/results/', views.results, name='results'),
    path('<int:question_id>/vote/', views.vote, name='vote'),
]
```

现在, 修改模板 `polls/index.html`, 将

```html
<!-- polls/templates/polls/index.html -->
<li><a href="{% url 'detail' question.id %}">{{ question.question_text }}</a></li>
```

修改成:

```html
<!-- polls/templates/polls/index.html -->
<li><a href="{% url 'polls:detail' question.id %}">{{ question.question_text }}</a></li>
```

## 完.