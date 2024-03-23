#!/usr/bin/env node
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const [type, ...value] = process.argv?.splice(2);
const { addTask } = require('./services/add-task');
const { format } = require('date-fns');
const { getReport } = require('./services/get-report');
const { logTaskHoursAndSync } = require('./services/log-task-hours-and-sync');
const { updateAdhocOrTask } = require('./services/update');
const { getSprints } = require('./services/get-sprints');
const { getZohoTasks } = require('./services/get-zoho-tasks');
const { getTask } = require('./services/get-task');
const { filePath, rl } = require('./services/config');
const { removeEmpty } = require('./services/utils');
const { dockerHealthCheck, containerHealthCheck } = require('./services/health-check');
const fs = require('fs');
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

if (!type) {
  console.error('Arrgument missing...');

  return;
}

if (type === 'init') {
  init();
} else {
  processArgs(type, value?.join(' '));
}

async function init() {
  console.log('Welcome to Zoho Time Entry CLI!');

  getConfigDetails(0);
}

function getConfigDetails(index) {
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
}

async function checkConfig() {
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
}

async function processArgs(type, value) {
  checkConfig(processArgs).then(async () => {
    const values = value ? removeEmpty(value?.split(' -')) : value;

    switch (type) {
      case 'health': {
        await dockerHealthCheck();
        await containerHealthCheck();

        break;
      }

      case 'status': {
        await getStatus(values);

        break;
      }

      case 'zoho': {
        console.log(await logTaskHoursAndSync());

        break;
      }

      case 'add': {
        await addNewTask(values);

        break;
      }

      case 'update': {
        await updateTask(values);

        break;
      }

      case 'sprints': {
        const params = {};

        if (values && values.includes('-a')) {
          params.type = '2';
        }

        console.log(await getSprints({ params }));

        break;
      }

      case 'tasks': {
        const params = {};

        if (!(values || values.includes('-a'))) {
          params.filterUser = true;
        }

        console.log(await getZohoTasks({ params }));

        break;
      }

      case 'entries': {
        const params = {};

        if (values && values.includes('-a')) {
          params.all = true;
        }

        console.log(await getTask({ params }));

        break;
      }

      default: {
        console.error('Arrgument missing.');

        return;
      }
    }

    process.exit(1);
  });
}

async function getStatus(values) {
  const data = {};
  const keyMap = {
    f: 'from',
    from: 'from',
    t: 'to',
    to: 'to',
  };

  if (values?.length) {
    for (const item of values) {
      let [key, ...itemValues] = item.split(' ');
      const itemValue = itemValues.join(' ');

      if (key.charAt(0) === '-') {
        key = key.substring(1);
      }

      data[keyMap[key]] = format(new Date(itemValue), 'yyyy-MM-dd');
    }
  } else {
    data.from = format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
    data.to = format(new Date(), 'yyyy-MM-dd');
  }

  console.log(await getReport(data.from, data.to));
}

async function addNewTask(values) {
  const data = {};
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
  };

  for (const item of values) {
    let [key, ...itemValues] = item.split(' ');
    let itemValue = itemValues.join(' ');

    if (key.charAt(0) === '-') {
      key = key.substring(1);
    }

    switch (key) {
      case 's':
      case 'sprint': {
        if (!itemValue.includes('sprint')) {
          itemValue = `sprint ${itemValue}`;
        }

        data[keyMap[key]] = itemValue;

        break;
      }

      case 'dt':
      case 'date': {
        data[keyMap[key]] = new Date(itemValue).toISOString();

        break;
      }

      case 'du':
      case 'duration': {
        data[keyMap[key]] = +itemValue;

        break;
      }

      default: {
        data[keyMap[key]] = itemValue;

        break;
      }
    }
  }

  await addTask(data);
}

async function updateTask(values) {
  const data = {};
  let id = '';

  for (const item of values) {
    let [key, ...itemValues] = item.split(' ');
    const itemValue = itemValues.join(' ');

    if (key.charAt(0) === '-') {
      key = key.substring(1);
    }

    switch (key) {
      case 'id': {
        id = itemValue;

        break;
      }

      case 'p':
      case 'project': {
        data.project = itemValue || 'Portal';

        break;
      }

      case 's':
      case 'sprint': {
        if (itemValues?.length > 1) {
          data.sprint = itemValue;
        } else {
          data.sprint = `sprint ${itemValue}`;
        }

        break;
      }

      case 't':
      case 'taskId': {
        data.taskId = itemValue;

        break;
      }

      case 'd':
      case 'date': {
        data.date = format(new Date(itemValue), 'yyyy-MM-dd');

        break;
      }

      case 'i':
      case 'item': {
        data.workType = itemValue;

        break;
      }

      case 'dur':
      case 'duration': {
        data.duration = itemValue;

        break;
      }

      case 'n':
      case 'notes': {
        data.notes = itemValue;

        break;
      }
    }
  }

  console.log(await updateAdhocOrTask(id, data));
}
