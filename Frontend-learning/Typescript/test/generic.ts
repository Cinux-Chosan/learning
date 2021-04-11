

interface Data {
  [k:string]:any
}

abstract class Model {
  static fromJson(o: Data) {}
}

const someList = [];

function replaceModelItem<T extends Model, K extends keyof T>(t:T, k: K) {
  // if (!(t instanceof Model)) {
  //   t = ;
  // }
  // const index = someList.indexOf(t);
  // someList[index] = t;
}