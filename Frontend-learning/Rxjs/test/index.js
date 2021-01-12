const { of } = require("rxjs");
const { filter, toArray } = require("rxjs/operators");

of(0)
  .pipe(
    filter((v) => !!v),
    toArray()
  )
  .subscribe(console.log);
