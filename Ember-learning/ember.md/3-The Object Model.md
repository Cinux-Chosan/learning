### The Object Model
        Note that for performance reasons, while calling create() you cannot redefine an instance's computed properties and should not redefine existing or define new methods. You should only set simple properties when calling create(). If you need to define or redefine methods or computed properties, create a new subclass and instantiate that.

---
        When a new instance is created, its init() method is invoked automatically

        If you are subclassing a framework class, like Ember.Component, and you override the init() method, make sure you call this._super(...arguments)! If you don't, a parent class may not have an opportunity to do important setup work, and you'll see strange behavior in your application.

---

        // Arrays and objects defined directly on any Ember.Object are shared across all instances of that object.


        const Person = Ember.Object.extend({
          shoppingList: ['eggs', 'cheese']
        });

        Person.create({
          name: 'Stefan Penner',
          addItem() {
            this.get('shoppingList').pushObject('bacon');
          }
        });

        Person.create({
          name: 'Robert Jackson',
          addItem() {
            this.get('shoppingList').pushObject('sausage');
          }
        });

        // Stefan and Robert both trigger their addItem.
        // They both end up with: ['eggs', 'cheese', 'bacon', 'sausage']

        //To avoid this behavior, it is encouraged to initialize those arrays and object properties during init(). Doing so ensures each instance will be unique.

        const Person = Ember.Object.extend({
          init() {
            this.set('shoppingList', ['eggs', 'cheese']);
            // init will be invoked when each instance is created so that each instance will have this property by its own.
          }
        });

        Person.create({
          name: 'Stefan Penner',
          addItem() {
            this.get('shoppingList').pushObject('bacon');
          }
        });

        Person.create({
          name: 'Robert Jackson',
          addItem() {
            this.get('shoppingList').pushObject('sausage');
          }
        });

        // Stefan ['eggs', 'cheese', 'bacon']
        // Robert ['eggs', 'cheese', 'sausage']

---

        通过使用Ember中Class的reopen()方法，扩展的属性会存在于每个实例中，为实例属性
        通过使用Ember中Class的reopenClass()方法，扩展的属性属于Class，而非实例。

        // add static property to class
        Person.reopenClass({
          isPerson: false
        });
        // override property of Person instance
        Person.reopen({
          isPerson: true
        });

        Person.isPerson; // false - because it is static property created by `reopenClass`
        Person.create().get('isPerson'); // true

---

        第一次访问computed属性的时候，会执行对应方法并缓存所得到的值，后面再次访问的时候会从缓存中获取该值而不会重新执行对应函数，任何computed依赖的变量发生改变都会导致重新计算该值。

        computed属性如果依赖对象的属性，可以用括号扩展，出现在{}中的属性发生改变才会触发computed属性重新计算，同一个对象中其它没有出现在{}的属性改变不会触发重新计算，语法写作：

        let obj = Ember.Object.extend({
          baz: {foo: 'BLAMMO', bar: 'BLAZORZ'},

          something: Ember.computed('baz.{foo,bar}', function() {    // 使用 {}
            return this.get('baz.foo') + ' ' + this.get('baz.bar');
          })
        });

        通过调用set给computed属性设值，会覆盖其值，导致后续不在根据依赖改变而改变，但是可以用过使用get和set来实现，set中需要返回所设置的值：

        something: Ember.computed('baz.{bar}', {
          get(key) {
            return this.get('baz.bar');
          },
          set(key, value) {
            return value;    // 返回所设置的值
          }
        })
        // 然后其他地方可以调用set修改something的值，而不会导致computed失效
        this.set('something', 'xxxxx');    


        Ember.computed macro即存在于 Ember.computed中的方法，如Ember.computed.alias()

        大部分Ember.computed macro（如 Ember.computed.map）基于数组的 []属性进行计算，[]只会在数组程度的改变时发生重新计算，而@each会根据每一项的改变计算，如果需要根据每一项变动，需要自己使用常规map。

---

        在init中调用set给属性设值，不会触发连锁反应，即computed或者observer都不会检测到，如果需要检测，可以使用如下方法：

        Person = Ember.Object.extend({
          init() {
            this.set('salutation', 'Mr/Ms');
          },

          salutationDidChange: Ember.on('init', Ember.observer('salutation', function() {
            // some side effect of salutation changing
          }))
        });

---

        在页面中没有调用computed属性，则它所对应的函数一直都不会执行，某些情况下，需要检索该计算属性是否改变，而又不需要使用它的值时，可以在init中获取一遍该值。

---

        在类的定义之外添加观察属性，使用addObserver，如给已经创建的实例添加Observer:

        person.addObserver('fullName', function() {
          // deal with the change
        });
