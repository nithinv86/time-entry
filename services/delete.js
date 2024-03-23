/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion } = require('./config');

module.exports = {
  deleteAdhocOrTask: async (id) => {
    try {
      return await notion.pages.update({ page_id: id, archived: true });
    } catch (error) {
      console.log(error.message);
    }
  },
};
