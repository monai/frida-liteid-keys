/* eslint-disable no-console */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';

import * as frida from 'frida';

export default async function launch(agentPath, argv) {
  const pid = await frida.spawn(argv, { stdio: 'pipe' });
  console.log(`[*] Spawned pid=${pid}`);

  const session = await frida.attach(pid);
  console.log('[*] Attached:', session);
  session.detached.connect(onDetached);

  const device = await frida.getLocalDevice();
  device.output.connect(onOutput);

  const currentDirname = dirname(fileURLToPath(import.meta.url));
  const source = await readFile(resolve(currentDirname, agentPath));
  const script = await session.createScript(source);
  console.log('[*] Script created');

  const out = [];
  script.message.connect((message, data) => {
    console.log('[*] Message:', message, data);
    if (message.type === 'error') {
      console.error(message.stack);
    } else {
      out.push([message.payload, data.toString('hex')]);
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

  function onOutput(pid_, fd, data) {
    console.log(`[${pid_}][${fd}]\n ${data}`);
  }
}
