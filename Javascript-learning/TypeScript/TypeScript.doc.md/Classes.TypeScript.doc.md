# Classes

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

This example shows the most basic inheritance feature: classes inherit properties and methods from base classes. Here, Dog is a derived class that derives from the Animal base class using the extends keyword. Derived classes are often called subclasses, and base classes are often called superclasses.

这个例子演示了继承的最基本特性：一个类继承了基类的属性和方法。这里，`Dog` 是通过关键字 `extends` 派生自基类 `Animal` 的派生类。派生类也就是常说的子类，基类通常称为超类。

Because `Dog` extends the functionality from `Animal`, we were able to create an instance of `Dog` that could both `bark()` and `move()`.

因为 `Dog` 继承了 `Animal` 的功能，因此我们能够创建一个具有 `bark()` 和 `move()` 方法的 `Dog` 实例。

Let’s now look at a more complex example.

看个例子：

```ts
class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}

let sam = new Snake("Sammy the Python");
let tom: Animal = new Horse("Tommy the Palomino");

sam.move();
tom.move(34);
```

This example covers a few other features we didn’t previously mention. Again, we see the extends keywords used to create two new subclasses of Animal: Horse and Snake.

这个例子涵盖了我们之前没有提到的其他一些功能。这里我们再次看到使用 `extends` 关键字来创建了 `Animal` 的两个子类： `Horse` 和 `Snake`.

One difference from the prior example is that each derived class that contains a constructor function must call `super()` which will execute the constructor of the base class. What’s more, before we ever access a property on `this` in a constructor body, we have to call `super()`. This is an important rule that TypeScript will enforce.

与前面的例子不同的一点是这里的每个派生类的构造函数中都包含了一个 `super()`，它用于执行基类的构造函数。。更重要的是，在构造函数中访问类的其它成员属性之前应该首先要执行 `super()` 方法，这是 TypeScript 强调的重要规则之一。

The example also shows how to override methods in the base class with methods that are specialized for the subclass. Here both `Snake` and `Horse` create a `move` method that overrides the `move` from `Animal`, giving it functionality specific to each class. Note that even though `tom` is declared as an `Animal`, since its value is a `Horse`, calling `tom.move(34)` will call the overriding method in `Horse`:

这个例子同时还演示了如何根据子类的特性来覆盖父类的同名函数。`Snake` 和 `Horse` 都创建了一个 `move` 方法来覆盖 `Animal` 的 `move` 方法，这让子类能够定制化自己的功能。请注意，即使 `tom` 是声明为 `Animal` 类型的，由于它是一个 `Horse` 的实例，因此调用 `tom.move(34)` 将会调用 `Horse` 中的 `move` 方法。

```s
Slithering...
Sammy the Python moved 5m.
Galloping...
Tommy the Palomino moved 34m.
```

## Public, private, 和 protected 修饰符

### 默认为 public