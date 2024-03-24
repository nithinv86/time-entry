import { userConfig } from './config';
import { connect } from './db';
import { convertToTaskData } from './utils';

module.exports = { addTask, addNewTask };

const addTask = async (entry) => {
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
};
const addNewTask = async (values) => {
  const data = convertToTaskData(values);

  await addTask(data);
};
