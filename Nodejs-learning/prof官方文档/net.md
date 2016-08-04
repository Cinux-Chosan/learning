#[net模块](https://nodejs.org/dist/latest-v4.x/docs/api/net.html)提供了一个对网络交互的封装，它包含了创建客户端和服务端的代码

##net.Server类
> 创建TCP或者本地本地服务器，该类基于EventEmitter，它有如下事件：
>> ###close###
>>> 当服务器关闭的时候，会触发该事件。如果还存在连接，则等所有连接关闭了才能触发该事件

>> ------

>> ###connection### （参数：net.Socket:连接对象）
>>> 当新连接被建立时触发，会传递一个net.Socket的实例socket

>> ------

>> ###error### (参数：Error:错误对象)
>>> 当发生错误的时候触发该事件，当该事件触发后会立即触发close事件。

>> ------

>> ###listening###
>>> 当服务器绑定listen事件之后会被触发，即 server.listen

>> ------

>> ###__server.address()__###
>>> 返回包含绑定的ip,协议，端口号的对象 e.g.:{ port: 12346, family: 'IPv4', address: '127.0.0.1' }  

>>> ＜ NOTE: 不要在listening之前调用该函数 ＞

>> ------

>> ###__server.close([callback])__###
>>> 停止接收新的连接请求，并保持现有连接。该函数等待关闭所有连接，然后触发close事件，回调函数会在触发close事件过后被调用。  

>>> 回调函数的唯一参数就是一个错误，如果调用close的时候server并没有开启，则会产生该错误

>> ------

>> ###server.connections###
>>> ＜已废弃＞： 当前的连接数

>> ------

>> ###__server.getConnections(callback)__###
>>> 异步获取当前连接数，主要用于在socket被发送到子进程的时候（works when sockets were sent to forks）。  

>>> 回调函数获取两个参数 err 和 count

>> ------

>> ###__server.listen(handle[, backlog][, callback])__###
>>> handle ＜Object＞ : 可以是一个server或者socket（任何属于底层_handle句柄的成员）或则{fd:＜n＞}的对象。  

>>> 该函数会让server在指定handle上接收连接。但是它会假定fd或者handle已经绑定到了某个端口或者domain socket。  

>>> windows不支持在fd上监听（listening），该函数是异步的，server被绑定完成过后，会触发listening事件。最后的callback会被当做listening的监听函数。  

>>> backlog ＜Number＞ : 该参数表示处于等待连接中的最大数，默认值是511，非512。  

>> ------

>> ###__server.listen(options[, callback])__###
>>> options ＜Object＞ : {port＜Number＞, host＜String＞, backlog＜Number＞, path＜String＞, exclusive＜Boolean＞}。  

>>> path可选项可用于指定一个UNIX socket。如果exclusive为false，则集群会使用相同的handle进行工作，允许共享连接句柄的任务。  

>>> 如果exclusive为true，则handle不能被共享，企图共享端口会造成错误。[Linkto](https://nodejs.org/dist/latest-v4.x/docs/api/net.html#net_server_listen_options_callback "官方文档对应部分")。

>> ------

>> ###__server.listen(path[, backlog][, callback])__###
>>> 在UNIX系统上，本地domain与UNIX domain采用相同的命名方式和权限检查，所以path与文件系统的path一样。  

>>> 在windows系统上，本地domain使用pipe实现，所以path必须参考 \\\\?\\pipe\\ 或者 \\\\.\\pipe\\. 。  

>>> 任何字符都可以，但是后者会处理一下pipe names，就像处理 ..。pipe不会长期存在，他们会在最后一个引用它们的引用关闭的时候被移除。。

>> ------

>> ###__server.listen(port[, hostname][, backlog][, callback])__###
>>> 如果缺省hostname参数，server会在IPv6可用的时候接收任何IPv6地址（：：），或者IPv4地址（0.0.0.0）。如果port为0则会被分配一个随机端口号。  

>>> 一种可能的错误是EADDRINUSE，即端口被占用。e.code == 'EADDRINUSE'

>> ------

>> server.maxConnections
>>> 当server的连接数比较高的时候，可以设置该属性来拒绝其他连接。  

>>> 当socket通过child_process.fork()被发送到child的时候，不推荐使用该方法。

>> ------

>> __server.unref()__
>>> 在server上调用该方法将允许该程序在它作为事件系统上唯一活动的server时退出。如果server已经掉用过该函数，再次调用不会有影响。返回值为该server。

>> ------

>> __server.ref()__
>>> 与unref相反，调用该方法在一个已经unref的server上，将不会让该程序在作为唯一一个server的时候退出。重复调用不会有影响。返回值为该server。

[Class: net.Socket](https://nodejs.org/dist/latest-v4.x/docs/api/net.html#net_class_net_socket)

*********************

##net.Socket类
> TCP 或者本地socket的抽象。实现了可读可写流的接口。可以被用来做客户端程序，或者被nodejs创建并传递给server的connection事件。

>> ------

>> __net.Socket([options])__
>>> options有如下默认值 {fd: null, allowHalfOpen: false ,readable: false, writable: false};  

>>> fd用于指定已经存在的socket的文件描述符。 readable和writable可以设置为true或者false来允许读写该socket。  

>>> allowHalfOpen请参考createServer()和 end 事件。

>> ------

>> close （参数：had_error ＜Boolean＞）
>>> 当socket完全关闭的时候会被触发。had_error表示由于transmission 错误导致socket关闭

>> ------

>> connect
>>> 当成功建立起socket连接时触发

>> ------

>> data（参数：chunk ＜Buffer＞）
>>> 当接受到数据的时候触发该事件。参数可以是Buffer或者String。通过socket.setEncoding()设置编码。如果当数据到达的时候没有监听该事件，则数据丢失

>> ------

>> drain
>>> 当write buffer被清空时触发。可以用于调节上传程序。返回值为 socket.write()的返回值

>> ------

>> end
>>> 当socket的另一端发送FIN包（断开连接）时触发。  

>>> 默认情况下allowHalfOpen为false，一旦在等待中的数据被全部写完，socket在默认情况下会摧毁它的文件描述符。  

>>> 通过将allowHalfOpen设置为true，socket就不会自动 end()，而允许用于写入任意数量的数据，但是用户需要自己 end()。

>> ------

>> error （参数：error ＜Error＞）
>>> 发生错误时触发

>> ------

>> lookup (参数：err ＜Error＞ || ＜Null＞, address ＜String＞, family ＜String＞ || ＜Null＞ )
>>> 在已经有了主机名（hostname）之后，在连接（connecting）之前被触发。UNIX socket下不起作用。参数address为IP地址，参数err ，family参考 dns.lookup()

>> ------

>> timeout
>>> 当socket超时时触发。但是该事件只是为了提醒用户socket处于空转状态。用户需要手动关闭连接，可以参考 socket.setTimeout()

>> ------

>> __socket.address()__
>>> 同server.address()，返回地址信息，e.g. { port: 12346, family: 'IPv4', address: '127.0.0.1' }

>> ------

>> socket.bufferSize ＜prop＞
>>> net.Socket具有该属性的时候，socket.write()会一直工作。这样做的目的是帮助用户更快的运行程序。 因为有可能网络情况不佳，此时电脑并不能保持大量的数据写入socket。nodejs会在内部将需要写入的数据保存为队列，在可以发送的时候将这些数据发送出去。（当socket为可写的时候，nodejs内部会在socket的文件描述符上进行轮询）  

>>> 因为nodejs会缓存要发送的数据，所以会导致消耗的内存变多。该属性可以反映当前被缓存的字符数量。某些情况下该数目可以表示字节数，但是由于String是懒编码的，所以此时字节数未知。  

>>> 当出现bufferSize变得较大的时候，应该使用pause()和resume()来调节数据的发送。

>> ------

>> socket.bytesRead ＜prop＞
>>> 接收到的字节数

>> ------

>> socket.bytesWritten ＜prop＞
>>> 发送的字节数

>> ------

>> __socket.connect(options[, connectListener])__
>>> 在某个指定的socket上建立连接  

>>> 如果是TCP socket，options应该是一个具有如下属性的对象：  
>>>> port: 客户端需要连接的端口号（必须）  

>>>> host: 客户端需要连接的服务端地址，默认为 "localhost"  

>>>> localAddress: 用于网络连接的本地接口  

>>>> localPort: 用于网络连接的本地端口号  

>>>> family: IP版本号，默认为 4  

>>>> lookup: 惯用的查询函数，默认为 dns.lookup  
>>> 如果是本地域sockets，options应该指定以下属性：  
>>>> path: 客户端应该连接的地址  
>>> 通常，该方法并非必须，使用net.createConnection开启该socket。该方式仅用于实现一个DIY的socket。  

>>> 该函数为异步函数，当connect事件被触发的时候，socket就会被建立。如果connecting发生错误，connect事件不会被触发，取而代之的是error事件。  

>>> connectListener会被当作connect事件的处理函数。

>> ------

>> __socket.connect(path[, connectListener])__  

>> __socket.connect(port\[, host][, connectListener])__
>>> 同socket.connect(options[, connectListener])。参数可以是{port: port, host: host} 或者 {path: path}。

>> ------

>> __socket.destroy()__
>>> 确保该socket不会发生更多的 I/O 操作。只有在发生错误的时候需要这么做。

>> ------

>> __socket.end(\[data][, encoding])__
>>> 发送FIN包，关闭socket。 It is possible the server will still send some data.  

>>> 如果指定了data参数，就相当于调用 socket.write(data, encoding)然后调用socket.end()。

>> ------

>> socket.localAddress ＜prop＞
>>> 该属性为一个表示与远程客户端所连接的本地IP。例如，如果你正在监听 "0.0.0.0" 并且 client 连接在 "192.168.1.1"上，那么这个值就是 "192.168.1.1"。

>> socket.localPort ＜prop＞
>>> 代表本地端口号的整数

>> ------

>> __socket.pause()__
>>> 暂停读取数据。即 data 事件不会再被触发。在调节文件上传的过程中会比较有用

>> ------

>> __socket.ref()__
>>> 同 server.ref()，不同的是该返回值为socket

>> ------

>> socket.remoteAddress ＜prop＞
>>> 代表远程IP地址的字符串。在客户端关闭连接等导致socket被摧毁的情况下，该值可能为undefined

>> ------

>> socket.remoteFamily ＜prop＞
>>> 代表远程IP协议版本的字符串，“IPv4”或者“IPv6”之一。

>> ------

>> socket.remotePort ＜prop＞
>>> 代表远程端口的整数

>> ------

>> __socket.resume()__
>>> 唤醒因socket.pause()导致休眠的socket继续读取数据。

>> ------

>> __socket.setEncoding([encoding])__
>>> 设置socket数据的编码，（Set the encoding for the socket as a Readable Stream.），参阅[Linkto](https://nodejs.org/dist/latest-v4.x/docs/api/stream.html#stream_readable_setencoding_encoding)

>> ------

>> __socket.setKeepAlive([enable][, initialDelay])__
>>> 启用/禁用 keep-alive 功能。有选择的设置在第一个keep-alive帧被发送到一个空闲ssocket之前的初始延迟时间。enable的默认值为false。  

>>> 设置 initialDelay（毫秒为单位）来设置介于第一个keep-alive探针被发送到最后一个数据包被接收的延时。设置为 0 将会保持该值与默认值不变。默认值为 0.  

>>> 返回值 socket

>> ------

>> __socket.setNoDelay([noDelay])__
>>> 禁用[Nagle算法](http://baike.baidu.com/link?url=2Z2PwTi0I5gVX-KKp3-25IhBmNRLmQWOcAB--uLbJhHKyOHJnWbMKzdsYarSRJDWSZU2jsJM1P-_qcGSn2ZUKq)。默认情况下，TCP连接使用Nagle算法，该算法在发送数据前缓存数据。将noDelay设置为true将会在每次调用socket.write()的时候立即发送数据。noDelay默认值为 true。  

>>> 返回值为 socket。

>> ------

>> __socket.setTimeout(timeout[, callback])__
>>> 当该socket 在 timeout 毫秒内一直处于不活跃的状态时，将 socket 设置为 timeout 。默认情况下 net.Socket 没有 timeout  

>>> 当空闲超时时间被触发，socket会收到 timeout 事件，但是连接仍然不会被中断。用户必须手动 end() 或者 destroy() 该socket。  

>>> 如果 timeout是 0，则已经存在的空闲超时将会被禁用。  

>>> 回掉函数 callback 将会作为 timeout事件的处理函数。  

>>> 返回值： 该 socket。  

>> ------

>> __socket.unref()__
>>> 同 server.socket,不同的是返回值为该 socket。

>> ------

>> __socket.write(data[, encoding][, callback])__
>>> 在该socket上面发送数据。encoding指定数据编码格式，默认为 "utf8"。  

>>> 如果返回true，表示所有数据全部被成功推入内核缓存区（kernel buffer）。  

>>> 如果返回false， 则表示部分或者全部数据被存入用户内存队列（queued in user memory）。 当buffer被清空的时候，drain事件将会触发。  

>>> 当所有数据最终都被发送出去的时候，回掉函数callback将会执行。  

>> ------

>> __net.connect(options[, connectListener])__
>>> 工厂函数，返回一个 net.Socket 并且根据options进行自动连接。  

>>> 该options 会被传递给 net.Socket的构造函数和 socket.connect方法。  

>>> connectListener将会作为 connect 事件的一次性处理函数，即只会调用一次。  

>>> [示例](https://nodejs.org/dist/latest-v4.x/docs/api/net.html#net_net_connect_options_connectlistener)

>> ------

>> __net.connect(path[, connectListener])__
>>> 工厂函数，返回一个 *UNIX* net.Socket并且根据path参数进行自动连接  

>>> connectListener将会作为 connect 事件的一次性函数。

>> ------

>> net.connect(port\[, host][, connectListener])
>>> 工厂函数，返回一个 net.Socket 并且根据 port 和 host 自动连接。  

>>> 如果host缺省，则会被赋值为 "localhost"。  

>>> connectListener将会作为 connect 事件的一次性函数。

>> ------

>> __net.createConnection(options[, connectListener])__
>>> 工厂函数，返回一个 net.Socket 并且根据 options进行自动连接。  

>>> options 会被传递给 net.Socket的构造函数和 socket.connect方法。  

>>> connectListener将会被作为 conncet 事件的一次性函数。  

>>> [示例](https://nodejs.org/dist/latest-v4.x/docs/api/net.html#net_net_createconnection_options_connectlistener)

>> ------

>> __net.createConnection(path[, connectListener])__
>>> 工厂函数，返回一个 *UNIX* net.Socket 并且根据 path进行自动连接  

>>> connectListener将会被作为 conncet 事件的一次性函数。

>> ------

>> __net.createConnection(port[, host][, connectListener])__
>>> 工厂函数，返回一个 net.Socket ，并且根据 port 和 host 进行自动连接。  

>>> 如果 host 参数缺省，则会被赋值为 "localhost"。

>>> connectListener将会被作为 conncet 事件的一次性函数。

>> ------

>> __net.createServer([options][, connectionListener])__
>>> 创建一个新的 server，connectionListener 会被自动设置为 connection 事件的处理函数。options 默认如下：{allowHalfOpen: false, pauseOnConnect: false}  

>>> 如果 allowHalfOpen 为 true，则当 socket 的另一端发送 FIN 包的时候，该 socket 不i会自动发送 FIN 包。该 socket 变为不可读状态，但是仍然可写。所以需要显示调用 end()。  

>>> 如果 pauseOnConnect 为 true，则与该 socket相关的每一个即将到来的连接都会被暂停。并且没有数据被读取。这将会允许与之相关的连接在数据没有被源进程读取的情况下，在不同的进程之间进行传递。如果需要从暂停的socket读取数据，需要条用 resume()。  

>>> [示例](https://nodejs.org/dist/latest-v4.x/docs/api/net.html#net_net_createserver_options_connectionlistener)

>> ------

>> __net.isIP(input)__
>>> 测试参数input是否是一个IP地址，如果返回 0 则代表该输入并非IP地址，返回 4 表示 IPv4，返回 6 则代表该地址为 IPv6。

>> ------

>> __net.isIPv4(input)__
>>> 测试参数input代表的字符串是否是一个有效的IPv4地址。返回true为有效。

>> ------

>> __net.isIPv6(input)__
>>> 测试参数input代表的字符串是否是一个有效的IPv6地址。返回true为有效。
