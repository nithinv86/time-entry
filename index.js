#!/usr/bin/env node
const { init, switchDefaultProject } = require('./services/init-config');
const { processArgs } = require('./services/process-commands');
const initNpm = async () => {
  const [type, ...value] = (process.argv || []).splice(2);

  if (!type) {
    console.error('Arrgument missing...');

    process.exit(1);
    return;
  }

  if (type === 'init') {
    init();
  } else if (type === 'switch project') {
    switchDefaultProject();
  } else {
    processArgs(type, value?.join(' '));
  }
};

initNpm();

module.exports = initNpm;
