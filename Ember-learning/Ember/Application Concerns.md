# Application Concerns

之所以把该部分从 Ember 3.0 注意点中抽离出来, 是因为这部分内容对 Ember 的基本使用并没有太大影响, 但是又特别重要. 理解它可以更好的了解 Ember. 所以对这部分进行逐字翻译. 这部分主要要了解的就是: Application 是类, 用于配置应用程序, Application instance 是 Application 类的实例对象, 用于管理应用程序的实例化后的各个部分. 在 Application 中注册的类也会实例化在 Application instance 中(即在Application instance 中会有在 Application 中注册过的对应的实例化对象). Application initializer 的参数是 Application, Application instance initializer 的参数是 Application instance.

## Applications and Instances

Every Ember application is represented by a class that extends [`Application`](https://emberjs.com/api/ember/release/classes/Application). This class is used to declare and configure the many objects that make up your app.

每个 Ember application 代表一个继承自 [`Application`](https://emberjs.com/api/ember/release/classes/Application) 的类. 这个类用来声明和配置构成应用程序的多个对象.

As your application boots, it creates an [`ApplicationInstance`](https://emberjs.com/api/ember/release/classes/ApplicationInstance) that is used to manage its stateful aspects. This instance acts as the "owner" of objects instantiated for your app.

当你的应用启动的时候, 它创建了一个 [`ApplicationInstance`](https://emberjs.com/api/ember/release/classes/ApplicationInstance) 用来管理状态的各个方面. 该实例作为你的应用实例化出来的对象的 "主人"

Essentially, the Application defines your application while the ApplicationInstance manages its state.

基本上, Application 用于定义你的应用的各个方面, ApplicationInstance 用于管理应用程序的各个方面的状态. (实际上 Application 是类, ApplicationInstance 是 Application 的实例对象)

This separation of concerns not only clarifies the architecture of your app, it can also improve its efficiency. This is particularly true when your app needs to be booted repeatedly during testing and / or server-rendering (e.g. via FastBoot). The configuration of a single Application can be done once and shared among multiple stateful ApplicationInstance instances. These instances can be discarded once they're no longer needed (e.g. when a test has run or FastBoot request has finished).

概念的分离不仅使得应用程序的结构更加清晰, 还可以提升效率. 尤其是当你的应用程序在测试或服务端渲染(如通过 FastBoot) 过程中需要频繁重复的启动时尤为如此. 对 Application 配置一次就可以在多个不同状态的 ApplicationInstance 中共享. 这些实例可以在不再需要时丢弃(如当测试或 FastBoot 请求完成之后)。

## Dependency Injection

Ember applications utilize the [`dependency injection`](https://en.wikipedia.org/wiki/Dependency_injection) ("DI") design pattern to declare and instantiate classes of objects and dependencies between them. Applications and application instances each serve a role in Ember's DI implementation.

Ember applications 采用基于 [`dependency injection`](https://en.wikipedia.org/wiki/Dependency_injection) ("DI") 的设计模式来声明并实例化对象类和它们之间的依赖关系。 Applications 和 application instance 在 Ember 的 DI 实现中都扮演了重要角色.

An Application serves as a "registry" for dependency declarations. Factories (i.e. classes) are registered with an application, as well as rules about "injecting" dependencies that are applied when objects are instantiated.

Application 如同依赖声明的 "注册表". Factories(如 类) 在 Application 中注册, 并且在对象实例化时应用这些 "注入" 依赖的规则.

An ApplicationInstance serves as the "owner" for objects that are instantiated from registered factories. Application instances provide a means to "look up" (i.e. instantiate and / or retrieve) objects.

ApplicationInstance 作为从已注册的 factories 实例化出来的对象的 "主人". 它提供了一种方法来 查找(如实例化和检索) 这些对象.

      Note: Although an Application serves as the primary registry for an app, each ApplicationInstance can also serve as a registry. Instance-level registrations are useful for providing instance-level customizations, such as A/B testing of a feature.

      需要注意的是, 尽管 Application 作为一个应用的主要注册表, 但是每个 ApplicationInstance 也是可以作为注册表的. 实例级的注册对提供实例级的定制化非常有用, 如某个特性的 A/B 测试.

### Factory Registrations

A factory can represent any part of your application, like a route, template, or custom class. Every factory is registered with a particular key. For example, the index template is registered with the key `template:index`, and the application route is registered with the key `route:application`.

factory 可以是应用程序的任何部分, 如 route, template, 或自定义的类. 每个 factory 都会被注册为一个特定的键. 例如, index template 被注册为 `template:index`, application route 被注册为 `route:application`.

Registration keys have two segments split by a colon (`:`). The first segment is the framework factory type, and the second is the name of the particular factory. Hence, the `index` template has the key `template:index`. Ember has several built-in factory types, such as `service`, `route`, `template`, and `component`.

注册的键是被一个冒号分隔的两段, 第一个段是 factory 类型, 第二段是某个具体 factory 的名字. 因此, `index` template 的 key 为 `template:index`. Ember 有一些内建的 factory 类型, 如 `service`, `route`, `template` 和 `component`

You can create your own factory type by simply registering a factory with the new type. For example, to create a `user` type, you'd simply register your factory with `application.register('user:user-to-register')`.

你可以使用一个新类型来注册自己的 factory. 例如, 创建 `user` 类型的 factory
, 你只需要简单的使用 `application.register('user:user-to-register')` 来注册.

Factory registrations must be performed either in application or application instance initializers (with the former being much more common).

注册 Factory 必须在 application 或者 application instance 的 initializers (初始化器) 中进行(前者更常用).

For example, an application initializer could register a `Logger` factory with the key `logger:main`:

例如, 一个 application initializer 中使用 `logger:main` 来注册一个 factory `Logger`:

```js
// app/initializers/logger.js
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
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
```

#### Registering Already Instantiated Objects (注册已经实例化的对象)

By default, Ember will attempt to instantiate a registered factory when it is looked up. When registering an already instantiated object instead of a class, use the `instantiate: false` option to avoid attempts to re-instantiate it during lookups.

默认情况下, 当 lookup 一个已注册的 factory 的时候, Ember 会试图对它进行实例化. 当注册一个已经实例化的对象而非是注册一个 类(class) 时, 使用 `instantiate: false` 选项可以避免在 lookup 的时候重新去实例化它.

In the following example, the `logger` is a plain JavaScript object that should be returned "as is" when it's looked up:

下面的例子中, `logger` 是一个原生 JavaScript 对象, 在 lookup 的时候它应该被原样返回:

```js
// app/initializers/logger.js
export function initialize(application) {
  let logger = {
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
```

#### Registering Singletons vs. Non-Singletons (单例 vs 非单例)

By default, registrations are treated as "singletons". This simply means that an instance will be created when it is first looked up, and this same instance will be cached and returned from subsequent lookups.

默认情况下, 注册都是 "单例" 的. 也就意味着只会在第一次 lookup 的时候创建实例, 之后这个实例就会被缓存起来, 在接下来的 lookup 中返回这个缓存的实例.

When you want fresh objects to be created for every lookup, register your factories as non-singletons using the `singleton: false` option.

当你希望每次 lookup 的时候都返回新的实例对象, 那么在注册的时候就需要使用 `singleton: false` 选项表明它需要注册为非单例的 factory.

In the following example, the Message class is registered as a non-singleton:

下面的例子中, Message 类就被注册为非单例:

```js
// app/initializers/notification.js
import EmberObject from '@ember/object';

export function initialize(application) {
  let Message = EmberObject.extend({
    text: ''
  });

  application.register('notification:message', Message, { singleton: false });
}

export default {
  name: 'notification',
  initialize: initialize
};
```

### Factory Injections

Once a factory is registered, it can be "injected" where it is needed.

一旦 factory 注册之后, 就可以把它 "注入" 到任何你需要它的地方.

Factories can be injected into whole "types" of factories with type injections. For example:

可以通过类型注册将一个 factory 注册进某个 factory 整个类型中(所有实例都会有), 例如:

```js
// app/initializers/logger.js
import EmberObject from '@ember/object';

export function initialize(application) {
  let Logger = EmberObject.extend({
    log(m) {
      console.log(m);
    }
  });

  application.register('logger:main', Logger);
  application.inject('route', 'logger', 'logger:main');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

As a result of this type injection, all factories of the type `route` will be instantiated with the property `logger` injected. The value of `logger` will come from the factory named `logger:main`.

这种类型注册的结果就是, 所有 route 类型的 factories 都会被实例化一个 `logger` 属性.  `logger` 的值来自于注册时名叫 `logger:main` 的 factory.

Routes in this example application can now access the injected `logger`:

现在该应用的 Route 都可以访问这个注入的 `logger`:

```js
// app/routes/index.js
import Route from '@ember/routing/route';

export default Route.extend({
  activate() {
    // The logger property is injected into all routes
    this.get('logger').log('Entered the index route!');
  }
});
```

Injections can also be made on a specific factory by using its full key:

也可以使用完整的键名来注册到某个特定的 factory 上:

```js
application.inject('route:index', 'logger', 'logger:main');
```

In this case, the logger will only be injected on the index route.

这种情况下, `logger` 就只能在 index route(路由)中访问.

Injections can be made into any class that requires instantiation. This includes all of Ember's major framework classes, such as components, helpers, routes, and the router.

可以在任何需要实例化的类上进行注入. 包括 Ember 的主要框架类, 如 components, helpers, routes 和 router.

#### Ad Hoc Injections

Dependency injections can also be declared directly on Ember classes using `inject`. Currently, `inject` supports injecting controllers (via `import { inject } from '@ember/controller';`) and services (via `import { inject } from '@ember/service';`).

也可以直接在 Ember 类上使用 `inject` 来声明依赖注入. 目前, `inject` 支持注入 controller (通过 `import { inject } from '@ember/controller';`) 和 service (通过 `import { inject } from '@ember/service';`)

The following code injects the `shopping-cart` service on the `cart-contents` component as the property `cart`:

下面的代码在 cart-contents 组件上注入了 `shopping-cart` service, 注册为组件的 `cart` 属性.

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  cart: service('shopping-cart')
});
```

If you'd like to inject a service with the same name as the property, simply leave off the service name (the dasherized version of the name will be used):

如果注册的 service 名与属性名相同, 则可以省略 service 名(驼峰名会被转换为带有中划线的小写命名)

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  shoppingCart: service()
});
```

### Factory Instance Lookups

To fetch an instantiated factory from the running application you can call the [`lookup`](https://emberjs.com/api/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) method on an application instance. This method takes a string to identify a factory and returns the appropriate object.

在 application 正在运行的时候, 可以通过在 application instance 上调用 [`lookup`](https://emberjs.com/api/ember/release/classes/ApplicationInstance/methods/lookup?anchor=lookup) 方法获取一个实例化的 factory. 该方法使用一个字符串来定位具体的 factory 并且返回该 factory 实例后的对象.

```js
applicationInstance.lookup('factory-type:factory-name');
```

The application instance is passed to Ember's instance initializer hooks and it is added as the "owner" of each object that was instantiated by the application instance.

Application instance 会被作为 Ember instance initializer 钩子的参数, 它用作所有通过 application instance 实例化对象的 "主人"(owner, 也可以理解为拥有者).

#### Using an Application Instance Within an Instance Initializer

Instance initializers receive an application instance as an argument, providing an opportunity to look up an instance of a registered factory.

Instance initializers 接收一个 application instance 作为参数, 它为我们提供了查询(lookup)已注册 factory 实例的机会.

```js
// app/instance-initializers/logger.js
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');

  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'logger',
  initialize: initialize
};
```

#### Getting an Application Instance from a Factory Instance

[`Ember.getOwner`](https://emberjs.com/api/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) will retrieve the application instance that "owns" an object. This means that framework objects like components, helpers, and routes can use `Ember.getOwner` to perform lookups through their application instance at runtime.

[`Ember.getOwner`](https://emberjs.com/api/ember/release/classes/@ember%2Fapplication/methods/getOwner?anchor=getOwner) 会检索到拥有该对象的 application instance. 也就意味着像 components, helpers, routes 这样的框架对象可以使用 `Ember.getOwner` 获得 application instance, 然后通过它来执行 lookup.

For example, this component plays songs with different audio services based on a song's audioType.

例如, 该 component 基于歌曲的不同类型(audioType属性)来调用不同的 service 来播放音乐.

```js
// app/components/play-audio.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

// Usage:
//
// {{play-audio song=song}}
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
```

## Initializers

Initializers provide an opportunity to configure your application as it boots.

Initializers 提供了一个在应用程序启动时配置该应用程序的机会.

There are two types of initializers: application initializers and application instance initializers.

有两种类型的 initializers: application initializers and application instance initializers.

Application initializers are run as your application boots, and provide the primary means to configure [`dependency injections`](https://guides.emberjs.com/v3.0.0/applications/dependency-injection) in your application.

Application initializers 在应用启动的时候运行, 并提供在应用程序中配置依赖注入的主要方法。

Application instance initializers are run as an application instance is loaded. They provide a way to configure the initial state of your application, as well as to set up dependency injections that are local to the application instance (e.g. A/B testing configurations).

Application instance initializers 在载入 Application instance 的时候运行. 它们提供了一种配置应用程序初始状态的方法，以及设置对 application instance 的依赖注入.(如配置 A/B 测试)

Operations performed in initializers should be kept as lightweight as possible to minimize delays in loading your application. Although advanced techniques exist for allowing asynchrony in application initializers (i.e. `deferReadiness` and `advanceReadiness`), these techniques should generally be avoided. Any asynchronous loading conditions (e.g. user authorization) are almost always better handled in your application route's hooks, which allows for DOM interaction while waiting for conditions to resolve.

在 initializers 中执行的操作应该尽可能轻量级, 这样可以减少载入应用时的延迟. 尽管存在一些超前的技术可以在 application initializers 中进行异步初始化(如 `deferReadiness` 和 `advanceReadiness`). 应该避免使用这些技术. 任何需要使用异步加载的情况(如用户认证) 最好是在应用的 route 钩子中执行, 这样允许在等待条件解析时进行DOM交互。

### Application Initializers

Application initializers can be created with Ember CLI's initializer generator:

可以使用 Ember CLI 的 initializer 生成器创建一个 Application initializers:

```
ember generate initializer shopping-cart
```

Let's customize the shopping-cart initializer to inject a cart property into all the routes in your application:

现在我们自定义 shopping-cart initializer 来给所有 routes 注入 cart 属性:

```js
// app/initializers/shopping-cart.js
export function initialize(application) {
  application.inject('route', 'cart', 'service:shopping-cart');
};

export default {
  initialize
};
```

### Application Instance Initializers

Application instance initializers can be created with Ember CLI's `instance-initializer` generator:

Application instance initializers 可以使用 Ember CLI 中的 `instance-initializer` 生成器创建:

```
ember generate instance-initializer logger
```

Let's add some simple logging to indicate that the instance has booted:

现在添加一点信息输出来表明 instance 已经启动:

```js
// app/instance-initializers/logger.js
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  initialize
};
```

### Specifying Initializer Order

If you'd like to control the order in which initializers run, you can use the `before` and/or `after` options:

可以使用 `before` 和 `after` 来配置 initializers 的运行顺序.

```js
// app/initializers/config-reader.js
export function initialize(application) {
  // ... your code ...
};

export default {
  before: 'websocket-init',
  initialize
};
```

```js
// app/initializers/websocket-init.js
export function initialize(application) {
  // ... your code ...
};

export default {
  after: 'config-reader',
  initialize
};
```

```js
// app/initializers/asset-init.js
export function initialize(application) {
  // ... your code ...
};

export default {
  after: ['config-reader', 'websocket-init'],
  initialize
};
```

Note that ordering only applies to initializers of the same type (i.e. application or application instance). Application initializers will always run before application instance initializers.

这种顺序只对相同类型的 initializers 有用(如 同是application 或同是 application instance), Application initializers 总是会在 application instance initializers 之前执行.

### Customizing Initializer Names

By default initializer names are derived from their module name. This initializer will be given the name `logger`:

默认情况下, initializer 名字来自于模块名. 下面这个 initializer 会使用 `logger` 作为名字.

```js
// app/instance-initializers/logger.js
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default { initialize };
```

If you want to change the name you can simply rename the file, but if needed you can also specify the name explicitly:

如果你想改变 initializer 的名字, 可以通过改变文件名, 也可以指定一个名字:

```js
// app/instance-initializers/logger.js
export function initialize(applicationInstance) {
  let logger = applicationInstance.lookup('logger:main');
  logger.log('Hello from the instance initializer!');
}

export default {
  name: 'my-logger',
  initialize
};
```

This initializer will now have the name `my-logger`.

此时 initializer 的名字为 `my-logger`

## [Services](https://guides.emberjs.com/v3.0.0/applications/services/)

A [`Service`](https://www.emberjs.com/api/ember/release/modules/@ember%2Fservice) is an Ember object that lives for the duration of the application, and can be made available in different parts of your application.

[`Service`](https://www.emberjs.com/api/ember/release/modules/@ember%2Fservice) 是在整个应用程序生命周期持续存在的 Ember 对象, 可以在应用程序各个部分获取.

Services are useful for features that require shared state or persistent connections. Example uses of services might include:

Services 对于需要用到共享状态或持久连接的特性非常有用。 services 的用例包括:

- User/session authentication. (用户/会话认证)
- Geolocation. (地理定位)
- WebSockets.
- Server-sent events or notifications. (服务端发送的事件或通知)
- Server-backed API calls that may not fit Ember Data. (不适用于 Ember Data 的服务端 API 调用)
- Third-party APIs. (第三方 API)
- Logging. (登陆)

### Defining Services

Services can be generated using Ember CLI's `service generator`. For example, the following command will create the `ShoppingCart` service:

Services 通过 Ember CLI 的 service generator 创建。 例如， 下面的命令就会创建一个  `ShoppingCart` service：

```bash
ember generate service shopping-cart
```

Services must extend the `Service` base class:

Service 必须继承自 `Service` 基类。

```js
// app/services/shopping-cart.js

import Service from '@ember/service';

export default Service.extend({
});
```

Like any Ember object, a service is initialized and can have properties and methods of its own. Below, the shopping cart service manages an items array that represents the items currently in the shopping cart.

Service 跟其他 Ember 对象一样， 可以有自己的属性和方法。 下面例子中，shopping cart service 管理了一个表示当前购物车中商品的数组。

```js
// app/services/shopping-cart.js

import Service from '@ember/service';

export default Service.extend({
  items: null,

  init() {
    this._super(...arguments);
    this.set('items', []);
  },

  add(item) {
    this.get('items').pushObject(item);
  },

  remove(item) {
    this.get('items').removeObject(item);
  },

  empty() {
    this.get('items').clear();
  }
});
```

### Accessing Services

To access a service, you can inject it in any container-resolved object such as a component or another service using the `inject` function from the `@ember/service` module. There are two ways to use this function. You can either invoke it with no arguments, or you can pass it the registered name of the service. When no arguments are passed, the service is loaded based on the name of the variable key. You can load the shopping cart service with no arguments like below.

可以通过使用 `@ember/service` 模块中的 `inject` 方法将一个 service 注入到任何一个像 component 或者其他 service 的容器(container-resolved)对象来访问一个 service。 使用 `inject` 有两种方式，既可以不传参数， 也可以传入注册该 service 时的名字。 不传参数的时候， service 使用对应的属性名。 下面展示不带参数时载入一个 shopping cart 的方法：

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  //will load the service in file /app/services/shopping-cart.js
  shoppingCart: service()
});
```

另一种注入 service 的方式是提供 service 的名称作为参数。

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  //will load the service in file /app/services/shopping-cart.js
  cart: service('shopping-cart')
});
```

This injects the shopping cart service into the component and makes it available as the `cart` property.

这样就把 shopping cart service 注入到了 component 中， 使用 `cart` 属性访问。

Sometimes a service may or may not exist, like when an initializer conditionally registers a service. Since normal injection will throw an error if the service doesn't exist, you must look up the service using Ember's `getOwner` instead.

有时候某个 service 并不存在， 比如在 initializer 中根据条件注册一个 service。 由于注入一个不存在的 service 会抛出异常， 所以你最好使用 Ember 的 `getOwner` 来 lookup 这个 service。

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';

export default Component.extend({
  //will load the service in file /app/services/shopping-cart.js
  cart: computed(function() {
    return getOwner(this).lookup('service:shopping-cart');
  })
});
```

Injected properties are lazy loaded; meaning the service will not be instantiated until the property is explicitly called. Therefore you need to access services in your component using the `get` function otherwise you might get an `undefined`.

注入的属性是懒加载的， 即 service 在该属性显式调用之前是不会实例化的。 因此在 component 中你必须使用 `get` 方法来获取 service， 否则可能得到 `undefined`

Once loaded, a service will persist until the application exits.

但是一旦加载过后， service 会一直存在直到应用退出。

Below we add a remove action to the cart-contents component. Notice that below we access the `cart` service with a call to `this.get`.

下面， 我们给 cart-contents component 添加了一个 remove action。 注意我们使用了 `this.get` 来访问 `cart` service。

```js
// app/components/cart-contents.js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  cart: service('shopping-cart'),

  actions: {
    remove(item) {
      this.get('cart').remove(item);
    }
  }
});
```

Once injected into a component, a service can also be used in the template. Note `cart` being used below to get data from the cart.

注入 service 后也可以在 template 中使用。 注意下面的使用中 `cart` 用于从 cart service 获取数据。

```html
// app/templates/components/cart-contents.hbs
<ul>
  {{#each cart.items as |item|}}
    <li>
      {{item.name}}
      <button {{action "remove" item}}>Remove</button>
    </li>
  {{/each}}
</ul>
```

## [The Run Loop](https://guides.emberjs.com/v3.0.0/applications/run-loop/)

Ember's internals and most of the code you will write in your applications takes place in a run loop. The run loop is used to batch, and order (or reorder) work in a way that is most effective and efficient.

Ember 内部代码和你写的大多数代码都在 run loop 中执行。run loop 采用最高效的方式来对作业进行批处理和排序（或重排）

It does so by scheduling work on specific queues. These queues have a priority, and are processed to completion in priority order.

它把作业安排在特定的队列中。 这些队列有优先级， 并按照优先级进行处理。

For basic Ember app development scenarios, you don't need to understand the run loop or use it directly. All common paths are paved nicely for you and don't require working with the run loop directly.

对于基本的应用程序开发场景，你不需要了解或直接使用运行循环。所有道路都已经为你铺平，不需要直接使用运行循环。

The most common case for using the run loop is integrating with a non-Ember API that includes some sort of asynchronous callback. For example:

使用运行循环的最常见情况是与包含某种异步回调的非 Ember API 进行集成。例如：

- DOM update and event callbacks (DOM 更新和事件回调)
- `setTimeout` and `setInterval` callbacks (`setTimeout` 和 `setInterval` 回调)
- `postMessage` and `messageChannel` event handlers (`postMessage` 和 `messageChannel` 事件处理函数)
- AJAX callbacks (AJAX 回调)
- Websocket callbacks (Websocket 回调)

### Why is the run loop useful?
