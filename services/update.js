/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion } = require('./config');

module.exports = {
  updateAdhocOrTask: async (id, body) => {
    try {
      const properties = {};

      for (const [item, value] of Object.entries(body)) {
        switch (item) {
          case 'taskId': {
            properties[item] = {
              title: [{ text: { content: value } }],
            };

            break;
          }

          case 'project':
          case 'sprint': {
            properties[item] = {
              select: { name: value },
            };

            break;
          }

          case 'personOrMeeting': {
            const multi_select = value.map((name) => ({ name }));
            properties[item] = { multi_select };

            break;
          }

          case 'date': {
            properties[item] = {
              date: { start: value },
            };

            break;
          }

          case 'duration': {
            properties[item] = {
              number: value,
            };

            break;
          }

          case 'workType':
          case 'notes': {
            properties[item] = {
              rich_text: [
                {
                  text: { content: value },
                },
              ],
            };

            break;
          }
        }
      }

      return await notion.pages.update({ page_id: id, properties });
    } catch (error) {
      console.log(error.message);
    }
  },
};
