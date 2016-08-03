#net模块提供了一个对网络交互的封装，它包含了创建客户端和服务端的代码

##net.Server类
> 创建TCP或者本地本地服务器，该类基于EventEmitter，它有如下事件：
>> close
>>> 当服务器关闭的时候，会触发该事件。如果还存在连接，则等所有连接关闭了才能触发该事件

>> connection （参数：net.Socket:连接对象）
>>> 当新连接被建立时触发，会传递一个net.Socket的实例socket

>> error (参数：Error:错误对象)
>>> 当发生错误的时候触发该事件，当该事件触发后会立即触发close事件。

>> listening
>>> 当服务器绑定listen事件之后会被触发，即 server.listen

>> __server.address()__
>>> 返回包含绑定的ip,协议，端口号的对象 e.g.:{ port: 12346, family: 'IPv4', address: '127.0.0.1' }
>>> NOTE: 不要在listening之前调用该函数

>> server.close([callback])
>>> 停止接收新的连接请求，并保持现有连接。该函数等待关闭所有连接，然后触发close事件，回调函数会在触发close事件过后被调用。
>>> 回调函数的唯一参数就是一个错误，如果调用close的时候server并没有开启，则会产生该错误

>> server.connections
>>> <已废弃>： 当前的连接数

>> __server.getConnections(callback)__
>>> 异步获取当前连接数，主要用于在socket被发送到子进程的时候（works when sockets were sent to forks）
>>> 回调函数获取两个参数 err 和 count

>> __server.listen(handle[, backlog][, callback])__
>>>
