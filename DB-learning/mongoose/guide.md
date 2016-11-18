# Guide

## Defining your schema (Everything in Mongoose starts with a Schema. )

### 支持的Schema类型
- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array

定义模式(schema)，如果想添加额外的keys，use Schema##add 方法

        var mongoose = require('mongoose');
        var Schema = mongoose.Schema;

        var blogSchema = new Schema({
          title:  String,
          author: String,
          body:   String,
          comments: [{ body: String, date: Date }],
          date: { type: Date, default: Date.now },
          hidden: Boolean,
          meta: {
            votes: Number,
            favs:  Number
          }
        });

创建模型，将Schema传入 mongoose.model(modelName, schema):

        var Blog = mongoose.model('Blog', blogSchema);
        // ready to go!

模型的实例即文档
- Instance methods（自定义实例方法）

        // define a schema
        var animalSchema = new Schema({ name: String, type: String });

        // assign a function to the "methods" object of our animalSchema
        animalSchema.methods.findSimilarTypes = function(cb) {
          return this.model('Animal').find({ type: this.type }, cb);
        };

        // now all of our animal instances have a findSimilarTypes method available to it.
        var Animal = mongoose.model('Animal', animalSchema);
        var dog = new Animal({ type: 'dog' });

        dog.findSimilarTypes(function(err, dogs) {
          console.log(dogs); // woof
        });

-
