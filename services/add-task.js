/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

const { userConfig } = require('./config');
const { connect } = require('./db');

module.exports = {
  addTask: async (entry) => {
    try {
      const { database_collection } = await userConfig();
      const entries = [];
      const db = await connect();
      const collection = db.collection(database_collection);

      if (!collection) {
        throw new Error('Collection not found');
      }

      const existingEntry = await collection.findOne({
        ...entry,
        date: new Date(entry.date).toISOString(),
        duration: +entry.duration,
      });

      if (existingEntry) {
        throw new Error('Same entry already exists');
      }

      entries.push({
        ...entry,
        duration: +entry.duration,
        date: new Date(entry.date).toISOString(),
        synced: false,
        createdAt: new Date().toISOString(),
      });

      const resp = await collection.insertMany(entries);

      console.log(`Inserted ${resp.insertedCount} document into the collection`);
    } catch (error) {
      console.error(error.message);
    }
  },
};
