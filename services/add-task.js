const { userConfig } = require('./config');
const { connect } = require('./db');
const { convertToTaskData } = require('./utils');
const addTask = async (entry) => {
  try {
    const { db: database } = await userConfig();
    const entries = [];
    const db = await connect();
    const collection = db.collection(database.collection);

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
};
const addNewTask = async (values) => {
  const data = convertToTaskData(values);

  await addTask(data);
};

module.exports = { addTask, addNewTask };
