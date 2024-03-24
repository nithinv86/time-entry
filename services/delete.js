import { userConfig } from './config';
import { connect } from './db';

module.exports = { deleteTask };

const deleteTask = async (id) => {
  try {
    const { database_collection } = await userConfig();
    const db = await connect();
    const collection = db.collection(database_collection);

    await collection.deleteOne({ id });
  } catch (error) {
    console.log(error.message);
  }
};
