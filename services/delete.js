const { userConfig } = require('./config');
const { connect } = require('./db');

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
