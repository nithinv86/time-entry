const { checkConfig } = require('./init-config');
const { dockerHealthCheck, containerHealthCheck } = require('./health-check');
const { removeEmpty } = require('./utils');
const { getStatus, getTasksByDate } = require('./get-report');
const { logTaskHoursAndSync } = require('./log-task-hours-and-sync');
const { addNewTask } = require('./add-task');
const { updateTaskDetails } = require('./update');
const { getSprints } = require('./get-sprints');
const { getZohoTasks } = require('./get-zoho-tasks');
const processArgs = async (type, value) => {
  try {
    await checkConfig();

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
        await updateTaskDetails(values);

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

        console.log(await getTasksByDate());

        break;
      }

      default: {
        console.error('Arrgument missing.');

        return;
      }
    }
  } catch (error) {
    console.log(error);
  }

  process.exit(1);
};

module.exports = { processArgs };
