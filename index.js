#!/usr/bin/env node
const { init } = require('./services/init-config');
const { processArgs } = require('./services/process-commands');
const { containerHealthCheck, dockerHealthCheck } = require('./services/health-check');
const initNpm = async () => {
  const [type, ...value] = (process.argv || []).splice(2);

  if (!type) {
    console.error('Arrgument missing...');

    process.exit(1);
    return;
  }

  if (type === 'init') {
    init();
  } else {
    await dockerHealthCheck();
    await containerHealthCheck();
    processArgs(type, value?.join(' '));
  }
};

initNpm();

module.exports = initNpm;
