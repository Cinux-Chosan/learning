# Classes

## ECMAScript Private Fields

自从 typescript 3.8 开始，支持新语法的 JavaScript 私有属性：

```ts
class Animal {
  #name: string;
  constructor(theName: string) {
    this.#name = theName;
  }
}

new Animal("Cat").#name;
// Property '#name' is not accessible outside class 'Animal' because it has a private identifier.
```

这种语法内置在 JavaScript 运行时

## Understanding TypeScript’s private

typescript 也有自己定义私有成员的方法，即把字段标记为 `private`：

```ts
class Animal {
  private name: string;

  constructor(theName: string) {
    this.name = theName;
  }
}

new Animal("Cat").name;
// Property 'name' is private and only accessible within class 'Animal'.
```

typescript 是结构化类型系统，当比较两个不同的类型时，不管其字段来自哪里，如果所有字段的类型兼容，则认为他们的类型是兼容的。

然而对于具有 `private` 和 `protected` 成员的对象来说则不同。如果两个具有 `private` 或者 `protected` 成员的类型要兼容，则它们必须具有同源的相同 `private` 或者 `protected` 成员。

```ts
class Animal {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

class Rhino extends Animal {
  constructor() {
    super("Rhino");
  }
}

class Employee {
  private name: string;
  constructor(theName: string) {
    this.name = theName;
  }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
animal = employee;
// Error: Type 'Employee' is not assignable to type 'Animal'.
// Error: Types have separate declarations of a private property 'name'.
```

## Understanding protected

`protected` 成员能在子类中访问

`constructor` 同样可以被标记为 `protected`，这意味着它不能在类外进行实例化，但是它能够被继承，子类能通过它进行实例化：

```ts
class Person {
  protected name: string;
  protected constructor(theName: string) {
    this.name = theName;
  }
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
let john = new Person("John");
// Error: Constructor of class 'Person' is protected and only accessible within the class declaration.
```

## Parameter properties

可以使用 `readonly`、 `private`、`protected`、`public` 之一或者与 `readonly` 组合进行使用，它可以使得属性在同一个地方创建和初始化：

```ts
class Octopus {
  readonly numberOfLegs: number = 8;
  constructor(readonly name: string) {}
}

let dad = new Octopus("Man with the 8 strong legs");
dad.name;
```

## Accessors

使用 `getter`/`setter`：

```ts
const fullNameMaxLength = 10;

class Employee {
  private _fullName: string = "";

  get fullName(): string {
    return this._fullName;
  }

  set fullName(newName: string) {
    if (newName && newName.length > fullNameMaxLength) {
      throw new Error("fullName has a max length of " + fullNameMaxLength);
    }

    this._fullName = newName;
  }
}

let employee = new Employee();
employee.fullName = "Bob Smith";

if (employee.fullName) {
  console.log(employee.fullName);
}
```

## Static Properties

## Abstract Classes

抽象类使用 `abstract` 关键字来声明，它用于其他类继承，它自身不能直接实例化。

和 interface 不同的是抽象类可以包含实现，抽象方法不包含实现，但抽象方法必须在派生类中实现：

```ts
abstract class Department {
  constructor(public name: string) {}

  printName(): void {
    console.log("Department name: " + this.name);
  }

  abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {
  constructor() {
    super("Accounting and Auditing"); // constructors in derived classes must call super()
  }

  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }

  generateReports(): void {
    console.log("Generating accounting reports...");
  }
}

let department: Department; // ok to create a reference to an abstract type
department = new Department(); // error: cannot create an instance of an abstract class
Cannot create an instance of an abstract class.
department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
department.generateReports(); // error: department is not of type AccountingDepartment, cannot access generateReports
// Error: Property 'generateReports' does not exist on type 'Department'.
```

## Constructor functions

在 typescript 中，声明一个类的同时实际上创建了多个声明，首先就是类实例的类型，即类名作为类型。

其次，我们创建了类的构造函数，即在 JavaScript 中的 function。

另外，使用 `typeof ClassName` 来获取类的类型，而非实例的类型，因为类名就是实例的类型：

```ts
let greeter: Greeter;
let greeterMaker: typeof Greeter = Greeter;
greeterMaker.standardGreeting = "Hey there!";
```

`greeterMaker` 只是 `Greeter` 的别名，实际上他们完全相等

## Using a class as an interface

前面说了，创建类的时候实际上声明了两样东西：类实例的类型和构造函数。

由于类创建了一种类型，因此在接口可以使用的地方也可以使用类：

```ts
class Point {
  x: number;
  y: number;
}

interface Point3d extends Point {
  z: number;
}

let point3d: Point3d = { x: 1, y: 2, z: 3 };
```
