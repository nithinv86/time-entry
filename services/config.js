const os = require('os');
const path = require('path');
const readline = require('readline');
const { readFileSync } = require('./utils');
const userHomeDir = os.homedir();
const filePath = path.join(userHomeDir, '.zoho-config');
const userConfig = async () => {
  return new Promise((resolve, reject) => {
    try {
      const data = readFileSync(filePath);
      const jsonData = JSON.parse(data);

      if (!Object.values(jsonData).length) {
        throw new Error('No configurations found, try `zoho init` as first step.');
      }

      resolve(jsonData);
    } catch (parseError) {
      reject(parseError);
    }
  });
};
const getHeaders = async () => {
  const { zoho } = await userConfig();

  return {
    authority: 'externalusers.zohosprints.com',
    accept: '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7',
    'cache-control': 'no-cache',
    cookie: zoho.cookie,
    pragma: 'no-cache',
    referer: 'https://externalusers.zohosprints.com/workspace/4medica/client/wmoku',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
    'x-za-clientportalid': zoho.portalId,
    'x-za-reqsize': 'large',
    'x-za-sessionid': zoho.sessionId,
    'x-za-source': zoho.source,
    'x-za-ui-version': 'v2',
    'x-zcsrf-token': zoho.token,
  };
};
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const keyMap = {
  p: 'project',
  project: 'project',
  s: 'sprint',
  sprint: 'sprint',
  t: 'task',
  task: 'task',
  dt: 'date',
  date: 'date',
  w: 'work',
  work: 'work',
  du: 'duration',
  duration: 'duration',
  r: 'remarks',
  remarks: 'remarks',
  id: 'id',
};

module.exports = { filePath, rl, keyMap, getHeaders, userConfig };
