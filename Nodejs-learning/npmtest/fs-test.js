const buf = new Buffer('buffer');
for (var value in buf.values()) {
  console.log(value);
}
// prints:
//   98
//   117
//   102
//   102
//   101
//   114

for (var value in buf) {
  console.log(value);
}
// prints:
//   98
//   117
//   102
//   102
//   101
//   114