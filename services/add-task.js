const path = require('path');
const {
  contentTableHeading,
  contentTableSeparator,
  convertToTaskData,
  readFileSync,
  accessFileSync,
  writeFileSync,
  userHomeDir,
  appendFileSync,
} = require('./utils');
const checkDateEntry = async (date, entryContent) => {
  const isExists = { file: false, entry: false };

  try {
    if (accessFileSync(path.join(userHomeDir, `.${date}`))) {
      const entries = readFileSync(path.join(userHomeDir, `.${date}`));

      isExists.file = entries.includes(`### ${date}`);
      isExists.entry = entries.includes(entryContent);
    }

    return isExists;
  } catch {
    return isExists;
  }
};
const addNewTask = async (values) => {
  const { project, sprint, task, date, work, duration, remarks } = await convertToTaskData(values);

  try {
    const entryHeading = `---\ntags: [Time entry task]\ntitle: ${date}\ncreated: ${new Date().toISOString()}\n---\n\n### ${date}\n${contentTableHeading}\n${contentTableSeparator}`;
    const entryContent = `\n| ${new Date().getTime()} | ${project} | ${sprint} | ${date} | ${task} | ${work} | ${duration} | ${remarks} | false |`;
    const isExists = await checkDateEntry(date, entryContent);

    if (isExists.file && isExists.entry) {
      console.log('Same entry already exists');
    } else if (isExists.file && !isExists.entry) {
      console.log('New entry added');
      appendFileSync(path.join(userHomeDir, `.${date}`), `${entryContent}`);
    } else {
      console.log('New entry added');
      writeFileSync(path.join(userHomeDir, `.${date}`), `${entryHeading}${entryContent}`);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addNewTask };
