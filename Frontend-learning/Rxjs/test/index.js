const { interval, race, of, merge, range } = require("rxjs");

const { mapTo, last, concatMap, takeLast, tap, mergeMap, retry, delay, take, mergeAll, map, catchError } = require("rxjs/operators");

let i = 0;

const source = interval(5000);
const example = source.pipe(
  tap(() => i++),
  // delay(1000),
  mergeMap((v) => range(1, 10)),
  map((val) => {
    if (!(i % 2) && val > 5) {
      return throwError("Error!");
    }
    return of(val);
  }),
  // retry(2),
  mergeAll(),
  catchError((err, c) => c)
  //retry 2 times on error
);

const subscribe = example.subscribe({
  next: (val) => console.log(val),
  error: (val) => console.log(`${val}: Retried 2 times then quit!`),
});
