## Programe Structure

### 2.5 Type Declarations

- float64 转 int 会抛弃小数部分
- converting a `string` to a `[]byte slice` allocates a copy of the string data
- In any case, a conversion never fails at run time.

### 2.6 Packages and Files

- package 的初始化是以初始化 package 级别的变量开始的
- 变量的初始化顺序默认是按声明的顺序，除非它们依赖了后面声明的变量，这种情况下后面的变量会优先被初始化
- package 分多个文件的情况下，文件的初始化顺序是传递给编译器的顺序，不过 go tool 会在传递给编译器之前通过文件名排序
- `init` 函数可以用于设置一些复杂的初始化，且 init 函数可以出现多个，它们会在程序启动的时候自动按声明顺序调用。
- 包的初始化顺序是按 import 顺序，且依赖优先的策略来初始化。`p` 依赖于 `q` 则可以肯定的是在 `p` 执行初始化的时候，`q` 已经完全初始化成功。`main` package 最后被初始化

### 2.7 Scope

- 在 go 中，如果内部声明的变量同时在外部也有声明，则在声明之前是可以访问到外部作用域内的同名变量的，但是 js 中不行，js 中存在变量提升。

```go
if true {
    x := "chosan"
    if true {
        x := x[0]  // 第一个 x 是本地声明的局部变量，第二个 x 为外部变量
    }
}
```

### 3.1 Integers

- `rune` 是 `int32` 的别名，但是代表该值是 unicode 字符编码
- `byte` 是 `unit8` 的别名，但它更强调其值为原始数据而非一个数字
- there is an unsigned integer type `uintptr`, whose width is not specified but is sufficient to hold all the bits of a pointer value.
- 如果计算结果溢出，则高位会被截断，因此 `int8` 类型的 `127 + 1` 得到结果为 `-128`

| 符合 | 解释                |
| ---- | ------------------- |
| `&`  | bitwise AND         |
| `\|` | bitwise OR          |
| `^`  | bitwise XOR         |
| `&^` | bit clear (AND NOT) |
| `<<` | left shift          |
| `>>` | right shift         |

其中 `^` 作为二元运算符时表示异或，用作一元运算符时表示求反码或补码

`&^` 表示位清除：`z = x &^ y` 表示如果 `y` 中的对应位为 `1`，则 `z` 中的对应为为 `0`，即清除 `y` 中为 `1` 的对应位

- 以 `0` 开头为八进制，以 `0x` 或 `0X` 表示十六进制

### 3.5 Strings

- 原始字符串使用 ` 号括起来，其中的转义符号都会被当做原始字符串的一部分而不会被转义，在写正则表达式的是后非常方便

- `[]rune(s)` 将 utf8 编码的字符串 `s` 转换成 `[]rune` 类型，如：

```go
r:=[]rune("张建军")
fmt.Printf("%x\n", r) // [5f20 5efa 519b]
```

字符串和 `[]byte` 之间也可以相互转换：

```go
s := "abc"
b := []byte(s)
s2 := string(b)
```

- 将数字转换成字符串，则该字符串会被当做 rune 值，返回该 rune 的 utf8 编码的字符

```go
fmt.Println(string(65))     // "A", not "65"
fmt.Println(string(0x4eac)) // "世界"
```

#### 3.5.4 Strings and Byte Slices

操作字符串有四个非常重要的库：

- `strings`：提供了很多搜索、替换、比较、去除空白字符、切分和连接字符串的方法
- `bytes`：有很多和 `strings` 类似的方法，不过操作的是 `[]byte` 类型。由于字符串是不可变的，因此构建字符串的过程中经常可能需要重新分配空间和执行拷贝操作，这种情况下可以考虑使用 `bytes.Buffer` 类型
- `strconv`：提供了很多方法用于在布尔值、整数、浮点数之间相互转换
- `unicode`：提供了一些操作和分类 rune 的方法，如 `IsDigit`、`IsLetter`、`IsUpper` 和 `IsLower` 等，它们都接收一个 rune 并返回 boolean，`ToUpper` 和 `ToLower` 将 rune 转换成大小写，`strings` 中也有，不过是对整个字符串进行转换。

```go
x := 123
y := fmt.Sprintf("%d", x)
// Itoa 表示 integer to ASCII，同理 Atoi 表示 ASCII to integer
fmt.Println(y, strconv.Itoa(x)) // "123 123"
fmt.Println(strconv.FormatInt(int64(x), 2)) // "1111011" ，但是通常 %b, %d, %u, %x 搭配 fmt.Printf 更常用

x, err := strconv.Atoi("123") // x is an int
y, err := strconv.ParseInt("123", 10, 64) // base 10, up to 64 bits
```

### 3.6 Constants

常量是在编译时确定的，并且基于常量的运算大多可以在编译时执行，这样可以减少运行时的工作量，并且可以提前暴露错误，如整数除以 0、字符串越界等

`time.Duration` 是一个基于 `int64` 的具名类型，`time.Minute` 是一个该类型的常量

- 一组常量连续声明的时候，可以省略后面的赋值，这将表示后面的值也会使用前面的表达式和类型：

```go
const (
    a = 1
    b
    c = 2
    d
)

fmt.Println(a, b, c, d) // "1 1 2 2"
```

看起来没有用，但是在 `iota` 的时候就非常有用了

#### 3.6.1 The Constant Generator iota

声明常量可以使用常量生成器 `iota`，它用于声明一组相关联的常量而不用重复书写表达式和初始值。在常量的声明中， iota 从 0 开始递增：

```go
type Weekday int

const (
    Sunday Weekday = iota
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Saturday
)
```

这就是 go 中的枚举类型。

```go
type Flags uint

const (
    FlagUp Flags = 1 << iota // is up
    FlagBroadcast            // supports broadcast access capability
    FlagLoopback             // is a loopback interface
    FlagPointToPoint         // belongs to a point-to-point link
    FlagMulticast            // supports multicast access capability
)
```

由于后面的值也会使用前面的相同的表达式 `1 << iota`，因此 iota 每次递增，每次将向左移动一个比特位

```go
const (
    _ = 1 << (10 * iota)
    KiB // 1024
    MiB // 1048576
    GiB // 1073741824
    TiB // 1099511627776              (exceeds 1 << 32)
    PiB // 1125899906842624
    EiB // 1152921504606846976
    ZiB // 1180591620717411303424     (exceeds 1 << 64)
    YiB // 1208925819614629174706176
)
```

#### 3.6.2 Untyped Constants

在 go 中，尽管常量可以有类型，但是大多数情况其实并没有为它们指定类型。编译器会选择精度更大的类型来表示它们，并且它们的计算比机器运算更加精准，你可以假设它有至少 256 位精度。

只有常量可以是无类型的，即初始化时未指定类型。无类型的常量赋值给变量时或出现在显式声明了类型的变量右侧的表达式中时会隐式转换成对应的类型。不管显式还是隐式转换，都需要目标类型可以表示常量的原始值，实数和复数允许舍入。

未指定类型的常量不仅保留了高精度，并且可以参与到比指定类型的常量更多的计算中而不需要进行类型转换。

无类型的整数会转换成 int 类型，因此其大小无法保证（因为在不同的机型上 int 可能是 32 位也可能是 64 位）。但是 float 会转换为 float64，complex 为 complex128，这是因为在不知道浮点数数据类型大小的情况下很难编写出准确的数值计算算法。

## 4. Composite Types

数组和结构体都是固定大小，slice 和 map 都是动态大小的结构

### 4.1 Arrays

用数组字面量初始化数组的时候，如果类型长度那里使用 `...` 则会自动使用后面的初始值来定义数组长度：

```go
q := [...]int{1, 2, 3}
fmt.Printf("%T\n", q) // "[3]int"
```

数组大小也是类型的一部分，也就是说 `[3]int` 和 `[4]int` 是不同的类型。数组的大小必须是常量表达式，也就是说其值再编译时就能被确定。

使用数组字面量初始化数组也可以指定索引：

```go
type Currency int

const (
    USD Currency = iota
    EUR
    GBP
    RMB
)

symbol := [...]string{USD: "$", EUR: "€", GBP: "£", RMB: "¥"}

fmt.Println(RMB, symbol[RMB]) // "3 ¥"
```

因此我们可以使用下面的方式声明一个长度为 100 的数组，其中除了最后一个值是 -1，其它所有值都是 0:

```go
r := [...]int{99: -1}
```

如果数组元素的类型兼容则认为数组类型也是兼容的。因此我们可以直接使用 `==` 来比较两个数组，它表示所有对应的元素都相同：

```go
a := [2]int{1, 2}
b := [...]int{1, 2}
c := [2]int{1, 3}
fmt.Println(a == b, a == c, b == c) // "true false false"
d := [3]int{1, 2}
fmt.Println(a == d) // compile error: cannot compare [2]int == [3]int
```

- 在 go 中，调用函数的时候会把每个参数的值复制一份传递到函数内，因此传递大量数据时性能不佳。由于函数接收到的参数并非原始值，而是一份复制品，因此在函数内做的任何修改都不会影响到原始值。当然我们可以使用传入指针来解决这些问题。

### 4.2 Slices

Slice 是一种能够访问底层数组的轻量级数据结构。slice 由三部分组成：指针、长度和容量。指针指向 slice 在底层数组中的第一个元素，容量为 slice 起始位置到数组末尾的长度。`len` 和 `cap` 分别返回其长度和容量。

- slice 超出容量会 panic，但是如果未超出容量只是超出 slice 本身的长度，则会延伸 slice，即访问容量以内的元素不会 panic，即便溢出了当前 slice。

- 由于 slice 包含其在底层数组中首个元素的指针，因此将其作为参数传递给函数将会使得函数可以修改底层数组。换句话说，对 slice 的拷贝实际上又创建了一份对底层数组的引用。

- 与数组不同的是 slice 并不兼容，因此不能用 `==` 来检测两个 slice 是否包含相同的元素（因为可以用它来检测两个 slice 是否引用了相同的地址）。标准库中提供了 `bytes.Equal` 方法来比较 `[]byte` 类型，但是其它类型则需要我们自己来编码判断。

- 任何可能改变 slice 长度和容量或者会使得 slice 指向一个新的底层数组的函数都应该需要更新原来的 slice 变量，即 `s = append(s, r)` 这种形式。

```go
var x []int
x = append(x, 1)
x = append(x, 2, 3)
x = append(x, 4, 5, 6)
x = append(x, x...) // append the slice x
fmt.Println(x)      // "[1 2 3 4 5 6 1 2 3 4 5 6]"
```

```go
func appendInt(x []int, y ...int) []int {
    var z []int
    zlen := len(x) + len(y)
    // ...expand z to at least zlen...
    copy(z[len(x):], y)
    return z
}
```

- slice 可以用于模拟栈

```go
stack = append(stack, v) // push v
top := stack[len(stack)-1] // top of stack
stack = stack[:len(stack)-1] // pop
```

### 4.3 Maps

在 go 中，map 是对 hash 表的引用。

- 创建 map

```go
ages := make(map[string]int) // mapping from strings to ints
```

```go
ages := map[string]int{
    "alice":   31,
    "charlie": 34,
}
```

```go
ages := make(map[string]int)
ages["alice"] = 31
ages["charlie"] = 34
```

- 添加元素

```go
ages["alice"] = 32
```

- 删除元素

```go
delete(ages, "alice") // remove element ages["alice"]
```

- 获取元素，如果 key 不存在则返回 0 值

```go
ages["bob"] = ages["bob"] + 1 // happy birthday!
// 且 ++ 或者 += 这类赋值语句也能对 map 元素使用
ages["bob"] += 1
```

有时候我们确实希望判断是否存在某个元素：

```go
age, ok := ages["bob"] // ok 为 true 表示存在
if !ok { /* "bob" is not a key in this map; age == 0. */ }
```

或者简写为：

```go
if age, ok := ages["bob"]; !ok { /* ... */ }
```

但是 map 元素毕竟不是变量，不能获取其地址：

```go
_ = &ages["bob"] // compile error: cannot take address of map element
```

其中一个原因是因为 map 增长的过程中可能会对已经存在的元素进行 hash 到新的存储位置，从而可能使原来的地址无效。

- 遍历 map

```go
for name, age := range ages {
    fmt.Printf("%s\t%d\n", name, age)
}
```

对 map 的遍历是无序的，因为其 hash 函数在不同的实现中可能不同，如果要保证有序，则需要先对键进行排序：

```go
import "sort"

var names []string
for name := range ages {
    names = append(names, name)
}
sort.Strings(names)  // 排序
for _, name := range names {
    fmt.Printf("%s\t%d\n", name, ages[name])
}
```

由于我们实际上可以提前获取到 names 的大小，因此我们可以一次性分配一个足够容量的 slice ，从而避免每次容量不够时导致插入都执行重新分配和复制的操作：

```go
names := make([]string, 0, len(ages))
```

- 和 slice 一样，map 不能直接使用 `==` 来比较，如果要比较需要自己编码实现：

```go
func equal(x, y map[string]int) bool {
    if len(x) != len(y) {
        return false
    }
    for k, xv := range x {
        if yv, ok := y[k]; !ok || yv != xv {
            return false
        }
    }
    return true
}
```

- go 中没有提供 set 类型。由于 map 的 key 是唯一的，因此 map 可以用于表示 set

```go
map[string]bool
```

- 关于需要使用 slice 作为索引的结构，可以自定义 key 的比较函数：

```go
var m = make(map[string]int)

func k(list []string) string { return fmt.Sprintf("%q", list) }

func Add(list []string)       { m[k(list)]++ }
func Count(list []string) int { return m[k(list)] }
```

## 4.4 Structs

struct 是一种聚合类型，它将多个任意类型的值组合在一起形成一个实体。

```go
type Employee struct {
    ID        int
    Name      string
    Address   string
    DoB       time.Time
    Position  string
    Salary    int
    ManagerID int
}

var dilbert Employee
```

struct 的属性也是变量，因此可以获得其地址，或者通过指针进行访问：

```go
position := &dilbert.Position
*position = "Senior " + *position // promoted, for outsourcing to Elbonia
```

- struct 中的字段不能再包含自身的类型，即 struct `S` 中不能再包含类型为 `S` 的字段，但是可以包含 `*S` 类型，这使得我们可以实现链表或者树等递归数据结构。

#### 4.4.1 Struct Literals

- 第一种方式：

```go
type Point struct{ X, Y int }

p := Point{1, 2}
```

此种方式需要保持顺序与声明的顺序一致

- 第二种方式（更常用）：

```go
anim := gif.GIF{LoopCount: nframes}
```

这种使用键值对的方式就不需要关心字段的顺序了。

另外，如果字段是小写，在其它 package 中无法引用和初始化：

```go
package p
type T struct{ a, b int } // a and b are not exported

package q
import "p"
var _ = p.T{a: 1, b: 2} // compile error: can't reference a, b
var _ = p.T{1, 2}       // compile error: can't reference a, b
```

- 在 go 中函数接收到的都是参数的复制值，struct 也是如此，因此使用指针的情况更常见

```go
pp := &Point{1, 2}
```

同

```go
pp := new(Point)
*pp = Point{1, 2}
```

但前者可以用在表达式中，如函数调用。

#### 4.4.2 Comparing Structs

- 如果所有的 struct 字段都兼容，则认为 struct 是兼容的，因此可以用 `==` 和 `!=` 来判断。`==` 按顺序比较两个 struct 的字段。

- struct 类型也可以作为 map 的键

#### 4.4.3 Struct Embedding and Anonymous Fields

- struct 嵌套

```go
type Point struct {
    X, Y int
}

type Circle struct {
    Center Point
    Radius int
}

type Wheel struct {
    Circle Circle
    Spokes int
}

var w Wheel
w.Circle.Center.X = 8
w.Circle.Center.Y = 8
w.Circle.Radius = 5
w.Spokes = 20
```

上面的方式访问字段变得很麻烦，要写一长串的属性路径。

go 允许我们仅使用类型来声明字段 —— 即匿名字段。字段的类型必须是一个具名类型或者具名类型的指针。

```go
type Circle struct {
    Point
    Radius int
}

type Wheel struct {
    Circle
    Spokes int
}

// 使用匿名的方式，我们可以直接访问叶子节点的属性，而不用指明中间字段：

var w Wheel
w.X = 8        // equivalent to w.Circle.Point.X = 8
w.Y = 8        // equivalent to w.Circle.Point.Y = 8
w.Radius = 5   // equivalent to w.Circle.Radius = 5
w.Spokes = 20
```

实际上匿名字段是有名字的，它们的名字就是其类型名，只不过这些名字在选择其子属性的属性访问操作符(`.`)中是可以省略的。

但是在声明的时候不能省略，以下声明方式会报错：

```go
w = Wheel{8, 8, 5, 20}                       // compile error: unknown fields
w = Wheel{X: 8, Y: 8, Radius: 5, Spokes: 20} // compile error: unknown fields
```

结构体字面量初始化时必须遵循声明时的格式，因此需要像下面的方式这样：

```go
// 方式 1
w = Wheel{Circle{Point{8, 8}, 5}, 20}

// 方式 2
w = Wheel{
    Circle: Circle{
        Point:  Point{X: 8, Y: 8},
        Radius: 5,
    },
    Spokes: 20, // NOTE: trailing comma necessary here (and at Radius)
}

// # 号使得 Printf 的 %v 输出的格式和 Go 语法类似，对于 struct 而言，会打印每个字段的名字

fmt.Printf("%#v\n", w)
// Output:
// Wheel{Circle:Circle{Point:Point{X:8, Y:8}, Radius:5}, Spokes:20}

w.X = 42

fmt.Printf("%#v\n", w)
// Output:
// Wheel{Circle:Circle{Point:Point{X:42, Y:8}, Radius:5}, Spokes:20}
```

同样，小写的类型在 package 外是无法被访问的。

实际上匿名字段不一定要是 struct 类型，任何具名类型或者具名指针类型都可以。但是为什么要嵌入一个没有子字段的类型呢？

答案就是 struct 的方法。实际上，外部 struct 不仅可以获得嵌套类型的属性，还可以获得其方法。这种机制是简单对象行为构成复杂对象行为的主要方式。

### 4.5 JSON

go 中提供了 `encoding/json`, `encoding/xml`, `encoding/asn1` 等标准库来编解码这些格式的数据。这些标准库都有类似的 API。

```go
type Movie struct {
    Title  string
    Year   int  `json:"released"`
    Color  bool `json:"color,omitempty"`
    Actors []string
}

var movies = []Movie{
    {Title: "Casablanca", Year: 1942, Color: false,
        Actors: []string{"Humphrey Bogart", "Ingrid Bergman"}},
    {Title: "Cool Hand Luke", Year: 1967, Color: true,
        Actors: []string{"Paul Newman"}},
    {Title: "Bullitt", Year: 1968, Color: true,
        Actors: []string{"Steve McQueen", "Jacqueline Bisset"}},
    // ...
}
```

转换成 JSON 的过程叫 marshaling，使用 `json.Marshal`：

```go
data, err := json.Marshal(movies)
if err != nil {
    log.Fatalf("JSON marshaling failed: %s", err)
}
fmt.Printf("%s\n", data)
```

`Marshal` 得到的是一个 `[]byte` 类型的值，其中没有无关的空白字符。但是不易于阅读，如果需要易于阅读，使用 `json.MarshalIndent`，它可以指定每一行的前缀和每个层级的缩进：

```go
data, err := json.MarshalIndent(movies, "", "    ") // 指定前缀和缩进
if err != nil {
    log.Fatalf("JSON marshaling failed: %s", err)
}
fmt.Printf("%s\n", data)
```

Marshaling 使用 struct 字段名作为 json 对象中字段的名字，这是通过反射来完成的。只有导出了的字段会被 json 编码，即首字母大写的字段。

也许你发现 `Year` 字段在结果中是 `released`，`Color` 变成了 `color`。这是因为字段标记的原因。字段标记就是字段后面那一段字符串，它指定该字段的元数据。

```go
Year  int  `json:"released"`
Color bool `json:"color,omitempty"`
```

字段标记可以是任意字符串，但是按照惯例一般解释为以空格区分的 `key:"value"` 键值对。