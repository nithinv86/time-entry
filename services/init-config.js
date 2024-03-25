const chalk = require('chalk');
const fs = require('fs');
const { filePath, rl } = require('./config');
const questions = [
  { parent: 'user', key: 'name', label: 'Your name' },
  { parent: 'user', key: 'email', label: 'email address' },
  { parent: 'zoho', key: 'userId', label: 'Zoho id' },
  { parent: 'zoho', key: 'cookie', label: 'Cookie secret' },
  { parent: 'zoho', key: 'token', label: 'Zoho csrf token' },
  { parent: 'zoho', key: 'portalId', label: 'Zoho client portal id' },
  { parent: 'zoho', key: 'sessionId', label: 'Zoho session id' },
  { parent: 'zoho', key: 'source', label: 'Zoho source' },
  { parent: 'db', key: 'host', label: 'MongoDB host' },
  { parent: 'db', key: 'user', label: 'MongoDB user' },
  { parent: 'db', key: 'password', label: 'MongoDB password' },
  { parent: 'db', key: 'name', label: 'MongoDB database name' },
  { parent: 'db', key: 'collection', label: 'MongoDB collection name' },
];
let answers = { user: {}, zoho: {}, db: {} };
const init = async () => {
  console.log(
    chalk.blueBright.bold('Welcome to Nithin Time Entry CLI app! ... '),
    chalk.blue('⏳ '),
  );

  getConfigDetails(0);
};
const getConfigDetails = (index) => {
  if (!index) {
    console.log(chalk.yellow('Please respond to the following configuration inquiries.'));
  }

  if (index >= questions.length) {
    fs.writeFile(filePath, JSON.stringify(answers), (err) => {
      if (err) {
        throw err;
      }

      console.log(chalk.yellow('Thanks for your time!'), chalk.blue('⏳ '));
    });

    rl.close();

    return;
  }

  const { parent, key, label } = questions[index];

  rl.question(`${label}: `, (userInput) => {
    answers[parent][key] = userInput;

    getConfigDetails(index + 1);
  });
};
const checkConfig = async () => {
  return new Promise((resolve) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log(chalk.red('Configurations are missing'));
        getConfigDetails(0);
      } else {
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

module.exports = { init, getConfigDetails, checkConfig };
