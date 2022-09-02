#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-console */

import launch from '../lib/launch.mjs';

launch('../lib/agents/liteid_2012.cjs', process.argv.slice(2))
  .catch((e) => {
    console.error(e);
  });
