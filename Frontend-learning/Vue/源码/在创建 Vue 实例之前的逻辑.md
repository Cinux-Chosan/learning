# Vue 导出之前

本章我们主要看看在创建 Vue 实例之前 —— 即 `import Vue` 之前，Vue 都做了哪些操作。

---

## 第一级初始化

Vue 的初始化是分层的，也就是说在导出 Vue 之前的整个引用链上都会对 Vue 进行初始化，我们先从最底层代码说起（文件位于`src/core/instance/index.js`）：

```ts
import { initMixin } from "./init";
import { stateMixin } from "./state";
import { renderMixin } from "./render";
import { eventsMixin } from "./events";
import { lifecycleMixin } from "./lifecycle";
import { warn } from "../util/index";

function Vue(options) {
  if (process.env.NODE_ENV !== "production" && !(this instanceof Vue)) {
    warn("Vue is a constructor and should be called with the `new` keyword");
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

export default Vue;
```

- `initMixin`

  - 添加 `Vue.prototype._init`

- `stateMixin`

  - 添加 `Vue.prototype.$data`
  - 添加 `Vue.prototype.$props`
  - 添加 `Vue.prototype.$set`
  - 添加 `Vue.prototype.$delete`
  - 添加 `Vue.prototype.$watch`

- `eventsMixin`

  - 添加 `Vue.prototype.$on`
  - 添加 `Vue.prototype.$once`
  - 添加 `Vue.prototype.$off`
  - 添加 `Vue.prototype.$emit`

- `lifecycleMixin`

  - 添加 `Vue.prototype._update`
  - 添加 `Vue.prototype.$forceUpdate`
  - 添加 `Vue.prototype.$destroy`

- `renderMixin`

  - 给 `Vue.prototype` 添加渲染相关的辅助函数，如 `createTextVNode`、`createEmptyVNode` 等
  - 添加 `Vue.prototype.$nextTick`
  - 添加 `Vue.prototype._render`

以上就是最初的每个初始化函数所做的操作，我把这个操作称之为第一级初始化，完成第一级初始化之后，将 Vue 导出。

---

## 第二级初始化

完成上面的初始化之后，接下来是二级初始化，即下面的初始化（文件位于`src/core/index.js`）：

```ts
import Vue from "./instance/index";
import { initGlobalAPI } from "./global-api/index";
import { isServerRendering } from "core/util/env";
import { FunctionalRenderContext } from "core/vdom/create-functional-component";

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, "$isServer", {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, "$ssrContext", {
  get() {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext;
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, "FunctionalRenderContext", {
  value: FunctionalRenderContext
});

Vue.version = "__VERSION__";

export default Vue;
```

在这个文件中，我们可以清晰的看到首先使用 `initGlobalAPI` 对 Vue 进行初始化，其代码如下（位于文件`src/core/global-api/index.js`）：

```ts
export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn("Do not replace the Vue.config object, set individual fields instead.");
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(type => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}
```

- 添加 `Vue.config`
- 添加 `Vue.util`，其中包含如下函数：
  - `warn`
  - `extend`
  - `mergeOptions`
  - `defineReactive`
- 添加 `Vue.set`
- 添加 `Vue.delete`
- 添加 `Vue.nextTick`
- 添加 `Vue.observable`
- 添加 `Vue.options`
  - 初始化 `Vue.options.components = {}`
  - 初始化 `Vue.options.directives = {}`
  - 初始化 `Vue.options.filters = {}`
- 添加 `Vue.options._base = Vue`
- 将 `builtInComponents` 复制到 `Vue.options.components` 中，其中只有一个组件：
  - `KeepAlive`
- `initUse`
  - 添加 `Vue.use`
- `initMixin`
  - 添加 `Vue.mixin`
- `initExtend`
  - 添加 `Vue.cid = 0`
  - 添加 `Vue.extend`
- `initAssetRegisters`
  - 创建资源的注册函数，用于注册资源，如 `Vue.component('my-comp', MyComp)`，资源包括
    - `component`：添加 `Vue.component` 方法
    - `directive`：添加 `Vue.directive` 方法
    - `filter`：添加 `Vue.filter` 方法

执行完上面的初始化之后，再

- 添加 `Vue.prototype.$isServer`
- 添加 `Vue.prototype.$ssrContext`
- 添加 `Vue.FunctionalRenderContext`
- 添加 `Vue.version`

执行完这些初始化之后，再次将 Vue 导出。

---

## 第三级初始化

第三级初始化的代码位于 `src/platforms/web/runtime/index.js`，这里的初始化逻辑就和特定平台有强关联性了，这些方法用于 Vue 在平台中渲染 virtual DOM 时使用，先来看看代码：

```ts
import Vue from "core/index";
import config from "core/config";
import { extend, noop } from "shared/util";
import { mountComponent } from "core/instance/lifecycle";
import { devtools, inBrowser } from "core/util/index";

import { query, mustUseProp, isReservedTag, isReservedAttr, getTagNamespace, isUnknownElement } from "web/util/index";

import { patch } from "./patch";
import platformDirectives from "./directives/index";
import platformComponents from "./components/index";

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function(el?: string | Element, hydrating?: boolean): Component {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating);
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(() => {
    if (config.devtools) {
      if (devtools) {
        devtools.emit("init", Vue);
      } else if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
        console[console.info ? "info" : "log"]("Download the Vue Devtools extension for a better development experience:\n" + "https://github.com/vuejs/vue-devtools");
      }
    }
    if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test" && config.productionTip !== false && typeof console !== "undefined") {
      console[console.info ? "info" : "log"](
        `You are running Vue in development mode.\n` +
          `Make sure to turn on production mode when deploying for production.\n` +
          `See more tips at https://vuejs.org/guide/deployment.html`
      );
    }
  }, 0);
}

export default Vue;
```

从这部分代码我们可以清晰的看到，第三级初始化实际上做的工作如下：

- 添加 `Vue.config.mustUseProp`
- 添加 `Vue.config.isReservedTag`
- 添加 `Vue.config.isReservedAttr`
- 添加 `Vue.config.getTagNamespace`
- 添加 `Vue.config.isUnknownElement`
- 将 `platformDirectives` 拷贝到 `Vue.options.directives` 中，其中包括：

  - `model`：用于支持 `v-model` 功能
  - `show`：用于支持 `v-show` 功能

- 将 `platformComponents` 拷贝到 `Vue.options.components` 中，其中包括：
  - `Transition`
  - `TransitionGroup`
- 添加 `Vue.prototype.__patch__`
- 添加 `Vue.prototype.$mount`
- 根据环境启用浏览器的 Vue devtool 插件

---

## 第四级初始化

四级初始化是一个可选初始化，当你使用 Vue 完整版的时候才会有第四级初始化，如果是使用 runtime 版本则不会有这个初始化操作。

第四级初始化的代码位于 `src/platforms/web/entry-runtime-with-compiler.js` 中，它做的操作实际上只是对 `Vue.prototype.$mount` 做了一个函数劫持，为什么要进行函数劫持呢？这是由于完整版的 Vue 通常直接用于 html 中，当挂载组件之前可能会对组件模板进行编译，劫持的目的就在于此，它会在真正调用 `$mount` 之前加入对模板的编译操作。

```ts
/* @flow */

import config from "core/config";
import { warn, cached } from "core/util/index";
import { mark, measure } from "core/util/perf";

import Vue from "./runtime/index";
import { query } from "./util/index";
import { compileToFunctions } from "./compiler/index";
import { shouldDecodeNewlines, shouldDecodeNewlinesForHref } from "./util/compat";

const idToTemplate = cached(id => {
  const el = query(id);
  return el && el.innerHTML;
});

const mount = Vue.prototype.$mount;
Vue.prototype.$mount = function(el?: string | Element, hydrating?: boolean): Component {
  el = el && query(el);

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== "production" && warn(`Do not mount Vue to <html> or <body> - mount to normal elements instead.`);
    return this;
  }

  const options = this.$options;
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template;
    if (template) {
      if (typeof template === "string") {
        if (template.charAt(0) === "#") {
          template = idToTemplate(template);
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== "production" && !template) {
            warn(`Template element not found or is empty: ${options.template}`, this);
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML;
      } else {
        if (process.env.NODE_ENV !== "production") {
          warn("invalid template option:" + template, this);
        }
        return this;
      }
    } else if (el) {
      template = getOuterHTML(el);
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile");
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== "production",
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments
        },
        this
      );
      options.render = render;
      options.staticRenderFns = staticRenderFns;

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== "production" && config.performance && mark) {
        mark("compile end");
        measure(`vue ${this._name} compile`, "compile", "compile end");
      }
    }
  }
  return mount.call(this, el, hydrating);
};

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 */
function getOuterHTML(el: Element): string {
  if (el.outerHTML) {
    return el.outerHTML;
  } else {
    const container = document.createElement("div");
    container.appendChild(el.cloneNode(true));
    return container.innerHTML;
  }
}

Vue.compile = compileToFunctions;

export default Vue;
```

从上面代码可以看出，其功能主要如下：

- 对 `Vue.prototype.$mount` 进行函数劫持
- 添加 `Vue.compile`
