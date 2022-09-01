#!/usr/bin/env node

const launch = require('../lib/liteid_2012/launch');

launch(process.argv.slice(2))
  .catch(e => {
    console.error(e);
  });
