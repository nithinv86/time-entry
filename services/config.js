/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const os = require('os');
const fs = require('fs');
const path = require('path');
const userHomeDir = os.homedir();
const filePath = path.join(userHomeDir, '.zoho-config');
const dotenv = require('dotenv').config({ path: filePath });
const readline = require('readline');

module.exports = {
  filePath,
  rl: readline.createInterface({ input: process.stdin, output: process.stdout }),
  headers: {
    authority: 'externalusers.zohosprints.com',
    accept: '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,ml;q=0.7',
    'cache-control': 'no-cache',
    cookie: process.env.COOKIE_SECRET,
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
    'x-za-clientportalid': process.env.CLIENT_PORTAL_ID,
    'x-za-reqsize': 'large',
    'x-za-sessionid': process.env.SESSION_ID,
    'x-za-source': process.env.ZA_SOURCE,
    'x-za-ui-version': 'v2',
    'x-zcsrf-token': process.env.ZCSRF_TOKEN,
  },
  userConfig: async () => {
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
  },
};
