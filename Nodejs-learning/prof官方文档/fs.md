# File System

> 文件 I/O 是基于 [POSIX](http://baike.baidu.com/link?url=g8KOncX8kOP4l_stJnWfhkigrU_gHvbCrfJ_yskZsuCsPhKC8My4cFwZwCtFM9F8PBJJZOWticm5inEKWN_URK "可移植性操作系统接口") 的简单封装。只需要 require('fs')就可以使用该模块。所有的方法都有 同步/异步 两种。  

> 异步方式总会把函数执行完成过后的回调函数作为该函数的最后一个参数，传入完成时的回调函数的参数因调用的函数而异，但是第一个参数始终是作为发生异常时的参数保留，如果函数成功执行完，那么第一个参数将会是 null 或者 undefined。

> 如果使用同步函数，那么如果发生异常将会立即被抛出。可以使用 try/catch 来处理异常或者允许它冒泡。
>> 异步函数举例：

        const fs = require('fs');

        fs.unlink('/tmp/hello', (err) => {
          if (err) throw err;
          console.log('successfully deleted /tmp/hello');
        });

>> 对应的同步版本：

        const fs = require('fs');

        fs.unlinkSync('/tmp/hello');
        console.log('successfully deleted /tmp/hello');

>> 对于异步函数，后面的函数可能先于前面的函数执行，所以正确的做法是使用链式回调函数。

>> 同步函数会阻塞程序后面的代码执行直到该函数返回为止。所以更建议使用异步函数。

>> 文件路径可以使用相对路径，但是该路径将相对于 process.cwd()

>> 大多数函数允许缺省回调函数。如果你那么做，nodejs将会采用一个默认的回调函数来重新抛出异常。如果要追踪该错误的原始调用处，可以设置 NODE_DEBUG 这个环境变量。如果不设置，将会提示找不到是哪里出错了，如果设置过后，会追溯并显示一连串错误信息。

## fs.FSWatcher 类
> 由 fs.watch() 返回该类的实例。

>> change 《事件》
>>> 参数：
>>>> event 《String》 ：表示文件发生了何种变化的字符串。

>>>> filename 《String》：发生改变的文件的文件名。
>>> 该事件在所监视的文件或者文件夹发生改变时触发，更多详情参考 fs.watch()。

>> error 《事件》
>>> 参数：
>>>> error 《Error》
>>> 当发生错误的时候会触发。

>> ###__watcher.close()__###
>>> 停止监视给定的 fs.FSWatcher 上的改变。

## fs.ReadStream 类
> 该类是一个可读流（readable stream）

>> open 《事件》
>>> 参数：
>>>> fd 《Number》可读流使用的文件描述符，该描述符为一个整数。
>>> 当可读流代表的文件被打开的时候会触发该事件。

>> readStream.path 《prop》
>>> 可读流读取的文件的路径。

## fs.Stats 类
> 该类的实例是由 fs.stat()，fs.lstat() 和 fs.fstat()和他们的同步方式返回的对象。
>> ##__stats.isFile()__##

>> ##__stats.isDirectory()__##

>> ##__stats.isBlockDevice()__##

>> ##__stats.isCharacterDevice()__##

>> ##__stats.isSymbolicLink()__ (only valid with fs.lstat())##

>> ##__stats.isFIFO()__##

>> ##__stats.isSocket()__##

>对于常规的文件， util.inspect(stats) 会返回一个类似如下的字符串：

        {
          dev: 2114,
          ino: 48064969,
          mode: 33188,
          nlink: 1,
          uid: 85,
          gid: 100,
          rdev: 0,
          size: 527,
          blksize: 4096,
          blocks: 8,
          atime: Mon, 10 Oct 2011 23:24:11 GMT,
          mtime: Mon, 10 Oct 2011 23:24:11 GMT,
          ctime: Mon, 10 Oct 2011 23:24:11 GMT,
          birthtime: Mon, 10 Oct 2011 23:24:11 GMT
        }

> 需要注意的是， atime, mtime, birthtime, ctime 是Date对象的实例，在比较它们值的时候需要正确的方法。大多数使用getTime()的方式将会返回从 UTC 1970年一月一日 00:00:00 到现在的毫秒数，该整数满足任何比较。然而也有可用于显示模糊信息的其他方法，更详细的信息参考 [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

> 设置时间值：
>> 在stat对象中，有如下类型的时间值：
>>> atime "Access Time" —— 文件最后通过 mknod(2)、utimes(2)、read(2) 这几个系统调用所 **进入** 或 **改变** 的时间。

>>> mtime "Modified Time" —— 文件最后通过 mknod(2)、 utimes(2)、write(2)这几个系统调用所改变的时间。































































































































。
