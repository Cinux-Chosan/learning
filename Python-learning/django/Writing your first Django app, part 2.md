# Django

## Writing your first Django app, part 2

### Database setup

现在, 打开 `mysite/settings.py`, 它是一个以模块级变量代表 Django 配置的普通的Python模块

默认会使用 SQLite, SQLite 包含在 Python 中, 因此不需要安装额外的其他东西来支持它.

如果你希望使用其他的数据库, 安装确切的数据库支持, 然后修改 `DATABASES` 的 `default` 选项来适配你所选择的数据库:

- `ENGINE`:  'django.db.backends.sqlite3', 'django.db.backends.postgresql', 'django.db.backends.mysql', 或者 'django.db.backends.oracle' 之一. 其他数据库可以[查看这里](https://docs.djangoproject.com/en/2.0/ref/databases/#third-party-notes).
- `NAME`: 数据库名字, 如果使用 SQLite, 那么数据库就是一个文件, 这种情况下, `NAME` 需要是一个完整的绝对路径.

如果不是使用 SQLite, 则需要额外的配置, 如必要的 [`USER`](https://docs.djangoproject.com/en/2.0/ref/settings/#std:setting-USER), [`PASSWORD`](https://docs.djangoproject.com/en/2.0/ref/settings/#std:setting-PASSWORD) 和 [`HOST`](https://docs.djangoproject.com/en/2.0/ref/settings/#std:setting-HOST), 更多信息请参考 [DATABASES](https://docs.djangoproject.com/en/2.0/ref/settings/#std:setting-DATABASES)

      非 SQLite 数据库
      1、确保使用时已经创建好了数据库
      2、确保在 settings.py 中指定的用户具有创建数据库的权限, 后面测试的时候会自动创建测试数据库

`TIME_ZONE` 用于设置时区, 修改配置的时候请顺便把时区改成你自己的时区

留意配置文件中的 `INSTALLED_APPS`, 它保存了在 Django 实例中激活的所有 Django 应用程序的名称。应用程序可以在多个项目中使用, 你可以打包和发布你的应用程序供别人使用.

`INSTALLED_APPS` 默认包含下面的应用:

- `django.contrib.admin`: 管理页面, 很快就会用到.
- `django.contrib.auth`: 认证系统.
- `django.contrib.contenttypes`: 一个用于 content types 的框架.
- `django.contrib.sessions`: 一个 session 框架.
- `django.contrib.messages`: 一个 messaging 框架.
- `django.contrib.staticfiles`: 一个管理静态文件的框架.

这些应用已经满足一般的使用场景了

以上应用中的某些可能会使用到至少一个数据库表, 因此我们需要在使用它们之前在数据库中创建表。可以运行以下命令来完成:

```sh
python manage.py migrate
```

migrate 命令检查配置中的 `INSTALLED_APPS`, 根据 `mysite/setting.py` 和与其他应用附带的配置创建必要的数据库表.

      极简主义

      虽然默认的配置满足日常使用, 但是并不是所有的用户都会用到它们, 如果不需要的话,在运行 migrate 命令之前尽管从 INSTALLED_APPS 中注释或者删除它们. migrate 命令只会给 INSTALLED_APPS 中的应用做迁移

### Creating models

现在来定义模型: 数据库布局, 额外的元数据等

      Philosophy
      模型是关于数据的唯一、明确的真实来源。它包含存储的数据的基本字段和行为。Django 遵循[DRY Principle](https://docs.djangoproject.com/en/2.0/misc/design-philosophies/#dry) 的原则, 目标是在一个地方定义数据模型, 并自动根据它推导出数据。

      This includes the migrations - unlike in Ruby On Rails, for example, migrations are entirely derived from your models file, and are essentially just a history that Django can roll through to update your database schema to match your current models.

在 poll 应用中, 我们将创建两个模型: `Question` 和 `Choice`. `Question` 包含一个问题和发布日期. `Choice` 有两个字段, 选项和票数, 每个 `Choice` 都与一个 `Question` 关联.

每个概念都转化为一个 python class, 编辑 `polls/models.py`:

```py
from django.db import models

class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
```

每个 model 都是继承自 [django.db.models.Model](https://docs.djangoproject.com/en/2.0/ref/models/instances/#django.db.models.Model), model 的变量代表数据库字段.

每个字段都是 [Field](https://docs.djangoproject.com/en/2.0/ref/models/fields/#django.db.models.Field) 类的实例. 如 [CharField](https://docs.djangoproject.com/en/2.0/ref/models/fields/#django.db.models.CharField) 为字符字段、[DateTimeField](https://docs.djangoproject.com/en/2.0/ref/models/fields/#django.db.models.DateTimeField), 这将告诉 Django 每个字段包含的数据类型.

每个 Field 实例的名字(如 question_text 或 pub_date) 就是字段名，它们的名字对机器是友好的（相对来说，注释是对人类友好的）, 你将会在 python 代码中使用这些值, 数据库会使用它们作为列名.

Field 参数的第一个位置参数为可选的注释（原文此处为 human-readable name，实际上功能就是起注释的作用），如果没有提供这个参数， Django 就会使用机器可读（machine-readable ）的名字，即字段名。在上面的例子中， 我们只为 `Question.pub_date` 定义了人类可读的名字（human-readable name ，即注释）。所有其他字段的机器可读名称就足以作为其人类可读的名称。

有些 `Field` 类有必要参数，以 `CharField` 为例， 需要你提供 `max_length` 参数， 它不仅用于数据库模式， 还会用于验证，你马上就会看到。

`Field`还可能有其他很多可选参数， 就像上面例子中， 我们把 votes 的默认值设置为 `0`

最后， 还使用了 ForeignKey 来定义关系。 它告诉 Django 每个 Choice 对应一个 Question。 Django支持所有常见的数据库关系： 多对一，多对多，一对一

### Activating models

很小的一段 model 代码都可能给 Django 跟多信息. 有了它, Django 就可以:

- 给当前 app 创建数据库模式(即 `CREATE TABLE` 语句后面的描述)
- 给 Question 和 Choice 对象创建一个 Python 的数据库存取 API

但首要工作就是告诉我们的项目 app **polls** 已经安装好了.

      设计哲学
      Django app 是插件式的, 你可以在多个项目中使用同一个应用, 你也可以发布 app, 因为它们并不需要绑定到某个指定的 Django 版本中进行安装

为了在我们的项目中包含某个应用程序，我们需要在 `INSTALLED_APPS` 中添加对它的配置类的引用。`PollsConfig` 类在 `polls/apps.py` 文件中, 所以带点的路径就是 `polls.apps.PollsConfig`. 我们把它添加到 `mysite/settings.py` 文件的 `INSTALLED_APPS` 中:

```py
# mysite/settings.py
INSTALLED_APPS = [
    'polls.apps.PollsConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
```

现在, Django 知道需要包含 **polls** app 了, 运行下面的命令:

`python manage.py makemigrations polls`

会看到下面这样的输出:

                  Migrations for 'polls':
                  polls/migrations/0001_initial.py:
                  - Create model Choice
                  - Create model Question
                  - Add field question to choice

对 model 做了改动过后(这里实际上是新建了一个), 我们可以通过 `makemigrations`告诉 Django 这些改动需要存储为 _migration_

Migrations 是 Django 用于存储对 model 的更改的文件. 它们被放在 `polls/migrations/` 下面, 这里是文件 `polls/migrations/0001_initial.py`.

- `migrate` 命令用来自动帮你运行 migrations 和管理你的数据库模式.
- `sqlmigrate` 命令根据 migration 名字返回对应的 SQL, 如:

`python manage.py sqlmigrate polls 0001`

将会看到:

```sql
BEGIN;
--
-- Create model Choice
--
CREATE TABLE "polls_choice" (
    "id" serial NOT NULL PRIMARY KEY,
    "choice_text" varchar(200) NOT NULL,
    "votes" integer NOT NULL
);
--
-- Create model Question
--
CREATE TABLE "polls_question" (
    "id" serial NOT NULL PRIMARY KEY,
    "question_text" varchar(200) NOT NULL,
    "pub_date" timestamp with time zone NOT NULL
);
--
-- Add field question to choice
--
ALTER TABLE "polls_choice" ADD COLUMN "question_id" integer NOT NULL;
ALTER TABLE "polls_choice" ALTER COLUMN "question_id" DROP DEFAULT;
CREATE INDEX "polls_choice_7aa0f6ee" ON "polls_choice" ("question_id");
ALTER TABLE "polls_choice"
  ADD CONSTRAINT "polls_choice_question_id_246c99a640fbbd72_fk_polls_question_id"
    FOREIGN KEY ("question_id")
    REFERENCES "polls_question" ("id")
    DEFERRABLE INITIALLY DEFERRED;

COMMIT;
```

注意以下几项:

- 输出结果依赖于使用的数据库, 这里是 PostgreSQL 的结果
- 数据库表明是结合 app 名(polls) 和小写的 model 名自动生成的 - question 和 choice. (你可以覆盖这种默认表现)
- 自动添加主键. (你可以覆盖这种默认表现)
- 为了方便, Django 给外键名追加了 `_id`. (你可以覆盖这种默认表现)
- 外键是通过 `FOREIGN KEY` 显式定义的. 不必担心 `DEFERRABLE` 部分, 它只是用来告诉 PostSQL 在事务结束之前不执行外键。
- 自动根据你所使用的数据库进行定制化, 因此像 `auto_increment`(MySQL), `serial`(PostgreSQL) 或者 `integer primary key autoincrement`(SQLite) 这些都会自动为你处理好. 就像使用何种括号(单引号或者双引号)都会自动处理
- `sqlmigrate` 命令不会自动在你的数据库上运行 migration, 它只是把它打印到屏幕上，这样你就可以看到Django使用了什么 SQL 语句。在检查 Django 将要做什么，或者如果数据库管理员需要对 SQL 脚本进行更改时，这将很有用。

如果你感兴趣, 你还可以运行 `python manage.py check;`, 这行命令将会在不生成 migrations 和访问数据库的情况下检查你项目中的所有问题.

现在, 运行 `migrate` 来在数据库中创建这些 model 的表: `python manage.py migrate`

`migrate` 命令将运行所有还未被应用的 migration 到数据库中, 将数据库中的模式与你在 model 中做的修改进行同步.

Migrations 非常强大，让你在开发项目的时候可以多次更改 model 而不需要你来删除数据库或者表然后重新创建 - 它专门用于实时升级数据库，而不丢失数据。记住改变 model 三部曲:

- 在 `models.py` 中改变 model
- 运行 `python manage.py makemigrations` 来为这些改变创建 migrations
- 运行 `python manage.py migrate` 来将这些改变应用到数据库

之所以使用单独的命令来制作和应用 migrations，是因为你将提交 migrations 到你的版本控制系统，并将它们与你的应用程序在一起；它们不仅使你的开发变得更容易，而且也可被其他开发人员在生产中使用。

`manage.py` 的更多信息, 参考[django-admin 文档](https://docs.djangoproject.com/en/2.0/ref/django-admin/)

### Playing with the API

现在进入交互式 Python shell 中使用 Django 带来的 API, 使用如下命令进入 Python shell:

`python manage.py shell`

之所以使用这个来代替简单的 `python` 命令, 是因为 `manage.py` 设置了环境变量 `DJANGO_SETTINGS_MODULE`, 它给 Django 设置了 python import 路径到你的 `mysite/settings.py` 文件.

进入 shell 之后, 浏览 [数据库 API](https://docs.djangoproject.com/en/2.0/topics/db/queries/)

```sh
>>> from polls.models import Choice, Question  # Import the model classes we just wrote.

# No questions are in the system yet.
>>> Question.objects.all()
<QuerySet []>

# Create a new Question.
# Support for time zones is enabled in the default settings file, so
# Django expects a datetime with tzinfo for pub_date. Use timezone.now()
# instead of datetime.datetime.now() and it will do the right thing.
>>> from django.utils import timezone
>>> q = Question(question_text="What's new?", pub_date=timezone.now())

# Save the object into the database. You have to call save() explicitly.
>>> q.save()

# Now it has an ID.
>>> q.id
1

# Access model field values via Python attributes.
>>> q.question_text
"What's new?"
>>> q.pub_date
datetime.datetime(2012, 2, 26, 13, 0, 0, 775217, tzinfo=<UTC>)

# Change values by changing the attributes, then calling save().
>>> q.question_text = "What's up?"
>>> q.save()

# objects.all() displays all the questions in the database.
>>> Question.objects.all()
<QuerySet [<Question: Question object (1)>]>
```

等一下, `<Question: Question object (1)>` 这种表现形式对我们并不友好, 我们可以通过给 model 添加一个 `__str__()` 方法来解决这个不友好的问题:

```py
# polls/models.py
from django.db import models

class Question(models.Model):
    # ...
    def __str__(self):
        return self.question_text

class Choice(models.Model):
    # ...
    def __str__(self):
        return self.choice_text
```

给 model 添加 `__str__()` 方法很重要, 不仅是因为方便你使用交互模式, 而且因为 Django 自动生成的 admin 会使用对象的表现形式(but also because objects’ representations are used throughout Django’s automatically-generated admin.).

这些都是常规的 python 函数, 现在来添加一个自定义函数作为演示:

```py
# polls/models.py
import datetime

from django.db import models
from django.utils import timezone

class Question(models.Model):
    # ...
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
```

注意附加的 `import datetime` 和 `from django.utils import timezone`, 分别引用 python 的标准模块 `datetime` 和 Django `django.utils.timezone` 中的 `time-zone-related` 工具. 如果你对 Python 的 time zone 不熟悉, 可以通过访问 [time zone 支持文档](https://docs.djangoproject.com/en/2.0/topics/i18n/timezones/) 学习

保存上面的更改过后, 通过 `python manage.py shell` 重新进入新的 Python 交互 shell:

```sh
>>> from polls.models import Choice, Question

# Make sure our __str__() addition worked.
>>> Question.objects.all()
<QuerySet [<Question: What's up?>]>

# Django provides a rich database lookup API that's entirely driven by
# keyword arguments.
>>> Question.objects.filter(id=1)
<QuerySet [<Question: What's up?>]>
>>> Question.objects.filter(question_text__startswith='What')
<QuerySet [<Question: What's up?>]>

# Get the question that was published this year.
>>> from django.utils import timezone
>>> current_year = timezone.now().year
>>> Question.objects.get(pub_date__year=current_year)
<Question: What's up?>

# Request an ID that doesn't exist, this will raise an exception.
>>> Question.objects.get(id=2)
Traceback (most recent call last):
    ...
DoesNotExist: Question matching query does not exist.

# Lookup by a primary key is the most common case, so Django provides a
# shortcut for primary-key exact lookups.
# The following is identical to Question.objects.get(id=1).
>>> Question.objects.get(pk=1)
<Question: What's up?>

# Make sure our custom method worked.
>>> q = Question.objects.get(pk=1)
>>> q.was_published_recently()
True

# Give the Question a couple of Choices. The create call constructs a new
# Choice object, does the INSERT statement, adds the choice to the set
# of available choices and returns the new Choice object. Django creates
# a set to hold the "other side" of a ForeignKey relation
# (e.g. a question's choice) which can be accessed via the API.
>>> q = Question.objects.get(pk=1)

# Display any choices from the related object set -- none so far.
>>> q.choice_set.all()
<QuerySet []>

# Create three choices.
>>> q.choice_set.create(choice_text='Not much', votes=0)
<Choice: Not much>
>>> q.choice_set.create(choice_text='The sky', votes=0)
<Choice: The sky>
>>> c = q.choice_set.create(choice_text='Just hacking again', votes=0)

# Choice objects have API access to their related Question objects.
>>> c.question
<Question: What's up?>

# And vice versa: Question objects get access to Choice objects.
>>> q.choice_set.all()
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>
>>> q.choice_set.count()
3

# The API automatically follows relationships as far as you need.
# Use double underscores to separate relationships.
# This works as many levels deep as you want; there's no limit.
# Find all Choices for any question whose pub_date is in this year
# (reusing the 'current_year' variable we created above).
>>> Choice.objects.filter(question__pub_date__year=current_year)
<QuerySet [<Choice: Not much>, <Choice: The sky>, <Choice: Just hacking again>]>

# Let's delete one of the choices. Use delete() for that.
>>> c = q.choice_set.filter(choice_text__startswith='Just hacking')
>>> c.delete()
```

- 获取更多 model 关系的信息, 参考 [Accessing related objects](https://docs.djangoproject.com/en/2.0/ref/models/relations/).
- 如何通过 API 使用双下划线来完成字段的查找, 参考[Field lookups](https://docs.djangoproject.com/en/2.0/topics/db/queries/#field-lookups-intro)
- 查看数据库 API 的完整信息, 参考[Database API reference](https://docs.djangoproject.com/en/2.0/topics/db/queries/)

### Introducing the Django Admin

      小提示:
      为你的员工或客户生成管理站点，添加、更改和删除内容是乏味的工作，而且不需要太多的创造力。出于这个原因，Django完全自动为模型创建管理界面。

      Django是在编辑室环境中编写的，在“内容发布者”和“公共”站点之间有着非常清晰的分离。网站管理员使用该系统来添加新闻故事、事件、体育成绩等，并且该内容显示在公共站点上。Django 为你省去了每次都为管理员编写一模一样的增删改查的重复工作。

      admin 不是为网站访问者设计的, 而是为网站管理员设计的.

#### 创建 admin 用户

首先我们需要创建一个能够登陆进管理页面的用户:

`python manage.py createsuperuser`

输入用户名:

`Username: admin`

输入 Email 地址:

`Email address: admin@example.com`

最后就是数据密码, 会让你输入两次, 第二次用于确认:

```sh
Password: **********
Password (again): *********
Superuser created successfully.
```

#### 启动开发服务器

如果服务器没有启动, 运行 `python manage.py runserver`

然后通过浏览器访问`http://127.0.0.1:8000/admin/`

将看到 ![登陆图](https://docs.djangoproject.com/en/2.0/_images/admin01.png)

由于默认情况下是开启了 [翻译](https://docs.djangoproject.com/en/2.0/topics/i18n/translation/) 的, 所以可能登陆界面使用的是你们国家的语言, 这依赖于你的浏览器设置和 Django 是否有该语言的翻译文件.

#### 进入 admin 页面

现在, 尝试使用前面创建的超级用户账户登陆, 登陆过后你将看到 Django admin 首页:

![Django管理界面首页](https://docs.djangoproject.com/en/2.0/_images/admin02.png)

你应该会看到一些可编辑类型：组(group)和用户(users)。它们由 Django 继承的 `django.contrib.auth` 的认证框架提供。

#### 让 poll 应用也能在 admin 页面中编辑

我们的 poll 应用没有显示出来, 去哪儿了呢?

只需要做一件事: 我们需要告诉 admin Question 对象有 admin 接口. 做法就是打开 `polls/admin.py` 文件, 向下面这样编辑它:

```py
# polls/admin.py
from django.contrib import admin

from .models import Question

admin.site.register(Question)
```

#### 查看 admin 功能

现在我们注册了 Question, Django 知道需要把它显示到 admin 首页:

![admin 首页](https://docs.djangoproject.com/en/2.0/_images/admin03t.png)

点击 "Questions", 进入 questions 的修改列表. 这个列表展示了数据库中所有的 questions, 并且你可以随便选择一个进行修改. 我们能看到之前创建的 qestion "What's up?":

![what's up](https://docs.djangoproject.com/en/2.0/_images/admin04t.png)

点击 “What’s up?”, 编辑它:

![编辑问题](https://docs.djangoproject.com/en/2.0/_images/admin05t.png)

这里需要注意以下几点:

- 这个表单是根据 Question model 自动生成的
- 不同的 model 字段类型 (如: `DateTimeField`, `CharField`) 对应不同的 HTML 输入组件, 在 Django admin 中的每个字段都知道如何展示它的类型
- 每个 `DateTimeField`

页面的底部给出了几个选项：

- Save – Saves changes and returns to the change-list page for this type of object.
- Save and continue editing – Saves changes and reloads the admin page for this object.
- Save and add another – Saves changes and loads a new, blank form for this type of object.
- Delete – Displays a delete confirmation page.

如果 "Date published" 的值和你在 `Writing your first Django app, part 1` 中创建的 question 的时间不一致, 那可能是你没有给设置 `TIME_ZONE` 配置正确的值. 更改它，重新加载页面并检查是否出现正确的值。

点击 "Today" 和 "Now" 快捷方式, 修改 "Date Published" 的值, 然后点击  “Save and continue editing.”  然后点击右上角的 “History” , 你将看到一个列出了所有通过 Django admin 对该对象所做的更改的页面，以及更改这条记录的时间戳和用户名：

![改变记录](https://docs.djangoproject.com/en/2.0/_images/admin06t.png)
