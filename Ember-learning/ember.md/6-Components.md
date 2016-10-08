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
