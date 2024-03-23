/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { MongoClient } = require('mongodb');
const { userConfig } = require('./config');

async function connect() {
  const { database_host, database_user, database_pass, database_name } = await userConfig();
  let uri = 'mongodb://';

  if (database_user) {
    uri += `${database_user}:${database_pass}@`;
  }

  uri += `${database_host}/${database_name}`;

  if (uri === 'mongodb://') {
    throw new Error('Missing MONGO_HOST');
  }

  const client = new MongoClient(uri);

  await client.connect();

  return client.db();
}
async function disconnect() {
  await client.close();
}

module.exports = { connect, disconnect };
