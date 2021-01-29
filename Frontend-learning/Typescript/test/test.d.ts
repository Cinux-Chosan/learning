/// <reference path="Validation.d.ts" />
/// <reference path="LettersOnlyValidator.d.ts" />
/// <reference path="ZipCodeValidator.d.ts" />
declare let strings: string[];
declare let validators: {
    [s: string]: Validation.StringValidator;
};
