import fetch from "node-fetch";

export async function getRedmineObject(objectName: string, {host, key}, id: string, args = {}) {
    const log = (message) => console.log(`getRedmineObject(${objectName}):${message}`);
    if (!id) {
        return null
    }
    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let url = `${host.replace(/\/$/, "")}/${objectName}s/${id}.json?${toQuery(args)}`;
    let opts = {
        headers: headers
    };
    log(`fetch:${url},${JSON.stringify(opts)}`);
    let response: TResponse = await fetch(url, opts);
    if (response.ok) {
        let result = await response.json();
        log(`response:${JSON.stringify(result)}`);
        return result[objectName];
    } else {
        if (response.status === 404) {
            return null
        } else {
            throw Error(await response.text())
        }
    }
}

export interface TResponse {
    ok: boolean,
    status: number,
    json: Function,
    text: Function
}

export let toQuery = (args: any) => args ? Object.keys(args).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&') : "";

export async function getRedmineObjects(objectName: string, {host, key}, pArgs: any = {}, base = null) {
    let {offset, limit} = pArgs;
    const log = (message) => console.log(`getRedmineObjects(${base},${objectName}):${message}`);

    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let args = {
        ...pArgs,
        offset: offset || 0,
        limit: limit || 25,
    };

    let path = `/${objectName}s.json?offset=${toQuery(args)}`;
    if (base) {
        path = `${base}${path}`
    }
    let url = `${host}${path}`;
    let opts = {headers: headers};
    log(`fetch:${url},${JSON.stringify(opts)}`);
    let response: TResponse = await fetch(url, opts);
    if (response.ok) {
        let json = await response.text();
        let result = JSON.parse(json);
        log(`response:${JSON.stringify(result)}`);
        return result[`${objectName}s`];
    } else {
        let text = await response.text();
        log(`response:${JSON.stringify(text)}`)
    }
}