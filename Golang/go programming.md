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