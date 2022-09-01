#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-console */

import launch from '../lib/liteid_2012/launch.mjs';

launch(process.argv.slice(2))
  .catch((e) => {
    console.error(e);
  });
