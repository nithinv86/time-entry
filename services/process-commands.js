const { checkConfig } = require('./init-config');
const { removeEmpty } = require('./utils');
const { getStatus, getTasksByDate } = require('./get-report');
const { logTaskHoursAndSync } = require('./log-task-hours-and-sync');
const { addNewTask } = require('./add-task');
const { updateTask, deleteTask } = require('./update-delete-task');
const { getGitlabActivities } = require('./get-gitlab-activities');
const processArgs = async (type, value) => {
  try {
    await checkConfig();

    const values = value ? removeEmpty(value?.split(' -')) : value;

    switch (type) {
      case 'add': {
        await addNewTask(values);

        break;
      }

      case 'update': {
        await updateTask(values);

        break;
      }

      case 'delete': {
        console.log(await deleteTask(values));

        break;
      }

      case 'status': {
        await getStatus(values);

        break;
      }

      case 'entries': {
        console.table(await getTasksByDate(values));

        break;
      }

      case 'zoho': {
        console.log(await logTaskHoursAndSync(''));

        break;
      }

      case 'gitlab': {
        await getGitlabActivities(values);

        break;
      }

      case 'v':
      case 'version': {
        const path = require('path');
        const packageJson = require(path.resolve(__dirname, '../package.json'));
        const packageVersion = packageJson.version;

        console.log('Package version:', packageVersion);

        break;
      }

      case 'h':
      case 'help': {
        console.log(`usage: timectl \t[version] [help] [init] [switch]
        \t[add] [update] [delete] [status] [entries] [zoho]\n`);
        console.log(`Below are common Time Entry commands utilized in various scenarios:\n
Start a time entry:
  init \t\t: Initialize and input necessary information.
  switch \t: Switch between the default projects.

Work on the Current Change:
  add \t\t: Add your time details.
  update \t: Update existing time details.
  delete \t: Remove existing time details.

Examine the History:
  entries \t: View each time entry's details by date.
  status \t: View daily status of time entries.
  zoho \t\t: Update time entries remotely.

Running 'timectl help' will list available subcommands and provide some conceptual guides.`);
        break;
      }

      default: {
        console.error(`timectl: '${type}' is not a timectl command. See 'timectl -help'.`);

        return;
      }
    }
  } catch (error) {
    console.log(error);
  }

  process.exit(1);
};

module.exports = { processArgs };
