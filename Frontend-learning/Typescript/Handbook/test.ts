interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function Counter() {
  return "123";
}

Counter.interval = 1;
Counter.reset = () => {};
Counter.x = () => {};

Counter.x();
