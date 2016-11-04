# liquid-fire

## Template Helpers
- {{#liquid-outlet}} 用于路由之间的变换
- {{#liquid-bind}} 在不同 model 或者不同 value 之间
- {{#liquid-if}} 在条件判断 true 和 false 之间变换
- {{#liquid-spacer}} 提供给 container 使用

### 共同的表现和选项（Common Behavior and Options）
- <div class="liquid-container"> 作为所有动画的容器，默认为 position: relative;
- <div class="liquid-child"> 作为动画的目标元素
- 无论什么时候数据跟新，以上 helper 都会查询 transition map 来决定如何执行动画
- 在动画过程中， liquid-container 将会包含 liquid-child 的离开和进入状态，在动画期间 transition 有完全的控制权。
- liquid-container 将会采用平滑的动画来改变它的大小来适应不同需求
- liquid-fire 在动画执行的时候会将内容绝对定位在动画需要执行的位置，并保持在正常文档流中

#### options
- class: 该属性会应用在 liquid-container 元素上
- 跳过 transition map 直接执行该 transition, 如 use="crossFade", 在不关心上下文而且又需要使用 transition 的时候非常有用。
- growDuration: 默认 250 毫秒
- growPixelsPerSecond: 默认 200 像素每秒
- growEasing: 改变 container 大小的缓冲函数，默认为 "slide"
- enableGrowth: 代表 container 是否应该改变它的大小，默认为 true

### {{#liquid-outlet}} ，使用场景：需要在路由之间执行动画
- 它具有 {{outlet}} 的功能
- 它会查询 transition map，提供路由之间转换动画的功能
- 它会添加标记，将内容封装在非虚拟视图中
- 它不支持传入 view 选项来覆盖它的 view 类

### {{liquid-bind}} ， 使用场景：将双向绑定的值传入模板，在 transition map 中定义当绑定的值发生改变的时候执行何种操作
- 使用 {{#liquid-bind}} 来展示下一页，使用场景：在同一个 route 的不同 models 之间执行动画
> 如果使用 block 模式的 {{#liquid-bind}}，每个绑定的值发生改变的时候都会导致整个块重绘

### {{#liquid-if}} {{#liquid-unless}}
- 包含 {{#if}} 的功能
- 查询 transition map，在条件为 true 和 false 之间执行动画
- 将内容封装在标记元素中

### {{#liquid-spacer}} . 使用场景：用于平滑的改变 container 的大小以适应内部元素的改变

## Transition Map
当某个 liquid helper 检测到更新并且需要执行动画的时候，它会查询 transition map。
- transition： 创建一条 transition 规则来管理何时执行某个动画。该规则由一个或多个约束和 use 陈述组成，只有当所有约束满足的情况下，使用 use 指定的动画才会执行。
- setDefault： 使用 名/值 对设置到 $.Velocity.defaults 上，它为缓冲函数和动画持续时间等提供了全局的默认设置。

### Route Constraints
#### 通过 route 和 model 匹配
以下三个约束适用于路由名称，它们只对 {{liquid-outlet}} 有用，因为 {{liquid-outlet}} 拥有进入 routes 的能力，其它 liquid helper 不能获得路由的任何信息
>
- fromRoute: 匹配 transition 开始时的路由名
- toRoute: 匹配 transition 结束时的路由名
- withinRoute: 匹配 transition 开始和结束时路由名相同的元素，对路由不需要改变的情况非常有帮助

以上三个约束接受一个参数，参数可以是字符串类型的路由名，一个测试路由名的函数或者一个包含前面两种类型的列表

> 以下三个约束适应于路由的 models，只对 {{liquid-outlet}} 有效
- fromModel: 匹配　transition　开始时候的路由　models
- toModel: 匹配　transition 结束时候的路由 models
- betweenModels: fromModel 和 toModel 的简写

以上三个约束接受一个用于测试 model 的函数，该函数接受 model 作为第一个参数，返回一个 boolean ，可以将其它 model 作为可选参数放在第二个参数的位置。即： fromModel 接收 (oldModel, newModel) ， toModel 接受 (newModel, oldModel)

#### 通过 outlet 匹配
以下约束适用于 outlet name ，只会对 {{liquid-outlet}} 起作用，因为只有 {{liquid-outlet}} 才能获取到自己的 name 属性，如果没有默认的 name ，则为 "main"

#### 通过 value 匹配
以下约束适用于直接传入 value 到 helper 中的情况，适用于以下两个helper：
- {{liquid-bind}}: 匹配其绑定的上线问
- {{liquid-if}}: 匹配断言，即匹配真假

>
- fromValue: 匹配改变前的值
- toValue: 匹配改变之后的值
- betweenValues: 匹配改变前后的值

以上每项的参数可以是：
- 一个测试值的函数，返回 true 或者 false
- 正则表达式
- 布尔值
- 字符串或者数字，严格匹配
- null，它会匹配 null 或者 undefined

#### 通过 媒体查询 匹配
定义满足媒体查询结果才执行的动画
- media()  

eg:
>
this.media('(min-width: 321px) and (max-width: 768px)'),

>
this.media('(orientation:landscape)'),

#### 通过 DOM 和 Template 匹配
- hasClass: 匹配具有某个 class 的元素
- matchSelector: 匹配 css 选择器
- childOf: 匹配传入的 css 选择器是否是其父元素
- inHelper: 匹配是否是某个 liquid helper 内的元素，如 this.inHelper('liquid-if') will constrain the rule to only apply to {{#liquid-if}}.

#### Choosing transition animations
- use()
- reverse()
- useAndReverse()  // 作为 use 和 reverse 的简写


















































































。
