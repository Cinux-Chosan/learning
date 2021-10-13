


// (async()=>{
//   ;do {
//   const options = Array.from(document.querySelectorAll('.option-text'));
//   if (options.length<=0) break;
//   options[Math.floor(Math.random()*4)].click();
//   const btn = document.querySelector('button');
//   if (!~btn.innerText.indexOf('再来一次')) btn.click();
//   await new Promise(res => setTimeout(res, 200));
//   }while(true);
//   })()


async function* ints() {
  let i = 10;
  while (i--) yield await new Promise(res => setTimeout(() => res(i), 1000));
}

const rs = new ReadableStream({
  async start(controller) {
    for await (const i of ints()) {
      controller.enqueue(i);
    }
    controller.close();
  }
})

const reader = rs.getReader();

console.log(rs.locked);

(async () => {
  while (true) {
    const { value, done } = await reader.read();
    console.log(value, done);
    if (done) break;
  }
})()