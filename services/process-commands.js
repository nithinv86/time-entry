const { checkConfig } = require('./init-config');
const { getProjects, getSprints, removeEmpty } = require('./utils');
const { getStatus, getTasksByDate } = require('./get-report');
const { logTaskHoursAndSync } = require('./log-task-hours-and-sync');
const { addNewTask } = require('./add-task');
const { getZohoTasks } = require('./get-zoho-tasks');
const { filterCalls } = require('./filter');
const { markAllAsSynced, updateTask, deleteTask } = require('./update-delete-task');
const processArgs = async (type, value) => {
  try {
    await checkConfig();

    const values = value ? removeEmpty(value?.split(' -')) : value;

    switch (type) {
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

        console.log(await getTasksByDate());

        break;
      }

      case 'filter': {
        if (values) {
          await filterCalls(values);
        }

        break;
      }

      case 'project': {
        console.log(await getProjects());

        break;
      }

      case 'delete': {
        console.log(await deleteTask(values));

        break;
      }

      case 'markAllAsSynced': {
        console.log(await markAllAsSynced(['1711633143990'], '2024-03-28'));

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
