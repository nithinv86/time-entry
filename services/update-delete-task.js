const { getTasksByDate } = require('./get-report');
const {
  contentTableSeparator,
  readFileSync,
  path,
  userHomeDir,
  writeFileSync,
  convertToTaskData,
} = require('./utils');
const markAllAsSynced = async (ids, date) => {
  try {
    const entries = await getTasksByDate(date, date);
    const file = readFileSync(path.join(userHomeDir, `.${date}`));
    let fileHeading = `${file.split(contentTableSeparator)[0]}\n${contentTableSeparator}`;

    for (const entry of entries) {
      if (entry) {
        const { id, project, sprint, task, date, work, duration, remarks } = entry;
        fileHeading += `\n| ${id} | ${project} | ${sprint} | ${date} | ${task} | ${work} | ${duration} | ${remarks} | true |`;
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
    const entries = await getTasksByDate(item.date, item.date);
    const file = readFileSync(path.join(userHomeDir, `.${item.date}`));
    let fileHeading = `${file.split(contentTableSeparator)[0]}\n${contentTableSeparator}`;

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
    let fileHeading = `${file.split(contentTableSeparator)[0]}\n${contentTableSeparator}`;

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

module.exports = { markAllAsSynced, updateTask, deleteTask };
