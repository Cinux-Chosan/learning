// 手写 Promise
class Promise {

    constructor(executor) {
        this.state = 'pending'
        this.result = null
        this.executor = executor
        // 变为 fulfilled 的回调，默认继续向下传值，调用 then 后会被重写，如果未调用 then 就会使用该默认函数
        this.onFulfilledCallback = result => result
        // 变为 rejected 的回调，默认继续抛出错误，调用 then 后会被重写，如果未调用 then 就会使用该默认函数
        this.onRejectedCallback = error => { throw error }
        this.execute();
    }

    execute() {
        try {
            this.executor.call(null, this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }

    resolve(result) {
        if (this.state === 'pending') {
            this.state = 'fulfilled'
            this.result = result
            // then 的回调函数是异步调用的，由于 JavaScript 没有原生支持微任务的 API（如 new MicroTask，BOM 和 Node 提供的方法不是 JS 原生方法），因此使用 setTimeout 代替
            setTimeout(() => this.onFulfilledCallback(result));
        }
    }

    reject(error) {
        if (this.state === 'pending') {
            this.state = 'rejected'
            this.result = error
            // 与 resolve 中同理
            setTimeout(() => this.onRejectedCallback(error));
        }
    }

    // 每次 then 都返回一个新的 Promise，因此每个 Promise 只能调用一次 then，因此使用 onFulfilledCallback 而不是数组
    then(onFulfilledCb, onRejectedCb) {
        return new Promise((resolve, reject) => {

            this.onFulfilledCallback = (result) => {
                // 用户的 onFulfilledCb 可能执行错误，需要捕获并向下传递
                try {
                    // onFulfilledCb 可能返回 Promise，因此需要根据情况而定
                    const _result = onFulfilledCb?.(result)
                    _result instanceof Promise ? _result.then(resolve, reject) : resolve(_result)
                } catch (error) {
                    reject(error)
                }
            }

            this.onRejectedCallback = (error) => {
                try {
                    if (onRejectedCb) {
                        // 如果用户在 onRejectedCb 中捕获了错误就调用后续的 resolve
                        const _result = onRejectedCb(error)
                        _result instanceof Promise ? _result.then(resolve, reject) : resolve(_result)
                    } else {
                        // 如果没有给错误回调函数则继续抛出错误向下传递
                        throw error
                    }
                } catch (error) {
                    // 如果 onRejectedCb 未捕获错误就继续传递
                    reject(error);
                }
            }
        })
    }
}

var p = new Promise((resolve, reject) => {
    throw new Error('hahh')
    resolve(1)
    resolve(2)
    reject(3)
})
    .then((data) => { console.log(data); return data }, error => console.error(error))
    .then((data) => { console.log(data) }, error => console.error(error))

console.log(p)


// 最初参考 https://juejin.cn/post/6994594642280857630 但感觉他这个后面 then 方法里面太绕，因此按照自己的方式完善了一次
// 另外还可以参考 [100 行代码实现 Promises/A+ 规范](https://mp.weixin.qq.com/s/qdJ0Xd8zTgtetFdlJL3P1g)