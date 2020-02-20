import {getRedmineProject} from "../services";

import DataLoader = require('dataloader');

export async function getRedmineProjectByKey(pkey) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    log(JSON.stringify(pkey));
    let {id, host, key} = JSON.parse(pkey);
    return await getRedmineProject({host, key}, id, {include: 'relations'})
}

export const projectLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineProjectByKey)));

export function keyProject(request, id) {
    let {host, key} = request;
    let loader_key = {
        id: id,
        host: host || request.headers["x-redmine-api-host"],
        key: key || request.headers["x-redmine-api-key"]
    };
    return JSON.stringify(loader_key)
}