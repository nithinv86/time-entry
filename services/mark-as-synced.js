const { userConfig } = require('./config');
const { connect } = require('./db');
const markAsSynced = async (id) => {
  const { db: database } = await userConfig();
  const db = await connect();
  const collection = db.collection(database.collection);

  try {
    await collection.updateOne({ id }, { $set: { synced: true } });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { markAsSynced };
