# [Vinyl](https://www.npmjs.com/package/vinyl)

vinyl 是一个简单的文件描述对象，包含了文件的各种属性，可用于描述网络文件。

## 用法
```javascript
var Vinyl = require('vinyl');

var jsFile = new Vinyl({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js',
  contents: new Buffer('var x = 123')
});
```

## API

### new Vinyl([options])

用于创建Vinyl实例的构造函数，每个实例代表一个互不干扰的文件、目录或者文件链接

#### `options`

options 不会被构造函数改变

##### `options.cwd`

文件当前工作目录

type: `String`

default: `process.cwd()`

#### `options.base`

用于计算 `relative` 属性，这是 glob 最开始的地方

type: `String`

default: `options.cwd`

#### `options.path`

文件的全路径

type: `String`

default: `undefined`

#### `options.history`

存放历史路径，如果 `options.path` 和 `options.history` 都传入，则 `options.path` 会被追加到 `options.history` 。 所有的 `options.history` 都被 `file.path` setter 标准化。

type: `Array`

default: `[]` (如果 `options.path`被传入则为 `[options.path]`)

#### `options.stat`

fs.stat 的返回值，see [options.stat](https://github.com/gulpjs/vinyl#optionsstat)

type: `fs.Stats`

default: `undefined`

#### `options.contents`

文件内容，如果 `options.contents` 是个 Stream 类型，则会被封装在 [`cloneable-readable`](https://github.com/mcollina/cloneable-readable) stream 中

type: `Stream`, `Buffer` 或者 `null`

default: `null`

#### `options.{custom}`

custom为自定义属性，任何其他的属性将会被直接赋值给创建好的Vinyl object。

```
var Vinyl = require('vinyl');

var file = new Vinyl({ foo: 'bar' });
file.foo === 'bar'; // true
```

### 实例方法 (Instance methods)

#### `file.isBuffer()`

文件内容是 `Buffer` 返回 `true`，否则返回 `false`

#### `file.isStream()`

文件内容是 `Stream` 返回 `true`，否则返回 `false`

#### `file.isNull()`

文件内容是 `null` 返回 `true`，否则返回 `false`

#### `file.isDirectory()`

文件如果是目录，返回 `true`，否则返回 `false`

文件会被当做目录的条件：
- `file.isNull()` 返回 true
- `file.stat` 为 object
- `file.stat.isDirectory()` 返回 true

当构造一个 Vinyl 对象的时候，通过 `options.stat` 传入一个有效的 `fs.Stats` 对象。如果是模拟 `fs.Stats` 对象，可能需要对 `isDirectory()` 方法做存根。

#### `file.isSymbolic()`

文件如果是一个软连接 (symbolic link) 返回 `true`，否则返回 `false`

文件被当做软连接的条件：
- `file.isNull()` 返回 `true`
- `file.stat` 为 object
- `file.stat.isSymbolicLink()` 返回 `true`

当构造一个 Vinyl 对象的时候，通过 `options.stat` 传入一个有效的 `fs.Stats` 对象。如果是模拟 `fs.Stats` 对象，可能需要对 `isSymbolicLink()` 方法做存根。

#### `file.clone([options])`

返回新的 Vinyl object，并且所有属性都被克隆在里面。

默认情况下，自定义属性会被深复制(cloned deeply)。

如果 `options` 或者 `options.deep` 为 `false`，则自定义属性会被浅复制。

如果 `file.contents` 是 `Buffer` 并且 `options.contents` 是 `false`，则 `Buffer` 会被重用而非复制

#### `file.inspect()`

返回 Vinyl object 的格式化字符串的解释，自动被 node 的 console.log() 调用。

### 实例属性 (Instance properties)

#### `file.contents`

用于获取(get) 和设置(set) 文件内容，如果设置为 `Stream`，则会被封装到 cloneable-readable stream，因为 Vinyl 不会改变入参。

设置为 `Stream`、 `Buffer` 或者 `null` 之外的值则会抛出异常

type: `Stream`、`Buffer` 或者 `null`

#### `file.cwd`

用于获取(get) 和设置(set) 当前工作目录。将始终会被标准化并且删除尾部分隔符

设置为非空字符串的其它值将会抛出异常

type: `String`

#### `file.base`

用于获取(get) 和设置(set) 当前 base 目录，用于相对路径。如果是 `null` 或者 `undefined` 则会代理 `file.cwd` 属性。将始终会被标准化并且删除尾部分隔符

设置为非空字符串或者 `null`/`undefined` 的其它值将会抛出异常

type: `String`

#### `file.path`

用于获取(get) 和设置(set) 绝对路径或者 `undefined`，设置一个不同的值并且被添加到 `file.history` 尾部，如果设置为当前值，将会被忽略。所有的新值将始终会被标准化并且删除尾部分隔符

设置为非字符串类型，将会抛出异常

type: `String`

#### `file.history`

保存 Vinyl object 曾经使用过的历史路径。`file.history[0]` 为最初路径， `file.history[file.history.length - 1]` 位当前路径。 `file.history` 和 它的每一个元素应该被当做只读属性， 并且被设置 `file.path` 的时候间接改变。

type: `Array`

#### `file.relative`

用于获取(get) `path.relative(file.base, file.path)`

当设置该值时 或者 获取该值时`file.path` 未被设置而抛出异常

type: `Array`

Example:

```javascript
var file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js'
});

console.log(file.relative); // file.js
```

#### `file.dirname`

用于获取(get) 和设置(set) `file.path` 的目录名。将始终会被标准化并且删除尾部分隔符

当 `file.path` 未赋值而抛出异常

type: `String`

Example:

```javascript
var file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js'
});

console.log(file.dirname); // /test

file.dirname = '/specs';

console.log(file.dirname); // /specs
console.log(file.path); // /specs/file.js
```

#### `file.basename`

用于获取(get) 和设置(set) `file.path` 的文件名

当 `file.path` 未设置的时候抛出异常

type: `String`

Example:

```javascript
var file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js'
});

console.log(file.basename); // file.js

file.basename = 'file.txt';

console.log(file.basename); // file.txt
console.log(file.path); // /test/file.txt
```

#### `file.stem`

用于获取(get) 和设置(set) `file.path` 的stem(无后缀文件名)

当 `file.path` 未设置而抛出异常

type: `String`

Example:

```javascript
var file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js'
});

console.log(file.stem); // file

file.stem = 'foo';

console.log(file.stem); // foo
console.log(file.path); // /test/foo.js
```

#### `file.extname`

用于获取(get) 和设置(set) 文件的扩展名

当 `file.path` 未设置时抛出异常

type:  `String`

Example:

```javascript
var file = new File({
  cwd: '/',
  base: '/test/',
  path: '/test/file.js'
});

console.log(file.extname); // .js

file.extname = '.txt';

console.log(file.extname); // .txt
console.log(file.path); // /test/file.txt
```

#### `file.symlink`

如果文件是软连接文件，则用于获取(get) 和设置(set) 文件指向的路径，将始终会被标准化并且删除尾部分隔符

当设置为非字符串类型时抛出异常

type: `String`

### 静态(Static) 方法（类方法）

#### `Vinyl.isVinyl(file)`

该静态方法用于检查 object 是否是 Vinyl file，使用该方法替代 `instanceof`

如果 object 为 Vinyl file 则返回 `true`，否则返回 `false`

注意：此方法使用一个内部交换标志，某些版本的 Vinyl 没有公开

Example:

```javascript
var Vinyl = require('vinyl');

var file = new Vinyl();
var notAFile = {};

Vinyl.isVinyl(file); // true
Vinyl.isVinyl(notAFile); // false
```

#### `Vinyl.isCustomProp(property)`

该静态方法被 Vinyl 用于在 constructor 中设置值或者当在 `file.clone()` 中复制属性的时候自动调用。参考 [Extending Vinyl](#user-content-extending-vinyl)

参数 `property`　为字符串，如果该property 在内部未使用，则返回 `true`，否则返回 `false`

该方法在继承 Vinyl constructor 的时候非常有用，参考 [Extending Vinyl](https://github.com/gulpjs/vinyl#extending-vinyl)

Example:

```javascript
var Vinyl = require('vinyl');

Vinyl.isCustomProp('sourceMap'); // true
Vinyl.isCustomProp('path'); // false -> internal getter/setter
```

### 规范化和连接 (Normalization and concatenation)

因为所有的属性都被它的 setter 规范化，所以你可以使用 `/` 连接他们。并且规范化在所有平台上正确地处理它。

Example:
```javascript
var file = new File();
file.path = '/' + 'test' + '/' + 'foo.bar';

console.log(file.path);
// posix => /test/foo.bar
// win32 => \\test\\foo.bar
```
 注意：不要使用 `\`连接，因为在 POSIX 系统这是一个有效的文件名字符

### <a name="extending-vinyl" id="extending-vinyl">扩展 Vinyl (Extending Vinyl)</a>

当你需要将 Vinyl 扩展到你自己的类中，你需要考虑以下事情：

当你有自己的属性需要在内部做处理时，你需要继承静态方法 `isCustomProp` 来查询该属性是否在 Vinyl 中，返回 `false` 则可以使用该属性。

```javascript
var Vinyl = require('vinyl');

var builtInProps = ['foo', '_foo'];

class SuperFile extends Vinyl {
  constructor(options) {
    super(options);
    this._foo = 'example internal read-only value';
  }

  get foo() {
    return this._foo;
  }

  static isCustomProp(name) {
    return super.isCustomProp(name) && builtInProps.indexOf(name) === -1;
  }
}
```

上例使得属性 foo 和 \_foo 在克隆时被忽略，当在传递给构造函数的 options 时他们不会被分配给新对象

`clone()` 亦是如此，如果你在内部有自己的东西需要克隆中做特殊处理的，也应该在扩展的时候这样做。
