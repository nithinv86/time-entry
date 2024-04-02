#!/usr/bin/env node
const { init, switchDefaultProject } = require('./services/init-config');
const { processArgs } = require('./services/process-commands');
const initNpm = async () => {
  let [type, ...value] = (process.argv || []).splice(2);

  if (!type) {
    type = 'h';
  }

  if (type === 'init') {
    init();
  } else if (type === 'switch') {
    switchDefaultProject();
  } else {
    processArgs(type, value?.join(' '));
  }
};

initNpm();

module.exports = initNpm;
