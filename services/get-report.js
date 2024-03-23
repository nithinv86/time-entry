/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion, taskDB } = require('./config');
const { format, subDays } = require('date-fns');

module.exports = {
  getReport: async (from, to) => {
    if (!from) {
      from = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      return;
    }

    if (!to) {
      to = format(new Date(), 'yyyy-MM-dd');
    }

    const on_or_after = new Date(from).toISOString();
    const on_or_before = new Date(to).toISOString();
    const filter = { and: [{ property: 'date', date: { on_or_after, on_or_before } }] };

    try {
      const taskResponse = await notion.databases.query({ database_id: taskDB, filter });

      const report = (taskResponse?.results || []).reduce((resp, { properties }) => {
        const date = properties.date.date.start;
        const task = properties.workType.rich_text?.[0]?.plain_text;

        resp[date] = {
          synced: resp[date]?.synced || 0,
          open: resp[date]?.open || 0,
          task: resp[date]?.task || 0,
          adhoc: resp[date]?.adhoc || 0,
        };

        if (properties.synced.checkbox) {
          resp[date].synced += properties.duration.number;
        } else {
          resp[date].open += properties.duration.number;
        }

        if (task === 'Adhoc' || task === 'Internal connects' || task === 'Internal connect') {
          resp[date].adhoc += properties.duration.number;
        } else {
          resp[date].task += properties.duration.number;
        }

        return resp;
      }, {});

      /* for (const { properties } of adhocResponse?.results || []) {
        const date = properties.date.date.start;

        if (!properties.synced.checkbox) {
          report[date].adhoc += properties.duration.number;
        }
      } */

      const filtertedResults = {};
      let currentDate = new Date(from);

      while (currentDate <= new Date(to)) {
        const formattedDate = format(currentDate, 'yyyy-MM-dd');

        if (report[formattedDate]) {
          filtertedResults[formattedDate] = report[formattedDate];
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return filtertedResults;
    } catch (error) {
      console.error(error.message);
    }
  },
};
