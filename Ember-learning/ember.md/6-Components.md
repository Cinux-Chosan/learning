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
