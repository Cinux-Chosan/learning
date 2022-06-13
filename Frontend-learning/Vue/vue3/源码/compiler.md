# Vue3 Compiler

## parse

`parse` 负责解析模板，将其转换为 AST，`parse` 的核心逻辑在于 `parseChildren` 方法，该方法内部存在一个 `while` 循环，它会一直处理模板字符串直到结束：

```js
while (!isEnd(context, mode, ancestors)) {
  // 处理模板字符串
}
```

`parseChildren` 逻辑如下：

- 如果字符串不在 `v-pre` 中，且是以 `{{` 开头，则调用 `parseInterpolation` 解析插值
  - `parseInterpolation`：
    - 找到 `}}` 的位置，将 `{{` 到 `}}` 之间的字符串取出，并去除掉首尾的空白字符，返回该节点信息
- 如果模板字符串第一个字符是 `<`，则：
  - 如果第二个字符是 `!`，则
    - 如果字符串是以 `<!--` 开头，则调用 `parseComment` 解析注释
    - 如果字符串是以 `<!DOCTYPE` 开头，则调用 `parseBogusComment` 解析文档注释
    - 如果字符串是以 `<![CDATA[` 开头，则调用
  - 如果第二个字符
    - 是 `/`，则说明是结束标签，但是结束标签在 `parseElement` 中会处理，因此这里会给与警告然后跳过
    - 是一个字母，则说明是节点，调用 `parseElement` 进行解析
    - 是 `?`，则提示异常
  - 如果上面情况都不满足，则提示异常
- 如果上面的步骤未解析出节点信息，则调用 `parseText` 当做文本解析
- 将解析的节点信息放入 children 数组中
- 处理空白字符，如节点之间的多个空格替换为一个空格等

`parseElement` 用于解析标签元素，其逻辑如下：

- 调用 `parseTag` 解析标签
- 如果
  - 是自闭合标签则
    - 返回解析后的元素
  - 否则
    - 将该元素推入 ancestors 栈
    - 继续调用 `parseChildren` 解析其子元素，然后从 `ancestors` 栈弹出
    - 检测是否到达结束标签的位置，如果是则调用 `parseTag` 处理结束标签
- 返回解析的元素，解析完成

`parseTag` 用于解析标签元素，其逻辑如下：

- 匹配出 `<` 或者 `</` 开头到空白字符、`>` 或者 `/>` 之前的字符串作为标签名称（正则表达式是 `/^<\/?([a-z][^\t\r\n\f />]*)/i`）
- 调用 `parseAttributes` 解析标签属性
- 检测是否是自闭合标签，如果以 `/>` 开头则说明是自闭合标签
- 如果是闭标签，则退出
- 定义元素类型，默认为 `ElementTypes.ELEMENT` 类型，如果不在 `v-pre` 中，则：
  - 如果标签名是 `tag`，则类型为 `ElementTypes.SLOT`
  - 否则如果标签名是 `template`
    - 如果属性中存在指令类型 `NodeTypes.DIRECTIVE` 并且是内置指令（内置指令包含 `if,else,else-if,for,slot`），则类型为 `ElementTypes.TEMPLATE`
  - 否则调用 `isComponent` 检测是否是组件，如果是则类型为 `ElementTypes.COMPONENT`
- 返回解析的标签结果

`parseAttributes` 用于解析元素开标签上的属性，其中会有个 while 循环一直解析到标签结尾，即一直到出现 `>` 或者 `/>` 为止，在循环内部

- 调用 `parseAttribute` 解析单个属性
- 如果属性是 class 则移除中间多余的空白字符
- 如果是开标签，则将解析的属性放到 props 数组中返回给外层

`parseAttribute` 用于解析单个属性：

- 匹配连续的非空白字符、`/`、`>`到 `=` 之间的字符作为属性名称 （正则表达式为 `/^[^\t\r\n\f />][^\t\r\n\f />=]*/`）
- 移除 `=` 两边的空格，然后调用 `parseAttributeValue` 解析属性值
- 如果不在 `v-pre` 中，且属性名是以 `v-`、`:`、`.`、`@`、`#` 开头的，则：（正则表达式为`/^(v-[A-Za-z0-9-]|:|\.|@|#)/`）
  - 匹配属性名和属性参数（正则表达式是 `/(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i`）
  - 解析指令类型、指令名称、指令参数等

`parseAttributeValue` 用于解析属性值：

- 判断第一个字符是否是 `"` 或者 `'`，如果是则说明值包裹在引号中
  - 将两个引号之间的字符串解析出来作为属性值
- 否则说明不是包裹在引号中
  - 匹配连续的非空白字符和 `>` 的字符，将其解析为属性值

---

一个简单的整体核心流程归纳如下：

- `parseChildren` 解析子节点，如果是以
  - `{{` 开头，则调用 `parseInterpolation` 解析插值表达式
  - 如果是以 `<` 加字母开头，则表示是开标签，调用 `parseElement` 解析元素
    - `parseElement` 调用 `parseTag` 开始解析标签
      - `parseTag`
        - 先解析出标签名称
        - 调用 `parseAttributes` 循环解析所有属性
          - `parseAttributes`
            - 调用 `parseAttribute` 解析单个属性
              - `parseAttribute`
                - 先解析出属性名称
                - 调用 `parseAttributeValue` 解析属性值，分该值是否使用引号包裹的情况
                - 将属性名称格式化为对应的类型和值，如解析指令、指令参数等
      - 如果不是自闭合标签，则调用 `parseChildren` 解析其子元素
      - 如果到达结束标签位置，则调用 `parseTag` 解析结束标签

---

### 核心思想：

解析的过程是通过正则表达式不停的匹配元素并且移动指针的过程。上下级元素之间采用栈的数据结构保存，首先解析元素的开标签及其属性，如果不是自闭合标签则将该元素压栈，然后解析其子元素并出栈，最后解析闭标签

解析元素属性的过程也是一步一步的使用正则进行匹配，整个过程比较繁琐但逻辑比较简单，可以参考上面的详细步骤。

### Q&A

- 从源码角度分析为什么 Vue3 可以支持多根节点：https://v3.cn.vuejs.org/guide/migration/fragments.html#%E7%89%87%E6%AE%B5
  - 因为 Vue3 在解析模板的开始会创建一个抽象的类型为 `NodeTypes.ROOT` 的节点，然后将整个模板当做其子节点传入 `parseChildren` 进行解析，因此 Vue3 支持多根节点

## Transform
