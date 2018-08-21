import {keyProject} from "./loaders/Project";
import {getProjectMemberShips, getRedmineIssues, getRedmineIssueStatuses} from "./services";
import loaders from "./loaders";
import {keyUser} from "./loaders/User";
import {keyGroup} from "./loaders/Group";

export class Repository {
    constructor(request, loaders) {
        this.request = request;
        this.loaders = loaders;
    }

    getContext() {
        let host = this.request.headers['x-redmine-api-host'];
        let key = this.request.headers['x-redmine-api-key'];
        return {host, key};
    }

    async getProjectById(id: string) {
        let context = this.getContext();
        return await this.loaders.projectLoader.load(keyProject(context, id))
    }

    async getIssues(args) {
        return await getRedmineIssues(this.getContext(), args);
    }

    async getUserById(id: string) {
        return await loaders.userLoader.load(keyUser(this.getContext(), id))
    }

    async getIssueStatuses() {
        return await getRedmineIssueStatuses(this.getContext());
    }

    async getGroupById(id: string) {
        return await loaders.groupLoader.load(keyGroup(this.getContext(), id))
    }

    async getMemberShipsByProjectId(project_id, args) {
        return await getProjectMemberShips(this.getContext(), project_id, args)
    }
}