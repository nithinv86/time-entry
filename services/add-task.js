/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { userConfig } = require('./config');
const { connect } = require('./db');

module.exports = {
  addTask: async (entry) => {
    try {
      const entries = [];
      const { database_collection } = await userConfig();
      const db = await connect();
      const collection = db.collection(database_collection);

      if (!collection) {
        throw new Error('Collection not found');
      }

      const existingEntry = await collection.findOne({ taskId: entry.taskId, date: entry.date });

      if (existingEntry) {
        throw new Error('Same entry already exists');
      }

      const resp = await collection.insertMany(entries);

      console.log(`Inserted ${resp.insertedCount} document into the collection`);

      entries.push({ ...entry, duration: +entry.duration });

      return;
    } catch (error) {
      console.error(error.message);
    }
  },
};
