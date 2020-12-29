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
