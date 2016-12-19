const glob = require('glob');

let str_glob =
  // "**/*.js",
  // "**/*.node",    // 无法找到匹配文件，如果设置了 nonull 则返回该模式，否则返回空数组
  // "*.{js,json}",
  "**/+(*.json|*.js|*.md)",
  // "**/.*",
  options = {
    // nonull: true,  // 如果为 true,则在没有匹配到文件的情况下，返回模式，否则返回空数组
    // dot: true,  // 如果为 true,则将 . 视为一般字符，否则除非模式以 . 开头才能匹配文件名以 . 开头的文件
    // matchBase: true,  // 如果为 true,并且模式中没有 / ,则等同于 **
    // cwd: "../",  // 默认为 process.cwd()
    // nocase: true,  // 匹配不区分大小写
    // noext: true,  // 关闭 extglob模式，即 +(a|b) 这种模式
    // nodir: true,  // 不匹配文件夹, 仅匹配文件, 如果需要匹配文件夹, 在模式后面加上 / 即可
    // absolute: true  // 返回匹配文件的绝对路径
  };

glob(str_glob, options, (err, files) => {
  console.log(files);
});

console.log(glob.hasMagic(str_glob, options));
