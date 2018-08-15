import DataLoader from "dataloader";
import {getRedmineGroup, getRedmineUser} from "../services";

async function getRedmineGroupByKey(pkey) {
    const log = (message) => console.log(`getRedmineUserByKey:${message}`);
    let {host, key, id} = JSON.parse(pkey);
    let user = await getRedmineGroup({host, key}, id);
    return user
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