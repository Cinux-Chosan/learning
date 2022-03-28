- `address payable` 可以隐式转换为 `address` 类型，但是 `address` 必须使用 `payble(<address>)` 才能转换到 `address payable`

- 所有的合约都可以转换为 address 类型，因此可以通过 `address(this).balance` 来查询当前合约的余额
