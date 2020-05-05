- new 用来分配值类型的内存
  - `p := new (int)`
- make 用来分配引用类型的内存

- 没有 `try ... catch`，使用 `defer recover` 来处理错误

  ```go
  // 错误处理 demo
  func test() {
    defer func() {
      err := recover()  // recover 捕获错误
      if err != nil {
        fmt.Println("err = ", err);
      }
    }()

    res := 10 / 0 // error
  }
  ```

- 抛出异常

  - `errors.New(错误说明)`
  - `panic` 输出信息并终止程序

- 数组初始化

  - `var a [3]int = [3]int{1,2,3}`
  - `a := [3]int{1,2,3}` ，使用类型推导
  - `a := [...]int{1,2,3,4,5}` ，不指定具体数量
  - `a := [...]int{1: 800, 0: 900}` ，指定下标

- 数组遍历

```go
for index, value := range array {
  // ...
}
```

- 切片

切片是引用类型，它底层是一个结构体，包含三个部分：第一个引用数组的元素地址（即起始下标）、长度、容量。

切片需要学会使用 `append` 和 `copy`

```go
intArr := [...]int{1,2,3,4,5}

slice := intArr[1:3]   // slice 即为一个切片

fmt.Println("切片的长度是 %d, 容量是 %d", len(slice), cap(slice))

// 通过 make 声明一个切片

var slice []int = make([]int, 4, 10)  // 声明一个 []int 类型的切片，长度为 4，容量为 10。make 方式会在底层创建一个隐藏的数组。

var slice []int = []int{1,2,3}  // 直接声明一个

// -------------- 根据数组初始化的简写，默认起点是 0，终点是数组长度

var slice = arr[:]  // 引用整个 arr

var slice = arr[2:]  // 引用数组 arr[2:len(arr)]

var slice = arr[:10]  // 引用数组 arr[0:10]
```

- map

map 需要通过 `make` 来分配空间

- 删除元素可以使用 `delete`
  - `delete(m, "no1")`
- 一次删除 map 所有的 key
  - 遍历所有 key ，逐一删除
  - 直接重新 make 一个新空间

```go
m := make(map[string]string, 10)
m["no1"] = "这是 no1"
m["no2"] = "这是 no2"

// 直接初始化
m := map[string]string { "no1": "这是 no1"}

// 读取 map 值
v, r := map["no1"]  // v 为值，r 为结果，如果有该 key 则 r 为 true 否则为 false

// map 的遍历，也使用 for-range
for k, v := range m {
  fmt.Printf("%s:%s\n", k, v)
}

// 查看 map 有多少对 key-value 也使用 len
len(m)
```

- 结构体

结构体的所有字段在内存中是连续的

```go
type Person struct {
  Name string
  Age int
}

// 1. 声明一个 Person

var p1 Person

// 2. 声明 + 初始化

var p2 Person = Person{}  // {} 中可以初始化

// 3. 通过 new 创建对应类型的指针

var p3 * Person = new (Person)

(*p3).Name = "smith"
(*p3).Age = 30

// 但是也可以写成

p3.Name = "john"  // 这种情况 go 底层也会转换成 (*p3).Name。这种写法只是 go 为了方便开发者做的

// 4. 同3

var p4 *Person = &Person{}
```

```go
type Person struct {
  Name string
}

// 给 A 类型绑定一个方法

func (p Person) sayName() {
  fmt.Printf("My name is %s", p.Name)
}

p := Person{"chosan"}
p.sayName()  // 输出 "My name is chosan"
```

如果一个自定义类型实现了 `String` 方法，则在 Print 的时候回调用该方法。

```go
func (p *Person) String() string {
  str := fmt.Sprintf("Name=[%v]", p.Name)
}

str := Student{
  Name: "Tom"
}

fmt.Println(&stu)  // Name=[Tom]
```
