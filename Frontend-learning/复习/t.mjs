setImmediate(() => {
    console.log("immediate1"); // 始终是这个先执行
    process.nextTick(() => console.log('promise'))//.then(console.log)
});
setImmediate(() => {
    console.log("immediate2"); // 始终是这个先执行
});