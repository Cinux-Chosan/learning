const Orchestrator = require('orchestrator');

let orchestrator = new Orchestrator();

orchestrator.add('task1', () => {
  console.log('task1');
});

orchestrator.add('task2', ['task3'], (cb) => {
  console.log('task2');
});

orchestrator.add('task3', (
  // cb    //question: 有cb 与无 cb 的差别
  setImmediate(() => {
    console.log('task3');
    // cb();   //question: 调用与不调用的差别
  });
});

orchestrator.start('task2', 'task1', 'task3', () => {
  console.log('over');
});
