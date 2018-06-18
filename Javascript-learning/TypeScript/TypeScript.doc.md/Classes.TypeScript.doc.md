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

In our examples, we’ve been able to freely access the members that we declared throughout our programs. If you’re familiar with classes in other languages, you may have noticed in the above examples we haven’t had to use the word public to accomplish this; for instance, C# requires that each member be explicitly labeled public to be visible. In TypeScript, each member is public by default.

在我们的例子中，我们能够自由的访问我们在程序中声明的成员。如果你对其他具有类的编程语言熟悉的话，你已经注意到了前面的例子中我们没有使用 `public`; 在 C# 中需要显式把每个成员标记为 `public` 之后才能在外部可见。在 typescript 中，每个成员默认为`public`。

You may still mark a member `public` explicitly. We could have written the `Animal` class from the previous section in the following way:

你仍然可以显式将成员指定为 `public`。前面的例子也可以写成下面这样：

```ts
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### 理解 `private`

When a member is marked `private`, it cannot be accessed from outside of its containing class. For example:

如果一个成员被标记为 `private`，那它就不能在这个类之外的地方访问，例如：

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

new Animal("Cat").name; // Error: 'name' is private;
```
TypeScript is a structural type system. When we compare two different types, regardless of where they came from, if the types of all members are compatible, then we say the types themselves are compatible.

TypesScript 是一个结构类型系统。当我们比较两个不同的类型时，不管它们来自哪里，如果它们所有成员的类型都兼容，那么它们两个类型就是兼容的。

However, when comparing types that have `private` and `protected` members, we treat these types differently. For two types to be considered compatible, if one of them has a `private` member, then the other must have a `private` member that originated in the same declaration. The same applies to `protected` members.

然而，当比较具有`private` 和 `protected` 成员的类型时，我们的方式是不一样的。两个类型如果要兼容，则如果其中一个有 `private` 成员，那么另一个也必须有一个源于同一个声明的 `private` 成员。`protected` 成员也同理。

Let’s look at an example to better see how this plays out in practice:

看看实际应用中是什么样子的：

```ts
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

class Rhino extends Animal {
    constructor() { super("Rhino"); }
}

class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```

In this example, we have an `Animal` and a `Rhino`, with `Rhino` being a subclass of `Animal`. We also have a new class `Employee` that looks identical to `Animal` in terms of shape. We create some instances of these classes and then try to assign them to each other to see what will happen. Because `Animal` and `Rhino` share the `private` side of their shape from the same declaration of `private name: string` in `Animal`, they are compatible. However, this is not the case for `Employee`. When we try to assign from an `Employee` to `Animal` we get an error that these types are not compatible. Even though `Employee` also has a `private` member called `name`, it’s not the one we declared in `Animal`.

这个例子中，我们有一个 `Animal` 和 一个`Rhino`，且 `Rhino` 是 `Animal`的子类。还有一个 `Employee` 类看起来和 `Animal` 在结构上相似。我们分别为它们创建实例然后尝试将它们相互赋值看看会发生什么。因为 `Animal` 和 `Rhino` 都具有从 `Animal` 中的 `private name: string` 声明来的 `private` 成员，因此它们是兼容的。然而 `Employee` 的情况就不太一样了。当我们尝试将一个 `Employee` 赋值给 `Animal` 时，我们就会得到一个类型不兼容的错误。尽管 `Employee` 也有一个 `private` 的 `name` 成员，但它并不是 `Animal` 中声明的那一个。

### 理解 `protected`

The `protected` modifier acts much like the `private` modifier with the exception that members declared `protected` can also be accessed within deriving classes. For example,

除了声明为 `protected` 的成员可以在派生类中访问之外，`protected` 和 `private` 在其它地方非常相似。

```ts
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}

class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // error
```

Notice that while we can’t use `name` from outside of `Person`, we can still use it from within an instance method of `Employee` because `Employee` derives from `Person`.

注意，尽管我们不能在 `Person` 之外使用 `name`，但是我们仍然可以在 `Employee` 实例方法中使用它，因为它派生自 `Person`。

A constructor may also be marked `protected`. This means that the class cannot be instantiated outside of its containing class, but can be extended. For example,

构造函数也能标记为 `protected`，这意味着这个类不能在包含它的类之外实例化，但是可以被继承，例如：

```ts
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}

// Employee can extend Person
class Employee extends Person {
    private department: string;

    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }

    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}

let howard = new Employee("Howard", "Sales");
let john = new Person("John"); // Error: The 'Person' constructor is protected
```

## Readonly 修改器(modifier) decorator译为修饰器，modifier译为修改器

You can make properties readonly by using the `readonly` keyword. Readonly properties must be initialized at their declaration or in the constructor.

你可以通过 `readonly` 关键字指定属性为只读。只读属性必须在声明或构造函数中初始化。

```ts
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; // error! name is readonly.
```

### 参数属性

In our last example, we had to declare a readonly member `name` and a constructor parameter `theName` in the `Octopus` class, and we then immediately set `name` to `theName`. This turns out to be a very common practice. Parameter properties let you create and initialize a member in one place. Here’s a further revision of the previous `Octopus` class using a parameter property:

在前面的例子中， 我们在不得不在 `Octopus` 类中声明了一个只读的 `name` 和一个构造函数的参数 `theName`，然后在构造函数中立即将 `theName` 赋值给 `name`。这是一种非常普遍的做法。更方便的做法是使用参数属性，参数属性能够让你只在一个地方创建和初始化成员（相当于给 Octopus 声明了一个 theName 成员）。以下是使用参数属性对之前的`Octopus`类进行的进一步修订：

```ts
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```

Notice how we dropped `theName` altogether and just use the shortened `readonly name: string` parameter on the constructor to create and initialize the `name` member. We’ve consolidated the declarations and assignment into one location.

注意，我们完全删除了 `theName`，只用了构造函数参数 `readonly name: string` 来创建和初始化类的 `name` 成员。我们将声明和赋值合并到了一起。

Parameter properties are declared by prefixing a constructor parameter with an accessibility modifier or readonly, or both. Using private for a parameter property declares and initializes a private member; likewise, the same is done for public, protected, and readonly.

参数属性的声明方式为：在构造函数参数中使用访问修改器或者 readonly 修改器，或者结合两者使用。使用 `private` 参数属性声明的就是 `private` 成员，其它几个也是同理。

## 访问器

TypeScript supports getters/setters as a way of intercepting accesses to a member of an object. This gives you a way of having finer-grained control over how a member is accessed on each object.

TypeScript 支持使用 getters/setters 来拦截对对象的成员访问。这让你可以更细致地控制每个对象上成员的访问方式。

Let’s convert a simple class to use `get` and `set`. First, let’s start with an example without getters and setters.

先从一个简单的类来入手 `get` 和 `set`。首先，看看没有 getters 和 setters 的情况。

```ts
class Employee {
    fullName: string;
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

While allowing people to randomly set `fullName` directly is pretty handy, this might get us in trouble if people can change names on a whim.

虽然这样直接的修改 `fullName` 显得非常方便，但是这也许会给我们带来更多的麻烦。

In this version, we check to make sure the user has a secret passcode available before we allow them to modify the employee. We do this by replacing the direct access to fullName with a set that will check the passcode. We add a corresponding get to allow the previous example to continue to work seamlessly.

在接下来的这个版本中，我们需要检查以确保用户拥有有效密码时才能让他们修改 employee。这里的做法就是通过 `set` 来在直接访问 `fullName` 的时候检查密码。我们还添加一个 `get` 来让之前的例子达到相同的效果。

```ts
let passcode = "secret passcode";

class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```

To prove to ourselves that our accessor is now checking the passcode, we can modify the passcode and see that when it doesn’t match we instead get the message warning us we don’t have access to update the employee.

为了证明访问器正在检查密码，我们可以通过修改密码，然后在密码不匹配的时候给出消息提示。

A couple of things to note about accessors:

关于访问器需要注意的是：

First, accessors require you to set the compiler to output ECMAScript 5 or higher. Downlevelling to ECMAScript 3 is not supported. Second, accessors with a `get` and no `set` are automatically inferred to be `readonly`. This is helpful when generating a `.d.ts` file from your code, because users of your property can see that they can’t change it.

- 第一，访问器需要你将编译器的输出设置为 `ECMAScript 5` 或者更高。不支持降级到 `ECMAScript 3`。
- 第二，只有`set`没有`get`的访问器自动推断为 `readonly`，在从你的代码生成 `.d.ts` 文件的时候非常有用，因为那些使用这个属性的用户能够看到这个属性是不能更改的。

## 静态属性

