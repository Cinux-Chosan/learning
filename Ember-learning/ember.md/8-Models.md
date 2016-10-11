# Models

- model 自身不具备数据，它只用来定义数据类型、数据之间的关系，即被称之为记录record
- Ember data 提供一个唯一的对象——store来作为应用的中心数据仓库。
- 记录（record）即包含了从服务端加载的数据实例，也可以创建新的纪录发送给后端保存。
> record具有唯一的 model type 和 id

- Adapter 作为 store的底层，store请求或者保存数据都会去请求Adapter，Adapter负责与后端进行沟通，它实现与服务端交互的API。
- 首次请求数据，数据会从服务端加载，之后数据被缓存，后面请求该数据，会从缓存中获取，如果有改变，数据会发送到服务端，服务端接收到数据更新，下次请求，数据就会自动刷新。
- 向store请求数据，由于数据不会立即返回，而是异步获取，所以向store请求数据会立即返回一个promise，store向Adapter请求数据也是立即返回promise。

## Defining Models
- model需要继承自 DS.Model（import DS from 'ember-data';）。
- 使用命令生成model： ember generate model person

### Defining Attributes
- 使用 DS.attr() 来定义数据类型，可以定义计算属性等

        export default DS.Model.extend({
          firstName: DS.attr(),
          lastName: DS.attr(),
          birthday: DS.attr(),
          fullName: Ember.computed('firstName', 'lastName', function() {
            return `${this.get('firstName')} ${this.get('lastName')}`;
          })
        });

- 明确数据类型（transform类型转换）：将类型参数（Ember Data supports attribute types of string, number, boolean, and date）作为第一个参数传给 DS.attr()，如 birthday: DS.attr('date')

- 定制 transform
> 命令创建 transform

        ember generate transform dollars

> 编写 deserialize和serialized方法（transform包含deserialize和serialized方法）

        // 在transform 中定义序列化和反序列化方法，反序列化方法（deserialize）将数据转化成客户端需要的类型，序列化方法（serialized）将数据转换成持久层（服务端）所使用的类型
        export default DS.Transform.extend({
          deserialize: function(serialized) {
            return serialized / 100; // returns dollars
          },

          serialize: function(deserialized) {
            return deserialized * 100; // returns cents
          }
        });

        // 完成transform的自定义过后，可以在model中使用
        export default DS.Model.extend({
          spent: DS.attr('dollars')
        });

- DS.attr() 接受一个 hash 值作为第二个参数，用于配置数据，唯一值是代表默认值的 defaultValue，该defaultValue 可以是一个javascript类型 or 方法。

        export default DS.Model.extend({
          username: DS.attr('string'),
          email: DS.attr('string'),
          verified: DS.attr('boolean', { defaultValue: false }),
          createdAt: DS.attr('date', {
            defaultValue() { return new Date(); }
          })
        });


## Finding Records
> 以下带有 find 的方法会发送请求，带有 peek 的数据不会发送请求。

- store.findRecord()
- store.peekRecord()
- store.findAll()
- store.peekAll()

> store.findAll() 返回一个 DS.PromiseArray ，它会被 fulfills 为 DS.RecordArray

> store.peekAll 直接返回 DS.RecordArray

> ##DS.RecordArray## 不是一个标准的javascript数组，而是一个实现了 Ember.Enumerable 的对象，不能使用[]取值，应该使用objectAt(index)

> 使用 queryRecord 查询单个数据（会发送GET请求）：

        // GET to /persons?filter[email]=tomster@example.com    // 将参数序列化并发送该请求
        this.get('store').queryRecord('person', {
          filter: {
            email: 'tomster@example.com'
          }
        }).then(function(tomster) {
          // do something with `tomster`
        });

> 使用 query 查询多个数据（会发送GET请求）：

        // GET to /persons?filter[name]=Peter
        this.get('store').query('person', {
          filter: {
            name: 'Peter'
          }
        }).then(function(peters) {
          // Do something with `peters`
        });

## Creating, Updating and Deleting
### Creating Records
- 调用 store 的 createRecord() 方法。

        // 在 controller 和 route 中可以使用this.get('store')获取store
        store.createRecord('post', {
          title: 'Rails is Omakase',
          body: 'Lorem ipsum'
        });

------------
后面暂未阅读
