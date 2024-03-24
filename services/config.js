const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const userHomeDir = os.homedir();
const filePath = path.join(userHomeDir, '.zoho-config');

module.exports = { filePath, rl, keyMap, headers, userConfig };

const userConfig = async () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonData = JSON.parse(data);

          if (!Object.values(jsonData).length) {
            throw new Error('No configurations found, try `zoho init` as first step.');
          }

          resolve(jsonData);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
};
const headers = async () => {
  const t = await userConfig();

  return {
    authority: 'externalusers.zohosprints.com',
    accept: '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7',
    'cache-control': 'no-cache',
    cookie: t.cookie_secret,
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
    'x-za-clientportalid': t.client_portal_id,
    'x-za-reqsize': 'large',
    'x-za-sessionid': t.session_id,
    'x-za-source': t.za_source,
    'x-za-ui-version': 'v2',
    'x-zcsrf-token': t.zcsrf_token,
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
