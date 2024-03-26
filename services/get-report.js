const { format, subDays } = require('date-fns');
const { userConfig } = require('./config');
const { connect } = require('./db');
const getTasksByDate = async (from, to) => {
  try {
    const { db: database } = await userConfig();
    const db = await connect();
    const collection = db.collection(database.collection);

    if (!from) {
      from = subDays(new Date(), 7);
    }

    if (!to) {
      to = new Date();
    }

    const $gte = new Date(from).toISOString();
    const $lte = new Date(to).toISOString();

    return await collection.find({ date: { $gte, $lte } }).toArray();
  } catch (error) {
    console.error(error.message);
  }
};
const getTasksBySynced = async (synced = false) => {
  try {
    const { db: database } = await userConfig();
    const db = await connect();
    const collection = db.collection(database.collection);

    return await collection.find({ synced }).toArray();
  } catch (error) {
    console.error(error.message);
  }
};
const getReport = async (from, to) => {
  try {
    const resp = await getTasksByDate(from, to);

    return (resp || []).reduce((res, { date, task, synced, duration }) => {
      date = format(new Date(date), 'yyyy-MM-dd');

      res[date] = {
        synced: res[date]?.synced || 0,
        open: res[date]?.open || 0,
        task: res[date]?.task || 0,
        adhoc: res[date]?.adhoc || 0,
      };

      if (synced) {
        res[date].synced += duration;
      } else {
        res[date].open += duration;
      }

      if (task === 'Adhoc' || task === 'Internal connects' || task === 'Internal connect') {
        res[date].adhoc += duration;
      } else {
        res[date].task += duration;
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

      data[keyMap[key]] = format(new Date(itemValue), 'yyyy-MM-dd');
    }
  } else {
    data.from = format(new Date(new Date().setDate(new Date().getDate() - 7)), 'yyyy-MM-dd');
    data.to = format(new Date(), 'yyyy-MM-dd');
  }

  console.table(await getReport(data.from, data.to));
};

module.exports = { getReport, getStatus, getTasksByDate, getTasksBySynced };
