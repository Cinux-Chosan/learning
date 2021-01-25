declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number'
let x = f(true);
//  ^ = let x: string | number
