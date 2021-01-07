const { empty, interval, of } = require("rxjs");
const { startWith, mergeMap } = require("rxjs/operators");

interval(1000)
  .pipe(mergeMap((x) => (x % 2 === 1 ? of("a", "b", "c") : empty())))
  .subscribe((x) => console.log(x));
