# Django

## Writing your first Django app, part 2

### Database setup

Now, open up `mysite/settings.py`. It’s a normal Python module with module-level variables representing Django settings.

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