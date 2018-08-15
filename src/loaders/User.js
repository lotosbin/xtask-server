import DataLoader from "dataloader";
import {getRedmineUser} from "../services";

async function getRedmineUserByKey(pkey) {
    const log = (message) => console.log(`getRedmineUserByKey:${message}`);
    let {host, key, id} = JSON.parse(pkey);
    let user = await getRedmineUser({host, key}, id);
    return user
}

export function keyUser(request, id) {
    let {host, key} = request;
    let loader_key = {
        host: host || request.headers['x-redmine-api-host'],
        key: key || request.headers['x-redmine-api-key'],
        id: id,
    };
    let loader_key_string = JSON.stringify(loader_key);
    console.log(`keyUser:${loader_key_string}`);
    return loader_key_string
}

export const userLoader = new DataLoader(keys => Promise.all(keys.map(getRedmineUserByKey)));