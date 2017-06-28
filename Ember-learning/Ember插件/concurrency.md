# [ember-concurrency](http://ember-concurrency.com/#/docs/introduction)

ember-concurrency: 让你轻松写出简洁、稳健、美观的异步代码。

它提供了一个具有如下优势的 `task` 原语，

- 不同于 Promises， 它支持取消
- 将运行状态暴露给我们，不再需要我们手工跟踪运行状态（正在运行或者完成状态）
- [Task Modifiers ](http://ember-concurrency.com/#/docs/task-concurrency)
- 依赖于 Components 的任务将会在组建被销毁后自动取消。不再需要 `if(this.isDestroyed)` 来进行判断，也不会再由于 ajax 异步响应导致的 `set on destroyed object` 错误。
- ...and much more

#### 额外的学习资源：

- [EmberConf 2017 presentation on ember-concurrency](https://www.youtube.com/watch?v=VEzVDOmY-dc)
- [EmberMap's paid course on ember-concurrency](https://embermap.com/topics/ember-concurrency)
- [Article: ember-concurrency, the solution to so many problems you never knew you had .](https://medium.com/@machty/ember-concurrency-the-solution-to-so-many-problems-you-never-knew-you-had-cce6d7731ba9#.e6r0iv44u)
- [Global Ember Meetup presentation](https://player.vimeo.com/video/162329769)

### 安装

``` sh
ember install ember-concurrency
```

### 介绍

为了说明 ember-concurrency 能够解决什么样的问题，我们会先在 Components 中通过 Ember API 来实现数据加载作为示例，然后通过 ember-concurrency 来重构。

我们以下将会实现一个获取和显示附近零售店的组建，它涉及两步异步过程：

1、 使用地理定位获取用户的经纬度；
2、 使用经纬度向服务器获取附近商店的列表。

该例与[ EmberConf 2017 ember-concurrency talk](https://youtu.be/VEzVDOmY-dc?t=123)一样，如果你更喜欢视频的话可以去看看。


#### 版本1： 最小实现

``` js
export default TutorialComponent.extend({
  result: null,
  actions: {
    findStores() {
      let geolocation = this.get('geolocation');
      let store = this.get('store');

      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          this.set('result', result);
        });
    }
  },
});
```

template:

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

我们从最简单的骨架开始实现它的特征：操作都放在 action  `findStores` 里面。我们创建了一个 Promise 来从一个定位服务获取坐标并传递给 stroe 的 `getNearbyStores` 方法，最后将结果放在 `result` 中用来在模板中显示。

虽然版本1能够实现功能，但是在生产中不使用，最大的问题就是它没有实现提示加载的UI，在结果被显示出来之前它似乎没有任何反应。

#### 版本2： 添加一个loading spinner

用 `isFindingStores` 变量来控制当前查询状态：

``` js
// 使用注释 ++ 来表示与上一个版本相比增加的内容
export default TutorialComponent.extend({
  result: null,
  isFindingStores: false, // ++
  actions: {
    findStores() {
      let geolocation = this.get('geolocation');
      let store = this.get('store');

      this.set('isFindingStores', true); // ++
      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          this.set('result', result);
          this.set('isFindingStores', false); // ++
        });
    }
  },
});
```

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
  {{#if isFindingStores}}
    {{! ++ }}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

版本2的问题在于：如果我们同一时间多次点击 "Find Nearby Stores" 按钮，就会发出多个请求，然而我们只需要一个。

#### 版本3： 预防并发

如果已经有一个请求正在进行，我们则通过检查 `isFindingStores` 变量来判断是否需要继续。

``` js
export default TutorialComponent.extend({
  result: null,
  isFindingStores: false,
  actions: {
    findStores() {
      if (this.isFindingStores) { return; } // ++

      let geolocation = this.get('geolocation');
      let store = this.get('store');

      this.set('isFindingStores', true);
      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          this.set('result', result);
          this.set('isFindingStores', false);
        });
    }
  },
});
```

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
  {{#if isFindingStores}}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

至此，我们就可以认为 "Find Nearby Stores" 按钮是安全的了，但是我们真的完成了吗？

当然不是，有一个重要的地方我们还没有考虑到：如果组件已经销毁（因为用户已经切换到另一个页面）但是异步请求还没有完成，我们的代码就会抛出异常：`"calling set on destroyed object`

#### 版本4：处理 "calling set on destroyed object" 错误

有可能我们的 promise 回调函数会在 components 被销毁过后运行，如果在已经销毁的对象上调用 `set()` 就会报错。

幸运的是，Ember 提供了 `isDestroyed` 标志来让你判断一个对象是否已经被销毁。

``` js
export default TutorialComponent.extend({
  result: null,
  isFindingStores: false,
  actions: {
    findStores() {
      if (this.isFindingStores) { return; }

      let geolocation = this.get('geolocation');
      let store = this.get('store');

      this.set('isFindingStores', true);
      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          if (this.isDestroyed) { return; } // ++
          this.set('result', result);
          this.set('isFindingStores', false);
        });
    }
  },
});
```

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
  {{#if isFindingStores}}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

现在，当你点击了 "Find Nearby Stores" 过后跳转到其它页面，你也不会看到那个错误了。

完了吗？

#### 版本5：处理 Promise 拒绝状态

也许你已经注意到了我们没有处理 `getCoords` 和 `getNearbyStores` promise 的拒绝态。我们可以使用 `finally()` 来将 `isFindingStores` 始终置为 `false`，但是我们会引入重复的代码：

``` js
export default TutorialComponent.extend({
  result: null,
  isFindingStores: false,
  actions: {
    findStores() {
      if (this.isFindingStores) { return; }

      let geolocation = this.get('geolocation');
      let store = this.get('store');

      this.set('isFindingStores', true);
      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          if (this.isDestroyed) { return; }
          this.set('result', result);
        })
        .finally(() => {                      // ++
          if (this.isDestroyed) { return; }   // ++
          this.set('isFindingStores', false); // ++
        });
    }
  },
});
```

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
  {{#if isFindingStores}}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

### 上例分析

在之前的例子中，我们创建了一个获取和显示附近商店的组件，正如你所见，它需要很多代码来规避方方面面可能出现的问题。

这样的代码不美观，但在我们的代码中却很常见。

#### Alternative: Move tricky code to an object with a long lifespan

组建的生命周期有限，它经常重绘、销毁。 而Controller、Service、Ember-Data Store 和 Route 直到 app 销毁之前都一直存在。

As such, one approach to avoiding "set on destroyed object" errors is to move tricky async logic into a method/action on a Controller or Service that is invoked by a Component. Sometimes this works, but it's often the case that even though you no longer see exceptions in the console, you still need to clean up / stop / cancel some operation on a long lived object in response to a Component being destroyed. There are Component lifecycle hooks like willDestroyElement that you can use for these kinds of things, but then you still end up with the same amount of code, but now it's smeared between Component and Controller.


### 使用 Task 重构代码

现在，我们就使用 ember-concurrency 的 task 来对相同的功能进行重构。与之前一样，由简到繁。

``` js
export default TutorialComponent.extend({
  result: null,
  actions: {
    findStores() {
      let geolocation = this.get('geolocation');
      let store = this.get('store');

      geolocation.getCoords()
        .then(coords => store.getNearbyStores(coords))
        .then(result => {
          this.set('result', result);
        });
    }
  },
});
```

``` hbs
<button onclick={{action 'findStores'}}>
  Find Nearby Stores
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```


#### 版本1：最小实现（使用 task）

``` js
import { task } from 'ember-concurrency';

export default TutorialComponent.extend({
  result: null,

  findStores: task(function * () {
    let geolocation = this.get('geolocation');
    let store = this.get('store');

    let coords = yield geolocation.getCoords();
    let result = yield store.getNearbyStores(coords);
    this.set('result', result);
  }),
});
```

``` hbs
<button onclick={{perform findStores}}> {{! ++ }}
  Find Nearby Stores
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

先看看有些什么改变：

第一，将 `findStores` action 改为 `findStores` task；

第二，template中，将`onclick={{action 'findStores'}}` 替换为 `onclick={{perform findStores}}`

最后，使用生成器语法[Generator Function Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) `yield` 来替代 promise 的 `.then` 回调

task 会在 yield 一个 promise 后等待该promise变为 fulfill 状态再继续执行下一次 yield 直到结束。

#### 版本2： 添加一个 loading spinner（with task）

使用 task 暴露出来的 `isRunning` 属性来取代手动追踪当前执行状态。这就意味着我们只需要修改模板，javascript 代码保持不动：

``` hbs
<button onclick={{perform findStores}}>
  Find Nearby Stores
  {{#if findStores.isRunning}}
    {{! ++ }}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

#### 版本3：防止并发（with task）

ember-concurrency 使用 [`Task Modifier`](http://ember-concurrency.com/#/docs/task-concurrency) 来防止多次点击带来的并发请求。使用 `.drop()` 修改器来在它正在运行的时候阻止多次启动该 task

``` js
import { task } from 'ember-concurrency';

export default TutorialComponent.extend({
  result: null,

  findStores: task(function * () {
    let geolocation = this.get('geolocation');
    let store = this.get('store');

    let coords = yield geolocation.getCoords();
    let result = yield store.getNearbyStores(coords);
    this.set('result', result);
  }).drop(), // ++
});
```

#### 版本4：处理 "set on destroyed object" 错误 （with task）

ember-concurrency 在宿主对象销毁的时候会自动取消 task。在前面的例子中，当用户跳转到其它页面，`findStores` task 会暂停在 unresolved 状态的 `getNearbyStores` promise。 component 会被销毁并且 `findStores` task 将会立即停止在它当前运行的状态并且不会执行到 `this.set()`。因此它能够避免出现 `"set on destroyed object"` 错误。

能够中途暂停是 ember-concurrency 强大的特性之一，则也是得益于生成器语法（Generator function Syntax）

#### 版本5：处理Promise 拒绝态（with task）

我们还是不需要动代码。如果 `getCoords` 或者 `getNearbyStores` 返回一个拒绝态的 promise，`findStores` task 会在错误发生的地方停止执行，并将异常冒泡。但是该 task 可以立即再次执行。

#### 最终版本

``` js
export default TutorialComponent.extend({
  result: null,
  findStores: task(function * () {
    let geolocation = this.get('geolocation');
    let store = this.get('store');

    let coords = yield geolocation.getCoords();
    let result = yield store.getNearbyStores(coords);
    this.set('result', result);
  }).drop(),
});
```

template:

``` hbs
<button onclick={{perform findStores}}>
  Find Nearby Stores
  {{#if findStores.isRunning}}
    {{fa-icon "spinner" spin=true}}
  {{/if}}
</button>

{{#if result}}
  {{#each result.stores as |s|}}
    <li>
      <strong>{{s.name}}</strong>:
      {{s.distance}} miles away
    </li>
  {{/each}}
{{/if}}
```

### Task 的语法

当 perform 一个task 的时候，它会运行传递给它的 [Generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*) —— 必须使用 `function *` 不能使用常规的 JavaScript 函数。

任何可以在常规函数里面执行的操作都可以在生成器函数中执行：

``` js
pickRandomNumbers: task(function * () {
  let nums = [];
  for (let i = 0; i < 3; i++) {
    nums.push(Math.floor(Math.random() * 10));
  }

  this.set('status', `My favorite numbers: ${nums.join(', ')}`);
}),
```

#### 使用关键字 `yield`

当你开始使用 `yield` 关键字的时候，你就开始释放 task 强大的能量了。`yield` 关键字用于 promise 可以暂停 task 函数直到该 promise 变为 resolved 状态，并在暂停的地方继续往下运行。

下例展示如果使用 `yield timeout(1000)` 来暂停1000ms，`timeout` helper function 由 ember-concurrency 提供，它只是简单的提供了一个延时 resolved 的promise。

``` js
waitAFewSeconds: task(function * () {
  this.set('status', "Gimme one second...");
  yield timeout(1000);
  this.set('status', "Gimme one more second...");
  yield timeout(1000);
  this.set('status', "OK, I'm done.");
}),
```

当你 `yield` 一个 promise 的时候， `yield` 表达式会计算并返回 promise resolve 过后的值。换句话说，你可以将一个变量的值设置为 yield 的 promise，当该 promise resolve 过后，该 task 函数将会重新启动，并且 promise resolve 过后的值会被赋予该变量。

``` js
myTask: task(function * () {
  this.set('status', `Thinking...`);
  let promise = timeout(1000).then(() => 123);
  let resolvedValue = yield promise;
  this.set('status', `The value is ${resolvedValue}`);  // the value is 123
}),
```

如果你`yield` 一个 reject 的promise，该 task 函数将会在yield 该reject promise 的地方抛出 rejected value（类似一个 exception object），也就是说你可以使用 `try{}catch(e){}finally{}` 块来处理异常，就像你运行同步代码那样：

``` js
  myTask: task(function * () {
    this.set('status', `Thinking...`);
    try {
      yield timeout(1000).then(() => {
        throw "Ahhhhh!!!!";
      });
      this.set('status', `This does not get used!`);
    } catch(e) {
      this.set('status', `Caught value: ${e}`);
    }
  }),
```

在 task 里面使用 generator 函数是为了更靠近 [`async/await`](https://github.com/tc39/ecmascript-asyncawait) 语法的行为。但是使用 `function *` 替代 `async function`，使用`yield` 替代 `await`

### 管理 task concurrency

默认情况下，ember-concurrency task 并发运行 —— 如果你调用 `myTask.perform();myTask.perform();` 两个实例将同时运行（除非宿主对象已经销毁，它们也会被取消）。

但是通常，你可能不想同时运行超过一个以上的实例。例如，你又一个保存 model 数据到服务器的 task，你可能不希望该 task 并发执行 —— 你希望它按顺序执行。或者你希望在已经又一个实例运行的情况下忽略后面对该 task 的调用。手动来处理这些约束相对棘手，并且冗余、易错。ember-concurrency 使用如下 Modifiers 来简化该操作：

#### 例子

以下所有例子使用相同的 task 函数（暂停一会儿然后完成），但是使用不同的 modifiers：

``` js
export default Ember.Controller.extend({
  defaultTask:     task(SHARED_TASK_FN),
  restartableTask: task(SHARED_TASK_FN).restartable(),
  enqueuedTask:    task(SHARED_TASK_FN).enqueue(),
  droppingTask:    task(SHARED_TASK_FN).drop(),
  keepLatestTask:  task(SHARED_TASK_FN).keepLatest(),
});
```

#### 默认行为： task 并行运行

参考[文档示例](http://ember-concurrency.com/#/docs/task-concurrency)

- restartable
  - `restartable` modifier 通过取消任何当前正在运行的 task 然后立即启动一个新的 task实例来确保只有一个实例运行。

- enqueue
  - `qenqueue` modifier 将所有的 task 入队列并按顺序执行它们，但是每一次只有一个 task 在执行。

- drop
  - `drop` modifier 在当其它 task 正在运行的时候取消后续 `.perform`

- .keepLatest()
  - `.keepLatest()` 将会取消除了 正在运行的 和 最近一个 task 的所有其它 task
  - 使用场景：你在轮询服务器的时候，在服务器响应请求之前，你通过其它手段（如 websocket）得知数据陈旧，你需要在初始请求完成之后重新查询服务器。

### 高级用法

#### 使用 `.maxConcurrency(N)`

之前的例子中将任务数量限制为 1 —— 在同一时间只有一个 task 实例。大多数时间，它满足你的需要。

但是有一些情况，当你想限制的个数超过 1 的时候，你可以使用 `.maxConcurrency(N)` modifier 来指定最大并发数。

下例使用与前面相同的 task modifier，但是还使用 `.maxConcurrency(3)`： 它们每个 task 都允许入队、取消或者阻止之前同时运行（`perform()`） 3 个实例

``` js
export default Ember.Controller.extend({
  restartableTask3: task(SHARED_TASK_FN).maxConcurrency(3).restartable(),
  enqueuedTask3:    task(SHARED_TASK_FN).maxConcurrency(3).enqueue(),
  droppingTask3:    task(SHARED_TASK_FN).maxConcurrency(3).drop(),
  keepLatestTask3:  task(SHARED_TASK_FN).maxConcurrency(3).keepLatest(),
});
```

参考 [demo](http://ember-concurrency.com/#/docs/task-concurrency-advanced)

maxConcurrency 为 1 的时候 restartable 是一个很好的 modifier 名称，但是超过 1 的时候它就不太能描述这种行为了，本例使用了一个更好的名称 `.sliding()`，as in sliding buffer. （不太明白这里的意思）

### 取消操作

ember-concurrency task 可以被明确的取消（通过调用某个task或者task实例的取消函数）或者隐式取消（基于task的配置或者宿主对象被销毁）。

通常，配置 task 属性是较好的方式（通过 task modifiers）因为它能够在正确的时间 隐式的/自动 取消，但是有的情况只能显式的取消。

#### 显式取消

显式取消有两种方式：

- 在 task 对象上调用 `task.cancelAll()` —— 该操作会取消该 task 上所有运行或者队列的 task 实例
- 在 task 实例（`task.perform()`返回的对象）上调用 `taskInstance.cancel()`

例子：[demo](http://ember-concurrency.com/#/docs/cancelation)

也可以使用 `.concurrency` 属性来得到指定 task 当前运行的任务实例数量。如 {{myTask.concurrency}}

### 处理错误

#### 错误与取消

当 `yield Promise`，task 函数会在以下 3 种情况暂停：

- promise fulfills，task 会接着这里继续执行。
- promise rejects， task 会在该处自动抛出一个错误
- task 被取消

[Task Function Syntax docs](http://ember-concurrency.com/#/docs/task-function-syntax) 演示了如何使用 `try/catch` 块来捕捉异常，但是如果是取消了？

在 ember-concurrency 中，取消被认为是第三种 "完成态"（另外两种是 成功/抛出异常）。也就是说如果 task 被取消，它会暂停在取消的时候，并且从该暂停处返回，它会跳过所有的 `catch(e){}` 代码块，但是会执行 `finally{}` 块。这样的操作有两个好处：

- `finally` 块始终都会执行，并且可以用于清理逻辑
- 你没有必要在 `catch` 块中清楚区分是 取消 还是 异常（如果取消被当作是错误被抛出的话你会在代码中感到很疑惑）

`finally` 块虽然很好的用于清理逻辑，但是请确保合理使用了 `Task Modifiers` 和 `.isRunning/.isIdle` 属性，因为这样可以避免自己去写很多重复逻辑。例如，在控制显示和隐藏 loading spinner 的时候可以使用 `.isRunning` 属性。

#### 例子 [demo](http://ember-concurrency.com/#/docs/error-vs-cancelation)

### 子 task（child task）

task 可以通过 `yield` `anoterTask.perform()` 的结果值 来调用其它 task。当发生这种情况的时候， 父task 将会等待 子task 完成才会开始。如果 父task 被取消， 子task 也将会自动被取消。

#### 例子 [demo](http://ember-concurrency.com/#/docs/child-tasks)


### task 组

[`Task Modifiers`](http://ember-concurrency.com/#/docs/task-concurrency)防止单个任务并行， task组 用于阻止多个 task 同一时间运行。使用 task group 有两步：

1、 定义 task组 。如：`nameOfGroup: taskGroup()`;
2、 使用 `.group()` 来关联 task。如 `myTask: task(...).group('nameOfGroup')`

一旦你定义了一个 task 作为 task组 的成员，你可以不在使用像 `drop()`、`restartable()` 等其它 task modifiers；取而代之的是使用将它们用在 task组 上，参考示例 [demo](http://ember-concurrency.com/#/docs/task-groups)

### 衍生状态

ember-concurrency 的核心目标之一就是提供尽可能多的衍生状态. 例如,ember-concurrency提供了 `.isRunning` 和 `.isIdle` 属性来供你使用,这样就不需要自己去控制 `isRunning` 状态.

ember-concurrency 提出了一个 task 概念. 当你 `perform` 一个 task 的时候, 就会产生一个 task实例 —— 它代表该 task 的一个执行实例. task 和 task实例都暴露出很多衍生状态给我们使用. 接下来将介绍它们:

#### task 对象的属性

- `isRunning` 当至少有一个该 task 实例在运行的时候返回 true,否则返回 false
- `isIdle` 与 `isRunning` 相反
- `performCount` 该task 被 perform 的次数
- `concurrency` 该task 当前正在执行的实例个数. 如果使用了如 `drop/enqueue/restartable` 这样的 task modifier 并且没有指定 `maxConcurrency` 则该数字不会超过 1, 在调试的时候该属性比较有用.
- `state` 代表task 状态的字符串,可以是 "running" 或者 "idle"

#### 重 task 对象获取 task实例

task 也暴露给我们了一些属性来获取指定的 task实例(每次通过调用 `.perform()` 创建)

- `last` 最后一个已经启动执行的task实例, This property will never point to a `drop`ped Task Instance,
- `lastSuccessful` 最后一个执行完成的实例(即返回值不是拒绝态的 promise)
- `isSuccessful` 如果该 task实例运行完成则返回 true
- `isError` 如果该 task实例由于异常导致失败,将返回true

任何时候你都可以把 `.perform()` 返回的 task实例 存储起来用以获取上面的衍生状态

#### task实例的属性
- `value` task 函数返回的值. 在返回值之前它是 `null` ,如果 task 一直没有执行完成(包括抛出异常和被取消),则一直为 null
- `error` task 函数抛出的 error/exception(也可能是 yield 返回的 reject promise 的值). 注意: 直到[该issue](https://github.com/machty/ember-concurrency/issues/40) 被解决之前,除非你在代码中解决了该问题(`.catch()`),否则该问题回一直冒泡到浏览器.

#### 合二为一

假如有一个叫 `myTask` 的 task, 如果你需要根据 myTask 最近执行的返回值显示一个成功的banner, 你可以写成 `{{myTask.last.value}}`, 如果需要该banner直到下一次task执行完成,可以写成 `{{myTask.lastSuccessful.value}}`, 还有很多其他组合写法供你使用.

#### [例子](http://ember-concurrency.com/#/docs/derived-state)

### Ember / jQuery 事件

可以使用 `waitForEvent` 来直到 Ember.Evented 或者 jQuery Event 触发之前暂停 task.

当需要在一个 task 中等待 event 触发时, 但是又你不想专门建立一个 promise 来等待事件触发的时候 resolve 该promise 时非常有用.

#### 使用 `waitForEvent` 的例子 [demo](http://ember-concurrency.com/#/docs/events)

#### 使用 衍生状态 的例子 [demo](http://ember-concurrency.com/#/docs/events)

有时候需要task嵌套, task2 是 task1 的子task, task2 一直无限循环,如果判断task2的 `isRunning` 将永远是 true, 所以通过判断子 task1 的状态来判断运行状态.
