const gaze = require('gaze');

let g = gaze('*.json', (err, watcher) => {
  let watched = watcher.watched();
  console.log(watched);
  // console.log(this.watched);    // undefined  // question: why this.watched is undefined

  watcher.on('changed', path => {
    console.log(path + ' was changed !');
  });

  watcher.on('added', path => {
    console.log(path + ' was added !');
  });

  watcher.on('deleted', path => {
    console.log(path + ' was deleted !');
  });

  watcher.on('all', (event, path) => {
    console.log(path + ' was ' + event);
  });

  let files = watcher.relative();
});

// // Also accepts an array of patterns
// gaze(['stylesheets/*.css', 'images/**/*.png'], function() {
//   // Add more patterns later to be watched
//   this.add(['js/*.js']);
// });
//

// g.on('ready', watcher => {
//   console.log(watcher.watched());
// });
