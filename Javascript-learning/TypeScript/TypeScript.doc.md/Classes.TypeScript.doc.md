# 类

## 前言

Traditional JavaScript uses functions and prototype-based inheritance to build up reusable components, but this may feel a bit awkward to programmers more comfortable with an object-oriented approach, where classes inherit functionality and objects are built from these classes. Starting with ECMAScript 2015, also known as ECMAScript 6, JavaScript programmers will be able to build their applications using this object-oriented class-based approach. In TypeScript, we allow developers to use these techniques now, and compile them down to JavaScript that works across all major browsers and platforms, without having to wait for the next version of JavaScript.

传统的 JavaScript 使用函数和基于原型链的继承来构建可重用的组件，但这对于那些更喜欢使用面向对象的程序员来说就有点尴尬，因为类继承自功能，对象又是这些类来创建的。从 ECMAScript2015（ES6） 开始，JavaScript开发者就能够使用这种面向对象的基于类的方式来实现。在typescript中，我们现在就可以使用这些，并且可以编译为任何主流浏览器和平台可以使用的代码，而不用等到下一代 JavaScript 的普及。

## 类

Let’s take a look at a simple class-based example:

先来看一个简单的基于类的例子：

```ts
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

The syntax should look familiar if you’ve used C# or Java before. We declare a new class Greeter. This class has three members: a property called `greeting`, a constructor, and a method `greet`.

如果你之前使用过 C# 或者 Java，那对这段代码应该很眼熟。这里声明了一个 Greeter 类，这个类有三个成员—— 一个`greeting`属性，一个`constructor`构造函数，一个`greet`方法。

You’ll notice that in the class when we refer to one of the members of the class we prepend `this.`. This denotes that it’s a member access.

当在方法中访问类成员的时候使用`this.`前缀，这就表示访问类的成员。

In the last line we construct an instance of the Greeter class using new. This calls into the constructor we defined earlier, creating a new object with the Greeter shape, and running the constructor to initialize it.

最后一行使用 `new` 操作符来创建了一个 `Greeter` 的实例。这将会调用前面定义的 `constructor` 来创建一个新的 `Greeter` 对象。

## 继承

In TypeScript, we can use common object-oriented patterns. One of the most fundamental patterns in class-based programming is being able to extend existing classes to create new ones using inheritance.

在 typescript 中， 我们使用通用的面向对象的模式。基于类的编程中最基本的模式之一就是能够通过继承已有的类来创建新的类。

Let’s take a look at an example:

看个例子：

```ts
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

const dog = new Dog();
dog.bark();
dog.move(10);
dog.bark();
```

