# [Velocity.js](http://velocityjs.org/)

## 概览

Velocity 是一个与 jQuery 的 $.animate() 一样的动画引擎。它不依赖 jQuery，它性能比 jQuery 好。

## 下载使用

[下载Velocity](https://raw.githubusercontent.com/julianshapiro/velocity/master/velocity.min.js)，将它包含到页面中，将 jQuery的 $.animate() 改为 $.velocity()即可。

## 兼容性

Velocity 可以在任何场景下工作，甚至是 IE8 和 Andriod 2.3 都可以。它模仿了 jQuery 的 $.queue() 并且可以很好的与 jQuery 的 $.animate()、$.fade()、$.delay()等相互操作兼容。因为 Velocity 的语法与 $.animate() 完全相同，你不需要改变任何其他代码。

## 秘诀

Javascript 和 jQuery 混为一谈是错误的做法，Javascript 动画，即 Velocity 使用的动画方式，是非常快的。但是jQuery 的就比较慢。 虽然与 jQuery 有相同的用法，但是它使用自己的动画堆栈，通过两个原则来提升性能：

- 促使 DOM 进行同步
- 缓存 DOM 节点来减少 DOM 操作

<!-- ## Check this out

根据我们工程师的引导来 -->


## 参数

如果有 jQuery 或者 Zepto， Velocity 会依附于 $ 上，如果没有，则 Velocity 会依附于 Window 上，在这种情况下，就需要 Velocity 方法来驱动动画效果，将 DOM 元素作为第一个参数传入：

``` js
Velocity(document.getElementById("dummy"), { opacity: 0.5 }, { duration: 1000 });
```

由于没有 jQuery 或者 Zepto，当然就没有办法使用那些库提供的 $.queue() and $.delay() 方法。但是 velocity 也提供了自己的方法。


## 基础：参数[示例](http://codepen.io/julianshapiro/pen/BjwtC)

### 概览

Velocity（在有 jQuery 或者 Zepto 的情况下，此时使用 $ 选择元素而不是给 Velocity 传入 DOM 元素）使用具有 css 属性和值的对象作为第一个参数，第二个参数传递 Velocity 的参数选项。

``` js
$element.velocity({
    width: "500px",
    property2: value2
}, {
    /* Velocity's default options */
    duration: 400,
    easing: "swing",
    queue: "",
    begin: undefined,
    progress: undefined,
    complete: undefined,
    display: undefined,
    visibility: undefined,
    loop: false,
    delay: false,
    mobileHA: true
});
```

默认参数可以通过修改全局的 $.Velocity.defaults 来覆盖。

### 单对象

Velocity 也可以传入单对象作为参数，该对象包括 properties（或者p）属性和 options(或者o) 属性：

``` js
$element.velocity({
    properties: { opacity: 1 },
    options: { duration: 500 }
});
Or:
$element.velocity({
    p: { opacity: 1 },
    o: { duration: 500 }
});
```

### 逗号分隔

Velocity 也接受 jQuery 的逗号语法来，但是仅仅对 duration、easing、complete 属性有用: $element.velocity(propertyMap [, duration] [, easing] [, complete])

这些参数可以按任意顺序被替代：

``` js
$element.velocity({ top: 50 }, 1000);
$element.velocity({ top: 50 }, 1000, "swing");
$element.velocity({ top: 50 }, "swing");
$element.velocity({ top: 50 }, 1000, function() { alert("Hi"); });
```

## 基础：属性映射

### 属性 [示例](http://codepen.io/julianshapiro/pen/fjbct)

Velocity auto-prefixes 属性（如： transform 在 WebKit浏览器上变成 webkit-transform），请不要手动给属性添加前缀。

Velocity 动画每个属性使用一个数值，因此，你可以这样写：

``` js
{ padding: 1 }
```

``` js
{ paddingLeft: 1, paddingRight: 1 }
```

但是不能写成 `{ padding: "1 1 1 1" }` 因为你提供了多个数值。

然而， Velocity includes hooks to break down the following properties that require multiple values: textShadow, boxShadow, clip, backgroundPosition, and transformOrigin. Refer to the [CSS Support](http://velocityjs.org/#cssSupport) dropdown for a full listing of hooks.

### 值 [Demo](http://codepen.io/julianshapiro/pen/fjbct)

Velocity 支持 px,em,rem,%,deg,vw/vh 作为单位，如果没有提供一个单位，则 Velocity 会自动选择一个合适的作为单位，通常是 px，但是在 rotateZ 的时候是 deg。

Velocity 支持四个操作符： +, -, * 和 /。可以将 = 与它们任何一个搭配使用：

``` js
$element.velocity({
    top: 50, // Defaults to the px unit type
    left: "50%",
    width: "+=5rem", // Add 5rem to the current rem value
    height: "*=2" // Double the current height
});
```

浏览器支持： rem 单位在 IE9 以下不支持。 vh/vw 单位 IE9 和 Andriod 4.4 以下不支持。

## 基础： 链式 [Demo](http://codepen.io/julianshapiro/pen/hyqlF)

当一个或多个元素上多次调用 Velocity ，它们自动进行排队，上一个执行完以后再执行下一个。

``` js
$element
    /* Animate the width property. */
    .velocity({ width: 75 })
    /* Then, when finished, animate the height property. */
    .velocity({ height: 0 });
```

## 可选项：duration

Velocity 支持毫秒为单位的 duration，就像 jQuery 的 `slow`, `normal`, `fase`

``` js
$element.velocity({ opacity: 1 }, { duration: 1000 });
$element.velocity({ opacity: 1 }, { duration: "slow" });
```

## 可选项：easing (缓动函数)

### 概览

Velocity 默认支持以下 easing 类型:

- [jQuery UI's easings](http://easings.net/zh-cn) [Demo](http://codepen.io/julianshapiro/pen/bAiIt)
- CSS3 命名的 easings: "ease", "ease-in", "ease-out", "ease-in-out"
- CSS3 贝塞尔曲线: 传入一个包含四个贝塞尔点的数组（参考[Cubic-Bezier.com](http://cubic-bezier.com/)） [Demo](http://codepen.io/julianshapiro/pen/xBJcu)
- Spring physics: 传入一个格式为 [tension,friction] 的数组，A higher tension (default: 500) increases total speed and bounciness. A lower friction (default: 20) increases ending vibration speed. 参考[Spring Physics Tester](http://codepen.io/julianshapiro/pen/hyeDg) [Demo](http://codepen.io/julianshapiro/pen/fgjaF)
- Step easing: 传入格式为 [setps] 的数组，The animation will jump toward its end values using the specified number of steps. See [this article](http://css-tricks.com/clever-uses-step-easing/) to learn more about step easing. [Demo](http://codepen.io/julianshapiro/pen/ylvuh)


以上所有 easing type 都完全支持 IE8

你可以通过传入 easing 名称（如 "ease-out"或者"easeInSine"），或者你可以传入一个数组：

``` js
/* Use one of the jQuery UI easings. */
$element.velocity({ width: 50 }, "easeInSine");
/* Use a custom bezier curve. */
$element.velocity({ width: 50 }, [ 0.17, 0.67, 0.83, 0.67 ]);
/* Use spring physics. */
$element.velocity({ width: 50 }, [ 250, 15 ]);
/* Use step easing. */
$element.velocity({ width: 50 }, [ 8 ]);
```

### Per-Property Easing （每个属性设置 easing）

Easing 也可以通过传入一个包含两个元素的数组作为属性值来声明一个属性的 easing， 第一个参数是标准的结束值，第二个参数是 easing 类型：

``` js
$element.velocity({
    borderBottomWidth: [ "2px", "spring" ], // Uses "spring"
    width: [ "100px", [ 250, 15 ] ], // Uses custom spring physics
    height: "100px" // Defaults to easeInSine, the call's default easing
}, {
    easing: "easeInSine" // Default easing
});
```

就像 jQuery 的 $.animate()，"swing" 是 Velocity 的默认 easing 类型。


### 自定义 easing (Advanced)

自定义 easing 方法，将方法依附于 $.Velocity.Easings 对象上，该方法接收如下参数：
- p: 该 easing function 调用的完成百分比（十进制）
- opts(可选): 传入 Velocity 的 option 对象
- tweenDelta(可选): 动画属性结束值与其起始值的差异。

``` js
$.Velocity.Easings.myCustomEasing = function (p, opts, tweenDelta) {
    return 0.5 - Math.cos( p * Math.PI ) / 2;
};
```

## 选项参数： Queue

你可以设置 queue 为 false 来强制一个新的动画立即与当前正在执行的动画并行执行。[Demo](http://codepen.io/julianshapiro/pen/Ioeqy)

``` js
/* Trigger the first animation (width). */
$element.velocity({ width: "50px" }, { duration: 3000 }); // Runs for 3s
setTimeout(function() {
    /* Will run in parallel starting at the 1500ms mark. */
    $element.velocity({ height: "50px" }, { queue: false });
}, 1500); // 1500ms mark
```

另外，一个自定义队列 —— 一个非立即执行队列 —— 可以通过传入queue 自定义队列名来创建。 你可以创建多个并行自定义队列，然后它们可以单独通过 `$element.dequeue("queueName")` （或者如果没有使用 jQuery 的情况下使用 Velocity.Utilities.dequeue(element(s), "queueName")）

注意： loop 选项和 reverse 命令不能用于自定义队列和并行队列。

Velocity 使用与 jQuery queue 相同的逻辑，所以可以与 $.animate()、$.fade()、$.delay() 无缝结合。如果想要了解更多 Velocity的 queue ，请至 [此处](http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me)


## 选项： Begin & Complete

### Begin [Demo](http://codepen.io/julianshapiro/pen/zCJgp)：

传给 begin 的函数将会在动画开始之前执行。

与Complete 一样，begin 回调函数会在每次调用之前执行，即便是多个元素在同时执行动画。进一步，如果一个调用被循环，该 begin 回调只触发一次 —— 即在第一次循环开始时。

该回调会被传递一个完整的 DOM 节点（原始DOM元素，非jQuery元素）数组作为它的上下文和第一个参数。为了单独得到这些元素，你必须通过 jQuery 的 $.each() 或者 Javascript 原始的 .forEach() 来迭代该数组。

``` js
$element.velocity({
    opacity: 0
}, {
    /* Log all the animated divs. */
    begin: function(elements) { console.log(elements); }
});
```

### Complete [Demo](http://codepen.io/julianshapiro/pen/DCLja)

Complete 与 begin 相反，传入的 complete 函数会在动画结束的时候被触发。该方法也是每次调用执行一次，即便是多个元素同时在执行动画。进一步，如果一个调用被循环，complete 方法智慧在最后一个循环结束后执行。

该回调也是接收完全原始的 DOM元素（非 jQuery元素）数组作为它的上线文和第一个参数。为了单独得到这些元素，你必须通过 jQuery 的 $.each() 或者 Javascript 原始的 .forEach() 来迭代该数组。

``` js
$element.velocity({
    opacity: 0
}, {
    /* Log all the animated divs. */
    complete: function(elements) { console.log(elements); }
});
```

## Option: Progress [Demo](http://codepen.io/julianshapiro/pen/Jktjq)

传递给 progress 一个回调函数将会在动画执行期间反复的被触发。回调函数在调用的状态上传递参数。这些数据可以用于自定义变换等。

该回调函数会被传递完整的 DOM 元素（非 jQuery元素）数组作为它上线文和第一个参数，如果要单独得到这些元素，你必须通过 jQuery 的 $.each() 或者 Javascript 原始的 .forEach() 来迭代该数组。传入的参数为： complete, remaining, start, and tweenValue:

- complete: 完成的百分比
- remaining: 离动画结束还有多少毫秒
- start: 开始调用时的绝对时间（in Unix time）
- tweenValue: 可选的传入Velocity 调用的中间动画(tween，参考http://blog.csdn.net/pointerfree/article/details/6777693)的当前值。这样作的作用是它允许你通过 progress 回调函数准确的得到 tween 动画过程执行过程的准确值。 This dummy property, like all other Velocity animation properties, is subject to the call's easing behavior. Leveraging this tween property allows you to turn Velocity into a custom tweening engine so that you animate the change of arbitrary DOM properties.

``` js
$element.velocity({
    opacity: 0,
    tween: 1000 // Optional
}, {
    progress: function(elements, complete, remaining, start, tweenValue) {
        console.log((complete * 100) + "%");
        console.log(remaining + "ms remaining!");
        console.log("The current tween value is " + tweenValue)
    }
});
```

**Note** that you can pass the dummy tween value along with other properties as well; tween doesn't have to stand alone. Further, note that you can forcefeed the tween property to start from an arbitrary offset. If you don't forcefeed a starting value, the tween will start from a value of 0.

``` js
$element.velocity({
    tween: [ 0, 1000 ]
}, {
    easing: "spring",
    progress: function(elements, c, r, s, t) {
        console.log("The current tween value is " + t)
    }
});
```

## Option: mobileHA

mobileHA 即 mobile hardware acceleration。 当设置为 true（默认值）—— Velocity 动画在移动设备上会自动开启硬件加速。

Use mobileHA instead of sprinkling [null transform hacks](http://aerotwist.com/blog/on-translate3d-and-layer-creation-hacks/) throughout your code. Velocity's manipulation of HA is highly streamlined.
Mobile browsers benefit hugely from HA, whereas desktop browsers do not. (JavaScript-powered desktop animations actually perform worse when hardware acceleration is applied.) Accordingly, **mobileHA has no effect on desktop browsers**.
As with Velocity's transform support — transform values set outside of Velocity (including their default values) are overridden when mobileHA is on. If this is an issue, turn mobileHA off by setting it to false:

``` js
$element.velocity(propertiesMap, { mobileHA: false });
```

## Option: Loop[Demo](http://codepen.io/julianshapiro/pen/KgvyC)


设置 loop 选项为一个正整数来指定动画循环次数：

``` js
$element.velocity({ height: "10em" }, { loop: 2 });
```

上例中，如果元素最初的 height 是 5em，则它的 height 会在 5em 和 10em 之间循环2次。

如果循环调用中使用了 begin 和 complete，它们只会被触发一次，即在最开始的循环动画和最后的循环动画才会触发。它们不会为每个循环交替重新触发。

传入 true 可以指定无限循环（infinite）：

``` js
$element.velocity({ height: "10em" }, { loop: true });
```

无限循环永远不会返回 promise，并且忽略 complete 回调函数。并且不能与 queue:false 一起使用。在触发同一个元素另一个无限循环动画的时候需要确保停止前一个无限循环动画。（可以通过 [stop](http://velocityjs.org/#stop) 命令停止循环）

## Option: Delay [Demo](http://codepen.io/julianshapiro/pen/GICev)

在动画开始前的延时，单位是毫秒。delay 选项的存在可以让动画逻辑完全控制在 velocity 之内 —— 如果 jQuery 的 $.delay()。

你可以设置循环之间的停顿:

``` js
$element.velocity({
    height: "+=10em"
}, {
    loop: 4,
    /* Wait 100ms before alternating back. */
    delay: 100
});
```

## Option: Display & Visibility [Demo](http://codepen.io/julianshapiro/pen/kJlKB)

### 简介：

Velocity 的 display 和 visibility 直接与它们的 CSS 对应，因此接收将相同的值：
- display 接收 "inline", "inline-block", "block", "flex", ""（空引号为删除该属性）和任何浏览器支持的私有属性。
- visibility 接收 "hidden", "visible", "collapse", "" （删除该属性）。

对于 display、 visibility 和 opacity 的比较，请参考[这篇文章](http://stackoverflow.com/a/273076/3329855)

除了 Velocity ， display 也接收一个非标准值 "auto"，它的意思是让 Velocity 将该元素的 display 设置成本地值。例如，锚元素默认为 "inline" ，div 默认为 "block"

Velocity 合并 CSS display/visibility 改变，这允许所有的动画逻辑被包含在 Velocity 里面，这意味着你不再需要 jQuery 的 $.hide() 和 $.show()。

### 使用

当 display 选项设置为 "none" 的时候（或者 visibility 设置为 "hidden"），则在动画完成之后相应的值被设置。也就是在动画完成之后隐藏该元素，在执行 opacity 动画为 0 的时候很有用。

如下，一个元素执行完 fade out 之后从文档流中被移除，这替代 jQuery 的 $.fadeOut() 函数：

``` js
/* Animate down to zero then set display to "none". */
$element.velocity({ opacity: 0 }, { display: "none" });
```

如下，一个元素执行完 fade out 之后将会不可见：

``` js
/* Animate down to zero then set visibility to "hidden". */
$element.velocity({ opacity: 0 }, { visibility: "hidden" });
```

相反，当 display/visibility 被设置成 "none"/"hidden" 以外的值，如 "block"/"visible"，则该值会在动画开始的时候被设置，以便动画的时候能够看见该元素。

（如果同时在执行 opacity 动画，它将被强制从 0 开始，它可以将元素回退到视图中）

如下，在元素渐变之前 display 被设置为 block。

``` js
/* Set display to "block" then animate from opacity: 0. */
$element.velocity({ opacity: 1 }, { display: "block" });
```

**注意：** display 和 visibility 选项在和 Reverse 指令(Command)使用的时候将会被忽略。


## Command

### Command: Fade & Slide

#### 表现

fade 和 silde 指令自动自动设置目标元素的 display 属性来显示和隐藏该元素。默认情况下，当显示一个元素的时候，display 被设置为该元素的原生类型（div 被设置为 "block"，span 被设置为 "inline"，etc.），这可以通过在 option 对象中传入一个自定义的 [display](http://velocityjs.org/#displayAndVisibility) 属性值来覆盖。

``` js
/* Set the element to a custom display value of "table". */ $element.velocity("fadeIn", { display: "table" });
```

#### fadeIn and fadeOut

元素渐隐可以通过传入 "fadeIn" 或者 "fadeOut"作为 Velocity 的第一个参数。 fade 指令的行为与标准的 Velocity 调用一样，它可以接收参数也可以被列队(queued)。

``` js
$element
    .velocity("fadeIn", { duration: 1500 })
    .velocity("fadeOut", { delay: 500, duration: 1500 });
```

上例中，我们用1500ms渐隐一个元素，停顿 500ms 然后在接下来的 1500ms fade out 。

#### slideUp and slideDown

将元素的高度从0增加和降低为0的动画，可以通过传入 "slideDown" 或者 "slideUp" 作为 Velocity 的第一个参数。 slide 指令表现同标准 Velocity 调用，它可以接收 options 和被链式调用:

``` js
$element
    .velocity("slideDown", { duration: 1500 })
    .velocity("slideUp", { delay: 500, duration: 1500 });
```

上例，通过 1500ms 将一个元素向下滑动到视图中，停顿 500ms，然后通过 1500ms 将该元素上滑移出视图。

如果你在寻找一个高性能的移动端优先的并且是以 Velocity 为基础的 slide（滑动）函数，请 check out [Bellows](https://github.com/mobify/bellows)

### Command: Scroll [Demo](http://codepen.io/julianshapiro/pen/kBuEi)

将浏览器滚动到顶部，可以传入 "scroll" 作为 Velocity 的第一个参数（而不是含有属性的对象），scroll 指令表现同标准 Velocity 调用，它可以接收 options 和被链式调用:

``` js
$element
    .velocity("scroll", { duration: 1500, easing: "spring" })
    .velocity({ opacity: 1 });
```

上例，花费1500ms和 "spring"方式将浏览器滚动到 div 的上边缘。当该元素滑进视图的时候，我们将它渐变出来。

对于有滚动条的元素， scroll 指令唯一需要的参数就是 container 选项，它可以是一个 jQuery 对象或是一个原生 DOM 元素。 container 元素必须是 CSS position 属性被设置成 relative、absolute 或者 fixed，设置为 static 无效。

``` js
/* Scroll $element into view of $("#container"). */
$element.velocity("scroll", { container: $("#container") });
```

[示例代码](http://codepen.io/julianshapiro/pen/kBuEi)

注意两种情况： 滚动是相对于浏览器窗口还是容器元素 —— scroll 指令总是在正在滚动到视图中的元素上调用。

默认情况下， 滚动发生在 Y 轴，如果传入 axis:"X" 选项可以横向滚动：

``` js
/* Scroll the browser to the LEFT edge of the targeted div. */
$element.velocity("scroll", { axis: "x" });
```

滚动也指定以像素为单位的偏移量 offset 属性：

``` js
$element
    /* Then scroll to a position 250 pixels BELOW the div. */
    .velocity("scroll", { duration: 750, offset: 250 })
    /* Scroll to a position 50 pixels ABOVE the div. */
    .velocity("scroll", { duration: 750, offset: -50 });
```

另外，将整个浏览器窗口滚动到任意元素边缘，只需要简单的将 html 元素作为目标元素，并且使用自定义 offset 属性值即可。另外可以通过传递 mobileHA:false 来避免在 IOS 上可能出现的闪烁问题：

``` js
/* Scroll the whole page to an arbitrary value. */
$("html").velocity("scroll", { offset: "750px", mobileHA: false });
```

### Command: [Stop](http://velocityjs.org/#stop) [Demo](http://codepen.io/julianshapiro/pen/xLAfs)

如果需要立即停止某个元素上面当前所有 Velocity 调用（包括通过 queue:false 调用的并行动画）, 则传递 "stop" 作为 Velocity 的第一个参数。该元素动画队列的下一个 Velocity 调用将会立即启动。

如果你正在停止一个[自定义队列](http://velocityjs.org/#queue)，可以传递队列名作为第二个参数，或者如果只停止并行动画（调用的时候使用 queue:false）但是并不停止当前默认队列动画，传递 false 作为自定义队列名。

``` js
$element.velocity("stop"); // Normal stop
$element.velocity("stop", "myQueue"); // Custom queue stop
```

当调用停止，它的 complete 和 display:none 被跳过。

**重要**：注意：循环（looped）Velocity 调用事实上是一系列 Velocity 调用链的组合。因此，如果要完全停止循环中的动画，你必须传入第二个参数来清除该元素上剩余的 Velocity 调用。同样，为了完全停止一个 [UI pack](http://velocityjs.org/#uiPack) 效果（可以由多个 Velocity 调用组成），你需要完全清除该元素上等待的动画队列。请参考下面的如何清除动画队列。

例如，一个正常的模式是通过常规方法停止一个调用然后又通过动画回到它的初始值，可以使用 Velocity 的 reverse 指令。

``` js
/* Prior Velocity call. */
$element.velocity({ opacity: 0 });
/* Later, midway through the call... */
$element [tab]/* Stop animating opacity. */
[tab].velocity("stop") [tab]/* Animate opacity back to 1. */
[tab].velocity("reverse");
```

#### 清除动画队列

当一个动画调用停止，该元素动画队列的下一个 Velocity 调用将会立即执行。 另外，传入 true（或自定义队列名称）来清除该元素队列中所有剩余的调用。与标准的 `stop`一样，元素所有的并行动画都将会停止。

``` js
/* Prior Velocity calls. */
$element
    .velocity({ width: 100 }, 1000)
    .velocity({ height: 200 }, 1000);
/* Called immediately after. */
$element.velocity("stop", true);
```

上例中， {width: 100} 会立即停止，随后的 {height:200} 会直接被移除，完全不会执行。

**重要**：If you're clearing the remaining queue entries on a call that targeted more than one element, be sure that your stop command is applied to the full set of elements that the call initially targeted. Otherwise, some elements will have stuck queues and will ignore further Velocity calls until they are manually dequeued.

#### 停止多个元素的动画调用

Because Velocity uses call-based tweening, when stop is called on an element, it is specifically the call responsible for that element's current animation that is stopped. Thus, if other elements were also targeted by that same call, they will also be stopped:

``` js
/* Prior Velocity call. */
$allElements.velocity({ opacity: 0 });
/* Stop the above call. */
$allElements.velocity("stop");
or
/* Behaves like above since it's ending a multi-element call. */
$firstElement.velocity("stop");
```

If you want per-element stop control in a multi-element animation, perform the animation by calling Velocity once on each element.


### Command: Finish [Demo](http://codepen.io/julianshapiro/pen/OPbQKw)

如果需要过早的跳到动画结尾，可以使用 `finish` 指令。

``` js
$element.velocity("finish");
```

`stop` 不管动画执行到什么时候都立即停止动画。`finish`则会跳到期望的最终值。与 `stop` 不同的还有 `finish` 不会阻止 `complete` 回调和 `display:none` 切换。
简而言之， `finish` 指令意味着立即跳到动画的最后一贞。

与 `stop` 一样的是， `finish` 也会影响当前活跃的并行的动画（通过 `queue:false` 调用的动画）。进而，给 `finish`指令传递第二个参数为 `false`与传入 `stop` 指令会有一样的效果：Only parallel animations are targeted for finishing。最后，给 `finish` 指令传递 `true` 也会与传入 `stop` 指令 `true` 有相同的效果：除了该指令的默认行为（停止当前队列调用加上所有并行动画），即使是默认队列的动画调用也会从队列移除。注意，这些调用在移除之前不会立即执行；剩下的队列动画调用根本不会执行。

### Command: Reverse [Demo](http://codepen.io/julianshapiro/pen/hBFbc)

如果想通过动画将元素还原到最后一个 Velocity 调用的状态，可以通过传入 `reverse` 指令。

`reverse` 默认使用前一个 Velocity 调用的参数（duration、easing 等）。也可以通过传入一个选项参数对象来覆盖前面的参数：

``` js
$element.velocity("reverse");
or
$element.velocity("reverse", { duration: 2000 });
```

`reverse` 会忽略前一个调用的回调函数（`begin` 和 `complete`）,即 `reverse` 不会重新触发回调函数。

注意： `reverse` 指令仅仅适用于默认队列(default queue)，不会对自定义队列(custom queue)和并行队列(queue:false)起作用。

## Feature

### Feature: Transforms [Demo](http://codepen.io/julianshapiro/pen/FIwfv)

#### 概览

CSS transform 属性允许你执行转换、缩放、2D和3D旋转。Learn more at [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

Velocity 使用 translateX 和 translateY ：

``` js
/* Translate to the right and rotate clockwise. */
$element.velocity({
    translateX: "200px",
    rotateZ: "45deg"
});
```

因为 Velocity 仅仅为每个 CSS 属性采用一个数值作为值。 transform 属性必须具有转换轴。例如 `scale` 不能使用 "1.5,2"，但是 scaleX() 和 scaleY() 可以同时动画达到相同的效果。（参考 [CSS Support dropdown](http://velocityjs.org/#cssSupport) 获取 Velocity 完整的 transform 支持 ）

**注意**：Velocity 的性能优化会忽略外部 transform 值的改变。（包括在 stylesheet 里面定义的初始值，但是可以通过 [Forcefeeding](http://velocityjs.org/#forcefeeding) 补救）（你可以通过Velocity使用 [Hook](http://velocityjs.org/#hook) 函数手动设置 transform 值）

#### 详细信息

所有浏览器在执行 3D 变换的时候自动触发硬件加速，硬件加速的好处是可以让动画更平滑，但是不好的地方是会造成文本的模糊和内存的消耗。如果你想要强制 2D 变换的时候使用硬件加速带来的好处，你可以通过传递给 3D 变换属性一个不会改变的值（如 0）：

``` js
/* Translate to the right and rotate clockwise. */
$element.velocity({
    translateZ: 0, // Force HA by animating a 3D property
    translateX: "200px",
    rotateZ: "45deg"
});
```

（该方法仅适用于桌面浏览器 —— 默认情况下，Velocity 在所有的移动端都会自动开启硬件加速，参考 [mobileHA](http://velocityjs.org/#mobileHA) ）

浏览器支持： 3D 变换在 IE10 或 Andriod 3.0 以下[不支持](http://caniuse.com/#search=transforms)，甚至IE9 下不支持 2D 变换。请记住，必须在父元素上设置 perspective 来使 3D 变换生效，参考 [MDN transform guide](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_transforms)


### Feature: Colors [Demo](http://codepen.io/julianshapiro/pen/wlEtB)

Velocity 支持 color 动画，支持以下属性： `color`、`backgroundColor`、`borderColor`、`outlineColor`

你可以给一个支持的 color 属性传递十六进制值的字符串（rgb, hsla 字符串， 不支持颜色关键字，如 red），你也可以对 color 属性的当个 RGB 分量进行动画： 分量为 红、绿、蓝 （它们从 0 ～ 255，也可以是百分比）和 Alpha值（透明度，值从 0 ～ 1）。

``` js
$element.velocity({
    /* Animate a color property to a hex value of red... */
    backgroundColor: "#ff0000",
    /* ... with a 50% opacity. */
    backgroundColorAlpha: 0.5,
    /* Animate the red RGB component to 50% (0.5 * 255). */
    colorRed: "50%",
    /* Concurrently animate to a stronger blue. */
    colorBlue: "+=50",
    /* Fade the text down to 85% opacity. */
    colorAlpha: 0.85
});
```

在 IE9 及以下不支持RGBA，这种情况下Velocity 会忽略 Alpha 分量，从而使用原始的RGB。

### Feature: [SVG](http://velocityjs.org/#svg) [Demo](http://codepen.io/julianshapiro/pen/wmtEH)

### Feature: Hook [Demo](http://codepen.io/julianshapiro/pen/LFeDB)

Hooks 是多值 CSS 属性的子值。 例如， `textShadow` 有多个值 "0px 0px 0px black"。 Velocity 允许你对这些子值进行动画，例如 `textShadowX`, `textShadowY`, `textShadowBlur`:

``` js
$element.velocity({ textShadowBlur: "10px" });
```

同样的，Velocity 允许你对 `boxShadow`、`clip`或者其他多值属性进行动画。参考 [CSS Property Support](http://velocityjs.org/#cssSupport) 获取 Velocity hooks 的完整列表。

由于不可能单独通过 jQuery 的 $.css() 来设置这些值， Velocity 提供了 `hook()` 辅助函数。 它的 API 同 $.css()。它需要一个元素（源生 DOM 元素或者 jQuery 元素）作为第一个参数： `$.Velocity.hook(element,property[,value])`:

设置 hook 值：

``` js
$.Velocity.hook($element, "translateX", "500px"); // Must provide unit type
$.Velocity.hook(elementNode, "textShadowBlur", "10px"); // Must provide unit type
```

得到 hook 值：

``` js
$.Velocity.hook($element, "translateX");
$.Velocity.hook(elementNode, "textShadowBlur");
```

注意： 使用 hook 函数的时候，你必须提供CSS 属性可以接受单位类型（例如 px, deg 等）。

### Feature: Promises [Demo](http://codepen.io/julianshapiro/pen/jIoca/)

如果你还不了解 promise,请看[这里](http://www.html5rocks.com/en/tutorials/es6/promises/)

当同时满足以下两种情况的时候，Velocity 调用会自动返回一个 promise 对象：

- A)、使用[utility function](http://velocityjs.org/#utilityFunction)
- B)、检测到浏览器支持 promise

否则，当使用 jQuery 的对象语法时（如 $.element.velocity(...)）永远不会返回 promise。

``` js
/* Using Velocity's utility function... */
$.Velocity.animate(element, { opacity: 0.5 })
    /* Callback to fire once the animation is complete. */
    .then(function(elements) { console.log("Resolved."); })
    /* Callback to fire if an error occurs. */
    .catch(function(error) { console.log("Rejected."); });
```

不管是动画自己完成还是被 $elements.velocity("stop"[,true]) 停止，都会返回一个 resolved 的 promise。 resolve 方法接收完整的原生DOM 元素数组作为它的上下文和第一个参数。如果需要单独获取它们，你必须使用 jQuery 的 $.each() 或者 Javascript 原生的 .forEach() 来迭代该数组。

相反， 如果传入 Velocity 的第一个参数不合法，promise 会变成 rejected 状态（例如传入一个空的属性对象或者不存在的 Velocity 指令）。 reject 回调的参数是错误对象。

promise 也适用于来自 [UI pack](http://velocityjs.org/#uiPack) （包括自定义效果） 的动画效果。通常，确保使用 Velocity 的 utility 方法来调用 UI pack 动画效果。另外，确保使用最新版本的 UI pack，因为是最近才添加了对 promise 的支持。

浏览器支持： 仅仅桌面班的 Chrome 和 Firefox 支持 promise。其它所有浏览器，你必须引入第三方 promise 库，如 [Bluebird](https://github.com/petkaantonov/bluebird) 或者 [When](https://github.com/cujojs/when/tree/master/es6-shim) 的 ES6 promise shim（不要使用 [Q](https://github.com/kriskowal/q)，因为它不会像 ES6 promise那样自动安装）。当使用 Bluebird 或者 When的时候，确保promise 库在 Velocity 之前加载完成。 Bluebird 和 When 都可以在 IE8 和 Android 上使用。

### Feature: Mock [Demo](http://codepen.io/julianshapiro/pen/KmlCv)

当进行UI测试的时候，你可以设置 $.Velocity.mock=true 来强制所有 Velocity 动画使用 0ms duration 和 0ms delay。（In essence, values are fully applied on the next animation tick）。这在测试完成值(end value)而非测试中间动画(tweening)时进行重复UI测试时非常有帮助。

另外，你也可以设置 $.Velocity.mock 为一个任意的乘数来加速或者降低所有页面动画的速度。

``` js
/* Slow down all animations by a factor of 10. */
$.Velocity.mock = 10;
```

当你试图微调多元素动画序列的时序时，以这种方式减慢动画是很有用的。


### Feature: Utility Function [Demo](http://codepen.io/julianshapiro/pen/ythqp)

与其使用jQuery插件的语法来在 Velocity 中使用 jQuery对象，你还可以使用 Velocity 来使用原始DOM元素：

``` js
/* Standard multi-argument syntax. */
var divs = document.getElementsByTagName("div");
$.Velocity(divs, { opacity: 0 }, { duration: 1500 });
/* Alternative single-argument syntax (ideal for CoffeeScript). <i>e</i> stands for elements, <i>p</i> for properties, and <i>o</i> for options: */
var divs = document.getElementsByTagName("div");
$.Velocity({ e: divs, p: { opacity: 0 }, o: { duration: 1500 } });
```

语法与标准的 Velocity 语法相同，只是所有参数通过一个对象传入。

使用 utility 方法在你需要实时生成元素的时候并且负担不起 jQuery对象创建的开销的时候（jQuery 创建对象会触发 DOM 查询）。

[这里](http://codepen.io/julianshapiro/pen/ythqp)有一个使用 utility 方法的示例。


## Advanced

### Advanced: Value Functions [Demo](http://codepen.io/julianshapiro/pen/Ecsoh)

属性的值可以时函数。 这些函数在每个元素上都会被调用 —— 在动画之前立即调用。因此，当使用 loop/reverse 的时候，这些函数不会重复调用。

函数的返回值会作为属性的值：

``` js
$element.velocity({
    opacity: function() { return Math.random() }
});
```

Value functions are passed the iterating element as their context, plus a first argument containing the element's index within the set and a second argument containing the total length of the set. By using these values, visual offseting can be achieved:

``` js
$element.velocity({
    translateX: function(i, total) {
        /* Generate translateX's end value. */
        return i * 10;
    }
});
```

In addition to helping contain animation logic within Velocity, value functions are the most performant way of differentiating properties amongst a set of elements — as opposed to pre-iterating through them and calling Velocity once for each, which forgoes Velocity's element set optimization.

### Advanced: Forcefeeding [Demo](http://codepen.io/julianshapiro/pen/rkgyH)

通常，动画引擎查询 DOM 来决定每个动画元素属性的初始值。 Velocity 使用 `forcefeeding` 技术 —— 用户明确指定元素动画的初始值来避免 DOM 查询 —— 消除了 [layout thrashing](http://www.kellegous.com/j/2013/01/26/layout-performance/)

Forcefed 通过传入第二或第三个数组元素来取代属性的值。(As described in the Easing pane, the second item can optionally be a per-property easing).

``` js
$element.velocity({
    /* Two-item array format. */
    translateX: [ 500, 0 ],
    /* Three-item array format with a per-property easing. */
    opacity: [ 0, "easeInSine", 1 ]
});
```

上例中，如果我们知道该元素还没有被 translate，所以传递个 translateX 0 作为初始值。
另外，我们也知道元素当前的透明度是 1。相当于我们指定了我们所知道的（或所期望的）动画初始值。

Forcefed 初始值也支持值函数，你可以利用此特性生成一个具有差异化起始值的元素集（参考 Velocity 的 [3D demo codecast](https://www.youtube.com/watch?v=MDLiVB6g2NY&hd=1)）

确保 forcefeed 仅仅是再动画开始的时候使用，而不是在动画链中间（此时 Velocity 已经在内部缓存了值）：

``` js
$element
    /* Optionally forcefeed here. */
    .velocity({ translateX: [ 500, 0 ] })
    /* Do not forcefeed here; 500 is internally cached. */
    .velocity({ translateX: 1000 });
```

Forcefeeding 在DOM 查询代价很大的时候非常有帮助，而在一些常规的、DOM查询开销并不大的地方就没使用的必要。

Note: Forcefeeding a hook's subproperty will default that hook's non-animated subproperties to their zero-values.

## Plugins

### Plugins: [UI Pack](http://velocityjs.org/#uiPack)

### [Plugins: VMD](http://velocityjs.org/#vmd)

### [Plugins: Ember & Misc.](http://velocityjs.org/#ember)

- [Ember UI](http://emberui.com/) is a UI component library with motion design powered by Velocity.
- [Liquid Fire](https://github.com/ef4/liquid-fire) provides comprehensive Velocity-powered animation.
- [Ember Velocity Mixin](https://github.com/quandl/ember-velocity-mixin) is an alternative to Liquid Fire.
- [Tweene](http://tweene.com/) is a timeline manipulation library that works on top of Velocity.
- [Bellows](https://github.com/mobify/bellows) is a mobile-first accordion widget that that uses Velocity for its motion.
- [ScrollMagic](https://github.com/janpaepke/ScrollMagic) is standalone scroll animation library that works with Velocity.
