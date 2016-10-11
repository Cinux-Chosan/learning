# Templates

---

- {{#each-in}} 可以用于循环获取对象的属性：

        <ul>
          {{#each-in categories as |category products|}}  // category为每一项的键名，products为值
            <li>{{category}}
              <ol>
                {{#each products as |product|}}
                  <li>{{product}}</li>
                {{/each}}
              </ol>
            </li>
          {{/each-in}}
        </ul>

- {{#each-in}}不会监视变量的改变。如果在重绘过后给对象添加属性，模板中的内容不会自动更新。

> 为了在修改了对象之后，需要触发重绘效果，可以重新调用set()将属性重新设置到该组件上，或者通过组件的rerender()手动触发re-render事件。

        actions: {
            addCategory(category) {
              let categories = this.get('categories');
              categories[category] = [];

              // A manual re-render causes the DOM to be updated
              this.rerender();      // 手动触发rerender事件，rerender()事件为component事件，只有在component中使用有效，在controller中无效，并且component的rerender只会导致自己数据重绘，不会影响同一个页面中的其他component
            }
          }


## Binding Element Attributes

- 默认情况下，helper和component不接受 data-* 的数据绑定，这些数据会自动被忽略：

        {{#link-to "photos" data-toggle="dropdown"}}Photos{{/link-to}}

        渲染为

        <a id="ember239" class="ember-view" href="#/photos">Photos</a>

        //为了开启data-* 的数据绑定，必须将data-* 字段添加到component中，例如：

        Ember.TextField.reopen({
          attributeBindings: ['data-toggle', 'data-placement']
        });

- 默认情况下，{{#link-to}}的参数如果是一个object，则会使用object的 id 作为参数。

- 如果路由嵌套，父级路由也有动态段，可以将父级路由写在前面：

        <p>
          {{#link-to 'photo.comment' 5 primaryComment}}
            Main Comment for the Next Photo
          {{/link-to}}
        </p>

- link-to 作为内联使用， 第一个参数为显示的文字：{{link-to "Inline Form" "index"}}

- link-to 中可以使用 replace=true 来覆盖浏览器的历史纪录

## Input helper
- 直接给helper添加事件：

        // 测试发现，该写法对某些事件无效，如 click, double-click
        {{input value=firstName key-press="updateFirstName"}}

      　// 测试发现，该写法（使用action helper）能够正确响应 click, double-click 事件等，因此此方法更好
        {{input value=firstName click=(action "updateFirstName")}}

## Action

- 默认情况下，响应 click 事件，如果需要响应其它事件，使用 on="mouseUp"，事件名使用驼峰

- 如果需要使用修饰键，需要将 allowedKeys 设为需要使用的键名：

        <button {{action "anActionName" allowedKeys="alt"}}>
          click me
        </button>

- 默认情况下，action 会阻止默认事件，所以使用 preventDefault=false 可以取消阻止默认事件。

- 获取event：如果直接使用{{action 'handlerName' params}}这种格式，handlerName得到的参数是params，为了获取 event事件对象，可以写作：

        <input type="text" value={{favoriteBand}} onblur={{action "bandDidChange"}} />
        或者
        <input type="text" value={{favoriteBand}} onblur={{action "bandDidChange" value="target.value"}} />   
        第二种写法，传给favoriteBand的值为event.target.value的值，即input框内的值

- 虽然事件可以绑定到所有的DOM元素上，但是某些浏览器不会响应click事件，例如没有 href属性的 a 标签上的事件，或者 div 上面的click事件等，这种情况就需要使用css来使得元素可以被点击：
        [data-ember-action]:not(:disabled) {
          cursor: pointer;
        }
        // 某些情况下，还如要使用role/tabindex等来帮助实现效果

- 为了创建动态绑定，即需要用到的变量名可能是保存在某个变量中的，此时需要使用 {{get}} 和 {{mut}}，{{get}}动态获取属性，{{mut}}将属性进行绑定，如果不使用{{mut}}，则不会是双向绑定：

        {{input value=(mut (get person field))}}    // 如果不用mut，则input框中改变内容，不会改变person的field变量所代表的变量名的字段
        // The {{get}} helper allows you to dynamically specify which property to bind, while the {{mut}} helper allows the binding to be updated from the input.
