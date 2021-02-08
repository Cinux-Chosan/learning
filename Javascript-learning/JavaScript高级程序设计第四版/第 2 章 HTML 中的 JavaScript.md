# 第 2 章 HTML 中的 JavaScript

- `defer`：立即下载，但在浏览器解析到 `</html>` 完成后才执行。声明 `defer` 的 `script` 会在事件 `DOMContentLoaded` 后执行。
- `async`：告诉浏览器立即下载该脚本，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。其保证在 `load` 之前执行，但可能会在 `DOMContentLoaded` 前后执行。
- 关于资源的预加载：[通过rel="preload"进行内容预加载](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content#%E5%93%AA%E4%BA%9B%E7%B1%BB%E5%9E%8B%E7%9A%84%E5%86%85%E5%AE%B9%E5%8F%AF%E4%BB%A5%E8%A2%AB%E9%A2%84%E5%8A%A0%E8%BD%BD%EF%BC%9F)