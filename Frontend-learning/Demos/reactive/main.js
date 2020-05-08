const obj = {
    name: 'chosan',
    age: 18
}

let whoNeedsMe = null

function reactive(obj, key) {
    const depList = []
    const property = Object.getOwnPropertyDescriptor(obj, key)
    let value = property.get ? property.get() : obj[key]
    Object.defineProperties(obj, key, {
        ...property,
        get() {
            if (whoNeedsMe) {
                depList.push(whoNeedsMe)
            }
            return value
        },
        set(val) {
            depList.forEach(dep => dep.notify && dep.notify(val, value))
            value = val
        }
    })
}

function observe(obj) {
    const keys = Object.keys(obj)
    keys.forEach(key => {
        reactive(obj, key)
    })
}

observe(obj)

obj.name