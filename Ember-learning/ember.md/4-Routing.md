# Routing

---

        定义路由的时候，遵循:model-name_id的结构：
        //the following will not work properly:

        Router.map(function() {
          this.route("photo", { path: "photo/:id" }, function() {
            this.route("comment", { path: "comment/:id" });
          });
        });

        //But the following will:

        Router.map(function() {
          this.route("photo", { path: "photo/:photo_id" }, function() {
            this.route("comment", { path: "comment/:comment_id" });
          });
        });

---

        Note: A route with a dynamic segment will always have its model hook called when it is entered via the URL. If the route is entered through a transition (e.g. when using the link-to Handlebars helper), and a model context is provided (second argument to link-to), then the hook is not executed. If an identifier (such as an id or slug) is provided instead then the model hook will be executed.（带有动态段的路由通过URL进入该页面的时候，总是会调用它的model方法，如果该路由是通过transition的方式进入，例如通过link-to，并且传入了一个存在于model上下文中的对象，则不会调用该model方法；如果是一个标识符，则会触发model方法）

---

        route默认会渲染与之对应的template，如果想渲染其它的template，可以在route中通过templateName设置：

        import Ember from 'ember';

        export default Ember.Route.extend({
          templateName: 'posts/favorite-posts'
        });

        如果想更精确的控制显示，可以在route中使用renderTemplate()方法。

---

        如果需要在route中重定向到其他路由，可以在route中的beforeModel()中使用this.transitionTo()来重定向，如果需要根据application的状态来进行判断，可以使用service。
        如果需要根据model的状态进行判断，可以使用afterModel()方法，它将接受两个参数，第一个参数为model，第二个参数为transition

---

        在嵌套的路由中，如果父级路由通过判断某些条件，使用transitionTo()跳转到子路由，这样会经过父级路由，导致重新触发父级路由，但还是会跳转（也许是因为参数transition里面所携带的信息的原因），这样会触发两遍父级路由，并不高效，所以可以使用redirect()来跳转，该方法会离开当前transition，不会再次触发beforeModel()、model()、afterModel()。route里面这几个hook的调用顺序为：beforeModel-> model-> afterModel-> redirect。并且如果存在redirect，则redirect每次都会在afterModel调用之后被调用。

---

        transition.abort()、transition.retry():
        通过将transition保存在其他路由的controller中，在适当的情况下通过retry()重新执行。

        When a transition is attempted, whether via {{link-to}}, transitionTo, or a URL change, a willTransition action is fired on the currently active routes. This gives each active route, starting with the leaf-most route（实际上默认只有叶子节点路由的willTransition会被触发，如果子节点的willTransition返回true，则会传递给父级route的willTransition）, the opportunity to decide whether or not the transition should occur.

        通过link-to或者transition会触发willTransition，但是点击浏览器的返回按钮，或者直接修改URL，会直接跳转到新的页面，不会经过willTransition，即便是willTransition调用了transition.abort()也无济于事。

---

        route中通过this.controller获取自己的controller，但是由于在首次进入route的时候并没有controller，此时this.controller为undefined；通过this.controllerFor('routeName')获取其他的controller。

---

        loading:
        首先查找 routeName-loading，然后是parentRouteName.loading或者parentRouteName-loading
        如果beforeModel、model、afterModel没有立即处理完，就会在route上触发loading事件。

        如果没有定义对应的loading函数，则loading事件会冒泡到父级route中。（
        If the loading handler is not defined at the specific route, the event will continue to bubble above a transition's parent route, providing the application route the opportunity to manage it.）

        在route的loading事件中，通过transition可以获取执行完成状态，即能够知道loading何时完成：

        actions: {
          loading(transition, originRoute) {
            let controller = this.controllerFor('foo');
            controller.set('currentlyLoading', true);
            transition.promise.finally(function() {  // loading完成
              controller.set('currentlyLoading', false);
            });
          }
        }


        error:
        如果页面出错或则model返回的promise为reject状态则会触发error，出错信息(i.e. the exception thrown or the promise reject value) 将会被发送到error的路由作为它的model。错误路由的beforeModel、model、afterModel不会被调用，只有setupController会被调用，并且setupController的参数为controller和error，error作为它的model。

        setupController: function(controller, error) {
          Ember.Logger.debug(error.message);
          this._super(...arguments);
        }


## Query Parameters

- 查询参数必须在controller中声明：
        import Ember from 'ember';

        export default Ember.Controller.extend({
          queryParams: ['category'],
          category: null
        });

- 查询参数不能绑定computed属性。

- 查询参数会自动与URL的值进行双向绑定。查询参数改变不会导致路由改变，即不会调用model和setupController这些。

- link-to也可以接受查询参数：

        // Binding is also supported
        {{#link-to "posts" (query-params direction=otherDirection)}}Sort{{/link-to}}

- transitionTo和transitionToRoute接受的最后一个参数是一个包含查询参数的对象:

        this.transitionTo('post', object, { queryParams: { showDetails: true }});
        this.transitionTo('posts', { queryParams: { sort: 'title' }});

        // if you want to transition the query parameters without changing the route
        this.transitionTo({ queryParams: { direction: 'asc' }});

        // 同样可以将它放在URL中：
        this.transitionTo('/posts/1?sort=date&showDetails=true');

- 查询参数默认情况下不会导致route刷新，即不会调用model和setupController，如果需要，则可以在route中配置某个查询参数需要刷新路由，将查询参数的refreshModel设为true即可：

route.js:

        import Ember from 'ember';

        export default Ember.Route.extend({
          queryParams: {
            category: {
              refreshModel: true
            }
          },
          model(params) {
            // This gets called upon entering 'articles' route
            // for the first time, and we opt into refiring it upon
            // query param changes by setting `refreshModel:true` above.

            // params has format of { category: "someValueOrJustNull" },
            // which we can forward to the server.
            return this.get('store').query('article', params);
          }
        });

controller.js:

        import Ember from 'ember';

        export default Ember.Controller.extend({
          queryParams: ['category'],
          category: null
        });

- 默认情况下，查询参数会使用pushState将历史纪录存入浏览器历史，如果不需要，可以配置使其使用replaceState来取代。配置方法为在route的查询参数配置中将replace设为true：

        // route中查询参数的配置同link-to，在link-to中使用replace=true达到该效果。
        queryParams: {
          category: {
            replace: true
          }
        }

- 修改映射关系（非默认名）：默认情况下，查询参数与URL中同名的字段产生绑定，如果不需要URL中的查询参数名于属性名相同，可以配置如下：

        export default Ember.Controller.extend({
          queryParams: {
            category: 'articles_category'     // category属性与URL中的articles_category形成双向绑定
          },
          category: null
        });

        // 可与非配置查询参数并列
        export default Ember.Controller.extend({
          queryParams: ['page', 'filter', {
            category: 'articles_category'
          }],
          category: null,
          page: 1,
          filter: 'recent'
        });

- 如果给查询参数设置了默认值，则URL中的值的改变导致属性的改变，会是相同的数据类型，即/?page=2 使得 page属性为2而不是"2"。属性被设为默认值的时候，在URL中不一定会体现出来，即URL中可能看不到该查询参数，但是如果值发生改变，则立马反映在URL中。

- 默认情况下，查询参数是粘性（sticky）的，即导航到其它路由过后，再次进入该路由，它的查询参数不会改变，这样的特性在保持页面与离开之前一致时比较有用，但是如果需要重置查询参数，可以使用如下两个方法：
> 1、在link-to或者transition的时候显示传入查询参数

> 2、在route中使用resetController方法处理：

        export default Ember.Route.extend({
          resetController(controller, isExiting, transition) {
            if (isExiting) {
              // isExiting would be false if only the route's model was changing
              controller.set('page', 1);
            }
          }
        });

- Promise

        可以在model中catch处于reject状态的promise，从而使其变成fullfilled状态，并且不会阻止路由跳转和显示错误信息

        export default Ember.Route.extend({
          model() {
            return iHopeThisWorks().catch(function() {        // catch
              // Promise rejected, fulfill with some default value to
              // use as the route's model and continue on with the transition
              return { msg: 'Recovered from rejected promise' };
            });
          }
        });
