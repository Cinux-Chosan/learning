#

## animation

当多个动画同时作用于相同元素时，如果出现属性重叠，则以靠后的动画为准，当靠后的动画执行完后如果靠前的动画还在执行，则以靠前的动画的属性为准。简而言之，优先以靠后的动画为准，先执行完后再接着相同的时间点执行前面的动画。

- `animation-name`：动画名称
- `animation-duration`：动画时间
- `animation-iteration-count`：动画执行次数，`infinite` 表示无限
- `animation-direction`:
  - `normal`: 从开始到结束，结束后瞬间回到初始状态
  - `reverse`: 从结束到开始，然后瞬间回到初始状态
  - `alternate`: `开始 -> 结束 -> 开始 ...`，中间都有过度，而不是瞬间回到最初状态
  - `alternate-reverse`: `结束 -> 开始 -> 结束 ...`，反向的 `alternate`
- `animation-fill-mode`:
  - `forwards`：动画结束后停在最后一帧
  - `backwards`：在 `delay` 期间使用第一帧状态，受 `animation-direction` 影响
  - `both`：同时开启 `forwards` 和 `backwards`
- `animation-timing-function`：动画时间函数，可参考 https://cubic-bezier.com/ 使用自定义参数或对比不同函数差异
  - `step(n,{start,end})`：表示步数
    - `start`：表示立即执行，即从第二帧开始
    - `end`：表示立即执行，表示先执行一帧，即第一帧是初始状态
    - `step-start`：`step(1, start)` 的简写
    - `step-end`：`step(1, end)` 的简写
- `animation-play-state`：可加在 `:hover` 上控制动画执行或暂停
  - `running`：运动
  - `paused`：暂停

简写的时候使用 `animation` 即可，必须要填写动画名称和时间，写在后面的时间是延迟时间，延迟时间可按需填写或不写。

## 3D

### perspective

当 `perspective` 作为属性使用时，不影响自身，其影响所有子元素，并将子元素统一观察，即一双眼睛看所有子元素，由于将所有子元素统一观察，将它们看做一个整体，因此子元素如果有相同的旋转角度看起来也不一定一样，因为它们处在同一个空间不同的位置，从同一个地方看向它们就会不一样。

当作为函数使用时，如`transform: perspective(100px)` ，表示对该元素单独观察，但不影响所有子元素，相当于单独用一双眼睛在观察该元素，多个`transform: perspective(100px)`元素之间互不干扰，相当于每个都有一双眼睛在独立观察它，它们处于独立的空间中，因此相同的旋转角度（其它属性也相同）看起来也是一样的。

### transform-style: preserve-3d;

保留 3D 效果，只要有 z 轴参与就加上，加在父级上。

### backface-visibility

背面不可见。当元素翻转之后无法看到正面，默认情况下是看到其背面的效果，如果希望翻转之后不可见，则添加属性 `backface-visibility: hidden;`。如果是父元素在翻转，而希望里面的子元素翻转之后背面不可见，则需要在父元素开启 `transform-style: preserve-3d;`，否则是默认效果。

该功能可以用于制作页面翻转效果。两个叠加的页面翻转之后就展示另一个页面。
