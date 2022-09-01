#!/usr/bin/env node
/* eslint-disable node/shebang */
/* eslint-disable no-console */

import launch from '../cmd/liteid_2012.mjs';

launch(process.argv.slice(2))
  .catch((e) => {
    console.error(e);
  });
