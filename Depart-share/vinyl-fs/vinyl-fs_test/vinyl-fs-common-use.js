const vfs = require('vinyl-fs'),
  map = require('map-stream');

let outputPath = './output/';

vfs.src(['**/*.json',
  '!' + outputPath + '**/*',
  // '!package.json'
])
.pipe(map((file, cb) => {
  console.log(file.contents.toString());
  cb(null, file);
}))
.pipe(vfs.dest(outputPath, {
  // cwd: 'output_tmp'
}))
.pipe(vfs.symlink(outputPath + "symlinks", {
  relative: true
}));
