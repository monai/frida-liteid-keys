#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-console */

import launch from '../lib/launch.mjs';

launch('../lib/liteid_2021_pkcs11.cjs', process.argv.slice(2))
  .catch((e) => {
    console.error(e);
  });
