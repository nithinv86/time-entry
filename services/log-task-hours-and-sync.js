const axios = require('axios');
const { format, addMinutes, startOfDay } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const { getTasksBySynced } = require('./get-report');
const { getSprints } = require('./get-sprints');
const { getZohoTasks } = require('./get-zoho-tasks');
const { markAsSynced } = require('./mark-as-synced');
const { headers, userId } = require('./config');
const logTaskHoursAndSync = async (project = '139011000000148327') => {
  const [tasks, zohoTasks, activeSprint] = await Promise.all([
    getTasksBySynced(),
    getZohoTasks({ params: { subitem: true } }),
    getSprints({ params: { type: '2' } }),
  ]);
  const response = { success: 0, failed: 0, total: 0 };

  for (const task of tasks) {
    const zohoTask = zohoTasks.find(({ taskId }) => {
      return taskId === task.taskId;
    });
    const newData = new FormData();
    const newDate = new Date(task.date);
    const duration = format(addMinutes(startOfDay(new Date()), task.duration), 'HH:mm');

    newDate.setHours(0, 0, 0, 0);

    const zonedDate = utcToZonedTime(newDate, 'Asia/Kolkata');
    const date = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    const parentUrl = `https://externalusers.zohosprints.com/zsapi/team/803166918/projects/${project}/sprints/${activeSprint?.[0]?.value}/item/${zohoTask?.value}/timesheet/?action=additemlog`;

    newData.append('users', userId);
    newData.append('duration', duration);
    newData.append('isbillable', 1);
    newData.append('date', date);
    newData.append('notes', task.notes ? `<div>${task.notes}</div>` : '');

    try {
      const resp = await axios.post(parentUrl, newData, { headers });

      if (resp.data.status === 'success') {
        response.success++;

        await markAsSynced(task.id);
      } else {
        response.failed++;
      }
    } catch (error) {
      console.error(error.message);
      response.failed++;
    }

    response.total++;
  }

  return response;
};

module.exports = { logTaskHoursAndSync };
