/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion, adhocDB } = require('./config');

module.exports = {
  addAdhoc: async (entry) => {
    try {
      const multi_select =
        typeof entry.personOrMeeting === 'object'
          ? entry.personOrMeeting.map((name) => ({ name }))
          : [{ name: entry.personOrMeeting }];
      const properties = {
        taskId: { title: [{ text: { content: entry.taskId } }] },
        project: { select: { name: entry.project } },
        sprint: { select: { name: entry.sprint } },
        personOrMeeting: { multi_select },
        date: { date: { start: entry.date } },
        duration: { number: +entry.duration },
        notes: { rich_text: [{ text: { content: entry.notes } }] },
      };

      return await notion.pages.create({ parent: { database_id: adhocDB }, properties });
    } catch (error) {
      console.error(error.message);
    }
  },
};
