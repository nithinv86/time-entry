const axios = require('axios');
const FormData = require('form-data');
const { format, addMinutes, startOfDay } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');
const { getTasksBySynced } = require('./get-report');
const { getZohoTasks } = require('./get-zoho-tasks');
const { markAllAsSynced } = require('./update-delete-task');
const { getHeaders, getSprints, userConfig } = require('./utils');
const logTaskHoursAndSync = async (project = '139011000000148327') => {
  const [tasks, zohoTasks, activeSprint, config] = await Promise.all([
    getTasksBySynced(),
    getZohoTasks({ params: { subitem: true } }),
    getSprints({ params: { type: '2' } }),
    userConfig(),
  ]);
  const response = { success: 0, failed: 0, total: 0 };
  const taskIdByDate = {};
  const headers = await getHeaders();
  const zohoApiCalls = tasks.map((task) => {
    const zohoTask = zohoTasks.find(({ taskId }) => taskId === task.task);
    const newData = new FormData();
    const taskDate = new Date(task.date);
    const duration = format(addMinutes(startOfDay(new Date()), task.duration), 'HH:mm');

    taskDate.setHours(0, 0, 0, 0);

    const zonedDate = utcToZonedTime(taskDate, 'Asia/Kolkata');
    const date = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX");
    const parentUrl = `https://externalusers.zohosprints.com/zsapi/team/803166918/projects/${project}/sprints/${activeSprint?.[0]?.value}/item/${zohoTask?.value}/timesheet/?action=additemlog`;

    newData.append('users', config.zoho.userId);
    newData.append('duration', duration);
    newData.append('isbillable', 1);
    newData.append('date', date);
    newData.append('notes', task.remarks ? `<div>${task.remarks}</div>` : '');

    return axios.post(parentUrl, newData, { headers });
  });

  try {
    const resp = await Promise.all(zohoApiCalls);

    for (const [index, item] of Object.entries(resp)) {
      if (item.data.status === 'success') {
        response.success++;

        if (!taskIdByDate[tasks[index].date]) {
          taskIdByDate[tasks[index].date] = [];
        }

        taskIdByDate[tasks[index].date].push(tasks[index].id);
      } else {
        response.failed++;
      }
    }

    for (const [date, taskIds] of Object.entries(taskIdByDate)) {
      await markAllAsSynced(taskIds, date);
    }
  } catch (error) {
    console.log(error.message);
  }

  return response;
};

module.exports = { logTaskHoursAndSync };
