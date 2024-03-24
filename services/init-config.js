import fs from 'fs';
import { filePath, rl } from './config';

const questions = [
  { key: 'name', label: 'Your name' },
  { key: 'email', label: 'email address' },
  { key: 'userId', label: 'Your id' },
  { key: 'cookie_secret', label: 'Cookie secret' },
  { key: 'zcsrf_token', label: 'Zoho csrf token' },
  { key: 'client_portal_id', label: 'Zoho client portal id' },
  { key: 'session_id', label: 'Zoho session id' },
  { key: 'za_source', label: 'Zoho source' },
  { key: 'database_host', label: 'MongoDB host' },
  { key: 'database_user', label: 'MongoDB user' },
  { key: 'database_pass', label: 'MongoDB password' },
  { key: 'database_name', label: 'MongoDB collection name' },
];
let answers = {};

module.exports = { init, getConfigDetails, checkConfig };

const init = async () => {
  console.log('%cWelcome to Zoho Time Entry CLI!', 'color:green');

  getConfigDetails(0);
};
const getConfigDetails = (index) => {
  if (!index) {
    console.log('Answer the following questions:');
  }

  if (index >= questions.length) {
    fs.writeFile(filePath, JSON.stringify(answers), (err) => {
      if (err) {
        throw err;
      }

      console.log('Thanks for your time!');
    });

    rl.close();

    return;
  }

  rl.question(`${questions[index].label} : `, (userInput) => {
    answers[questions[index].key] = userInput;

    getConfigDetails(index + 1);
  });
};
const checkConfig = async () => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('Configurations are missing');
        getConfigDetails(0);
      } else {
        // File exists, read it
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            throw err;
          }

          answers = JSON.parse(data);

          resolve();
        });
      }
    });
  });
};
