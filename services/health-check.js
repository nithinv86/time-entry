/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const { execSync } = require('child_process');
const os = process.platform;
const containerName = 'mongodb';

module.exports = {
  dockerHealthCheck: async () => {
    if (os === 'darwin') {
      try {
        execSync('docker info', { stdio: 'ignore' });

        console.log('Docker is running...');
      } catch {
        console.log('Docker is not running, starting...');

        execSync('open --background -a Docker');
        setTimeout(() => {}, 5000);
      }
    } else if (os === 'linux') {
      try {
        const dockerStatus = execSync('sudo systemctl is-active docker 2>/dev/null')
          .toString()
          .trim();
        if (dockerStatus === 'active') {
          console.log('Docker is running...');
        } else {
          console.log('Docker is not running, starting...');
          execSync('sudo systemctl start docker');
          setTimeout(() => {}, 5000);
        }
      } catch {
        console.log('Error checking Docker status.');
      }
    } else if (os === 'win32') {
      console.log('You are on Windows (or Windows Subsystem for Linux - WSL).');
    } else {
      console.log('Unsupported operating system.');
    }
  },
  containerHealthCheck: async () => {
    try {
      const containerStatus = execSync(
        `sudo docker inspect -f '{{.State.Running}}' ${containerName} 2>/dev/null`,
      )
        .toString()
        .trim();
      if (containerStatus === 'true') {
        console.log(`${containerName} is running...`);
      } else {
        console.log(`${containerName} is not running, starting...`);
        execSync(`sudo docker start ${containerName}`);
        setTimeout(() => {}, 5000);
      }
    } catch {
      console.log('Error checking container status.');
    }
  },
};
