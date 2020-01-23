/**
 * 手动实现 instanceof 实现
 * 原理：检查 instance 原型链上是否会出现 ctor 的原型对象
 * @param {object} instance 
 * @param {Function|Class} ctor 
 */

function instanceOf(instance, ctor) {
    let instanceProto = instance.__proto__
    const ctorProto = ctor.prototype
    while (instanceProto) {
        if (instanceProto === ctorProto) {
            return true
        }
        instanceProto = instanceProto.__proto__
    }
    return false
}

class A { }
class B extends A { }
class C { }

const a = new A
const b = new B
const c = new C
c.__proto__ = a

console.log(
    a instanceof A,
    instanceOf(a, A),
    b instanceof A,
    instanceOf(b, A),
    c instanceof A,
    instanceOf(c, A)
)