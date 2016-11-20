# JSONAPI

- JSON API 需要使用 JSON API 媒体类型来交换数据(application/vnd.api+json)

## 规则
### 顶层 Top level
- 最外层必须为 Object，它为文档的顶级
- 最外层必须包含至少以下之一（顶层属性）：

>
- data: 文档的主要数据，它是资源或者资源集合的表现  （不能与 errors 同时出现），data 规则如下：

>>
- 单资源对象， Object 或者 null，无数据为 null
- 资源对象的数组， Array 或者 []，无数据为 []

- errors: 包含错误的对象的数组 （不能与 data 同时出现）
- meta

- 最外层可能包含以下属性（顶层属性）：

>
- jsonapi: 描述服务端实现的对象 Object
- included: 与 data 有关的资源对象（resource object）的数组 Array （次属性必须在有data的情况下才可能有）
- links: 与 data 有关的连接对象 Object，它可能包含如下成员：

>>
- self: 生成当前响应文档的链接
- related: 当 data 代表一个资源关系的时候，该属性为相关资源的链接
- pagination: data 的分页链接

### 二层
- data 资源对象必须包含如下两个成员：

>
- id: 当数据从客户端发送到服务端的时候，不需要id，它代表一条需要在服务端创建的资源
- type

- data 资源对象可以包含一下属性

>
- attributes: 代表资源的数据  Object
- relationships: 描述本资源与其它JSON API 资源的关系  Object
- links: 包含本资源的引用链接  Object
- meta: 不能用来代表attributes和relationships的非标准元数据

#### 字段(fields)：attributes 和 relationships 共同被称为字段

#### 属性(attributes) 不能包含 relationships 和 links

#### 关系(Relationships) 可能是一对一或者一对多
关系必须至少包含以下之一
- links: links 至少包含 self 和 related
- data: 资源链接
- meta: 关于关系的非标准元数据 Object
