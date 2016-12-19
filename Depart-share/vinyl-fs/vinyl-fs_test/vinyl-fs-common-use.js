const vfs = require('vinyl-fs');

let outputPath = './output/';

vfs.src(['**/*.json',
  '!' + outputPath + '**/*',
  // '!package.json'
])
.pipe(vfs.dest(outputPath, {
  // cwd: 'output_tmp'
}));
