#!/usr/bin/env node

const { checkBashrcEntry, addBashrcEntry } = require('./services/add-rc-entry.js');

function createAliases() {
  const aliases = [{ alias: 'ntime', target: `${process.cwd()}/index.js` }];

  for (const { alias, target } of aliases) {
    const aliasCommand = `alias ${alias}='${target}'`;

    if (!checkBashrcEntry(aliasCommand)) {
      addBashrcEntry(aliasCommand);
    }
  }
}

createAliases();
