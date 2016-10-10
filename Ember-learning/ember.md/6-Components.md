# Components

## Defining a Component
- 动态渲染不同Component：使用{{component}}组件，如{{component 'blog-post'}}与{{blog-post}}达到相同渲染目的

## The Component Lifecycle (需要细看)
### On Initial Render
- init
- didReceiveAttrs
- willRender
- didInsertElement
- didRender

### On Re-Render
- didUpdateAttrs
- didReceiveAttrs
- willUpdate
- willRender
- didUpdate
- didRender

### On Component Destroy
- willDestroyElement
- willClearRender
- didDestroyElement

## Passing Properties to a Component
### Positional Params （组建传入位置参数）
- 使用 positionalParams

        // templates
        {{#each model as |post|}}
          {{blog-post post.title post.body}}
        {{/each}}

        // components/blog-post.js
        const BlogPostComponent = Ember.Component.extend({});
        BlogPostComponent.reopenClass({
          positionalParams: ['title', 'body']
        });

- 如果 positionalParams 是字符串类型，则传入的参数会成为以该字符串命名的数组，此时可通过下标访问

        const BlogPostComponent = Ember.Component.extend({
          title: Ember.computed('params.[]', function(){
            return this.get('params')[0];
          }),
          body: Ember.computed('params.[]', function(){
            return this.get('params')[1];
          })
        });

        BlogPostComponent.reopenClass({
          positionalParams: 'params'
        });

- 组建的{{yield}}部分，在父级中调用的时候，作用于为父级的作用域。

### Sharing Component Data with its Wrapped Content
- 让组件同时可以访问父级（调用组件）的作用域环境和父级的父级（调用父级）的作用域环境，或者动态使用不同组件：

        comp-1.hbs:
        {{yield (hash body=(component 'comp-2' name=n age=a))}}

        comp-2.hbs:
        {{name}}:{{age}}

        application.hbs:
        {{#comp-1 as |comp|}}
          {{comp.body name="ZJJ"}}    // 此时 comp.body为comp-2组建，它的name为"ZJJ"，age为a的值
        {{/comp-1}}

### Customizing a Component's Element
- 定制组件最外层的包围标签：使用 tagName 属性来替代默认的<div>标签，如：tagName: 'nav'
- 定制class：
> 1. 调用的时候传入 class属性，class属性的值会被自动应用到组件最外层， 如： {{navigation-bar class="primary"}}

> 2. 使用classNames属性，同调用时传入class， 如： classNames: ['primary']

- 使用classNames灵活绑定：
> 根据某个属性，判断是否具有该class

        export default Ember.Component.extend({
          classNameBindings: ['isUrgent'],
          isUrgent: true
        });

        ///////////////渲染如下：
        <div class="ember-view is-urgent"></div>

> 根据属性，渲染非同名class

        export default Ember.Component.extend({
          classNameBindings: ['isUrgent:urgent'],
          isUrgent: true
        });

        ///////////////渲染如下：
        <div class="ember-view urgent">

> 类似于三元表达式的属性切换：

        export default Ember.Component.extend({
          classNameBindings: ['isEnabled:enabled:disabled'],
          isEnabled: false
        });        
        ////////////////或者
        export default Ember.Component.extend({
          classNameBindings: ['isEnabled::disabled'],
          isEnabled: false
        });

        ///////////////渲染如下：
        <div class="ember-view disabled">

> class直接与属性绑定      

        export default Ember.Component.extend({
          classNameBindings: ['priority'],
          priority: 'highestPriority'
        });

        /////////////渲染如下
        <div class="ember-view highestPriority">

### Customizing Attributes
- 给包含标签定制属性

        export default Ember.Component.extend({
          tagName: 'a',
          attributeBindings: ['href'],
          href: 'http://emberjs.com'
        });

        export default Ember.Component.extend({
          tagName: 'a',
          attributeBindings: ['customHref:href'],
          customHref: 'http://emberjs.com'
        });

        export default Ember.Component.extend({
          tagName: 'span',
          title: null,
          attributeBindings: ['title'],
        });

### Using Block Params
- 从组建返回参数到外部

        // 在组件blog-post.hbs中使用 yield 返回三个参数
        {{yield post.title post.body post.author}}

        // 在外部使用传出参数 title, body, author
        {{#blog-post post=model as |title body author|}}
          <h2>{{title}}</h2>
          <p class="author">by {{author}}</p>
          <div class="post-body">{{body}}</p>
        {{/blog-post}}

### Supporting both block and non-block component usage in one template
- 组件的 hasBlock 属性，自动根据组件的调用方式来确定值，在组件被调用的时候是使用 block 方式（带有 # 的块调用）为true，在使用内联方式调用时为 false


## Handling Events 处理事件
- 在组件中，需要处理的事件，直接在js中写对应的属性函数即可（controller中无效）：

        export default Ember.Component.extend({
          doubleClick() {
            alert("DoubleClickableComponent was clicked!");
            return true;    // 默认禁止冒泡，return true允许冒泡
          }
        });


### Sending Actions

- 直接通过参数传递

        {{drop-target action=(action "didDrop")}}

- 将action传递给浏览器默认事件

        <button onclick={{action 'signUp'}}>Sign Up</button>

- 获取浏览器event对象的方式有

> 1.定义浏览器默认事件，即直接在component.js中定义Ember默认支持的事件方法

> 2.将事件处理程序传递给标签元素的事件处理属性

[Ember事件处理方法](https://guides.emberjs.com/v2.8.0/components/handling-events/#toc_event-names)

###
- 向 action 多次传入参数

        // 组件的hbs：组件内部向外抛出 confirmValue
        {{yield confirmValue}}

        // 调用组件的父级的hbs：外部使用组件所抛出变量
        {{#button-with-confirmation
            text="Click to send your message."
            onConfirm=(action "sendMessage" "info")    // 传入sendMessage的第一个参数
            as |confirmValue|}}
          {{input value=confirmValue}}    // 使用组件抛出的值与input进行绑定
        {{/button-with-confirmation}}

        // 组件的js：组件内部再次向 sendMessage 传入第二个参数
        submitConfirm() {
           //call onConfirm with the value of the input field as an argument
           const promise = this.get('onConfirm')(this.get('confirmValue'));
           promise.then(() => {
             this.set('confirmShown', false);
           });
         }

         // 调用组件的父级的js：
         actions: {
            sendMessage(messageType, messageText) {    // 经过两次传参，分别接收两个参数
              //send message here and return a promise
            }
          }


### 使用 service 的 action 步骤：
- 在组件中注入对应service
- 在hbs中传入action的时候，加上 target属性，target为对应的 service
- 在service中实现对应的action

### action 的 value 属性：
- value属性会自动取参数中对应的属性值，如 {{action 'act1' value="id"}}，传入参数为 {id: 10000}; 则 act1(param) { } 中的 param 为 10000；如果params是一个{id: 500, name: 'ZJJ'}，则 {{action 'act1' params value="name"}}，则act1的参数为params.name即"ZJJ"

### action绑定到父级（节约js代码）
- {{action}}中，如果指向函数的参数名带有引号，则会在 actions:{} 中去匹配对应处理方法，如果不带引号，则会在属性中去查找，即该属性可能是父级传入的一个action

          // 调用组件的父级：
        {{sub-comp onConfirm=(action 'act1')}}
          // 组件 {{sub-comp}} 中可以直接使用：
        <button {{action onConfirm}}></button>



























.
