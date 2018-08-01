import fetch from "node-fetch";

let toQuery = args => Object.keys(args).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&');

export async function getRedmineIssues({host, key}, {offset, limit, project_id, issue_id}) {
    const log = (message) => console.log(`getRedmineIssues:${message}`);

    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let args = {
        offset: offset || 0,
        limit: limit || 25,
    };
    if (project_id) {
        args.project_id = project_id;
    }
    if (issue_id) {
        args.issue_id = issue_id;
    }


    let response: TResponse = await fetch(`${host}/issues.json?offset=${toQuery(args)}`, {headers: headers});
    let result = await response.json();
    return result.issues;
}


export async function getRedmineProjects({host: redmine_api_host, key: redmine_api_key}, args, request) {
    const log = (message) => console.log(`getRedmineProjects:${message}`);
    log(`request.headers=${JSON.stringify(request.headers)}`);
    let headers = {
        'Content-Type': 'application/json'
    };
    if (redmine_api_key) {
        headers['X-Redmine-API-Key'] = redmine_api_key;
    }
    log(`headers:${JSON.stringify(headers)}`);
    let base = `${redmine_api_host}/projects.json`;
    if (args.id) {
        base = `${redmine_api_host}/projects/${args.id}.json`;
    }
    let response: TResponse = await fetch(`${base}?offset=${toQuery(args)}`, {headers: headers});
    const result = await response.json();
    if (args.id) {
        return [result.project]
    }
    return result.projects;
}

export async function getRedmineProject(id, args, request) {
    const log = (message, args) => console.log(`getRedmineProjects:${message}`, args);
    let header = request.headers['x-redmine-api-key'];
    log(`request.headers=${JSON.stringify(request.headers)}`);
    let headers = {
        'Content-Type': 'application/json'
    };
    if (header) {
        headers['X-Redmine-API-Key'] = header;
    }
    log(`headers:${JSON.stringify(headers)}`);

    let host = request.headers['x-redmine-api-host'];
    let url = `${host}/projects/${id}.json?include=relations`;
    log(`url=${url}`);
    let response: TResponse = await fetch(url, {headers: headers});
    const result = await response.json();
    log(`issue`, result);
    return result.project;
}

interface TTaskRelation {
    id: string,
    issue_id: string,
    issue_to_id: string,
    relation_type: string
}

interface TResponse {
    json: Function
}

export async function getRedmineRelations({host, key}, {issue_id}): Promise<Array<TTaskRelation>> {
    const log = (message) => console.log(`getRedmineIssues:${message}`);

    let headers = {
        'Content-Type': 'application/json'
    };
    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }

    let response: TResponse = await fetch(`${host}/issues/${issue_id}/relations.json`, {headers: headers});
    let result = await response.json();
    return result.relations;
}
