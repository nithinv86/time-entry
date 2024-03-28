const os = require('os');
const { execSync } = require('child_process');
const { appendFileSync, existsSync, readFileSync } = require('./utils');
const addBashrcEntry = (entryToAdd) => {
  const rcPath = getRcPath();
  const prefix = '### time-entry aliases ###';

  appendFileSync(rcPath, `\n${prefix}\n${entryToAdd}\n`);
  execSync(`bash -c "source ${rcPath}"`);

  console.log(`Entry "${entryToAdd}" added`);
};
const checkBashrcEntry = (entryToAdd) => {
  const rcPath = getRcPath();

  if (!existsSync(rcPath)) {
    return true;
  }

  const bashrcContent = readFileSync(rcPath);

  return bashrcContent.includes(entryToAdd);
};
const getRcPath = () => {
  let rcPath = '';

  if (process.platform === 'darwin') {
    rcPath = `${os.homedir()}/.zshrc`;
  } else if (process.platform === 'linux') {
    rcPath = `${os.homedir()}/.bashrc`;
  }

  return rcPath;
};

module.exports = { addBashrcEntry, checkBashrcEntry, getRcPath };
