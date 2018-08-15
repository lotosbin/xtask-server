import {keyProject} from "./loaders/Project";
import {getRedmineIssues} from "./services";
import loaders from "./loaders";
import {keyUser} from "./loaders/User";

export class Repository {
    constructor(request, loaders) {
        this.request = request;
        this.loaders = loaders;
    }

    getContext() {
        let host = this.request.headers['x-redmine-api-host'];
        let key = this.request.headers['x-redmine-api-key'];
        let context = {host, key};
        return context;
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
}