import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';
import launch from '../lib/launch.mjs';

export default async function main(argv) {
  const currentDirname = dirname(fileURLToPath(import.meta.url));
  const source = await readFile(resolve(currentDirname, '../lib/liteid_2012.cjs'));

  return launch(source, argv);
}
