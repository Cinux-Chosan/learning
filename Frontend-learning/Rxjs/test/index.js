function bindCallback(fn) {
  return function(...args) {
    return {
      subscribe: fn.bind(this, ...args) 
    };
  };
}

const fn = function(name, callback) {
  setTimeout(() => {
    callback(`My name is ${name}`);
  }, 600);
};
const bound = bindCallback(fn);
bound('Chosan').subscribe(console.log)
