/**
 * 
 * @param {Array} modules 需要加载的模块
 * @param {Function} cb 模块加载完成之后的回调函数
 * 
 * 模拟 require.js 加载模块
 * 思想： 通过创建 script 标签并监听 onload 事件来使得回调函数在模块加载完成之后才会被调用
 */

function myRequire(modules, cb) {
  var loaded = 0
  modules.map(m => {
    var script = document.createElement('script')
    script.src = m
    script.type = 'text/javascript'
    script.onload = () => {
      loaded++
      if (loaded === modules.length) {
        cb()
      }
    }
    document.body.appendChild(script)
    return script
  })
}