const { userConfig } = require('./config');
const { connect } = require('./db');
const deleteTask = async (id) => {
  try {
    const { db: database } = await userConfig();
    const db = await connect();
    const collection = db.collection(database.collection);

    await collection.deleteOne({ id });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { deleteTask };
