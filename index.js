#!/usr/bin/env node

const { init } = require('./services/init-config');
const { processArgs } = require('./services/process-commands');

const [type, ...value] = (process.argv || []).splice(2);

if (!type) {
  console.error('Arrgument missing...');

  return;
}

if (type === 'init') {
  init();
} else {
  processArgs(type, value?.join(' '));
}
