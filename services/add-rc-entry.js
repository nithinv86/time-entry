const fs = require('fs');
const os = require('os');
const { execSync } = require('child_process');
const addBashrcEntry = (entryToAdd) => {
  const rcPath = getRcPath();
  const prefix = '### time-tracker aliases ###';

  fs.appendFileSync(rcPath, `\n${prefix}\n${entryToAdd}\n`);
  execSync(`bash -c "source ${rcPath}"`);

  console.log(`Entry "${entryToAdd}" added`);
};
const checkBashrcEntry = (entryToAdd) => {
  const rcPath = getRcPath();

  if (!fs.existsSync(rcPath)) {
    return true;
  }

  const bashrcContent = fs.readFileSync(rcPath, 'utf8');

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
