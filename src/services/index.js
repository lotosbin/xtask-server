import fetch from "node-fetch";

let toQuery = args => args ? Object.keys(args).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(args[k])}`).join('&') : "";

export async function getRedmineIssueStatuses(context) {
    // noinspection SpellCheckingInspection
    return await getRedmineObjects('issue_statuse', context)
}
export async function getRedmineGroups(context, args) {
    return await getRedmineObjects('group', context, {...args, include: 'users'})
}

export async function getRedmineGroup({host, key}, user_id) {
    return await getRedmineObject('group', {host, key}, user_id)
}

export async function getRedmineGroupUsers(context, group_id, args) {
    return await getRedmineObjects('user', context, args, `/groups/${group_id}`)
}

export async function getRedmineUsers(context, args) {
    return await getRedmineObjects('user', context, args)
}

export async function getRedmineObjects(objectName, {host, key}, pArgs = {}, base = null) {
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

export async function getRedmineUser({host, key}, user_id: string) {
    return await getRedmineObject('user', {host, key}, user_id)
}

export async function getRedmineObject(objectName: string, {host, key}, id: string, args) {
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
    let url = `${host}/${objectName}s/${id}.json?${toQuery(args)}`;
    let opts = {
        headers: headers
    };
    log(`fetch:${url},${JSON.stringify(opts)}`);
    let response: TResponse = await fetch(url, opts);
    let result = await response.json();
    log(`response:${JSON.stringify(result)}`);
    return result[objectName];
}

export async function getRedmineIssues({host, key}, {offset, limit, project_id, issue_id, assigned_to_id}) {
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
    if (assigned_to_id) {
        args.assigned_to_id = assigned_to_id;
    }

    let response: TResponse = await fetch(`${host}/issues.json?offset=${toQuery(args)}`, {headers: headers});
    let result = await response.json();
    log(`result:${JSON.stringify(result)}`);
    return result.issues;
}

export async function issue_update({host, key}, {issue_id, start_date, due_date, status_id}) {
    const log = (message) => console.log(
        `issue_update:${message}`
    );

    let headers = {
        'Content-Type': 'application/json'
    };

    if (key) {
        headers['X-Redmine-API-Key'] = key;
    }
    let args = {};
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
    let url = `${host}/issues/${issue_id}.json`;
    log(`PUT ${url}`);
    let response: TResponse = await fetch(url, {
        headers: headers,
        method: "PUT",
        body: JSON.stringify({issue: args})
    });
    if (response.ok) {
        let result = await response.json();
        log(`result:${JSON.stringify(result)}`);
        return result.issues;
    } else {
        let text = await response.text();
        log(`response:${JSON.stringify(text)}`)
    }
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

export async function getRedmineProject({host, key}, id: string) {
    if (id === undefined || id == null) {
        return null
    }
    const log = (message, args) => console.log(`getRedmineProject:${message}`, args);
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

interface TTaskRelation {
    id: string,
    issue_id: string,
    issue_to_id: string,
    relation_type: string
}

interface TResponse {
    ok: Boolean,
    json: Function,
    text: Function
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
