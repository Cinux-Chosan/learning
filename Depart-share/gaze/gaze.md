# [Gaze](https://github.com/Cinux-Chosan/learning/blob/master/Projects%E6%9E%84%E5%BB%BA-learning/gulp/gaze.md)

由其它 watch 库最好的部分组成的 glob fs.watch 封装模块

## 使用

安装模块： `npm i gaze`或者通过修改 package.json然后运行 `npm i`

```javascript
var gaze = require('gaze');

// Watch all .js files/dirs in process.cwd()
gaze('**/*.js', function(err, watcher) {
  // Files have all started watching
  // watcher === this

  // Get all watched files
  var watched = this.watched();

  // On file changed
  this.on('changed', function(filepath) {
    console.log(filepath + ' was changed');
  });

  // On file added
  this.on('added', function(filepath) {
    console.log(filepath + ' was added');
  });

  // On file deleted
  this.on('deleted', function(filepath) {
    console.log(filepath + ' was deleted');
  });

  // On changed/added/deleted
  this.on('all', function(event, filepath) {
    console.log(filepath + ' was ' + event);
  });

  // Get watched files with relative paths
  var files = this.relative();
});

// Also accepts an array of patterns
gaze(['stylesheets/*.css', 'images/**/*.png'], function() {
  // Add more patterns later to be watched
  this.add(['js/*.js']);
});
```

### Alternate Interface

```javascripts
var Gaze = require('gaze').Gaze;

var gaze = new Gaze('**/*');

// Files have all started watching
gaze.on('ready', function(watcher) { });

// A file has been added/changed/deleted has occurred
gaze.on('all', function(event, filepath) { });
```

### Error

```javascripts
gaze('**/*', function(error, watcher) {
  if (error) {
    // Handle error if it occurred while starting up
  }
});

// Or with the alternative interface
var gaze = new Gaze();
gaze.on('error', function(error) {
  // Handle error here
});
gaze.add('**/*');
```
