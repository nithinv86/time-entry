const { getTasksByDate } = require('./get-report');
const {
  contentTableSeparator,
  readFileSync,
  path,
  userHomeDir,
  writeFileSync,
  convertToTaskData,
} = require('./utils');
const updateStatus = async (taskId, date, taskStatus = true) => {
  try {
    const entries = await getTasksByDate([`f ${date}`, `t ${date}`]);
    const file = readFileSync(path.join(userHomeDir, `.${date}`));
    let fileHeading = getFileHeading(file.split(contentTableSeparator)[0]);

    for (const entry of entries) {
      if (entry) {
        const { id, project, sprint, task, date, work, duration, remarks, status } = entry;

        fileHeading += `\n| ${id} | ${project} | ${sprint} | ${date} | ${task} | ${work} | ${duration} | ${remarks} | ${taskId === id ? taskStatus : status} |`;
      }
    }

    writeFileSync(path.join(userHomeDir, `.${date}`), fileHeading);
  } catch (error) {
    console.log(error.message);
  }
};
const updateTask = async (values) => {
  try {
    const item = await convertToTaskData(values);
    const entries = await getTasksByDate([`f ${item.date}`, `t ${item.date}`]);
    const file = readFileSync(path.join(userHomeDir, `.${item.date}`));
    let fileHeading = getFileHeading(file.split(contentTableSeparator)[0]);

    for (const entry of entries) {
      if (entry) {
        const { id, project, sprint, task, date, work, duration, remarks, synced } = entry;

        if (id === item.id) {
          fileHeading += `| ${id} | ${project} | ${sprint} | ${item.date} | ${item.task} | ${item.work} | ${item.duration} | ${item.remarks} | ${synced} |\n`;
        } else {
          fileHeading += `| ${id} | ${project} | ${sprint} | ${date} | ${task} | ${work} | ${duration} | ${remarks} | ${synced} |\n`;
        }
      }
    }

    writeFileSync(path.join(userHomeDir, `.${item.date}`), fileHeading);
  } catch (error) {
    console.log(error.message);
  }
};
const deleteTask = async (values) => {
  try {
    const item = await convertToTaskData(values);
    const entries = await getTasksByDate(item.date, item.date);
    const file = readFileSync(path.join(userHomeDir, `.${item.date}`));
    let fileHeading = getFileHeading(file.split(contentTableSeparator)[0]);

    for (const entry of entries) {
      if (entry) {
        const { id, project, sprint, task, date, work, duration, remarks, synced } = entry;

        if (id !== item.id) {
          fileHeading += `| ${id} | ${project} | ${sprint} | ${date} | ${task} | ${work} | ${duration} | ${remarks} | ${synced} |\n`;
        }
      }
    }

    writeFileSync(path.join(userHomeDir, `.${item.date}`), fileHeading);
  } catch (error) {
    console.log(error.message);
  }
};
const getFileHeading = (topHeading) => {
  const lastIndex = topHeading.lastIndexOf('\n');

  if (lastIndex !== -1) {
    topHeading = topHeading.substring(0, lastIndex) + topHeading.substring(lastIndex + 1);
  }

  return `${topHeading}\n${contentTableSeparator}\n`;
};

module.exports = { updateStatus, updateTask, deleteTask };
