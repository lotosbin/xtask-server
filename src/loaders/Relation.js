import DataLoader from "dataloader";
import {getRedmineRelations} from "../services";

export function keyRelation({host: redmine_api_host, key: redmine_api_key}, issue_id) {
    let key = {
        host: redmine_api_host,
        key: redmine_api_key,
        issue_id: issue_id,
    };

    return JSON.stringify(key)
}

async function getRedmineRelationsByKey(pkey) {
    const log = (message) => console.log(`getRedmineProjectByKey:${message}`);
    let {host, key, issue_id} = JSON.parse(pkey);
    return await getRedmineRelations({host, key}, {issue_id: issue_id})
}

export const relationLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineRelationsByKey)));