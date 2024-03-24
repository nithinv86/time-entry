const { userConfig } = require('./config');
const { connect } = require('./db');
const { convertToTaskData } = require('./utils');
const updateAdhocOrTask = async (id, body) => {
  try {
    const { db: database } = await userConfig();
    const db = await connect();
    const collection = db.collection(database.collection);
    const newvalues = Object.fromEntries(
      Object.entries(body).map(([key, value]) => [key, key === 'duration' ? +value : value]),
    );

    await collection.updateOne({ id }, { $set: newvalues });
  } catch (error) {
    console.log(error.message);
  }
};
const updateTaskDetails = async (values) => {
  const { id, ...data } = convertToTaskData(values);

  console.log(await updateAdhocOrTask(id, data));
};

module.exports = { updateAdhocOrTask, updateTaskDetails };
