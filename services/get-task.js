/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion, taskDB } = require('./config');
const { format, isWithinInterval, subDays } = require('date-fns');

module.exports = {
  getTask: async (params = {}) => {
    const query = { database_id: taskDB };
    const from = format(subDays(new Date(), 7), 'yyyy-MM-dd');
    const to = format(new Date(), 'yyyy-MM-dd');

    if (params.includeOpen) {
      const on_or_after = new Date(from).toISOString();
      const on_or_before = new Date(to).toISOString();

      query.filter = { and: [{ property: 'date', date: { on_or_after, on_or_before } }] };
    } else {
      console.log(params);
      query.filter = {
        and: [
          {
            property: 'synced',
            checkbox: { equals: false },
          },
        ],
      };
    }

    try {
      const response = await notion.databases.query(query);
      const report = response.results.map((item) => {
        return {
          id: item.id,
          taskId: item.properties.taskId.title?.[0]?.plain_text || '',
          project: item.properties.project.select.name,
          sprint: item.properties.sprint.select.name,
          url: item.properties.url.formula.string,
          date: item.properties.date.date.start,
          duration: item.properties.duration.number,
          notes: item.properties.notes.rich_text?.[0]?.plain_text || '',
        };
      });

      if (params.includeOpen) {
        return report.filter((item) => {
          return isWithinInterval(new Date(item.date), {
            start: new Date(from),
            end: new Date(to),
          });
        });
      }

      return report;
    } catch (error) {
      console.log(error.body);
    }
  },
};
