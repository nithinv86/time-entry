/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { userConfig } = require('./config');
const { connect } = require('./db');
const { format, subDays } = require('date-fns');

module.exports = {
  getReport: async (from, to) => {
    const { database_collection } = await userConfig();
    const db = await connect();
    const collection = db.collection(database_collection);

    if (!from) {
      from = subDays(new Date(), 7);
    }

    if (!to) {
      to = new Date();
    }

    const $gte = new Date(from).toISOString();
    const $lte = new Date(to).toISOString();

    try {
      const resp = await collection.find({ date: { $gte, $lte } }).toArray();

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
  },
};
