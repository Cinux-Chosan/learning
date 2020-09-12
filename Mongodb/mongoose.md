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
```
