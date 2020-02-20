import DataLoader = require('dataloader');
import {getRedmineObject} from "../services/util";

async function getRedmineGroupByKey(pkey) {
    let {host, key, id} = JSON.parse(pkey);
    return await getRedmineObject('group', {host, key}, id)
}

export function keyGroup({host: redmine_api_host, key: redmine_api_key}, id) {
    let key = {
        host: redmine_api_host,
        key: redmine_api_key,
        id: id,
    };
    return JSON.stringify(key)
}

export const groupLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineGroupByKey)));