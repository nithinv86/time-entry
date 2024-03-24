#!/usr/bin/env node

import { init } from './services/init-config';
import { processArgs } from './services/process-commands';

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
