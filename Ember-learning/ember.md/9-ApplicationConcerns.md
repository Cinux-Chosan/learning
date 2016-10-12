# Application Concerns
- Application：声明和和配置组成该网页应用的objects，单个Application的配置可以在多个ApplicationInstance之间共享。
- ApplicationInstance：由application创建，用于管理应用的状态，该实例作为应用中那些实例化对象的拥有者。

- 开场总结语：每个Ember应用程序都继承自 Ember.Application ，在它启动的时候，它会创建一个 Ember.ApplicationInstance 用于管理它的各方面状态，Ember.ApplicationInstance 作为程序中实例化对象的拥有者。 ###程序的声明和配置发生在 Ember.Application 中，管理状态发生在 Ember.ApplicationInstance 中。###

## Dependency Injection
- Ember.Application 作为依赖的注册表，当注册对象被实例化的时候，工厂类型（factory）在应用程序（application）内的注册、注入依赖的规则等会被应用。
- Ember.ApplicationInstance 作为在 Ember.Application 注册过并已经实例化的对象的管理者，它提供了查询方法（lookup）来查询和取得这些对象。
- 应用程序的任何部分都是一个工厂类型，如 route, template, 或者自定义类，每个工厂类型注册的时候都包含一个特定的键名（key），如  index template 注册为  template:index， application route 为 route:application， ### 键名（key）包含两部分，使用 ：（冒号） 分割，前一部分为工厂类型，后一部分为具体的工厂名。Ember 提供了一些内建的工厂类型如： service, route, template, component
- 开发者可以自定义工厂类型，只需要在application上注册该类型即可。如需要注册user类型，只需要application.register('user:user-to-register') 这样注册一下即可。
- 工厂类型的注册必须在 application initializers 或者 application instance initializers 上。在application initializers上注册Logger类型示例：

        // app/initializers/logger.js
        import Ember from 'ember';

        export function initialize(application) {
          var Logger = Ember.Object.extend({  // Logger为Class而非对象实例，如果是对象实例，如下Registering Already Instantiated Objects部分
            log(m) {
              console.log(m);
            }
          });

          application.register('logger:main', Logger);
        }

        export default {
          name: 'logger',
          initialize: initialize
        };

### Registering Already Instantiated Objects
- 默认情况下，Ember会企图在调用lookup的时候实例化一个已经注册过的工厂类型，如果该工厂类型已经实例化，即注册的时候是用对象去注册而非类（class），它已经是一个对象，无需再实例化为一个对象，此时需要在注册的时候添加参数 instantiate: false 来阻止重新实例化该对象。例如：

        // app/initializers/logger.js
        export function initialize(application) {
          var logger = {
            log(m) {
              console.log(m);
            }
          };

          application.register('logger:main', logger, { instantiate: false });
        }

        export default {
          name: 'logger',
          initialize: initialize
        };

### Registering Singletons vs. Non-Singletons（注册为单例）
- 默认情况下，工厂注册为单例模式，即它只会在第一次调用lookup的时候创建实例，此后该实例会被缓存，并在后面的lookup中返回缓存对象。如果需要在每次lookup的时候都重新创建对象，需要在注册的时候加上参数 singleton: false， 例如：

        // app/initializers/notification.js

        import Ember from 'ember';
        export function initialize(application) {
          var Message = Ember.Object.extend({
            text: ''
          });

          application.register('notification:message', Message, { singleton: false });
        }

        export default {
          name: 'notification',
          initialize: initialize
        };

### Factory Injections
- 一旦工厂类型经过注册，就可以被注入到每个需要的地方，在注入了工厂的地方可以使用 this.get 来获取该注入的工厂类型，注入实例：

        // app/initializers/logger.js

        import Ember from 'ember';
        export function initialize(application) {
          var Logger = Ember.Object.extend({
            log(m) {
              console.log(m);
            }
          });

          application.register('logger:main', Logger);
          application.inject('route', 'logger', 'logger:main');  // 此处注入所有route中，注入名为logger，即所有route中都有指向工厂类型logger:main并且名为logger的属性，如果只需要注入对应的工厂中，可以指明被注入的工厂类型：application.inject('route:index', 'logger', 'logger:main'); 如此一来，只能在index的route中访问
        }

        export default {
          name: 'logger',
          initialize: initialize
        };

        // 在 app/routes/index.js 中访问 :
        import Ember from 'ember';
        export default Ember.Route.extend({
          activate() {
            // The logger property is injected into all routes
            this.get('logger').log('Entered the index route!');
          }
        });

### Factory Instance Lookups
- 在运行中的应用程序中获取已经实例化的工厂类型，可以使用 application instance 的 lookup() 方法。其中 application instance 会被作为参数传递给Ember的 instance-initializer
#### Using an Application Instance Within an Instance Initializer

        // app/instance-initializers/logger.js
        export function initialize(applicationInstance) {
          let logger = applicationInstance.lookup('logger:main');

          logger.log('Hello from the instance initializer!');
        }

        export default {
          name: 'logger',
          initialize: initialize
        };

#### Getting an Application Instance from a Factory Instance
- Ember.getOwner 会检索并获取拥有该实例对象的应用程序实例，也就是说在运行时框架对象（如components, helpers, routes）可以使用 Ember.getOwner 来获取 application instance 并且调用 lookup，如：

        // app/components/play-audio.js

        import Ember from 'ember';
        const {
          Component,
          computed,
          getOwner
        } = Ember;

        // Usage:
        //
        //   {{play-audio song=song}}
        //
        export default Component.extend({
          audioService: computed('song.audioType', function() {
            let applicationInstance = getOwner(this);
            let audioType = this.get('song.audioType');
            return applicationInstance.lookup(`service:audio-${audioType}`);
          }),

          click() {
            let player = this.get('audioService');
            player.play(this.get('song.file'));
          }
        });

## Initializers （初始化器）
- Initializers：Initializers 使得可以在application启动的时候对其进行配置
- 初始化器分为两种： 应用初始化器（ application initializers ） 和 应用实例初始化器（ application instance initializers）

> - 应用程序初始化器在application启动的时候运行，它是为 application 配置依赖注入（ dependency injections ）的主要手段。

> - 应用实例初始化器（Application instance initializers）在 应用实例配加载的时候运行。它提供了配置application初始状态的方法，也用于建立应用程序实例本地的
依赖注入

### Application Initializers
- 创建： ember generate initializer shopping-cart
- 示例： 将 shopping-cart 作为 cart 属性注入到每一个 route 中

        // app/initializers/shopping-cart.js

        export function initialize(application) {  // application会被作为参数传入
          application.inject('route', 'cart', 'service:shopping-cart');
        };

        export default {
          name: 'shopping-cart',
          initialize: initialize
        };

### Application Instance Initializers
- 创建：ember generate instance-initializer logger
- 示例：

        app/instance-initializers/logger.js

        export function initialize(applicationInstance) {  // applicationInstance会被作为参数传入
          var logger = applicationInstance.lookup('logger:main');
        }

        export default {
          name: 'logger',
          initialize: initialize
        };

### Specifying Initializer Order
- 如果你希望控制 initializers 启动的顺序，可以在 export 中使用 before 和 after 参数：

        //before演示： app/initializers/config-reader.js

        export function initialize(application) {
          // ... your code ...
        };

        export default {
          name: 'configReader',
          before: 'websocketInit',
          initialize: initialize
        };

        //after演示： app/initializers/websocket-init.js

        export function initialize(application) {
          // ... your code ...
        };

        export default {
          name: 'websocketInit',
          after: 'configReader',
          initialize: initialize
        };

        //多参数的after演示： app/initializers/asset-init.js

        export function initialize(application) {
          // ... your code ...
        };

        export default {
          name: 'assetInit',
          after: ['configReader', 'websocketInit'],
          initialize: initialize
        };

- 需要注意的是，顺序限定只会在相同类型的初始化器中起作用，即 Application initializers 只会对 Application initializers 起作用， instance-initializers 只会对 instance-initializers 起作用。
----


总结： initializers 中定义方法，注册对象，注入全局中，instance-initializers 会在initializers中注册的类型自动加载的时候执行，instance-initializers中可以lookup。

## Services
- Ember.Service 是一个存在于应用程序整个生命周期的Ember对象
> - User/session authentication.

> - Geolocation.

> - WebSockets.

> - Server-sent events or notifications.

> - Server-backed API calls that may not fit Ember Data.

> - Third-party APIs.

> - Logging.

- 创建 service：ember generate service shopping-cart
- 如同所有Ember对象一样，Service能够有自己的属性和方法
- 在任何容器对象（如component和其它的service）中获取某个service可以通过 Ember.inject.service 方法：
> 方法 1（不带参）：会默认使用键名的带中划线的结构

        // load the shopping-cart service
        shoppingCart: Ember.inject.service()

> 方法 2（带参）：带参数作为需要加载的service名

        // load the shopping-cart service as cart property
        cart: Ember.inject.service('shopping-cart')

- 使用 inject 注入的属性为懒加载属性，以上面的service为例，如果没有调用该属性，则该service不会被实例化，因此需要使用 this.get()获取该注入的service属性，否则会得到undefined
- service一旦载入，就会一直存在于application中直到application结束
- service一旦注入，就可以在模板中如同属性一样调用，可以访问service中的属性
