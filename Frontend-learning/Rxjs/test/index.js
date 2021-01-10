const { of, interval, concat } = require("rxjs");
const { mergeMap, map, mergeAll } = require('rxjs/operators')
const letters = of('a', 'b', 'c');
// const result = letters.pipe(
//   mergeMap(x => interval(1000).pipe(map(i => x + i))),
// );
// result.subscribe(x => console.log(x));

concat([1, 2, 3])
  .subscribe(console.log)
