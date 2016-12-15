# [merge-descriptors](https://www.npmjs.com/package/merge-descriptors)

使用描述符合并对象

```javascript
var thing = {
  get name() {
    return 'jon'
  }
}

var animal = {

}

merge(animal, thing)

animal.name === 'jon'
```

# API

### merge(destination, source)

使用 `source` 的描述符重新定义 `destination` 的描述符

### merge(destination, source, false)

将 `source` 中存在而 `destination`中不存在的描述符添加到`destination`上
