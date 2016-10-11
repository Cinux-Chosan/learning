# Application Concerns
- Application：声明和和配置组成该网页应用的objects，单个Application的配置可以在多个ApplicationInstance之间共享。
- ApplicationInstance：由application创建，用于管理应用的状态，该实例作为应用中那些实例化对象的拥有者。

## Dependency Injection
-


## Initializers （初始化器）
- Initializers：当application启动的时候，可以通过 Initializers 来配置它
- 初始化器分为两种： 应用初始化器（ application initializers ） 和 应用实例初始化器（ application instance initializers）
> 应用初始化器在application启动的时候运行，它是为 application 配置依赖注入（ dependency injections ）的主要手段。

> 应用实例初始化器（Application instance initializers）在 应用实例配加载的时候运行。它提供了配置application初始状态的方法，也用于建立应用程序实例本地的
依赖注入

### Application Initializers
- 创建： ember generate initializer shopping-cart
- 示例： 将 shopping-cart 作为 cart 属性注入到每一个 route 中

        app/initializers/shopping-cart.js

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



----


总结： initializers 中定义方法，注册对象，注入全局中，instance-initializers 会在initializers中注册的类型自动加载的时候执行，instance-initializers中可以lookup。
