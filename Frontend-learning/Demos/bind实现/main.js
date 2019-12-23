/**
 * 手动实现 bind 
 * 原理：使用 apply 来绑定执行上下文
 * @param {object} ctx 执行上下文
 * @param {[arg1, arg2, ...]} 参数列表
 */

Function.prototype.myBind = function (ctx, ...args) {
    const _this = this
    const fn = function (...moreArgs) {
        _this.apply(ctx, [...args, ...moreArgs])
    }
    // prototype 中包含指向函数本身的 contructor
    fn.prototype = this.prototype
    // fn.__proto__ 不用嫁接过来，因为都是来自 Function.prototype 对象
    return fn
}

name = 'window'

let person = {
    name: 'Chosan',
    age: 18
}
function f2bind() {
    console.log(this.name, ...arguments)
}

f2bind()  // window
f2bind.bind(person)()  // Chosan
f2bind.myBind(person)()  // Chosan
// 不管多少次 bind 最后都会回到执行第一个上面，这也符合 bind 本身只能绑定一次执行上下文的特性
f2bind.myBind(person).myBind({ name: 'second bind name' })()  // Chosan