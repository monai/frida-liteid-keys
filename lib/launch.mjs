/* eslint-disable no-console */
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';

import * as frida from 'frida';
import minimist from 'minimist';

export default async function launch(agentPath, argv) {
  const args = minimist(argv);

  let targetProcess;
  if (args.n) {
    targetProcess = args.n;
  } else {
    console.log(`[*] Spawn argv=${argv}`);
    targetProcess = await frida.spawn(argv, { stdio: 'pipe' });
    console.log(`[*] Spawned pid=${targetProcess}`);
  }

  const session = await frida.attach(targetProcess);
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
    const hex = data?.toString('hex');

    console.log('[*] Message:', message, hex);
    if (message.type === 'error') {
      console.error(message.stack);
    } else {
      out.push([message.payload, hex]);
    }
  });
  await script.load();
  console.log('[*] Script loaded');

  await frida.resume(targetProcess);
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
