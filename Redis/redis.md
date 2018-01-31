# [Redis 文档](https://redis.io/documentation)

## Using pipelining to speedup Redis queries

### 请求/响应 协议和 RTT

Redis 是一个 TCP 服务器， 采用 CS 模型（客户端-服务器），这就被称作 请求/响应 协议。

这意味着通常请求分两步完成：
- 客户端向服务器发起，通常以阻塞的方式从 socket 读取服务器响应。
- 服务器处理命令，并把结果返回给客户端。

这种情况下，依次向服务器发送命令就像下面这种场景：

- Client: INCR X
- Server: 1
- Client: INCR X
- Server: 2
- Client: INCR X
- Server: 3
- Client: INCR X
- Server: 4


客服端和服务器通过网络连接，网络环境可能波动很大，可能是环回接口（即使用本地环回地址，如 127.0.0.1），那么连接就很快，如果网络中途有很多路由，那么建立网络连接可能就很慢，不管网络环境如何，数据都要经历从客户端发出，再从服务端返回这段时间。

这个时间就称作 RTT（往返时间）。当客户端需要连续发送大量请求的时候它对性能的影响就变得显而易见了（如在同一个列表中添加许多元素，或者使用许多字段来填充数据库）。如过 RTT 为 250 毫秒，即使服务器每秒能处理 10 万个请求，但实际上我们却每秒最多处理 4 个请求。

如果是环回接口，RTT 非常短， 但如果你需要连续执行大量的写操作，相对来说环回接口也显得有点慢了。但是非常幸运的是有一种方法来改善这种情况。

#### Redis Pipelining（流水线）[https://redis.io/topics/pipelining]

一个 请求/响应 服务器应该被实现为即使客户端没有来得及读取旧数据，它也能够处理新的请求。这样就可以发送多个命令到服务器而不用等待回复，最后再一次性读取回复。

这就叫 Pipelining, 并且是数十年来广泛使用的技术。例如许多 POP3 协议就已经实现了这个特性，大大的加速了从服务器上下载新邮件的过程。

Redis 很早就支持 pipelining, 所以不管是哪个版本的 redis， 你都可以使用这项特性，下面是一个使用原始 netcat 工具的例子：
``` sh
$ (printf "PING\r\nPING\r\nPING\r\n"; sleep 1) | nc localhost 6379
+PONG
+PONG
+PONG
```

这次我们没有每次等待 RTT， 而是三个命令只花费了一次 RTT 时间。
那么之前的第一个例子就会使下面这个样子：

- Client: INCR X
- Client: INCR X
- Client: INCR X
- Client: INCR X
- Server: 1
- Server: 2
- Server: 3
- Server: 4

重要提示： 当客户端使用 pipelining 向服务端发送命令的时候， 服务端将会被迫使用内存来缓存回复队列。所以如果你需要使用 pipelining 来发送大量的命令，最好选择一个合理的数量来批量发送它们，例如发送 10k 命令，读取回复，再发送另外 10k 命令，如此以往。这样做得到的速度几乎相同，但却最多只需要用缓存这 10k 命令回复的额外内存就可以达到几乎相同的效果。