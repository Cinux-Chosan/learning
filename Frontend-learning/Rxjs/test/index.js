const { interval, of } = require("rxjs");
const { bufferCount, groupBy, mergeMap, reduce, tap } = require('rxjs/operators')

of(
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Parcel' },
  { id: 2, name: 'webpack' },
  { id: 1, name: 'TypeScript' },
  { id: 3, name: 'TSLint' }
).pipe(
  groupBy(p => p.id),
  tap(console.log),
  mergeMap((group$) => group$.pipe(reduce((acc, cur) => [...acc, cur], []))),
)
  .subscribe(p => console.log(p));