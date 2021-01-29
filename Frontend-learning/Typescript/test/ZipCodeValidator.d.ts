/// <reference path="Validation.d.ts" />
declare namespace Validation {
    class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string): boolean;
    }
}
