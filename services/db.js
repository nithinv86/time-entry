import { MongoClient } from 'mongodb';
import { userConfig } from './config';

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

module.exports = { connect };
