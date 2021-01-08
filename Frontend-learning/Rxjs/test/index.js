const { interval, of } = require("rxjs");
const { bufferCount, groupBy, mergeMap, reduce, tap, windowTime, map, mergeAll, take, audit, throttle } = require("rxjs/operators");
let i = 0;
interval(400)
  .pipe(
    throttle((ev) => {
      console.log("xxxxx" + i++, );
      return interval(1000);
    })
  )
  .subscribe(console.log);
