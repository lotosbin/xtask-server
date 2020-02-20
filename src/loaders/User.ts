import DataLoader = require('dataloader');
import { getRedmineObject } from '../services/util';

async function getRedmineUserByKey(pkey) {
  let { host, key, id } = JSON.parse(pkey);
  return await getRedmineObject('user', { host, key }, id);
}

export function keyUser(request, id) {
  let { host, key } = request;
  let loader_key = {
    host: host || request.headers['x-redmine-api-host'],
    key: key || request.headers['x-redmine-api-key'],
    id: id,
  };
  let loader_key_string = JSON.stringify(loader_key);
  console.log(`keyUser:${loader_key_string}`);
  return loader_key_string;
}

export const userLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineUserByKey)));
