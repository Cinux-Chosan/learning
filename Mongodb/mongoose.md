# Mongoose

## Schema

### 定义 Schema

```js
import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String, // String is shorthand for {type: String}
  author: String,
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number,
  },
});
```

blogSchema 中的每一个键都对应一种 SchemaType，以下是 SchemaType 的类型：

- `String`
- `Number`
- `Date`
- `Buffer`
- `Boolean`
- `Mixed`
- `ObjectId`
- `Array`
- `Decimal128`
- `Map`
- `Schema`

如果一个键只需要定义类型，则可以直接将类型写在它后面（参考 title 和 date 两种不同写法）。

键也接受嵌套的对象，如果这个嵌套对象的键不包含 mongoose 特定的类型，则 mongoose 将其视为子模式（参考 meta 写法）。

Schema（模式）不仅可以定义文档结构和对属性进行类型转换，还可以定义文档实例的方法、Model 的静态方法、复合索引以及被称作[`中间件`](https://mongoosejs.com/docs/middleware.html)的文档生命周期钩子。

### 创建 Model

为了使用我们定义好的模式，需要我们将模式（Schema）转换为模型（Model）。只需要调用 `mongoose.model(modelName, schema)` 就可以了，如：

```js
const Blog = mongoose.model("Blog", blogSchema);
```

### id

默认情况下，Mongoose 会给模式添加 `_id` 属性。

```js
const schema = new Schema();

schema.path("_id"); // ObjectId { ... }
```

```js
const Model = mongoose.model("Test", schema);

const doc = new Model();
doc._id instanceof mongoose.Types.ObjectId; // true
```

### 实例方法

`模型（Model）`的实例被称作[`文档（document）`](https://mongoosejs.com/docs/documents.html)。文档有很多自己的实例方法，尽管如此，我们也可以给它添加自定义的实例方法，添加实例方法的方式有：

- 通过 `Schema.methods` 对象添加
- 通过 `Schema.method()` 方法添加

```js
// 定义一个模式
const animalSchema = new Schema({ name: String, type: String });

// 通过模式的 methods 给文档添加实例方法
animalSchema.methods.findSimilarTypes = function (cb) {
  return mongoose.model("Animal").find({ type: this.type }, cb);
};

var Animal = mongoose.model("Animal", animalSchema);
const dog = new Animal({ type: "dog" });

// 现在 dog 这个文档就具有了自定义的实例方法 findSimilarTypes
dog.findSimilarTypes((err, dogs) => {
  console.log(dogs);
});
```

### 静态方法

给 Model 添加静态方法的方式有：

- 通过 `Schema.statics` 对象添加
- 通过 `Schema.static()` 方法添加

```js
// 将函数添加到对应模式的 statics 对象中
animalSchema.statics.findByName = function (name) {
  return this.find({ name: new RegExp(name, "i") });
};
// 或者通过对应模式的 static() 方法添加
animalSchema.static("findByBreed", function (breed) {
  return this.find({ breed });
});

const Animal = mongoose.model("Animal", animalSchema);
let animals = await Animal.findByName("fido");
animals = animals.concat(await Animal.findByBreed("Poodle"));
```

- 因为 文档（document）是 模型（Model）的实例，因此静态方法需要添加到 Model 中。

### 查询函数

查询函数就像是实例方法，但是它是用于扩展 mongoose 查询的。

```js
animalSchema.query.byName = function (name) {
  return this.where({ name: new RegExp(name, "i") });
};

const Animal = mongoose.model("Animal", animalSchema);

Animal.find()
  .byName("fido")
  .exec((err, animals) => {
    console.log(animals);
  });

Animal.findOne()
  .byName("fido")
  .exec((err, animal) => {
    console.log(animal);
  });
```

### 索引

暂时略过

### 虚拟节点

虚拟节点也是文档的属性，你可以对它取值和赋值，但是它不会被存到数据库中。

虚拟节点的 getter 可以用来格式化组合字段，setter 则可以用来将单个值拆分为多个值进行存储。

```js
// define a schema
const personSchema = new Schema({
  name: {
    first: String,
    last: String,
  },
});

// compile our model
const Person = mongoose.model("Person", personSchema);

// create a document
const axl = new Person({
  name: { first: "Axl", last: "Rose" },
});

// 不使用虚拟节点打印全名
console.log(axl.name.first + " " + axl.name.last); // Axl Rose

// 使用虚拟节点打印全名
personSchema.virtual("fullName").get(function () {
  return this.name.first + " " + this.name.last;
});

console.log(axl.fullName); // Axl Rose
```

- `toJSON()` 和 `toObject()` 默认不会转换虚拟节点。包括对文档调用 `JSON.stringify()`，因为 `JSON.stringify()` 调用 `toJSON()`。可以通过给 `toJSON()` 或者 `toObject()` 传递 `{ virtuals: true }` 来表示需要对虚拟节点也进行转换。

- 虚拟节点的 setter 会在验证前调用。另外由于虚拟节点没有存在于 MongoDB 中，因此不能查询虚拟节点。

### 别名

别名也是一种虚拟节点，对别名的取值和赋值会悄无声息的设置到另一属性上。因此你可以在编程的时候将数据库中一个短的属性名映射为一个长的可阅读的属性名，这样也可以节省带宽。

```js
const personSchema = new Schema({
  n: {
    type: String,
    // 现在读取 name 会从 n 取值，对 n 赋值也会修改 name 的值
    alias: "name",
  },
});

// 修改 name 的值会传递给 n
const person = new Person({ name: "Val" });
console.log(person); // { n: 'Val' }
console.log(person.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
console.log(person.name); // "Val"

person.name = "Not Val";
console.log(person); // { n: 'Not Val' }
```

你也可以给嵌套的字段设置别名。虽然使用嵌套的模式或者子文档可以很轻易实现，但是你也可以 `nested.propName` 这种点号方式来声明别名：

```js
const childSchema = new Schema(
  {
    n: {
      type: String,
      alias: "name",
    },
  },
  { _id: false }
);

const parentSchema = new Schema({
  // 在子模式中，不需要写完整路径
  c: childSchema,
  name: {
    f: {
      type: String,
      // 内联形式的嵌套别名需要书写字段的完整路径
      alias: "name.first",
    },
  },
});
```

### 参数选项

模式（schema）有很多配置选项，可以直接传递给其构造函数或者通过 `set` 方法来设置：

```js
new Schema({..}, options);

// or

const schema = new Schema({..});
schema.set(option, value);
```

具体参数参考 [Schema options](https://mongoosejs.com/docs/guide.html#options)

## SchemaType

模式（Schema）定义模型（Model）。SchemaType 是模式中的一个用于定义字段元信息的配置对象，它定义了某个字段应该是什么类型，是否有 getter/setter 以及如何校验。

SchemaType 只是 Mongoose 中的一个配置对象。它不同于 type，换句话说 `mongoose.ObjectId !== mongoose.Types.ObjectId`，前者是 SchemaType 而后者是 type。SchemaType `mongoose.ObjectId` 的实例并不会真正的创建 MongoDB 的 ObjectId，它只是用来在模式中配置某个字段。

以下是 Mongoose 中允许的 SchemaType，也可以通过 Mongoose 插件添加自定义 SchemaType：

- `String`
- `Number`
- `Date`
- `Buffer`
- `Boolean`
- `Mixed`
- `ObjectId`
- `Array`
- `Decimal128`
- `Map`
- `Schema`

```js
var schema = new Schema({
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 65 },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  decimal: Schema.Types.Decimal128,
  array: [],
  ofString: [String],
  ofNumber: [Number],
  ofDates: [Date],
  ofBuffer: [Buffer],
  ofBoolean: [Boolean],
  ofMixed: [Schema.Types.Mixed],
  ofObjectId: [Schema.Types.ObjectId],
  ofArrays: [[]],
  ofArrayOfNumbers: [[Number]],
  nested: {
    stuff: { type: String, lowercase: true, trim: true },
  },
  map: Map,
  mapOfString: {
    type: Map,
    of: String,
  },
});

// example use

var Thing = mongoose.model("Thing", schema);

var m = new Thing();
m.name = "Statue of Liberty";
m.age = 125;
m.updated = new Date();
m.binary = Buffer.alloc(0);
m.living = false;
m.mixed = { any: { thing: "i want" } };
m.markModified("mixed");
m._someId = new mongoose.Types.ObjectId();
m.array.push(1);
m.ofString.push("strings!");
m.ofNumber.unshift(1, 2, 3, 4);
m.ofDates.addToSet(new Date());
m.ofBuffer.pop();
m.ofMixed = [1, [], "three", { four: 5 }];
m.nested.stuff = "good";
m.map = new Map([["key", "value"]]);
m.save(callback);
```

### `type` 键

`type` 是 schema 中一个特殊的属性。当 Mongoose 在 schema 嵌套的对象中找到 `type` 字段，则 Mongoose 会将这个对象看做是用于定义 SchemaType，即定义 schema 字段的对象。

```js
// 三种定义 string 类型的 SchemaType 的方式
const schema = new Schema({
  name: { type: String },
  nested: {
    firstName: { type: String },
    lastName: { type: String },
  },
});
```

如果要定义一个 `type` 字段，你需要使用 `type: { type: String }`，如：

```js
const holdingSchema = new Schema({
  asset: {
    // 让 Mongoose 知道 asset 是一个对象，它有 asset.type 和 asset.ticker 两个字段
    type: { type: String },
    ticker: String,
  },
});
```

### SchemaType 参数选项

```js
// 两种定义字段的方式：后者可以在 test 中添加更多元信息，如 lowercase: true 表示总是需要转换成小写

var schema1 = new Schema({
  test: String, // `test` is a path of type String
});

var schema2 = new Schema({
  // The `test` object contains the "SchemaType options"
  test: { type: String }, // `test` is a path of type string
});
```

SchemaType 中有以下元字段：

- `required`：布尔值或者函数，如果为 true，则会校验该字段必须存在
- `default`：任意值或者函数，用于设置字段的默认值
- `select`：布尔值，指定该字段模式是否需要被过滤
- `validate`：函数，用于校验该字段
- `get`：函数，会使用 `Object.defineProperty()` 方法来为该字段定义自定义 getter
- `set`：函数，用于自定义 setter
- `alias`：字符串（mongoose >= 4.10 版本才可用）。定义虚拟别名节点
- `immutable`：布尔值，表示该字段不可改。Mongoose 会阻止你修改该字段，除非父文档指定了 `isNew: true`
- `transform`：函数，当对文档调用其 `toJSON()` 方法时会调用该函数，包括 `JSON.stringify()` 也会调用到该函数，因为 `JSON.stringify()` 会调用 `toJSON()`。

```js
const numberSchema = new Schema({
  integerOnly: {
    type: Number,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
    alias: "i",
  },
});

const Number = mongoose.model("Number", numberSchema);

const doc = new Number();
doc.integerOnly = 2.001;
doc.integerOnly; // 2
doc.i; // 2
doc.i = 3.001;
doc.integerOnly; // 3
doc.i; // 3
```

#### 索引相关

- `index`：布尔值，表示是否要在该字段定义索引
- `unique`：布尔值，是否在该字段定义唯一索引
- `sparse`：布尔值，是否在该字段定义 sparse 索引

```js
var schema2 = new Schema({
  test: {
    type: String,
    index: true,
    unique: true, // Unique index. If you specify `unique: true`
    // specifying `index: true` is optional if you do `unique: true`
  },
});
```

#### 字符串相关

- `lowercase`：布尔值，总是会调用该值的 `.toLowerCase()`
- `uppercase`：布尔值
- `trim`：布尔值，会调用该值的 `.trim()` 进行转换
- `match`：正则表达式，会校验该值是否满足指定正则表达式
- `enum`：数组，会校验该字段的值是否出现在指定数组中
- `minlength`：数字，表示该值的最小长度
- `maxlength`：数字，表示该值的最大长度

#### 数字相关

- `min`：数字，指定该字段的最小值
- `max`：数字，指定该字段的最大值
- `enum`：数组，校验该字段的值是否出现在数组中

#### 日期相关

- `min`：日期类型
- `max`：日期类型

### 如何使用

#### 字符串

使用 `String` 或者 `"String"` 来定义：

```js
const schema1 = new Schema({ name: String }); // name 将会被转换为字符串
const schema2 = new Schema({ name: "String" }); // 和上面一样

const Person = mongoose.model("Person", schema2);

// 如果使用该模式时，传递一个具有 toString() 方法的对象，则 Mongoose 会调用该对象。
// toString 不能等于 Object.prototype.toString()
// 该元素也不能是数组类型

new Person({ name: 42 }).name; // "42" 会被转换成字符串
new Person({ name: { toString: () => 42 } }).name; // "42" 同样会被转换为字符串

// "undefined", 如果调用该文档的 `save()` 将会抛出类型转换错误
new Person({ name: { foo: 42 } }).name;
```

#### 数字

使用 `Number` 或者 `"Number"`。

类似于 `String` 类型，如果传递一个具有 `valueOf()` 方法并且返回一个数字，则 Mongoose 同样会调用它并将结果赋值到该字段。`null` 和 `undefined` 不会被转换。

`NaN` 或者会被转换为 `NaN` 的字符串，没有 `valueOf()` 方法的数组和对象将会在验证时抛出 [`CastError`](https://mongoosejs.com/docs/validation.html#cast-errors)，也就意味着它不会在初始化时抛出该错误，仅会在验证的时候得到该错误。

#### 日期

#### Buffer

#### Mixed

一种表示可能是任意类型的 SchemaType。Mongoose 不会对类型为 mixed 的字段做任何转换。你可以通过使用 `Schema.Types.Mixed` 或者通过传递一个空的对象字面量来定义 mixed 字段。

```js
// 以下几种方式达到的效果相同
const Any = new Schema({ any: {} });
const Any = new Schema({ any: Object });
const Any = new Schema({ any: Schema.Types.Mixed });
const Any = new Schema({ any: mongoose.Mixed });
// Note that by default, if you're using `type`, putting _any_ POJO as the `type` will
// make the path mixed.
const Any = new Schema({
  any: {
    type: { foo: String },
  }, // "any" will be Mixed - everything inside is ignored.
});
// However, as of Mongoose 5.8.0, this behavior can be overridden with typePojoToMixed.
// In that case, it will create a single nested subdocument type instead.
const Any = new Schema(
  {
    any: {
      type: { foo: String },
    }, // "any" will be a single nested subdocument.
  },
  { typePojoToMixed: false }
);
```

由于 Mixed 是`无模式`的类型，你可以将任意值给它，但是正因为如此 Mongoose 失去了对该字段的自动检测和保存。如果要告诉 Mongoose 该字段发生了改变 ，你需要调用 `doc.markModified(path)`，传递发生了改变的 Mixed 字段名作为参数。

```js
person.anything = { x: [3, 4, { y: "changed" }] };
person.markModified("anything");
person.save(); // Mongoose will save changes to `anything`.
```

通常为了避免出现这些副作用，可以使用子文档来替代 Mixed。

#### ObjectId

#### Boolean

Mongoose 中的布尔值就是 JavaScript 中的布尔值，默认情况下，Mongoose 会将 truethy 值转换成 true，falsy 值转换为 false。

你可以通过 `convertToTrue` 和 `convertToFalse` 来指定哪些自定义的值需要被转换为 true 或者 false。参考 [Boolean](https://mongoosejs.com/docs/schematypes.html#booleans)

#### 数组

Mongoose 支持 `SchemaType` 和`子文档`的数组。SchemaType 的数组又称为`原始数组`，子文档数组又称为`文档数组`。

```js
var ToySchema = new Schema({ name: String });
var ToyBoxSchema = new Schema({
  toys: [ToySchema],
  buffers: [Buffer],
  strings: [String],
  numbers: [Number],
  // ... etc
});
```

数组类型比较特殊，会使用 `[]` 作为其默认值。

注意，指定一个空数组会被当做 Mixed 数组，以下都是 `Mixed 数组`：

```js
var Empty1 = new Schema({ any: [] });
var Empty2 = new Schema({ any: Array });
var Empty3 = new Schema({ any: [Schema.Types.Mixed] });
var Empty4 = new Schema({ any: [{}] });
```

#### Map

该特性是 Mongoose 5.1 中新添加的特性。

`MongooseMap` 是 JavaScript 中 `Map` 类的子类。通常 map 和 MongooseMap 可互换。在 Mongoose 中，可以使用 map 来创建任意键的嵌套文档。

注意：Mongoose Map 中，字段必须是字符串才能存入 MongoDB 中。

```js
const userSchema = new Schema({
  // `socialMediaHandles` 是一个值为字符串类型的 Map
  // Map 的键名始终是字符串类型
  // 通过 of 来指定 Map 值的类型
  socialMediaHandles: {
    type: Map,
    of: String,
  },
});

const User = mongoose.model("User", userSchema);
// Map { 'github' => 'vkarpov15', 'twitter' => '@code_barbarian' }
console.log(
  new User({
    socialMediaHandles: {
      github: "vkarpov15",
      twitter: "@code_barbarian",
    },
  }).socialMediaHandles
);
```

上例中并没有显式声明 `github` 和 `twitter` 字段，但是由于 `socialMediaHandles` 是 map 类型，你可以存任意字段。然而也正是由于 `socialMediaHandles` 是 map，你必须使用 `.get()` 来获取值，使用 `.set()` 来设值。

```js
const user = new User({
  socialMediaHandles: {},
});

// Good
user.socialMediaHandles.set("github", "vkarpov15");
// Works too
user.set("socialMediaHandles.twitter", "@code_barbarian");
// Bad, the `myspace` property will **not** get saved
user.socialMediaHandles.myspace = "fail";

// 'vkarpov15'
console.log(user.socialMediaHandles.get("github"));
// '@code_barbarian'
console.log(user.get("socialMediaHandles.twitter"));
// undefined
user.socialMediaHandles.github;

// Will only save the 'github' and 'twitter' properties
user.save();
```

map 在 MongoDB 中以 BSON 对象存储。BSON 中的键是有序的，这意味着字段的插入顺序会被记录。

#### Getter

Getter 就像 schema 中定义的虚拟节点。

使用场景举例：如果你希望存储用户图片的相对路径，但是在获取的时候又得到完整的绝对路径，则可以使用 getter：

```js
const root = "https://s3.amazonaws.com/mybucket";

const userSchema = new Schema({
  name: String,
  picture: {
    type: String,
    get: (v) => `${root}${v}`,
  },
});

const User = mongoose.model("User", userSchema);

const doc = new User({ name: "Val", picture: "/123.png" });
doc.picture; // 'https://s3.amazonaws.com/mybucket/123.png'
doc.toObject({ getters: false }).picture; // '/123.png'
```

通常，你应该仅在原始字段上使用 getter 而非数组或子文档上定义 getter，因为 getter 会重写 Mongoose 字段访问器返回的值，对对象使用 getter 会使得 Mongoose 失去了对字段变化追踪的能力。

```js
const schema = new Schema({
  arr: [{ url: String }],
});

const root = "https://s3.amazonaws.com/mybucket";

// 不用这么做！
schema.path("arr").get((v) => {
  return v.map((el) => Object.assign(el, { url: root + el.url }));
});

// Later
doc.arr.push({ key: String });
doc.arr[0]; // 'undefined' because every `doc.arr` creates a new array!

// Good, do this instead of declaring a getter on `arr`
schema.path("arr.0.url").get((v) => `${root}${v}`);
```

总之，声明数组或嵌套文档的 getter 需要特别小心！

#### Schema

如果要声明某个字段为其他 schema，则只需要将 `type` 设置为其它 schema 的实例即可。

```js
const subSchema = new mongoose.Schema({
  // some schema definition here
});

const schema = new mongoose.Schema({
  data: {
    type: subSchema
    default: {}
  }
});
```

#### [创建自定义类型](https://mongoosejs.com/docs/schematypes.html#customtypes)

#### `schema.path()` 方法

`schema.path()` 方法返回指定字段的 schemaType

```js
var sampleSchema = new Schema({ name: { type: String, required: true } });
console.log(sampleSchema.path("name"));
// Output looks like:
/**
 * SchemaString {
 *   enumValues: [],
 *   regExp: null,
 *   path: 'name',
 *   instance: 'String',
 *   validators: ...
 */
```

## Model

Model 是 Schema 编译后的类型。Model 的实例为文档。Model 的作用是负责从数据中创建和读取文档。

### 编译 model

对 Schema 调用 `mongoose.model` 来编译出一个 model。

```js
var schema = new mongoose.Schema({ name: "string", size: "string" });
var Tank = mongoose.model("Tank", schema);
```

第一个参数会被用于获取数据库的集合的名字，Mongoose 会自动使用 model 名的复数小写的形式来当做集合名。因此上例中会使用 `tanks` 作为集合名。

注意，`.model()` 方法会对 schema 做一份拷贝。在调用 `.model()` 之前请确保 schema 已经具有你需要用到的任何属性，包括钩子函数。

### 创建文档（document）

```js
var Tank = mongoose.model("Tank", yourSchema);

var small = new Tank({ size: "small" });
small.save(function (err) {
  if (err) return handleError(err);
  // saved!
});

// 或者通过下面的方式

Tank.create({ size: "small" }, function (err, small) {
  if (err) return handleError(err);
  // saved!
});

// 插入多个数据
Tank.insertMany([{ size: "small" }], function (err) {});
```

注意，在 model 使用的数据库连接尚未打开之前，所有创建和删除操作都不会成功。每个 model 都有一个关联的数据库连接实例。当你使用 `mongoose.model()` 的时候，该 model 会自动使用 mongoose 默认连接实例。

如果需要使用自定义连接，请使用连接实例的 `model()` 方法。

### 查询

可以结合 MongoDB 丰富的查询语法，使用每个 model 的 `find`、`findById`、`findOne`或者 `where` 这些静态方法来查询文档。

```js
Tank.find({ size: "small" }).where("createdDate").gt(oneYearAgo).exec(callback);
```

### 删除

使用静态方法 `deleteOne()` 和 `deleteMany()` 来移除文档。

```js
Tank.deleteOne({ size: "large" }, function (err) {
  if (err) return handleError(err);
  // deleted at most one tank document
});
```

### 更新

每个 model 都有自己的 `update` 方法来修改数据库的文档而不用返回到应用程序中。

```js
Tank.updateOne({ size: "large" }, { name: "T-90" }, function (err, res) {
  // Updated at most one doc, `res.modifiedCount` contains the number
  // of docs that MongoDB updated
});
```

如果你希望更新单个文档然后将文档返回到应用程序中，可以使用 `[findOneAndUpdate](https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate)`

### [Change Streams](https://docs.mongodb.com/manual/changeStreams/)

MongoDB 3.6 及 Mongoose 5.0 以上

Change Streams 提供了一种监听所有插入和更新操作的途径。

```js
async function run() {
  // 创建一个 model
  const personSchema = new mongoose.Schema({
    name: String,
  });
  const Person = mongoose.model("Person", personSchema, "Person");

  // 创建一个 change stream。当数据库发生改变的时候会触发 'change' 事件
  Person.watch().on("change", (data) => console.log(new Date(), data));

  // 插入一条文档会触发上面定义的 change stream
  console.log(new Date(), "Inserting doc");
  await Person.create({ name: "Axl Rose" });
}
```

## `[文档（document）](https://mongoosejs.com/docs/documents.html)`

在 Mongoose 中 Document 和 Model 是不同的类。Model 是 Document 类的子类。当你使用 Model 构造函数的时候，即创建了一个文档（document）。

```js
const MyModel = mongoose.model("Test", new Schema({ name: String }));
const doc = new MyModel();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```

在 Mongoose 中，一个 “文档” 通常指一个 model 的实例。你不应该绕过 model 直接创建 Document 类的实例。

### 检索

当你在 Mongoose 中使用类似于 `findOne()` 之类的方法加载文档时，你就得到了一个 Mongoose 中的文档。

```js
const doc = await MyModel.findOne();

doc instanceof MyModel; // true
doc instanceof mongoose.Model; // true
doc instanceof mongoose.Document; // true
```

### 更新

Mongoose 文档可以追踪字段的改变。你可以直接使用 JavaScript 赋值语句直接对一个文档进行修改，Mongoose 会将其转换为 MongoDB update 操作符。

```js
doc.name = "foo";

// Mongoose 会发送一个 `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })` 到 MongoDB
// 这说明 Mongoose 将上面的赋值操作转换为了 MongoDB 操作符
await doc.save();
```

在 Mongoose 中通常通过 `save()` 方法来更新文档。使用 `save()` 会对文档进行完整的验证以及应用中间件。

当 `save()` 不能满足需要时，也可以使用 MongoDB 的 update 方法，但是这样的话 Mongoose 只能做数据转换、应用中间件以及做有限的验证。

```js
// Update all documents in the `mymodels` collection
await MyModel.updateMany({}, { $set: { name: "foo" } });
```

注意，`update()`、`unpdateMany()` 以及 `findOneAndUpdate()` 等不会执行 `save()` 中间件。如果需要执行 `save` 的中间件需要先查询然后调用 `save()`。

### 校验

在 save 之前，文档会被类型转换和校验。Mongoose 首先会将字段类型转换为指定的类型，然后对它们进行校验。在 Mongoose 内部实现中，保存前会调用文档的 `validate()` 方法。

```js
const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
const Person = mongoose.model("Person", schema);

let p = new Person({ name: "foo", age: "bar" });
// Cast to Number failed for value "bar" at path "age"
await p.validate();

let p2 = new Person({ name: "foo", age: -1 });
// Path `age` (-1) is less than minimum allowed value (0).
await p2.validate();
```

Mongoose 也支持使用 `runValidators` 选项来做有限的校验。默认情况下，Mongoose 会将 `findOne()`、`updateOne()` 的参数进行类型转换，但并不会做校验。因此你需要通过 `runValidators: true` 来开启校验。

```js
// Cast to number failed for value "bar" at path "age"
await Person.updateOne({}, { age: "bar" });

// Path `age` (-1) is less than minimum allowed value (0).
await Person.updateOne({}, { age: -1 }, { runValidators: true });
```

### 重写文档

Mongoose 中有两种方式可以重写文档，即替换整个文档的所有字段。

- 调用 `Document#overwrite()` 方法，然后调用 `save()`
- 使用 `Model.replaceOne()`

```js
const doc = await Person.findOne({ _id });

// 方法 1
// 仅设置 `name` 字段，并消除所有其它字段
doc.overwrite({ name: "Jean-Luc Picard" });
await doc.save();

// 方法 2
await Person.replaceOne({ _id }, { name: "Jean-Luc Picard" });
```

## 子文档

子文档即嵌套在文档中的文档。在 Mongoose 中，这意味着能够将 schema 嵌套在其它 schema 里面，嵌套的 schema 可以应用中间件、自定义校验逻辑、虚拟节点等其它顶级 schema 可用的特性。

```js
var childSchema = new Schema({ name: "string" });

var parentSchema = new Schema({
  // 子文档数组
  children: [childSchema],
  // 单独的嵌套子文档。 注意，独立的嵌套子文档需要 mongoose >= 4.2.0
  child: childSchema,
});
```

子文档与一般文档最主要的区别是子文档不能单独保存，它只能跟随所依附的顶层文档一起保存。

```js
var Parent = mongoose.model("Parent", parentSchema);
var parent = new Parent({ children: [{ name: "Matt" }, { name: "Sarah" }] });
parent.children[0].name = "Matthew";

// `parent.children[0].save()` 是一个空函数，它只会触发中间件，但并不会实际保存子文档。你需要调用顶级文档的 save() 方法
parent.save(callback);
```

Aside from code reuse, one important reason to use subdocuments is to create a path where there would otherwise not be one to allow for validation over a group of fields (e.g. dateRange.fromDate <= dateRange.toDate).

子文档也可以有自己的 `save()` 和 `validate()` 中间件。调用父级的 `save()` 会触发所有子文档的 `save()`，`validate()` 也是一样。

```js
childSchema.pre("save", function (next) {
  if ("invalid" == this.name) {
    return next(new Error("#sadpanda"));
  }
  next();
});

var parent = new Parent({ children: [{ name: "invalid" }] });
parent.save(function (err) {
  console.log(err.message); // #sadpanda
});
```

子文档的 `pre('save')` 和 `pre('validate')` 会在顶级文档的 `pre('validate')` 之后以及顶级文档的 `pre('save')` 之前调用。因为内置中间件就是先校验后 `save()`

```js
// 下例会按序输出 1-4
var childSchema = new mongoose.Schema({ name: "string" });

childSchema.pre("validate", function (next) {
  console.log("2");
  next();
});

childSchema.pre("save", function (next) {
  console.log("3");
  next();
});

var parentSchema = new mongoose.Schema({
  child: childSchema,
});

parentSchema.pre("validate", function (next) {
  console.log("1");
  next();
});

parentSchema.pre("save", function (next) {
  console.log("4");
  next();
});
```

### 子文档 vs 嵌套字段

在 Mongoose 中，子文档和嵌套字段是不同的，以下就是这两种模式：

```js
// Subdocument
const subdocumentSchema = new mongoose.Schema({
  child: new mongoose.Schema({ name: String, age: Number }),
});
const Subdoc = mongoose.model("Subdoc", subdocumentSchema);

// Nested path
const nestedSchema = new mongoose.Schema({
  child: { name: String, age: Number },
});
const Nested = mongoose.model("Nested", nestedSchema);
```

这两个看起来很相似，在 MongoDB 中的结构也是一样的，不过在 Mongoose 中它们有所不同：

- 嵌套字段永远不会存在 child === undefined 的情况，即便是你没有单独设置 child，也总是可以设置 `child` 的属性而不会报 undefined 错误。但是子文档的实例就可以出现 child === undefined 的情况。
- 在 Mongoose 5 中，`Document#set()` 会合并嵌套字段，但是如果是子文档，则会覆盖。

```js
const doc1 = new Subdoc({});
doc1.child === undefined; // true
doc1.child.name = "test"; // Throws TypeError: cannot read property...

const doc2 = new Nested({});
doc2.child === undefined; // false
console.log(doc2.child); // Prints 'MongooseDocument { undefined }'
doc2.child.name = "test"; // Works
```

```js
const doc1 = new Subdoc({ child: { name: "Luke", age: 19 } });
doc1.set({ child: { age: 21 } });
doc1.child; // { age: 21 }

const doc2 = new Nested({ child: { name: "Luke", age: 19 } });
doc2.set({ child: { age: 21 } });
doc2.child; // { name: Luke, age: 21 }
```

### 查找子文档

每个子文档默认有一个 `_id` 字段。Mongoose 文档数组有一个 `id()` 方法用于从一个文档数组中查找指定 `_id` 的文档：

```js
var doc = parent.children.id(_id);
```

### 向文档数组添加子文档

Mongoose 数组的 push、unshift、addToSet 等都会首先做类型转换：

```js
var Parent = mongoose.model("Parent");
var parent = new Parent();

// create a comment
parent.children.push({ name: "Liesl" });
var subdoc = parent.children[0];
console.log(subdoc); // { _id: '501d86090d371bab2c0341c5', name: 'Liesl' }
subdoc.isNew; // true

parent.save(function (err) {
  if (err) return handleError(err);
  console.log("Success!");
});
```

子文档也可以直接通过 Mongoose 数组的 create 方法来创建，这样就不用手动将它添加到数组中：

```js
var newdoc = parent.children.create({ name: "Aaron" });
```

### 删除子文档

每个子文档自身都有一个 `remove` 方法。

对于数组中的子文档而言，这个方法相当于调用 `.pull()`。

对于单个子文档而言，这个方法等同于将它设置为 `null`。

```js
// 等同于 `parent.children.pull(_id)`
parent.children.id(_id).remove();
// 等同于 `parent.child = null`
parent.child.remove();
parent.save(function (err) {
  if (err) return handleError(err);
  console.log("the subdocs were removed");
});
```

### 获取子文档父级

有时候你可能需要获取子文档的父级，可以通过 `parent()` 方法来获取：

```js
const schema = new Schema({
  docArr: [{ name: String }],
  singleNested: new Schema({ name: String }),
});
const Model = mongoose.model("Test", schema);

const doc = new Model({
  docArr: [{ name: "foo" }],
  singleNested: { name: "bar" },
});

doc.singleNested.parent() === doc; // true
doc.docArr[0].parent() === doc; // true
```

如果嵌套太深，你可以直接通过 `ownerDocument()` 方法直接获取顶层文档。

```js
const schema = new Schema({
  level1: new Schema({
    level2: new Schema({
      test: String,
    }),
  }),
});
const Model = mongoose.model("Test", schema);

const doc = new Model({ level1: { level2: "test" } });

doc.level1.level2.parent() === doc; // false
doc.level1.level2.parent() === doc.level1; // true
doc.level1.level2.ownerDocument() === doc; // true
```

### 数组声明的替代写法

如果创建 schema 时使用了对象数组，Mongoose 会自动将对象转换成 schema：

```js
var parentSchema = new Schema({
  children: [{ name: "string" }],
});
// 等同于
var parentSchema = new Schema({
  children: [new Schema({ name: "string" })],
});
```

### 单独子文档声明的替代写法

与文档数组不同，Mongoose 5 不会将 schema 中的对象转换为 schema。下例中 nested 中是嵌套字段而非子文档：

```js
const schema = new Schema({
  nested: {
    prop: String,
  },
});
```

在某些时候你希望定义嵌套字段的同时定义 validator 和 getter/setter 时会出现意想不到的结果：

```js
const schema = new Schema({
  nested: {
    // 不要这么做，在 Mongoose 5 中这样会使得 `nested` 变成一个 mixed 字段
    type: { prop: String },
    required: true,
  },
});

const schema = new Schema({
  nested: {
    // 这才是正确的做法
    type: new Schema({ prop: String }),
    required: true,
  },
});
```

以对象的方式声明 nested 会让它变成一个 Mixed 类型。为了让 Mongoose 自动将 `type: { prop: String }` 转换为 `type: new Schema({ prop: String })`，你需要将 `typePojoToMixed` 设置为 `false`：

```js
const schema = new Schema(
  {
    nested: {
      // Because of `typePojoToMixed`, Mongoose knows to
      // wrap `{ prop: String }` in a `new Schema()`.
      type: { prop: String },
      required: true,
    },
  },
  { typePojoToMixed: false }
);
```

总之，Mongoose 会将数组中的对象转换为 schema，但是单独的对象不会被转换为 schema。
