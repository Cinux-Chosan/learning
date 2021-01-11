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

字段标记可以是任意字符串，但是按照惯例一般解释为以空格区分的 `key:"value"` 键值对。由于它们包含双引号，因此通常写作原始字符串的形式。其中 `json` 键控制 `encoding/json` 库的表现，类似的其它 `encoding/...` 库遵循相同的约定。 `json` 的第一个字段表示转成 json 后的字段名，`omitempty` 表示如果该字段为空或 0 值则不输出该字段。

与编码相反的方向在 go 中称作 unmarshaling，通过 `json.Unmarshal` 来完成：

```go
var titles []struct{ Title string }
if err := json.Unmarshal(data, &titles); err != nil {
    log.Fatalf("JSON unmarshaling failed: %s", err)
}
fmt.Println(titles) // "[{Casablanca} {Cool Hand Luke} {Bullitt}]"
```

上例中，当 `json.Unmarshal` 完成时，它将数据填充进了 titles，由于 titles 是一个 struct 的 slice，且该 struct 只有 `Title` 字段，因此结果中也只有 `Title` 字段，这样可以选择哪些值需要被获取，哪些值需要被忽略。

---

go 在 JSON 解码的过程中是大小写**不敏感**的，因此只有在 JSON 字段中是下划线字段名但是 go 中不是的时候才需要使用字段标记：

```go
package github

import "time"

const IssuesURL = "https://api.github.com/search/issues"

type IssuesSearchResult struct {
    TotalCount int `json:"total_count"`
    Items      []*Issue
}

type Issue struct {
    Number    int
    HTMLURL   string `json:"html_url"`
    Title     string
    State     string
    User      *User
    CreatedAt time.Time `json:"created_at"`
    Body      string    // in Markdown format
}

type User struct {
    Login   string
    HTMLURL string `json:"html_url"`
}
```

```go
package github

import (
    "encoding/json"
    "fmt"
    "net/http"
    "net/url"
    "strings"
)

// SearchIssues queries the GitHub issue tracker.
func SearchIssues(terms []string) (*IssuesSearchResult, error) {
    q := url.QueryEscape(strings.Join(terms, " "))
    resp, err := http.Get(IssuesURL + "?q=" + q)
    if err != nil {
        return nil, err
    }

    // We must close resp.Body on all execution paths.
    // (Chapter 5 presents 'defer', which makes this simpler.)
    if resp.StatusCode != http.StatusOK {
        resp.Body.Close()
        return nil, fmt.Errorf("search query failed: %s", resp.Status)
    }

    var result IssuesSearchResult
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        resp.Body.Close()
        return nil, err
    }
    resp.Body.Close()
    return &result, nil
}
```

之前的例子使用 `json.Unmarshal` 来把 `[]byte` 类型解码成单个 JSON 实体，这里使用流式的解码方式：`json.Decoder`，它能够从一个流中解码出多个 JSON 实体。与此同时，还有一个对应的流式编码器：`json.Encoder`。

最后，调用 `Decode` 后就填充了变量 `result`。

### 4.6 Text and HTML Templates

暂时忽略

## 5. Functions

### 5.1 Function Declarations

```go
func name(parameter-list) (result-list) {
    body
}
```

- 如果函数没有返回值或者只返回一个不具名的值，则返回值那里不需要括号，否则需要括号包起来。

- 返回结果也可以有名字，这种情况则相当于定义了一个局部变量并且初始化成了 0 值，定义了返回值的函数必须要有 `return`，除非它明显无法运行到函数最后，例如最终调用了一个 panic 或者无限循环。

- 相同的类型可以连续合并声明，最后再写类型：

```go
func f(i, j, k int, s, t string)                { /* ... */ }
func f(i int, j int, k int, s string, t string) { /* ... */ }
```

下面展示四种定义两个参数和一个返回结果的函数，它们都是 `int` 类型：

```go
func add(x int, y int) int   { return x + y }
func sub(x, y int) (z int)   { z = x - y; return }
func first(x int, _ int) int { return x }
func zero(int, int) int      { return 0 }

fmt.Printf("%T\n", add)   // "func(int, int) int"
fmt.Printf("%T\n", sub)   // "func(int, int) int"
fmt.Printf("%T\n", first) // "func(int, int) int"
fmt.Printf("%T\n", zero)  // "func(int, int) int"
```

函数的类型有时候也叫函数的签名。如果两个函数具有相同的参数类型和返回值类型，则认为它们是同类型的。

- 参数通过值传递，因此函数接收到的每个参数都是拷贝的一份值 —— 修改这个值不会影响到函数外部。但是如果值是引用类型，如指针、slice、map、function、channel，则对引用类型的修改会间接修改到它们所引用的值，这种情况下就会影响到函数外部的值。

- 有时可能会遇到一个没有主体的函数声明，表示该函数是用 Go 以外的语言实现的。这样的声明定义了函数签名：

```go
package math

func Sin(x float64) float64 // implemented in assembly language
```

### 5.2 Recursion

下面将会使用一个非标准库 `golang.org/x/net/html` 来解析 HTML。`golang.org/x/...` 里面的库也是 Go 团队管理和维护，一般用于网络、郭启华文本处理、移动平台、图像处理、密码学和开发工具等。某些是因为还在开发中，还有一些是因为只会在某些特定情况下才会用得到。

- 某些语言使用固定大小的函数调用栈，从 64kb 到 2mb 不等，在递归深层级时可能会栈溢出，但是 go 中使用动态大小的栈，一开始很小，然后根据需要慢慢扩容，一次不需要担心堆栈溢出的问题。

### 5.3 Multiple Return Values

- go 的垃圾回收机制会回收未使用或不再使用的内存，但是并不会释放操作系统资源或者网络资源等（如打开的文件句柄等），这些资源需要显示关闭。

### 5.4 Errors

- 使用 `log.Fatalf` 报告错误，如同所有 log 函数一样，默认情况下它会加上日期和时间前缀。

```go
if err := WaitForServer(url); err != nil {
    log.Fatalf("Site is down: %v\n", err)
}
```

也可以自定义前缀并且不显示日期和时间：

```go

log.SetPrefix("wait: ")
log.SetFlags(0)
```

- 有一些错误是需要和其他错误进行区分的，如 `io.EOF` 表示读取操作已经读到最后，不能继续读取了。

### 5.5 Function values

函数可以作为值：

```go
func add1(r rune) rune { return r + 1 }

fmt.Println(strings.Map(add1, "HAL-9000")) // "IBM.:111"
fmt.Println(strings.Map(add1, "VMS"))      // "WNT"

fmt.Println(strings.Map(add1, "Admix"))    // "Benjy"
```

再举一个例子：

```go
// forEachNode calls the functions pre(x) and post(x) for each node
// x in the tree rooted at n. Both functions are optional.
// pre is called before the children are visited (preorder) and
// post is called after (postorder).
func forEachNode(n *html.Node, pre, post func(n *html.Node)) {
    if pre != nil {
        pre(n)
    }

    for c := n.FirstChild; c != nil; c = c.NextSibling {
        forEachNode(c, pre, post)
    }

    if post != nil {
        post(n)
    }
}
```

### 5.6 Anonymous Functions

匿名函数，又叫函数字面量。它是一个表达式。

如：

```go
strings.Map(func(r rune) rune { return r + 1 }, "HAL-9000")
```

匿名函数使得我们可以在使用的地方才定义，而且它能够访问外层的作用域。

如果匿名函数需要递归自身，则必须先声明一个变量，然后将匿名函数赋值给这个变量：

```go
var visitAll func(items []string)

visitAll = func(items []string) {
    for _, item := range items {
        if !seen[item] {
            seen[item] = true
            visitAll(m[item])
            order = append(order, item)
        }
    }
}
```

不能将两部分合并在一起，否则函数字面量不会存在于变量 visitAll 的作用域内，因此无法通过 visitAll 来调用递归调用自身。下面是错误的方法：

```go
visitAll := func(items []string) {
    // ...
    visitAll(m[item]) // compile error: undefined: visitAll
    // ...
}
```

#### 5.6.1 Caveat: Capturing Iteration Variables

```go
var rmdirs []func()
for _, d := range tempDirs() {
    dir := d               // NOTE: necessary!
    os.MkdirAll(dir, 0755) // creates parent directories too
    rmdirs = append(rmdirs, func() {
        os.RemoveAll(dir)
    })
}

// ...do some work...

for _, rmdir := range rmdirs {
    rmdir() // clean up
}
``
```

上面的代码中每次将 d 赋值给 dir 变量，如果缺少了这一步，在 append 的匿名函数中直接使用 d 将会导致所有 d 都是同一个值，因为 d 是 for 声明的局部变量，每次遍历都会更新变量 d，导致所有匿名函数中的 d 都是最后一个元素，因此需要将 d 赋值给一个 for 内部的局部变量，也可以再次声明同名的局部变量：

```go
for _, dir := range tempDirs() {
    dir := dir // declares inner dir, initialized to outer dir
    // ...
}
```

### 5.7 Variadic Functions

变长参数函数值参数长度可以为任意值的函数。

最常见的就是 `Printf`，它可以接收非固定长度的参数。

这种函数通过最后一个参数使用 `...` 来声明，它表示可以使用任意长度的该类型来调用当前函数：

```go
func sum(vals ...int) int {
    total := 0
    for _, val := range vals {
        total += val
    }
    return total
}

fmt.Println(sum())           //  "0"
fmt.Println(sum(3))          //  "3"
fmt.Println(sum(1, 2, 3, 4)) //  "10"
```

go 在背后会分配一个新的数组，将参数拷贝进去然后将整个数组的 slice 传递给函数，因此上面最后一行调用和下面等价：

```go
values := []int{1, 2, 3, 4}
fmt.Println(sum(values...)) // "10"
```

尽管使用 `...int` 声明的函数表现和直接传递 slice 声明的函数表现类似，但是它们是不同的函数类型。

```go
func f(...int) {}
func g([]int)  {}

fmt.Printf("%T\n", f) // "func(...int)"
fmt.Printf("%T\n", g) // "func([]int)"
```

### 5.8 Deferred Function Calls

- 从语法上讲，`defer` 语句是以关键字`defer`为前缀的普通函数或方法调用。函数和参数表达式在声明 `defer` 时进行求值，但实际调用被推迟到包含`defer`语句的函数完成时，无论是正常情况下`return` 还是异常情况下 panic 最后都会执行 defer

- 可以声明多个 `defer` 调用，但是他们的执行顺序与声明顺序相反

- 释放资源的 `defer` 应该在获取到资源后马上执行

```go
package ioutil

func ReadFile(filename string) ([]byte, error) {
    f, err := os.Open(filename)
    if err != nil {
        return nil, err
    }
    defer f.Close()
    return ReadAll(f)
}
```

```go
var mu sync.Mutex
var m = make(map[string]int)

func lookup(key string) int {
    mu.Lock()
    defer mu.Unlock()
    return m[key]
}
```

```go
func bigSlowOperation() {
    defer trace("bigSlowOperation")() // don't forget the extra parentheses
    // ...lots of work...
    time.Sleep(10 * time.Second) // simulate slow operation by sleeping
}

func trace(msg string) func() {
    start := time.Now()
    log.Printf("enter %s", msg)
    return func() { log.Printf("exit %s (%s)", msg, time.Since(start)) }
}

// $ go build gopl.io/ch5/trace
// $ ./trace
// 2015/11/18 09:53:26 enter bigSlowOperation
// 2015/11/18 09:53:36 exit bigSlowOperation (10.000589217s)
```

- defer 函数在 return 更新了函数返回值变量之后调用。

```go
func double(x int) (result int) {
    defer func() { fmt.Printf("double(%d) = %d\n", x, result) }()
    return x + x
}

_ = double(4)
// Output:
// "double(4) = 8"
```

由于匿名函数内部可以访问外面的变量，因此它能够获取到函数返回结果

defer 函数甚至可以修改当前函数返回给调用者的值：

```go
func triple(x int) (result int) {
    defer func() { result += x }()
    return double(x)
}

fmt.Println(triple(4)) // "12"
```

- 由于 defer 函数在函数运行到最后之前不会执行，因此在循环中的 defer 需要特别注意。下面的代码可能会消耗完所有的文件描述符，因为在所有文件被处理完成之前没有一个文件描述符会被关闭：

```go
for _, filename := range filenames {
    f, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer f.Close() // NOTE: risky; could run out of file descriptors
    // ...process f...
}
```

一种解决方案就是将循环体抽离到另一个函数中：

```go
for _, filename := range filenames {
    if err := doFile(filename); err != nil {
        return err
    }
}

func doFile(filename string) error {
    f, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer f.Close()
    // ...process f...
}
```

### 5.9 Panic

在一次典型的 panic 中，所有的正常执行都被停止，所有在 goroutine 中的 defer 函数被执行，然后程序崩溃并抛出一个错误消息。这个错误消息包含了 panic 的值，通常是一串显示调用栈以及错误原因的消息。

内置的 panic 函数可以直接调用，并接受任意值作为其参数。

并非所有出错都有必要使用 panic，只有一些不可能发生或明显导致程序无法执行的情况才使用 panic，另外，某些明显会在运行时被检测到的错误也没必要主动使用 panic：

```go
func Reset(x *Buffer) {
    if x == nil {
        panic("x is nil") // unnecessary!
    }
    x.elements = nil
}
```

虽然 go 中的 panic 和其它语言中的异常机制很像，但它们的使用场景却很不一样。由于 panic 会导致程序崩溃，因此一些预期的错误也不应该使用 panic，比如用户输入错误导致的问题，这些情况最好是使用 error

下面的 Compile 函数用于编译正则表达式，如果传入的格式有问题则会返回一个 error。如果调用者确定自己的程序不会传入错误的格式，则对调用者来说检查返回值 error 显得没那么必要而且很麻烦，这种情况下就可以提供一个函数来通过 panic 的方式处理错误，即 MustCompile 函数：

```go
package regexp

func Compile(expr string) (*Regexp, error) { /* ... */ }

func MustCompile(expr string) *Regexp {
    re, err := Compile(expr)
    if err != nil {
        panic(err)
    }
    return re
}
```

`MustCompile` 使得客户端可以很方便的初始化包级别的正则变量：

```go
var httpSchemeRE = regexp.MustCompile(`^https?:`) // "http:" or "https:"
```

但 `MustCompile` 不应该以不可信的输入值来调用。Must 前缀也是这种函数的命名约定 —— 很肯定直接使用不会有问题，真要有问题也只会是那些几乎不可能的情况或会导致程序崩溃的情况。

当发生 panic 时，所有 defer 函数都会被执行，从栈顶一直传播到 `main` 中：

```go
func main() {
    f(3)
}

func f(x int) {
    fmt.Printf("f(%d)\n", x+0/x) // panics if x == 0
    defer fmt.Printf("defer %d\n", x)
    f(x - 1)
}

// f(3)
// f(2)
// f(1)
// defer 1
// defer 2
// defer 3
```

作为诊断程序的目的，runtime 库允许程序员使用相同的机制来转存堆栈信息：

```go
func main() {
    defer printStack()
    f(3)
}

func printStack() {
    var buf [4096]byte
    n := runtime.Stack(buf[:], false)
    os.Stdout.Write(buf[:n])
}
```

Readers familiar with exceptions in other languages may be surprised that runtime.Stack can print information about functions that seem to have already been “unwound.” Go’s panic mechanism runs the deferred functions before it unwinds the stack.

### 5.10 Recover

虽然出现了 panic，但有的情况是需要从错误中恢复的，或者至少应该在退出前做一些清理工作。比如一个 web 服务器遇到了未知异常可以关闭连接而不是使得整个客户端挂起，或者在开发测试阶段应该告诉客户端错误信息。

如果在 defer 函数中调用了内置的 recover 函数，并且此时声明 defer 的函数发生了 panic，则 recover 会终止 panic 状态并返回 panic 的值。异常函数将从 panic 处停止执行但正常返回。

如果其它情况调用 recover 不会有任何影响，它只会返回 nil

```go
func Parse(input string) (s *Syntax, err error) {
    defer func() {
        if p := recover(); p != nil {
            err = fmt.Errorf("internal error: %v", p)
        }
    }()
    // ...parser...
}
```

上例中， defer 函数中把 panic 转换为了 error。更高级的用法可能是在错误消息中包含 runtime.Stack 中完整的调用栈信息返回给调用者。

通常，不应该尝试恢复其它 package 中抛出的 panic。公共 API 应该使用 error 来向调用者报告错误。

有选择性的 recover 才是最安全的。我们可以不同的类型作为 panic 的值并检测 recover 得到的值是否是该类型来分别处理 panic，如果是我们想要处理的 panic 则将其转换为 error，如果不是我们需要处理的 panic 则继续将其以 panic 的方式向上传播：

```go
// soleTitle returns the text of the first non-empty title element
// in doc, and an error if there was not exactly one.
func soleTitle(doc *html.Node) (title string, err error) {
    type bailout struct{}

    defer func() {
        switch p := recover(); p {
        case nil:
            // no panic
        case bailout{}:
            // "expected" panic
            err = fmt.Errorf("multiple title elements")
        default:
            panic(p) // unexpected panic; carry on panicking
        }
    }()

    // Bail out of recursion if we find more than one non-empty title.
    forEachNode(doc, func(n *html.Node) {
        if n.Type == html.ElementNode && n.Data == "title" &&
            n.FirstChild != nil {
            if title != "" {
                panic(bailout{}) // multiple title elements
            }
            title = n.FirstChild.Data
        }
    }, nil)
    if title == "" {
        return "", fmt.Errorf("no title element")
    }
    return title, nil
}
```

## 6. Methods

在我们看来，对象就是具有一系列属性和方法的某个变量或者值。方法就是和某个类型相关联的函数。

### 6.1 Method Declarations

方法的定义和普通函数的定义一样，但在方法名前面有一个额外的参数。该参数将方法和自己的类型关联起来：

```go
package geometry

import "math"

type Point struct{ X, Y float64 }

// traditional function
func Distance(p, q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}

// same thing, but as a method of the Point type
func (p Point) Distance(q Point) float64 {
    return math.Hypot(q.X-p.X, q.Y-p.Y)
}
```

上面的例子中，`p` 称作方法的接收者(`receiver`)。在 Go 中不使用像 `this` 或者 `self` 之类的变量作为 receiver。在 go 中 receiver 就和其它参数一样。而且一般变量名就使用类型的第一个字母，如 `p` 对应 `Point`。

```go
p := Point{1, 2}
q := Point{4, 6}
fmt.Println(Distance(p, q)) // "5", function call
fmt.Println(p.Distance(q))  // "5", method call
```

Go 能为同一个 package 中的具名类型添加方法，只要它底层的类型不是指针或者接口(interface)
