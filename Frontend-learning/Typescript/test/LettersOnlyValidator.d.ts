/// <reference path="Validation.d.ts" />
declare namespace Validation {
    class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string): boolean;
    }
}
