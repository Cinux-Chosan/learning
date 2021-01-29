/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// import * as fs from "fs";

// Some samples to try
let strings = ["Hello", "98052", "101"];

import x = Validation.StringValidator;
var y = Validation.ZipCodeValidator;
// var z = fs.readFile;
// console.log(fs.readFile, z);

// Validators to use
let validators: { [s: string]: x } = {};
validators["ZIP code"] = new y();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
  for (let name in validators) {
    console.log(`"${s}" - ${validators[name].isAcceptable(s) ? "matches" : "does not match"} ${name}`);
  }
}
