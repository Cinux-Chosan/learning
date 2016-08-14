# 客户端检测

>> 尽量使用typeof 进行能力检测，

                    function isSortable(obj) {
                      return typeof obj.sort == "function";
                    }
>> IE中大多数验证方式都比较怪异，与其他浏览器不同，所以具体参看《javascript高级程序设计》P219

> 关于代理检测部分，实际需要的时候，参考《javascript高级程序设计》第九章，P217
