const fs = require('fs/promises');
const path = require('path');
const frida = require('frida');

module.exports = launch;

async function launch(argv) {
  const pid = await frida.spawn(argv, { stdio: 'pipe' });
  console.log(`[*] Spawned pid=${pid}`);

  const session = await frida.attach(pid);
  console.log('[*] Attached:', session);
  session.detached.connect(onDetached);

  const device = await frida.getLocalDevice();
  device.output.connect(onOutput);

  const source = await fs.readFile(path.resolve(__dirname, 'script.js'));
  const script = await session.createScript(source);
  console.log('[*] Script created');

  const out = [];
  script.message.connect((message, data) => {
    console.log('[*] Message:', message, data);
    if (message.type === 'error') {
      console.error(message.stack);
    } else if (message.payload === 'c') {
      out.push([data.readUInt32BE()]);
    } else {
      out[out.length - 1].push(data.toString('hex'));
    }
  });
  await script.load();
  console.log('[*] Script loaded');

  await frida.resume(pid);
  console.log('[*] Resumed');

  function onDetached(reason) {
    console.log(`[*] onDetached(reason=${reason})`);
    console.log(out);
    device.output.disconnect(onOutput);
  }

  function onOutput(pid, fd, data) {
    console.log(`[${pid}][${fd}]\n ${data}`);
  }
}
