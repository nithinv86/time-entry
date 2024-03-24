import { checkConfig } from './init-config';
import { dockerHealthCheck, containerHealthCheck } from './health-check';
import { removeEmpty } from './utils';
import { getStatus, getTasksByDate } from './get-report';
import { logTaskHoursAndSync } from './log-task-hours-and-sync';
import { addNewTask } from './add-task';
import { updateTaskDetails } from './update';
import { getSprints } from './get-sprints';
import { getZohoTasks } from './get-zoho-tasks';

module.exports = { processArgs };

const processArgs = async (type, value) => {
  checkConfig().then(async () => {
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

    process.exit(1);
  });
};
