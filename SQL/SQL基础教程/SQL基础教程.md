# PostgreSQL

## 第 0 章

- PostgreSQL的安装和连接设置
- 通过 PostgreSQL执行 SQL语句

### 安装

参考 [Mac 配置 PostgreSQL 常用操作](https://www.jianshu.com/p/354442add14f)

### 创建数据库

1. 创建名为 shop 的数据库: `CREATE DATABASE shop;`
2. 登陆名为 shop 的数据库: `psql -U zhangjianjun -d shop;`, `-d` 指定数据库, `-U` 指定用户名

### 注意点

1. “;”是 SQL 的结束符，如果没有输入的话，即使按下回车键，SQL 语句也不会执行。因此，在执行 SQL 语句的时候， 请大家注意不要忘记输入“;”。

## 第 1 章

- 数据库是什么
- 数据库的结构
- SQL概要
- 表的创建
- 表的删除和更新

### 常规知识点

- 用来管理数据库的计算机系统称为数据库管理系统（Database Management System，`DBMS`)
- 关系数据库（Relational Database，`RDB`）: 管理关系型数据库的系统称为 `RDBMS`

| 商品编号 | 商品名称 | 商品种类 | 销售单价 | 进货单价 | 登记日期 |
| ---- | --- | --- | --- | ---| --- |
| 0001 | T恤衫 | 衣服 | 1000 | 500 | 2009-09-20 |
| 0002 | 打孔器 | 办公用品 | 500 | 320 | 2009-09-11 |
| 0003 | 运动T恤 | 衣服 | 4000 | 2800 |
| 0004 | 菜刀 | 厨房用具 | 3000 | 2800 | 2009-09-20 |
| 0005 | 高压锅 | 厨房用具 | 6800 | 5000 | 2009-01-15 |
| 0006 | 叉子 | 厨房用具 | 500 | 2009 |-09-20 |
| 0007 | 擦菜板 | 厨房用具 | 880 | 790 | 2008-04-28 |
| 0008 | 圆珠笔 | 办公用品 | 100 | 2009 |-11-11 |

- 表的`列`（垂直方向）称为`字段`，它代表了保存在表中的数据项目。
- 表的`行`（水平方向）称为`记录`，它相当于一条数据。
- 关系数据库以`行`为单位读写数据。

- SQL 语句及其种类

  根据对 RDBMS 赋予的指令种类的不同，SQL 语句可以分为以下三类。

  - DDL（Data Definition Language，数据定义语言）: 用来`创建`或者`删除`存储数据用的数据库以及数据库中的表等对象, DDL 包含以下几种指令。
    - CREATE：创建数据库和表等对象
    - DROP： 删除数据库和表等对象
    - ALTER： 修改数据库和表等对象的结构
  - DML（Data Manipulation Language，数据操纵语言）: 用来`查询`或者`变更`表中的记录（实际使用的 SQL 语句当中有 90% 属于 DML）。DML 包含以下几种指令。
    - SELECT：查询表中的数据
    - INSERT：向表中插入新数据
    - UPDATE：更新表中的数据
    - DELETE：删除表中的数据
  - DCL（Data Control Language，数据控制语言）: 用来`确认`或者`取消`对数据库中的数据进行的变更。除此之外，还可以对 RDBMS 的用户是否有权限 操作数据库中的对象（数据库表等）进行设定。DCL 包含以下几种指令。
    - COMMIT： 确认对数据库中的数据进行的变更
    - ROLLBACK：取消对数据库中的数据进行的变更
    - GRANT： 赋予用户操作权限
    - REVOKE： 取消用户的操作权限

- SQL 的基本书写规则
  - SQL语句要以分号 `;` 结尾。（一条 SQL 语句可以描述一个数据库操作。在 RDBMS 当中，SQL 语句也是逐条执行的。）
  - SQL语句不区分大小写
    - 关键字大写
    - 表名的首字母大写
    - 其余（列名等）小写
  - 常数的书写方式是固定的
    - 字符串和日期常数需要使用单引号 `'` 括起来。
    - 数字常数无需加注单引号（直接书写数字即可）。
  - 单词需要用半角空格或者换行来分隔

### 重要知识点

#### 建表

建表之前, 首先要创建数据库

`CREATE DATABASE <数据库名>;`

然后就可以建表了:

```sql
CREATE TABLE <表名> (
<列名1> <数据类型> <该列所需约束>,
<列名2> <数据类型> <该列所需约束>,
<列名3> <数据类型> <该列所需约束>,
<列名4> <数据类型> <该列所需约束>,
...
<表的约束1>, <表的约束2> ...
);
```

使用实例:

```sql
CREATE TABLE Product
(product_id CHAR(4) NOT NULL,
 product_name VARCHAR(100) NOT NULL,
 product_type VARCHAR(32) NOT NULL,
 sale_price INTEGER,
 purchase_price INTEGER,
 regist_date DATE,
 PRIMARY KEY (product_id));
```

##### 数据类型的指定

- `INTEGER`: 用来指定存储整数的列的数据类型（数字型），不能存储小数。
- `CHAR`: 是用来指定存储字符串的列 的数据类型（字符型）。
  - `CHAR` 是 CHARACTER（字符）的缩写。可以像 CHAR(10) 或者 CHAR(200) 这样，在 括号中指定该列可以存储的字符串的长度（最大长度）。字符串超出最大 长度的部分是无法输入到该列中的。RDBMS 不同，长度单位也不一样， 既存在使用字符个数的情况，也存在使用字节长度的情况。字符串以定长字符串  的形式存储在被指定为 CHAR 型的列中。所谓定长字符串，就是当列中存储的字符串长度达不到最大长度的时候，使用半 角空格进行补足。例如，我们向 CHAR(8) 类型的列中输入 'abc'的时候， 会以 'abc     '（abc 后面有 5 个半角空格）的形式保存起来。 另外，虽然之前我们说过 SQL 不区分英文字母的大小写，但是表中 存储的字符串却是区分大小写的。也就是说，'ABC' 和 'abc' 代表了两 个不同意义的字符串
- `VARCHAR`: 同 CHAR 类型一样，VARCHAR 型也是用来指定存储字符串的列的 数据类型（字符串类型）。
  - 也可以通过括号内的数字来指定字符串的长度（最 大长度）。但该类型的列是以可变长字符串  的形式来保存字符串的 B。定 长字符串在字符数未达到最大长度时会用半角空格补足，但可变长字符串 不同，即使字符数未达到最大长度，也不会用半角空格补足。例如，我们 向 VARCHAR(8) 类型的列中输入字符串 'abc' 的时候，保存的就是字 符串 'abc'。
  - Oracle中使用VARCHAR2型（Oracle中也有VARCHAR这种数据类型，但并不推荐使用）。
- `DATE`: 用来指定存储日期（年月日）的列的数据类型（日期型）。
  - 除了年月日之外，Oracle中使用的DATE型还包含时分秒，但在本书中我们只学 习日期部分。

##### 约束的设置

约束是除了数据类型之外，对列中存储的数据进行限制或者追加条件的功能。

- `NOT NULL`
- `PRIMARY KEY(key_name)`

#### 表的删除和更新

##### 删除表

```sh
DROP TABLE <表名>;
```

除的表是无法恢复的。即使是被误删的表，也无法恢复，只能重新创建，然后重新插入数据。

##### 表定义的更新（ALTER TABLE语句）

有时好不容易把表创建出来之后才发现少了几列，其实这时无需把表删
除再重新创建，只需使用变更表定义的 `ALTER TABLE` 语句就可以了。
ALTER 在英语中就是“改变”的意思。

- 添加列: `ALTER TABLE <表名> ADD COLUMN <列的定义>;`
  - Oracle和SQL Server中不用写COLUMN: `ALTER TABLE <表名> ADD <列名> ;`
  - 在Oracle中同时添加多列的时候，可以像下面这样使用括号: `ALTER TABLE <表名> ADD (<列名>,<列名>,……);`

使用实例:

```sql
ALTER TABLE Product ADD COLUMN product_name_pinyin VARCHAR(100);
```

- 删除列: `ALTER TABLE <表名> DROP COLUMN <列名>;`
  - Oracle中不用写COLUMN
  - 在Oracle中同时删除多列的时候，可以使用括号来实现。

使用实例:

```sql
ALTER TABLE Product DROP COLUMN product_name_pinyin;
```

##### 常规知识点

- `ALTER TABLE` 语句和 `DROP TABLE` 语句一样，执行之后无法恢复。误添的列可以通过 `ALTER TABLE` 语句删除，或者将表全部删除之后重新再创建。
- 修改表名可以使用 `RENAME`, 各个数据库的语法都不尽相同，是因为标准 SQL 并没有 RENAME

```sql
--变更表名
ALTER TABLE Poduct RENAME TO Product;
RENAME TABLE Poduct TO Product;
sp_rename 'Poduct', 'Product';
RENAME TABLE Poduct to Product;
```

```sql
CREATE TABLE users(
  user_name CHAR(20) NOT NULL,
  password CHAR(20) NOT NULL,
  user_id SERIAL NOT NULL,
  PRIMARY KEY (user_id)
);
INSERT INTO users VALUES('zhangjianjun', 'myPassword');
```

```sql
-- DML ：插入数据
-- MySQL 中使用 START TRANSACTION;
-- 在Oracle和DB2中运行时，无需使用 TRANSACTION
BEGIN TRANSACTION;  
INSERT INTO Product VALUES ('0001', 'T恤衫', '衣服',
1000, 500, '2009-09-20');
INSERT INTO Product VALUES ('0002', '打孔器', '办公用品',
500, 320, '2009-09-11');
INSERT INTO Product VALUES ('0003', '运动T恤', '衣服',
4000, 2800, NULL);
INSERT INTO Product VALUES ('0004', '菜刀', '厨房用具',
3000, 2800, '2009-09-20');
INSERT INTO Product VALUES ('0005', '高压锅', '厨房用具',
6800, 5000, '2009-01-15');
INSERT INTO Product VALUES ('0006', '叉子', '厨房用具',
500, NULL, '2009-09-20');
INSERT INTO Product VALUES ('0007', '擦菜板', '厨房用具',
880, 790, '2008-04-28');
INSERT INTO Product VALUES ('0008', '圆珠笔', '办公用品',
100, NULL,'2009-11-11');
COMMIT;
```

## 第２章　查询基础

- SELECT语句基础
- 算术运算符和比较运算符
- 逻辑运算符

### SELECT语句基础

从表中选取数据时需要使用 SELECT 语句，也就是只从表中选出 （SELECT）必要数据的意思。通过 SELECT 语句查询并选取出必要数据 的过程称为匹配查询或查询（query）。

```sql
SELECT <列名1>, <列名2>, <列名3>, ... -- SELECT 子句中列举了希望从表中查询出的列的名称, 查询结果中列的顺序和 SELECT 子句中的顺序相同, 想要查询出全部列时，可以使用代表所有列的星号（*），如果使用星号的话就会按照 CREATE TABLE 语句的定义对列进行排序。
FROM <表名>; -- FROM 子句指定了选取出数据的表的名称
```

这里SELECT 语句包含了 `SELECT` 和 `FROM` 两个子句（clause）。子句 是 SQL 语句的组成要素，是以 SELECT 或者 FROM 等作为起始的短语。

使用实例:

```sql
SELECT product_id, product_name, purchase_price
FROM Product;
```

```sql
SELECT *
FROM Product;
```

#### 为列设定别名 ( AS 关键字)

```sql
SELECT product_id AS id,
product_name AS name,
purchase_price AS price
FROM Product;
```

别名可以使用中文，使用中文时需要用双引号（`"`）括起来。注意不是单引号（`'`）。
使用双引号（`"`）可以设定包含空格 （空白）的别名。但是如果忘记使 用双引号就可能出错，因此并不推荐。大家可以像product_list这样使用下划线（`_`）来代替空白。

#### 常数的查询

```sql
SELECT '商品' AS string, 38 AS number, '2009-02-24' AS date,
product_id, product_name
FROM Product;
```

**解释**: 这条查询语句相当于在查询的结果前面添加了两列, 第一列名为 `string`, 值固定为 `商品`, 第二列名为 `number`, 值固定为 `38`, 第三列名为 `date`, 值固定为 `2009-02-24`

结果:

|  string | number | date | product_id | product_name |
| ---| ---| --- | --- | --- |
| 商品 | 38 | 2009-02-24 | 0001 | T恤衫 |
| 商品 | 38 | 2009-02-24 | 0002 | 打孔器 |
| 商品 | 38 | 2009-02-24 | 0003 | 运动T恤 |

#### 从结果中删除重复行

想知道某一列保存了那些不同的值, 就需要从结果中去处重复的行, 去处重复的行使用 `DISTINCT`

```sql
SELECT DISTINCT product_type  -- 执行完成过后, 就只包含不同的类型, 相同类型只保留一项
FROM Product;
```

```sql
SELECT DISTINCT product_type, regist_date  -- 多列时, 两条记录中每个字段的值都相同才为重复
FROM Product;
```

**注意**: 使用 DISTINCT 时，NULL 也被视为一类数据。NULL 存在于多行中时，也会被合并为一条 NULL 数据。对
**注意**: DISTINCT 关键字只能用在第一个列名之前, 不能写成 regist_date, DISTINCT product_type。

执行结果:

|  string | number | date | product_id | product_name |
| --- | --- | --- | --- | --- |
| 商品 | 38 | 2009-02-24 | 0001 | T恤衫 |
| 商品 | 38 | 2009-02-24 | 0002 | 打孔器 |
| 商品 | 38 | 2009-02-24 | 0003 | 运动T恤 |

上面的 SELECT 子句中的第一列 '商品' 是字符串常数，第 2 列 38 是数字 常数，第 3 列 '2009-02-24' 是日期常数，它们将与 product_id 列和 product_name 列一起被查询出来

#### 根据WHERE语句来选择记录

通过 WHERE 子句来指定查询数据的条件

```sql
SELECT <列名1>, <列名2>, <列名3>, ……
FROM <表名>
WHERE <条件表达式>;
```

使用实例:

```sql
SELECT product_name, product_type
FROM Product
WHERE product_type = '衣服';
```

执行顺序是: 首先通过 WHERE 子句查询出符合指定条件的记录，然后再选取出 SELECT 语句指 定的列
**注意**: SQL 中子句的书写顺序是固定的，不能随意更改。`WHERE` 子句必须紧跟在 `FROM` 子句之后，

#### 注释的书写方法

- 单行注释: 书写在 `--` 之后，只能写在同一行。
- 多行注释: 书写在 `/*` 和 `*/` 之间，可以跨多行

#### 注意事项

- SQL 语句使用换行符或者半角空格来分隔单词，在任何位置进行分隔都可以， 即使像下面这样通篇都是换行符也不会影响SELECT语句的执行。但是这样可能会 由于看不清楚而出错。原则上希望大家能够以子句为单位进行换行（子句过长时， 为方便起见可以换行）。

```sql
SELECT
*
FROM
Product
;
```

另外，像下面这样插入空行（无任何字符的行）会造成执行错误，请特别注意。

```sql
SELECT *

FROM Product;
```

### 算术运算符和比较运算符

#### 算术运算

```sql
SELECT product_name, sale_price,
sale_price * 2 AS "sale_price_x2"
FROM Product;
```

- SQL语句中可以使用的四则运算的主要运算符: `+`, `-`, `*`, `/`
- SQL 中也可以像平常的运算表达式那样使用括号 `( )`。括号的使用并不仅仅局限于四则运算，还可以用在 SQL 语句的任何表达式当中
- 需要注意 `NULL`: 所有包含 NULL 的计算，结果肯定是 NULL。通常情况下，类似 5/0 这样除数为 0 的话会发生错误，只有 NULL 除以 0 时不会发生错误，并且结果还是 NULL。
- FROM子句在SELECT语句中并不是必不可少的，只使用SELECT子句进行计算也是可以的。如 `SELECT (100 + 200) * 3 AS calculation;`, 这样的使用场景比较少, 不过还是有, 例如，不管内容是什么，只希望得到一行临时数据的情况。
  - 但是也存在像 Oracle 这样不允许省略 SELECT 语句中的 FROM 子句的 RDBMS，请大家注意

#### 比较运算

- `=`: 等于
- `<>`: 不等于, `!=` 是非标准的
- `>=`
- `<=`
- `>`
- `<`

```sql
SELECT product_name, product_type, regist_date
FROM Product
WHERE regist_date < '2009-09-27';
```

**注意**: 不能对`NULL`使用比较运算符

类似于 `purchase_price <> 2800` 这样的查询条件并不能查询出值为 `NULL` 的记录, 即使是 `purchase_price = NULL` 也是不行的, 需要使用运算符 `IS NULL` 或者 `IS NOT NULL`

#### 逻辑运算

- `NOT`: NOT 不能单独使用，必须和其他查询条件组合起来使用。

```sql
SELECT product_name, product_type, sale_price
FROM Product
WHERE NOT sale_price >= 1000;  -- 实际上很多场景可以不使用 NOT, 如此处可以使用 sale_price < 1000, NOT运算符用来否定某一条件，但是不能滥用
```

- `AND`: 在其两侧的查询条件都成立时整个查询条件才成立，其意思相当于“并且”。

```sql
SELECT product_name, purchase_price
 FROM Product
 WHERE product_type = '厨房用具'
 AND sale_price >= 3000;  -- 使用 AND 并列条件
```

- `OR`: 在其两侧的查询条件有一个成立时整个查询条件都成立，其意思相当于“或者”。

```sql
SELECT product_name, purchase_price
 FROM Product
 WHERE product_type = '厨房用具'
 OR sale_price >= 3000;  -- 使用 OR 运算符
```

**注意**: `AND`运算符的优先级高于`OR`运算符。想要优先执行OR运算符时可以使用括号。

```sql
SELECT product_name, product_type, regist_date
FROM Product
WHERE product_type = '办公用品'
AND ( regist_date = '2009-09-11'  -- 使用括号, 否则会被解释为 product_type = '办公用品' AND  regist_date = '2009-09-11' 然后再和 regist_date = '2009-09-20' 构成 OR 条件
OR regist_date = '2009-09-20');
```

- 含有`NULL`时的真值, `NULL` 作为除了 `TRUE` 和 `FALSE` 的第三种值, 即 `UNKNOWN`, 需要使用 `IS NULL` 或者 `IS NOT NULL` 来判断

- AND:

||||
|---|---|---|
| P | Q | P AND Q |
| 真 | 真 | 真 |
| 真 | 假 | 假 |
| 真 | 不确定 | 不确定 |
| 假 | 真 | 假 |
| 假 | 假 | 假 |
| 假 | 不确定 | 假 |
| 不确定 | 真 | 不确定 |
| 不确定 | 假 | 假 |
| 不确定 | 不确定 | 不确定 |

- OR:

||||
|---|---|---|
| P | Q | P OR Q|
| 真 | 真 | 真|
| 真 | 假 | 真|
| 真 | 不确定 | 真|
| 假 | 真 | 真|
| 假 | 假 | 假|
| 假 | 不确定 | 不确定|
| 不确定 | 真 | 真|
| 不确定 | 假 | 不确定|
| 不确定 | 不确定 | 不确定|

- 数据库领域的有识之士们达成了“尽量不使用 NULL”的共识。 这就是为什么在创建 Product 表时要给某些列设置 NOT NULL 约束（禁止录入 NULL）的缘故。

## 第 3 章 聚合与排序

- 对表进行聚合查询
- 对表进行分组
- 为聚合结果指定条件
- 对查询结果进行排序

### 对表进行聚合查询

- 通常，聚合函数会对NULL以外的对象进行汇总。但是只有COUNT函数例外，使用COUNT（*）可以查出包含NULL在内的全部数据的行数。

请大家先记住以下 5 个常用的函数:

- `COUNT`：计算表中的记录数（行数）
- `SUM`：计算表中数值列中数据的合计值
- `AVG`：计算表中数值列中数据的平均值
- `MAX`：求出表中任意列中数据的最大值
- `MIN`：求出表中任意列中数据的最小值

#### 使用用例

- 计算表中数据的行数

`COUNT`函数的结果根据参数的不同而不同。`COUNT(*)`会得到包含NULL的数据 行数，而`COUNT(<列名>)`会得到NULL之外的数据行数。该特性是 COUNT 函数所特有的，其他函数并不能将星号作为参数（如 果使用星号会出错）。

```sql
SELECT COUNT(*)  -- 计算所有行的行数
FROM Product;
---------
SELECT COUNT(purchase_price)  -- 计算 purchase_price 中非空行的行数
FROM Product;
```

- 计算合计值

```sql
SELECT SUM(sale_price)
FROM Product;
```

```sql
SELECT SUM(sale_price), SUM(purchase_price)
FROM Product;
```

四则运算中如果存在 `NULL`，结果一定是 `NULL`，但是聚合函数会将`NULL` 排除在外, **这与“等价为 0”并不相同**。但`COUNT(*)`例外，并不会排除`NULL`。

- 计算平均值

```sql
-- 语法和 SUM 函数完全相同, 不会计算 NULL
SELECT AVG(sale_price)
FROM Product;
```

- 计算最大值和最小值

`MAX`/`MIN` 函数和 `SUM`/`AVG` 函数有一点不同，那就是 `SUM`/ `AVG` 函数**只能对数值类型的列使用**，而 `MAX`/`MIN` 函数原则上可以适用于任何数据类型的列。

```sql
SELECT MAX(sale_price), MIN(purchase_price)
FROM Product;
```

- 使用聚合函数删除重复值（关键字`DISTINCT`）

想要计算值的种类时，可以在`COUNT`函数的参数中使用`DISTINCT`。不仅限于 `COUNT` 函数，所有的聚合函数都可以使用 `DISTINCT`

```sql
SELECT COUNT(DISTINCT product_type)  -- 在 COUNT 中使用 DISTINCT 的例子, 因为必须要在计算行数之前删除 product_type 列中的重复数据。
FROM Product;
```

### 对表进行分组

- 使用`GROUP BY`子句可以像切蛋糕那样将表分割。通过使用聚合函数和 `GROUP BY`子句，可以根据“商品种类”或者“登记日期”等将表分割后再进行汇总。
- 聚合键中包含`NULL`时，在结果中会以“**不确定**”行（空行）的形式表现出来。
- 使用聚合函数和`GROUP BY`子句时需要注意以下 **4** 点。
  - 只能写在`SELECT`子句之中
  - `GROUP BY`子句中不能使用`SELECT`子句中列的别名
  - `GROUP BY`子句的聚合结果是无序的
  - `WHERE`子句中不能使用聚合函数

```sql
-- GROUP BY 子句
SELECT <列名1>, <列名2>, <列名3>, ……
FROM <表名>
GROUP BY <列名1>, <列名2>, <列名3>, ……;
```

**注意**: `GROUP BY` 子句一定要写在 `FROM` 语句之后（如果有 `WHERE` 子句的话需要写在 `WHERE` 子句之后）。目前, 顺序为 `1. SELECT → 2. FROM → 3. WHERE → 4. GROUP BY`

#### 聚合键中包含`NULL`的情况

当聚合键中包含 `NULL` 时，也会将 `NULL` 作为一组特定的数据, 在结果中会以“**不确定**”行（空行）的形式表现出来。

```sql
SELECT purchase_price, COUNT(*)
FROM Product
GROUP BY purchase_price;
```

执行结果(purchase_price为空的行即值为 `NULL` 的行):

|purchase_price | count |
| --- | --- |
| | 2 |
| 320 | 1 |
| 500 | 1 |
| 5000 | 1 |
| 2800 | 2 |
| 790 | 1 |

#### 使用`WHERE`子句时`GROUP BY`的执行结果

```sql
SELECT <列名1>, <列名2>, <列名3>, ……
FROM <表名>
WHERE
GROUP BY <列名1>, <列名2>, <列名3>, ……;
```

像这样使用 `WHERE` 子句进行汇总处理时，会先根据 `WHERE` 子句指 定的条件进行过滤，然后再进行汇总处理。请

- `GROUP BY` 和 `WHERE` 并用时:
- 书写的顺序是: `SELECT → 2. FROM → 3. WHERE → 4. GROUP BY`
- 执行的顺序是: `FROM → 2. WHERE → 3. GROUP BY → 4. SELECT`

#### 与聚合函数和 `GROUP BY` 子句有关的常见错误

- 错误1: 在`SELECT`子句中书写了多余的列
  - 在使用 `COUNT` 这样的聚合函数时，`SELECT` 子句中的元素有严格的限制。实际上，使用聚合函数时，`SELECT` 子句中只能存在以下三种元素。
    - 常数
    - 聚合函数
    - `GROUP BY`子句中指定的列名（也就是聚合键）

这里经常会出现的错误就是**把聚合键之外的列名书写在 `SELECT` 子句之中**。

```sql
-- 错误举例
SELECT product_name, purchase_price, COUNT(*)
FROM Product
GROUP BY purchase_price;
```

执行结果:

      ERROR：列"product,product_name"必须包含在GROUP BY子句之中，或者必须在聚合  函数内使用 行 1: SELECT product_name, purchase_price, COUNT(*)

错误原因: 列名 product_name 并没有包含在 `GROUP BY` 子句当中。因此，该列名也不能书写在 `SELECT` 子句之中

理解思路: 使用进货单价将表进行分组之后，一行就代表了一个组进货单价, 而不在分组中的其它字段, 到底显示该组中哪一个的值呢? 这里无法确定, 所以他们不能出现在 `SELECT` 中.

---

- 错误2: 在`GROUP BY`子句中写了列的别名
  - `SELECT` 子句中的项目可以通过 `AS` 关键字来指定别名。但是，在 `GROUP BY` 子句中是不能使用别名的。

```sql
-- 错误举例
SELECT product_type AS pt, COUNT(*)
FROM Product
GROUP BY pt;
```

PostgreSQL 执行上述 SQL 语句并不会发生错误，而会得到如下结果。但是这样的写法在其他 DBMS 中并不是通用的，因此 请大家不要使用。

错误原因: 是 SQL 语句在 DBMS 内部的执行顺序造成的—— `SELECT` 子句在 `GROUP BY` 子句之后执行。 在执行 `GROUP BY` 子句时，`SELECT` 子句中定义的别名，DBMS 还并不知道。

---

- 错误3: `GROUP BY`子句的结果能排序吗

答案是：“**随机的**”。想要按照某种特定顺序进行排序的话，需要在 `SELECT` 语句中进行指定。

---

- 错误4: 在 `WHERE` 子句中使用聚合函数

只有 `SELECT` 子句和 `HAVING` 子句（以及之后将要学到的 `ORDER BY` 子句）中能够使用 `COUNT` 等聚合函数。并且，`HAVING` 子 句可以非常方便地实现上述要求。

### 为聚合结果指定条件

- 使用 `COUNT` 函数等对表中数据进行汇总操作时，为其指定条件的不是 `WHERE` 子句，而是 `HAVING` 子句。
- 聚合函数可以在 `SELECT` 子句、`HAVING` 子句和`ORDER BY`子句中使用。
- `HAVING` 子句要写在 `GROUP BY` 子句之后。
- `WHERE` 子句用来指定数据行的条件，`HAVING` 子句用来指定分组的条件。

#### `HAVING` 子句

`WHERE` 子句只能指定记录（行）的条件，而不能用来指定组的条件, 此时便可以用 `HAVING` 子句

```sql
SELECT <列名1>, <列名2>, <列名3>, ……
FROM <表名>
GROUP BY <列名1>, <列名2>, <列名3>, ……
HAVING <分组结果对应的条件>
```

`HAVING` 子句必须写在 `GROUP BY` 子句之后，其在 DBMS 内部的执行顺序也排在 `GROUP BY` 子句之后。

使用 `HAVING` 子句时 `SELECT` 语句的书写顺序: `SELECT → FROM → WHERE → GROUP BY → HAVING`

使用举例:

```sql
-- 从按照商品种类进行分组后的结果中，取出“包含的数据行数为2 行”的组
SELECT product_type, COUNT(*)
FROM Product
GROUP BY product_type
HAVING COUNT(*) = 2;
```

#### `HAVING` 子句的构成要素

`HAVING` 子句和包含 `GROUP BY` 子句时的 `SELECT` 子句一样，能 够使用的要素有一定的限制，限制内容也是完全相同的。`HAVING` 子句中 能够使用的 3 种要素如下所示。

- 常数
- 聚合函数
- `GROUP BY`子句中指定的列名（即聚合键）

`HAVING COUNT （*）= 2` 这样的条件，其中 `COUNT（*）`是聚合函数，`2` 是常数，全都满足上述要求。反之，如果写成了下面这个样子就会发生错误:

```sql
SELECT product_type, COUNT(*)
FROM Product
GROUP BY product_type
HAVING product_name = '圆珠笔';
```

`product_name` 列并不包含在 `GROUP BY` 子句之中，因此不允许写在 `HAVING` 子句里。可以把这种情况想象为使用 `GROUP BY` 子句时的 `SELECT` 子句。 汇总之后得到的表中并不存在 `product_name` 这个列，SQL 当然无法为表中不存在的列设定条件了。

#### 相对于 `HAVING` 子句，更适合写在 `WHERE` 子句中的条件

有些条件既可以写在 `HAVING` 子句当中，又可以写在 `WHERE` 子句当中。这些条件就是聚合键所对应的条件。虽然条件分别写在 WHERE 子句和 HAVING 子句当中返回的结果都完全相同。但笔者却认为，聚合键所对应的条件还是应该书写在 `WHERE` 子句之中。理由如下:

- 逻辑分明
  - `WHERE` 子句 = 指定行所对应的条件
  - `HAVING` 子句 = 指定组所对应的条件
- 执行效率
  - 通过 `WHERE` 子句指定条件时，由于排序之前就对数据进行了过滤
  - `HAVING` 子句是在排序之后才对数据进行分组的，因此与 在 `WHERE` 子句中指定条件比起来，需要排序的数据量就会多得多。
  - 可以对 `WHERE` 子句指定条件所对应的列创建索引，这样也可以大幅提高处理速度。

### 对查询结果进行排序

- 使用 `ORDER BY` 子句对查询结果进行排序。
- 在 `ORDER BY` 子句中列名的后面使用关键字 `ASC` 可以进行升序排序，使用 `DESC` 关键字可以进行降序排序。
- `ORDER BY` 子句中可以指定多个排序键。
- 排序健中包含 `NULL` 时，会在开头或末尾进行汇总。
- `ORDER BY` 子句中可以使用 `SELECT` 子句中定义的列的别名。
- `ORDER BY` 子句中可以使用 `SELECT` 子句中未出现的列或者聚合函数。
- `ORDER BY` 子句中不能使用列的编号。

#### `ORDER BY`子句

不加 `ORDER BY` 的时候, 排序结果是随机的, 即便是看似有序, 也可能下一次顺序大为不同.

```sql
SELECT <列名1>, <列名2>, <列名3>, ……
FROM <表名>
ORDER BY <排序基准列1>, <排序基准列2>, ……
```

不论何种情况，`ORDER BY` 子句都需要写在 `SELECT` 语句的末尾, 因为对数据行进行排序的操作必须在结果即将返回时执行。

当前书写顺序: `1. SELECT 子句 → 2. FROM 子句 → 3. WHERE 子句 → 4. GROUP BY 子句 → 5. HAVING 子句 → 6. ORDER BY 子句`

- `DESC`: 降序排列
- `ASC`: 升序排列

**注意**: 省略该关键字时会默认使用升序(`ASC`)进行排序。

##### 指定多个排序键

时指定多个排序键的规则是优先使用左侧的键，如果该列存在相同值的话，再接着参考右侧的键。

```sql
SELECT product_id, product_name, sale_price, purchase_price
FROM Product
ORDER BY sale_price, product_id;
```

##### `NULL` 的顺序

在第 2 章中说过（2-2 节），不能对 `NULL` 使用比较运算符，含有 `NULL` 的列作为排序键时，`NULL` 会在结果的开头或末尾汇总显示。究竟是在开头显示还是在末尾显示，并没有特殊规定。某些 DBMS 中可以指定 `NULL` 在开头或末尾显示。

##### 在排序键中使用显示用的别名

在 `GROUP BY` 子句中不能使用 `SELECT` 子句中定义的别名，但是在 `ORDER BY` 子句中却是允许使用别 名的, 原因也是执行顺序的不同:

- 使用 `HAVING` 子句时 `SELECT` 语句的顺序: `FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY`

这只是一个粗略的总结，虽然具体的执行顺序根据 DBMS 的不同而不同. 但一定要记住 `SELECT` 子 句的执行顺序在 `GROUP BY` 子句之后，`ORDER BY` 子句之前。

##### `ORDER BY`子句中可以使用的列

- `ORDER BY` 子句中也可以使用存在于表中、但并不包含在 `SELECT` 子句之中的列

```sql
SELECT product_name, sale_price, purchase_price
FROM Product
ORDER BY product_id;
```

- `ORDER BY` 子句中也可以使用聚合函数

```sql
SELECT product_type, COUNT(*)
FROM Product
GROUP BY product_type
ORDER BY COUNT(*);
```

## 第 4 章 数据更新

- 数据的插入（INSERT语句的使用方法）
- 数据的删除（DELETE语句的使用方法）
- 数据的更新（UPDATE语句的使用方法）
- 事务