

// 由于所有代码在一起，执行 effect 函数时会用到 effectFn，但是为了逻辑的一致性，将 effectFn 放在后面，使用 setTimeout 保证 effectFn 和 targetMap 已经已经初始化
setTimeout(() => {
    // 1.
    const o = window['o'] = reactive({
        num: 0
    })

    // 2.
    effect(() => console.log(`num changed to: ${o.num}`))

    // 7.
    o.num++
});



// 实际上为了解决嵌套等问题，effectFn 应该采用栈结构，这里只是为了精简演示代码
let effectFn;
const targetMap = new Map();

function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            // 4. 搜集依赖
            track(target, key);
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);

            // 8. 触发更新
            trigger(target, key);
            return result
        }
    })
}

function effect(fn) {
    // 3.
    effectFn = fn;
    // 执行一遍，触发依赖搜集
    fn();
}

function track(target, key) {
    // 5. 通过 target 和 key 这种层级解构找到 target.key 这个属性的依赖
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map())
    }
    let dep = depsMap.get(key);

    if (!dep) {
        depsMap.set(key, dep = new Set())
    }

    // 6. 添加依赖函数 effectFn 到 target.key 的依赖集合中
    dep.add(effectFn);
}

function trigger(target, key) {
    const dep = targetMap.get(target).get(key);
    for (const fn of dep) {
        // 9. 触发依赖函数执行
        fn();
    }
}