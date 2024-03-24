import { userConfig } from './config';
import { connect } from './db';

module.exports = { markAsSynced };

const markAsSynced = async (id) => {
  const { database_collection } = await userConfig();
  const db = await connect();
  const collection = db.collection(database_collection);

  try {
    await collection.updateOne({ id }, { $set: { synced: true } });
  } catch (error) {
    console.log(error.message);
  }
};
