/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export interface Node {
  id: string;
}

export class GroupType implements Node {
  id: string;
  name?: string;
  users?: UserType[];
}

export class IssueStatusType {
  id?: string;
  name?: string;
  is_default?: boolean;
  is_closed?: boolean;
}

export class MemberShipType implements Node {
  id: string;
  user?: UserType;
  project?: ProjectType;
  group?: GroupType;
}

export abstract class IMutation {
  abstract task_update(issue_id?: string, start_date?: string, due_date?: string, status_id?: string): TaskType | Promise<TaskType>;
}

export class ProjectType implements Node {
  id: string;
  redmine_api_host?: string;
  redmine_api_key?: string;
  identifier?: string;
  name?: string;
  description?: string;
  created_on?: string;
  updated_on?: string;
  issues?: TaskType[];
  memberships?: MemberShipType[];
}

export abstract class IQuery {
  abstract tasks(offset?: number, limit?: number, issue_id?: string, redmine_api_host?: string, redmine_api_key?: string): TaskType[] | Promise<TaskType[]>;

  abstract issues(offset?: number, limit?: number, issue_id?: string, redmine_api_host?: string, redmine_api_key?: string, assigned_to_id?: string, project_id?: string): TaskType[] | Promise<TaskType[]>;

  abstract projects(offset?: number, limit?: number, id?: string, redmine_api_host?: string, redmine_api_key?: string): ProjectType[] | Promise<ProjectType[]>;

  abstract users(offset?: number, limit?: number, id?: string, redmine_api_host?: string, redmine_api_key?: string): UserType[] | Promise<UserType[]>;

  abstract groups(offset?: number, limit?: number, id?: string, redmine_api_host?: string, redmine_api_key?: string): GroupType[] | Promise<GroupType[]>;

  abstract issue_statuses(): IssueStatusType[] | Promise<IssueStatusType[]>;
}

export class TaskRelationType implements Node {
  id: string;
  redmine_api_host?: string;
  redmine_api_key?: string;
  identifier?: string;
  issue_id?: string;
  issue_to_id?: string;
  relation_type?: string;
  issues?: TaskType[];
}

export class TaskType implements Node {
  id: string;
  subject?: string;
  description?: string;
  project_id?: string;
  project_name?: string;
  status_name?: string;
  status?: IssueStatusType;
  author_name?: string;
  author?: UserType;
  assigned_to_name?: string;
  assigned_to?: UserType;
  created_on?: string;
  updated_on?: string;
  closed_on?: string;
  start_date?: string;
  due_date?: string;
  done_ratio?: string;
  project?: ProjectType;
  relations?: TaskRelationType[];
}

export class UserType implements Node {
  id: string;
  login?: string;
  firstname?: string;
  mail?: string;
  created_on?: string;
  last_login_on?: string;
  api_key?: string;
  status?: number;
  group_id?: string;
}
