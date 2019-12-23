/**
 * debouce 的简单实现
 * 思想：每次执行清空上一次设置的定时任务，并重新设置新的定时任务
 * @param {Function} cb 需要执行的函数
 * @param {number} time ms 为单位的时间
 */
{
    function debounce(cb, time) {
        let timeId = null
        const fn = (...args) => {
            clearInterval(timeId)
            timeId = setTimeout(() => {
                cb(...args)
            }, time);
        }
        return fn
    }

    const debouncedTest = debounce(test('哈哈，我执行了！ --- 来自 debounce'), 1000);

    let count = 0
    let intervalId = setInterval(() => {
        if (++count > 10) {
            clearInterval(intervalId)
        }
        debouncedTest()
    }, 500)
}

/////////////////////////////// 以下是 throttle 实现 /////////////////////////////

/**
 * throttle 的简单实现
 * 思想：每次执行先判断两次调用的时间差 delta 是否大于指定时间 time，如果 delta >= time 则执行函数并重置执行的时间，否则函数不执行
 * @param {Function} cb 需要执行的函数
 * @param {number} time ms 为单位的时间
 */
{
    function throttle(cb, time) {
        let lastTriggerTime = null
        const fn = (...args) => {
            const delta = Date.now() - lastTriggerTime
            if (lastTriggerTime && delta < time) {
                return
            }
            cb(...args)
            lastTriggerTime = Date.now()
        }
        return fn
    }

    const throttledTest = throttle(test('哈哈，我执行了！ --- 来自 throttle'), 1000)

    setInterval(() => {
        throttledTest()
    }, 100)
}

function test(msg) { return () => console.log(msg) }
