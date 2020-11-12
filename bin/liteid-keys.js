#!/usr/bin/env node

const launch = require('../lib/launch');

launch(process.argv.slice(2))
  .catch(e => {
    console.error(e);
  });
