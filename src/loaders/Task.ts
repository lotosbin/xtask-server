import {getRedmineIssues} from "../services";
import DataLoader = require('dataloader');

async function getRedmineTaskByKey(pkey) {
    let {host, key, id} = JSON.parse(pkey);
    let tasks = await getRedmineIssues({host, key}, {issue_id: id} as any);
    return tasks[0]
}

export function keyTask({host: redmine_api_host, key: redmine_api_key}, id) {
    let key = {
        host: redmine_api_host,
        key: redmine_api_key,
        id: id,
    };

    return JSON.stringify(key)
}

 export  const taskLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineTaskByKey)));