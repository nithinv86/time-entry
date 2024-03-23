/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const processOs = process.platform;
const currentPath = process.cwd();
const entryToAdd = `alias time='${currentPath}/services/command.js'`;

function getRcPath() {
  let rcPath = '';

  if (processOs === 'darwin') {
    rcPath = `${os.homedir()}/.zshrc`;
  } else if (processOs === 'linux') {
    rcPath = `${os.homedir()}/.bashrc`;
  }

  return rcPath;
}

module.exports = {
  checkBashrcEntry: () => {
    const rcPath = getRcPath();

    if (!fs.existsSync(rcPath)) {
      return true;
    }

    const bashrcContent = fs.readFileSync(rcPath, 'utf8');

    return bashrcContent.includes(entryToAdd);
  },
  addBashrcEntry: () => {
    const rcPath = getRcPath();
    const prefix = '### time-tracker aliases ###';

    fs.appendFileSync(rcPath, `\n${prefix}\n${entryToAdd}\n`);
    execSync(`bash -c "source ${rcPath}"`);

    console.log(`Entry "${entryToAdd}" added`);
  },
};
