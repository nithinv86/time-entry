const chalk = require('chalk');
const { filePath, rl } = require('./config');
const { writeFileSync, accessFile, readFileSync } = require('./utils');
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
    chalk.blueBright.bold("Welcome to Nithin's Time Entry CLI app! ... "),
    chalk.blue('⏳ '),
  );

  getConfigDetails(0);
};
const getConfigDetails = (index) => {
  if (!index) {
    console.log(chalk.yellow('Please respond to the following configuration inquiries.'));
  }

  if (index >= questions.length) {
    writeFileSync(filePath, JSON.stringify(answers));
    console.log(chalk.yellow('Thanks for your time!'), chalk.blue('⏳ '));
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
    accessFile(filePath, (err) => {
      if (err) {
        console.log(chalk.red('Configurations are missing'));
        getConfigDetails(0);
      } else {
        const data = readFileSync(filePath);

        answers = JSON.parse(data);

        resolve(answers);
      }
    });
  });
};

module.exports = { init, getConfigDetails, checkConfig };
