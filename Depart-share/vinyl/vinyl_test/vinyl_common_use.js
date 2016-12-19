const vinyl = require("vinyl");
let file = new vinyl({
  // cwd: './',
  path: 'C:/Users/Chosan/Desktop/learning/Depart-share/vinyl/vinyl_test/package.json'
});

setTimeout(() => {
  console.info(file.isDirectory());
  console.info(file.path);
  console.info(file.contents);
}, 2000);
