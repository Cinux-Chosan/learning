# Code-Splitting

## Bundling

Most React apps will have their files “bundled” using tools like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/). Bundling is the process of following imported files and merging them into a single file: a “bundle”. This bundle can then be included on a webpage to load an entire app at once.

大多数 React 应用都会使用 [Webpack](https://webpack.js.org/) 或者 [Browserify](http://browserify.org/) 来打包。打包是一个将多个相关文件合并成一个文件的过程。这个包可以被包含在网页中使得浏览器可以一次性加载整个网页。

Example

**App**:

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundle**:

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

Note:

Your bundles will end up looking a lot different than this.

需要注意的是，你打包后的代码可能和这个看起来不太一样。

If you’re using [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/), or a similar tool, you will have a Webpack setup out of the box to bundle your app.

如果你使用 [Create React App](https://github.com/facebookincubator/create-react-app), [Next.js](https://github.com/zeit/next.js/), [Gatsby](https://www.gatsbyjs.org/) 或其他类似的工具，它们可能已经集成和配置好了 Webpack，直接使用即可。

If you aren’t, you’ll need to setup bundling yourself. For example, see the [Installation](https://webpack.js.org/guides/installation/) and [Getting Started](https://webpack.js.org/guides/getting-started/) guides on the Webpack docs.

如果你并不是使用上面提到的那些工具，那就需要你手动对打包进行配置。如果需要示例，请参考 Webpack 文档的 [Installation](https://webpack.js.org/guides/installation/) 和 [Getting Started](https://webpack.js.org/guides/getting-started/) 部分。

## Code Splitting

Bundling is great, but as your app grows, your bundle will grow too. Especially if you are including large third-party libraries. You need to keep an eye on the code you are including in your bundle so that you don’t accidentally make it so large that your app takes a long time to load.

To avoid winding up with a large bundle, it’s good to get ahead of the problem and start “splitting” your bundle. [Code-Splitting](https://webpack.js.org/guides/code-splitting/) is a feature supported by bundlers like Webpack and Browserify (via [factor-bundle](https://github.com/browserify/factor-bundle)) which can create multiple bundles that can be dynamically loaded at runtime.

Code-splitting your app can help you “lazy-load” just the things that are currently needed by the user, which can dramatically improve the performance of your app. While you haven’t reduced the overall amount of code in your app, you’ve avoided loading code that the user may never need, and reduced the amount of code needed during the initial load.

## import()

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.

**Before**:

```js
import { add } from './math';

console.log(add(16, 26));
```

**After**:

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Note:

The dynamic `import()` syntax is a ECMAScript (JavaScript) [proposal](https://github.com/tc39/proposal-dynamic-import) not currently part of the language standard. It is expected to be accepted in the near future.

When Webpack comes across this syntax, it automatically starts code-splitting your app. If you’re using Create React App, this is already configured for you and you can start using it immediately. It’s also supported out of the box in Next.js.

If you’re setting up Webpack yourself, you’ll probably want to read Webpack’s guide on code splitting. Your Webpack config should look vaguely like this.

When using Babel, you’ll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need babel-plugin-syntax-dynamic-import.

When Webpack comes across this syntax, it automatically starts code-splitting your app. If you’re using Create React App, this is already configured for you and you can [start using it](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting) immediately. It’s also supported out of the box in [Next.js](https://github.com/zeit/next.js/#dynamic-import).

If you’re setting up Webpack yourself, you’ll probably want to read Webpack’s [guide on code splitting](https://webpack.js.org/guides/code-splitting/). Your Webpack config should look vaguely [like this](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

When using [Babel](http://babeljs.io/), you’ll need to make sure that Babel can parse the dynamic import syntax but is not transforming it. For that you will need [babel-plugin-syntax-dynamic-import](https://yarnpkg.com/en/package/babel-plugin-syntax-dynamic-import).

## React.lazy

**文档未完结**