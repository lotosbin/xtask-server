import {getRedmineProject} from "../services";
import DataLoader from "dataloader";

export async function getRedmineProjectByKey(key) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    log(`${key}`);
    let {id, args, request} = JSON.parse(key);
    return await getRedmineProject(id, args, request)
}

export const projectLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineProjectByKey)));

export function keyProject({host: redmine_api_host, key: redmine_api_key}, id, args, request) {
    let header = redmine_api_key || request.headers["x-redmine-api-key"];
    let host = redmine_api_host || request.headers['x-redmine-api-host'];
    let key = {
        id: id,
        args: {},
        request: {headers: {}}
    };
    if (header) {
        key.request.headers['x-redmine-api-key'] = header;
    }
    if (host) {
        key.request.headers['x-redmine-api-host'] = host;
    }
    return JSON.stringify(key)
}