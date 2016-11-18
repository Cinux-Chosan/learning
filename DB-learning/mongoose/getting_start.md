# Mongoose

## Guide

### Installation
- npm i mongodb [--save]
- npm i mongoose [--save]

#### 启动MongoDB服务
- 给MongoDB创建一个文件夹用于放置文档数据，下例为目录 /data

        mongod --dbpath=/data

- 安装并启动 mongod 进程

### Usage

#### Require && Connect

        var mongoose =  require('mongoose');
        mongoose.connect('mongodb://localhost/test');
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
          // we're connected!
        });

#### Schema
mongoose 的一切都基于 schema

1、定义Schema:

        var kittySchema = mongoose.Schema({
            name: String
        });


2、将Schema编译进一个Model

        var Kitten = mongoose.model('Kitten', kittySchema);

3、model是一个我们构造文档的类，在使用这个model的时候，每个文档将会是一个kitten 实例，它的属性和表现都如我们在schema中声明的一样

        var silence = new Kitten({ name: 'Silence' });   // 创建一个文档
        console.log(silence.name);

4、给文档定义方法（需要在编译进model之前）

        kittySchema.methods.speak = function () {
          var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
          console.log(greeting);
        }
        
        var Kitten = mongoose.model('Kitten', kittySchema); 

- 方法会存在于每个文档实例

        var fluffy = new Kitten({ name: 'fluffy' });
        fluffy.speak(); // "Meow name is fluffy"

5、保存，使用文档对象的save()方法

        fluffy.save(function (err, fluffy) {
          if (err) return console.error(err);
          fluffy.speak();
        });

6、使用model查找它的所有实例，如在Kitten上查找所有kitten实例

        Kitten.find(function (err, kittens) {
          if (err) return console.error(err);
          console.log(kittens);
        })

- 可以使用正则表达式等进行匹配

        Kitten.find({ name: /^fluff/ }, callback);

