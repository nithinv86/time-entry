/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { notion } = require('./config');

module.exports = {
  markAsSynced: async (pageId) => {
    try {
      await notion.pages.update({
        page_id: pageId,
        properties: {
          synced: { checkbox: true },
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};
