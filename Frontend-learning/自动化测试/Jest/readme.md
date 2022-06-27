# Jest 自动化测试

TDD：Test Driven Development（Red-Green Development），测试驱动开发：

- 方式：
  - 编写测试用例
  - 运行测试用例，但由于还未实现代码，因此无法通过
  - 编写代码，使用测试用例通过测试
  - 优化代码，完成开发
- 优点：
  - 减少回归 bug
  - 测试覆盖率高
  - 代码质量较好

### 如何使用 ES 模块

编写的模块代码一般都是 es 模块，但是 Jest 默认使用 commonjs 规范，如何让它使用 es 模块呢？

起始在 Jest 内部集成了 babel-jest，当项目下安装了 `babel-core`，它会自动使用 `.babelrc` 配置对编写的 es 代码进行转换。

因此只需要安装 `@babel/core` 和 `@babel/preset-env` 然后配置 `.babelrc`：

```json
{
    "presets":[
        [
            "@babel/preset-env": {
                "targets": {
                    "node": "current"
                }
            }
        ]
    ]
}
```

### 匹配器

- `toBe(val)`：匹配两个内容绝对相等
- `toEqual(val)`：匹配两个内容相等，如相同字段的对象
- `toBeNull()`、`toBeUndefined()`、`toBeDefined()`、`toBeTruthy()`、`toBeFalsy()`
- 数字相关：
  - `toBeGreaterThan()`、`toBeGreaterThanOrEqual()`、另外也有 `toBeLessThan()` 相关的
  - `toBeCloseTo()`：解决精度问题，如浮点数 `0.1 + 0.2` 会出现精度问题导致不等于 `0.3`，使用 `toEqual` 无法通过测试，需要使用 `toBeCloseTo`
- 字符串相关：
  - `toMatch`：匹配字符串
- 数组相关：
  - `toContain(val)`
- 异常处理：
  - `toThrow(msg?: string)`：期望函数抛出异常，如 `expect(fn).toThrow()` 在 fn 抛出异常时通过测试。

另外还有取反匹配，在前面添加 `not` 即可，如：

```js
expect(1).not.toBeFalsy();
```

- 希望至少有几个 expect 被执行（某些情况根据条件进行测试可能会没有走到对应的条件，从而没有进入测试）：`expect.assertions(1)` 表示该块测试至少要执行一个 `expect` 方法

### 异步代码测试

- 直接返回 ` `

- 在测试代码中使用 `done` 回调函数:

```js
test("async test", (done) => {
  Promise.resolve(1).then((data) => {
    expect(data).toBe(1);
    done();
  });
});
```

- 使用 jest 提供 de resolves

```js
// 测试成功
expect(fetchData()).resolves.toMatchObject({
  data: {
    success: true,
  },
});
// 测试失败
expect(fetchData()).rejects.toThrow();
```

### 钩子函数

```js
beforeAll(() => {
  // 在开始测试之前调用，可以做一些初始化
});
beforeEach(() => {
  // ... 每个测试用例调用之前会被执行
});
afterEach(() => {
  // ... 每个测试用例调用完成之后执行
});
afterAll(() => {
  // ... 收尾
});
```

### 分组

使用 `describe` 对多个测试进行分组，每个分组里面也可以使用钩子，它只会对它内部的测试生效。

```js
describe("这里是分组描述", () => {
  test("test 1", () => {
    // ...
  });
  test("test 2", () => {
    // ...
  });
});
```

### 仅执行某几个测试

加上 `only` 后，只有添加了 `only` 的测试才会执行：

```js
test("test 1", () => {});
test.only("test 2", () => {});
test("test 3", () => {});
```

### Mock 函数

Mock 函数让我们可以追踪函数的调用情况，而不用关心其具体实现。

像下面这样声明一个 mock：

```js
// 当空函数使用，没有实现
const mockCallback = jest.fn();
// 传入实现，当 mockCallback 当做函数使用时以传入的函数作为实现
const mockCallback = jest.fn((x) => 42 + x);
// 也可以使用 mockImplementation
```

模拟返回值：

```js
const myMock = jest.fn();
console.log(myMock());
// > undefined

myMock
  .mockReturnValueOnce(10) // 模拟返回 10 一次
  .mockReturnValueOnce("x") // 模拟返回 x 一次
  .mockReturnValue(true); // 一直返回 true

console.log(myMock(), myMock(), myMock(), myMock());
// > 10, 'x', true, true
```

模拟模块函数：

```js
import axios from "axios";
import Users from "./users";

jest.mock("axios"); // 如果存在一个 `__mocks__` 目录并且里面存在 axios，则会自动使用里面的方法。
// 如果配置了某个模块的 mock，但此时又需要引用未经过 jest 处理的函数，可以使用 `jest.requireActual(模块)`

test("should fetch users", () => {
  const users = [{ name: "Bob" }];
  const resp = { data: users };
  axios.get.mockResolvedValue(resp); // 当调用 axios.get 时返回 resp 作为返回值

  // or you could use the following depending on your use case:
  // axios.get.mockImplementation(() => Promise.resolve(resp))

  return someFuncUseAxiosGet.then((data) => expect(data).toEqual(users));
});
```

仅模拟模块部分实现，参考 https://jestjs.io/docs/mock-functions#mocking-partials

某些情况下需要函数返回 `this`，可以使用 `mockReturnThis`

```js
const myObj = {
  myMethod: jest.fn().mockReturnThis(),
};

// is the same as

const otherObj = {
  myMethod: jest.fn(function () {
    return this;
  }),
};
```

### 快照

使用 `toMatchSnapshot()` 生成快照，首次没有快照的时候会自动生成，以后就会每次和快照进行对比，如果不一样就会提示测试不通过，如果某个字段只是特定的类型，值可能是随机生成的，则可以传入一个模式对象：

```js
expect(user).toMatchSnapshot({
  createdAt: expect.any(Date),
  id: expect.any(Number),
});
```

### 对定时器进行模拟

先使用 `jest.useFakeTimers()` 表示使用模拟定时器，然后使用 `jest.runAllTimers()` 立即调用所有定时器，但是嵌套在定时器里面的定时器也会被执行，如果只希望执行已经设置好的定时器，嵌套的还未开启的定时器不执行则可以使用 `jest.runOnlyPendingTimers()`

还可以换个思路，让时间快进，如 `jest.advanceTimersByTime(3000)`，让时间快进 3 秒，这样设置在 3 秒内的定时器会被立即执行。如果担心 `advanceTimersByTime` 对多个测试用例造成影响，可以在 `beforeEach` 中声明 `jest.useFakeTimers()`，这样每次都会重新使用新的模拟定时器
