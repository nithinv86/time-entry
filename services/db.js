const { MongoClient } = require('mongodb');
const { userConfig } = require('./config');
const connect = async () => {
  const { db } = await userConfig();
  let uri = '';

  if (db.host.startsWith('localhost')) {
    uri = 'mongodb://';

    if (db.user) {
      uri += `${db.user}:${db.password}@`;
    }
  }

  uri += `${db.host}/${db.name}`;

  if (uri === 'mongodb://') {
    throw new Error('Missing MONGO_HOST');
  }

  try {
    const client = new MongoClient(uri);

    await client.connect();

    return client.db();
  } catch (error) {
    console.error('MongoDB is not available:', error);
  }
};

module.exports = { connect };
