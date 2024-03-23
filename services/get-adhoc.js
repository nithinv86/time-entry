/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion, adhocDB } = require('./config');

module.exports = {
  getAdhoc: async () => {
    try {
      const response = await notion.databases.query({
        database_id: adhocDB,
        filter: {
          and: [
            {
              property: 'synced',
              checkbox: {
                does_not_equal: true,
              },
            },
          ],
        },
      });

      return response.results.map((item) => {
        return {
          id: item.id,
          taskId: item.properties.taskId.title?.[0]?.plain_text || '',
          project: item.properties.project.select.name,
          sprint: item.properties.sprint.select.name,
          personOrMeeting: item.properties.personOrMeeting.multi_select
            .map((item) => item.name)
            .join(', '),
          date: item.properties.date.date.start,
          duration: item.properties.duration.number,
          notes: item.properties.notes.rich_text?.[0]?.plain_text || '',
        };
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
