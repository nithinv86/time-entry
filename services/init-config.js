const chalk = require('chalk');
const {
  accessFileSync,
  filePath,
  getProjects,
  readFileSync,
  rl,
  writeFileSync,
  existsSync,
  userHomeDir,
  mkdirSync,
} = require('./utils');
const { getToken } = require('./get-gitlab-activities');
const questions = [
  { parent: 'user', type: 'input', key: 'name', label: 'Your name' },
  { parent: 'user', type: 'input', key: 'email', label: 'email address' },
  { parent: 'zoho', type: 'input', key: 'userId', label: 'Zoho id' },
  { parent: 'zoho', type: 'input', key: 'cookie', label: 'Cookie secret' },
  { parent: 'zoho', type: 'input', key: 'token', label: 'Zoho csrf token' },
  { parent: 'zoho', type: 'input', key: 'portalId', label: 'Zoho client portal id' },
  { parent: 'zoho', type: 'input', key: 'sessionId', label: 'Zoho session id' },
  { parent: 'zoho', type: 'input', key: 'source', label: 'Zoho source' },
  { parent: 'gitlab', type: 'input', key: 'url', label: 'Personal Gitlab URL' },
  { parent: 'gitlab', type: 'input', key: 'userId', label: 'Gitlab user Id' },
  { parent: 'gitlab', type: 'input', key: 'password', label: 'Gitlab password' },
  { parent: 'project', type: 'select', key: 'default', label: 'Choose default project' },
];
let userConfig = { user: {}, zoho: {}, gitlab: {} };
const init = async () => {
  console.log(
    chalk.blueBright.bold("Welcome to Nithin's Time Entry CLI app! ... "),
    chalk.blue('⏳ '),
  );

  if (!existsSync(userHomeDir)) {
    mkdirSync();
  }

  getConfigDetails(0);
};
const getConfigDetails = async (index) => {
  if (!index) {
    console.log(chalk.yellow('Please respond to the following configuration inquiries.'));
  }

  const { parent, key, label } = questions[index];

  if (parent === 'project') {
    writeFileSync(filePath, JSON.stringify(userConfig));
    switchDefaultProject(userConfig);
  } else {
    rl.question(`${label}: `, async (userInput) => {
      if (parent === 'gitlab' && key === 'password') {
        userConfig[parent][key] = btoa(userInput);
        userConfig[parent].token = await getToken(userConfig[parent]);
      } else {
        userConfig[parent][key] = userInput;
      }

      getConfigDetails(index + 1);
    });
  }
};
const checkConfig = async () => {
  return new Promise((resolve) => {
    const test = accessFileSync(filePath);

    if (test) {
      const data = readFileSync(filePath);

      userConfig = JSON.parse(data);

      resolve(userConfig);
    } else {
      console.log(chalk.red('Configurations are missing'));
      getConfigDetails(0);
    }
  });
};
const switchDefaultProject = async () => {
  let projects;

  if (Object.values(userConfig?.zoho).length) {
    projects = await getProjects(userConfig);
  } else {
    [projects, userConfig] = await Promise.all([getProjects(), checkConfig()]);
  }

  console.log('Select a project from below list.');

  for (const [index, project] of Object.entries(projects)) {
    console.log(`${+index + 1}. ${project.label}`);
  }

  rl.question('Enter project index: ', (userInput) => {
    userConfig.project = { default: projects[+userInput - 1] };

    writeFileSync(filePath, JSON.stringify(userConfig));
    console.log(chalk.yellow('Thanks for your time!'), chalk.blue('⏳ '));
    rl.close();
  });
};

module.exports = { init, checkConfig, switchDefaultProject };
