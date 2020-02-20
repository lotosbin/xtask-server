import fetch from "node-fetch";
import {toQuery, TResponse} from "./util";

type IHost = {
    host: string,
    key: string
};

export async function getRedmineIssues({host, key}: IHost, {offset, limit, project_id, issue_id, assigned_to_id}) {
    const log = (message) => console.log(`getRedmineIssues:${message}`);

    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let args: any = {
        offset: offset || 0,
        limit: limit || 25,
    };
    if (project_id) {
        args.project_id = project_id;
    }
    if (issue_id) {
        args.issue_id = issue_id;
    }
    if (assigned_to_id) {
        args.assigned_to_id = assigned_to_id;
    }

    let response: TResponse = await fetch(`${host}/issues.json?offset=${toQuery(args)}`, {headers: headers});
    let result = await response.json();
    log(`result:${JSON.stringify(result)}`);
    return result.issues;
}

/**
 * @see: http://www.redmine.org/projects/redmine/wiki/Rest_Issues#Updating-an-issue
 * */
export async function issue_update({host, key}: IHost, {issue_id, start_date, due_date, status_id}) {
    const log = (message) => console.log(
        `issue_update:${message}`
    );

    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let args: any = {};
    if (start_date) {
        args.start_date = start_date
    }
    if (due_date) {
        args.due_date = due_date
    }
    if (status_id) {
        args.status_id = status_id
    }
    log(`args:${JSON.stringify(args)}`);
    let url = `${host.replace(/\/$/, "")}/issues/${issue_id}.json`;
    log(`PUT ${url}`);
    try {
        let opts = {
            headers: headers,
            method: "PUT",
            body: JSON.stringify({issue: args})
        };
        log(`opts ${JSON.stringify(opts)}`);
        let response: TResponse = await fetch(url, opts);
        if (response.ok) {
            let issues = await getRedmineIssues({host, key}, {issue_id} as any);
            return issues && issues.length ? issues[0] : null
        } else {
            let text = await response.text();
            log(`response:${JSON.stringify(text)}`)
        }
    } catch (e) {
        log(`response:${JSON.stringify(e)}`)
    }
}


export async function getRedmineProjects({host: redmine_api_host, key: redmine_api_key}, args) {
    const log = (message) => console.log(`getRedmineProjects:${message}`);
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

export async function getRedmineProject({host, key}: IHost, id: string, args: any) {
    if (id === undefined || id == null) {
        return null
    }
    const log = (message, args = {}) => console.log(`getRedmineProject:${message}`, args);
    let headers = {
        'Content-Type': 'application/json'
    };
    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    log(`headers:${JSON.stringify(headers)}`);

    let url = `${host}/projects/${id}.json?include=relations`;
    log(`url=${url}`);
    let response: TResponse = await fetch(url, {headers: headers});
    const result = await response.json();
    log(`issue`, result);
    return result.project;
}

export interface TTaskRelation {
    id: string,
    issue_id: string,
    issue_to_id: string,
    relation_type: string
}

export async function getRedmineRelations({host, key}: IHost, {issue_id}): Promise<Array<TTaskRelation>> {
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
