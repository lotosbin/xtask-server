import {getRedmineIssues, getRedmineProject, getRedmineRelations} from "../services";
import DataLoader from "dataloader";

export async function getRedmineTaskByKey(pkey) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    let {host, key, id} = JSON.parse(pkey);
    let tasks = await getRedmineIssues({host, key}, {issue_id: id});
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

export const taskLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineTaskByKey)));

export function keyRelation({host: redmine_api_host, key: redmine_api_key}, issue_id) {
    let key = {
        host: redmine_api_host,
        key: redmine_api_key,
        issue_id: issue_id,
    };

    return JSON.stringify(key)
}

export async function getRedmineRelationsByKey(pkey) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    let {host, key, issue_id} = JSON.parse(pkey);
    return await getRedmineRelations({host, key}, {issue_id: issue_id})
}

export const relationLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineRelationsByKey)));


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

export const projectLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineProjectByKey)));

export async function getRedmineProjectByKey(key) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    log(`${key}`);
    let {id, args, request} = JSON.parse(key);
    return await getRedmineProject(id, args, request)
}
