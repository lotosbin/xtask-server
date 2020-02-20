import { keyProject } from './loaders/Project';
import { getRedmineIssues, getRedmineIssues as _getRedmineIssues, getRedmineProjects, issue_update as _issue_update } from './services';
import { keyUser } from './loaders/User';
import { keyGroup } from './loaders/Group';
import { keyTask } from './loaders/Task';
import { keyRelation } from './loaders/Relation';
import { getRedmineObjects } from './services/util';
import loaders from './loaders';

export interface IUser {
  firstname: string;
}

export class Repository {
  private loaders: any;
  private readonly host: string;
  private readonly key: string;

  constructor({ host, key }) {
    this.host = host;
    this.key = key;
    this.loaders = loaders;
  }

  getContext() {
    return { host: this.host, key: this.key };
  }

  async getProjectById(id: string) {
    return await this.loaders.projectLoader.load(keyProject(this.getContext(), id));
  }

  async getIssues(args) {
    return await getRedmineIssues(this.getContext(), args);
  }

  async getIssuesByToId({ issue_to_id }): Promise<any[]> {
    return await this.loaders.task.load(keyTask(this.getContext(), issue_to_id));
  }

  async getUserById(id?: string): Promise<IUser | null> {
    if (id == null) {
      return null;
    }
    return await this.loaders.userLoader.load(keyUser(this.getContext(), id));
  }

  async getIssueStatuses() {
    return await getRedmineObjects('issue_statuse', this.getContext());
  }

  async getGroupById(id: string) {
    return await this.loaders.groupLoader.load(keyGroup(this.getContext(), id));
  }

  async getMemberShipsByProjectId(project_id, args) {
    return await getRedmineObjects('membership', this.getContext(), args, `/projects/${project_id}`);
  }

  async getRelation(issue_id: string) {
    return await this.loaders.relation.load(keyRelation(this.getContext(), issue_id));
  }

  async getRedmineProjects(args: any) {
    return await getRedmineProjects(this.getContext(), args);
  }
  /**
   * @deprecated use `getUserById`
   * */
  async getRedmineUser(id: string) {
    return await this.getUserById(id);
  }

  async getRedmineUsers(args: any) {
    return await getRedmineObjects('user', this.getContext(), args);
  }

  async getRedmineGroup(id: any) {
    return await this.loaders.groupLoader.load(keyGroup(this.getContext(), id));
  }

  async getRedmineGroups(args: any) {
    return await getRedmineObjects('group', this.getContext(), { ...args, include: 'users' });
  }

  async getRedmineUserList(ids: [string]): Promise<any[]> {
    return await this.loaders.userLoader.loadMany(ids.map(id => keyUser(this.getContext(), id)));
  }

  /**
   * @deprecated use `getIssues`
   * */
  async getRedmineIssues(args: any) {
    return await this.getIssues(args);
  }

  async issue_update(args: any) {
    await _issue_update(this.getContext(), args);
  }
}
