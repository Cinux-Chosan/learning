function MyPromise(executor) {
    executor(this.resolve.bind(this), this.reject.bind(this))
    this.queue = []
    this.state = 'pending'
    this.index = 0
    return this
}

MyPromise.prototype.then = function (res, rej) {
    this.queue.push([...arguments])
    return this
}

MyPromise.prototype.resolve = function (data) {
    const callbacks = this.queue[this.index++]
    if (callbacks) {
        const fnResolve = callbacks[0]
        if (fnResolve) {
            try {
                const ret = fnResolve(data)
                this.resolve(ret)
            } catch (error) {
                this.reject(error)
            }
        }
    }
}

MyPromise.prototype.reject = function (reason) {
    const callbacks = this.queue[this.index++]
    if (callbacks) {
        const fnReject = callbacks[1]
        if (fnReject) {
            try {
                const ret = fnReject(reason)
                this.resolve(ret)
            } catch (error) {
                throw error
            }
        }
    }
}

new MyPromise((res, rej) => {
    setTimeout(() => res('zhang'), 1000)
}).then((data) => {
    console.log(data)
    return data + 1
}).then(data => {
    console.log(data)
    return data + 1
}).then(data => {
    console.log(data)
    throw new Error('错误中断')
}).then(data => {
    console.log(data)
    debugger
}, reason => {
    console.error(reason)
    debugger
    return 'ok'
}).then(data => {
    console.log(data)
})