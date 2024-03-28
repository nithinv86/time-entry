const {
  contentTableHeading,
  contentTableSeparator,
  path,
  readFileSync,
  userHomeDir,
  removeEmpty,
} = require('./utils');
const getTasksByDate = async (from, to) => {
  try {
    if (!from) {
      from = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
    }

    if (!to) {
      to = new Date();
    }

    let data = [];
    let startDate = new Date(from);
    const itemHeading = contentTableHeading.split('|').reduce((acc, val) => {
      const item = val.trim();
      if (item && item !== '--') {
        acc.push(item);
      }
      return acc;
    }, []);

    while (startDate <= new Date(to)) {
      const stringDate = startDate.toISOString().split('T')[0];
      const item = readFileSync(path.join(userHomeDir, `.${stringDate}`));

      if (item) {
        const timeEntries = removeEmpty(item.split(contentTableSeparator)[1].split('\n'));

        data = data.concat(
          timeEntries.map((entry) =>
            entry.split('|').reduce((acc, val, i) => {
              const item = val.trim();

              if (item && item !== '--') {
                acc[itemHeading[i - 1]] = item;
              }

              return acc;
            }, {}),
          ),
        );
      }

      startDate.setDate(startDate.getDate() + 1);
    }

    return data.filter((item) => item);
  } catch (error) {
    console.error(error.message);
  }
};
const getTasksBySynced = async (synced = 'false') => {
  try {
    const resp = await getTasksByDate();

    return (resp || []).filter((item) => item.synced === synced);
  } catch (error) {
    console.error(error.message);
  }
};
const getReport = async (from, to) => {
  try {
    const resp = await getTasksByDate(from, to);
    const adhocTasks = ['adhoc', 'internal', 'internal'];

    return (resp || []).reduce((res, { date, work, synced, duration }) => {
      res[date] = {
        synced: res[date]?.synced || 0,
        open: res[date]?.open || 0,
        task: res[date]?.task || 0,
        adhoc: res[date]?.adhoc || 0,
      };

      if (synced === 'true') {
        res[date].synced += +duration;
      } else {
        res[date].open += +duration;
      }

      if (adhocTasks.includes(work.toLowerCase())) {
        res[date].adhoc += +duration;
      } else {
        res[date].task += +duration;
      }

      return res;
    }, {});
  } catch (error) {
    console.error(error.message);
  }
};
const getStatus = async (values) => {
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

      data[keyMap[key]] = new Date(itemValue).toISOString().split('T')[0];
    }
  } else {
    data.from = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
    data.to = new Date().toISOString().split('T')[0];
  }

  console.table(await getReport(data.from, data.to));
};

module.exports = { getReport, getStatus, getTasksByDate, getTasksBySynced };
