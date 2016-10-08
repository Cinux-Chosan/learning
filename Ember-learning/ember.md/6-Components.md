# Components

## Defining a Component
- 动态渲染不同Component：使用{{component}}组件，如{{component 'blog-post'}}与{{blog-post}}达到相同渲染目的

## The Component Lifecycle
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
