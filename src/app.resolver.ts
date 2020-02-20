import { Args, Context, Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { IUser, Repository } from './Repository';
import { IIssue } from './services';

interface IContext {
  repository: Repository;
}

@Resolver('Query')
export class AppResolver {
  @ResolveProperty()
  async tasks(@Args() args: any, @Context() { repository }) {
    return await repository.getIssues(args);
  }

  @ResolveProperty()
  async issues(@Args() args: any, @Context() { repository }) {
    return await repository.getIssues(args);
  }

  @ResolveProperty()
  async projects(@Args() args: any, @Context() { repository }: IContext) {
    return await repository.getRedmineProjects(args);
  }

  @ResolveProperty()
  async users(@Args() args: any, @Context() { repository }: IContext) {
    if (args.id) {
      let list = [];
      const user = await repository.getRedmineUser(args.id);
      list.push(user);
      return list;
    }
    return await repository.getRedmineUsers(args);
  }

  @ResolveProperty()
  async groups(@Args() args: any, @Context() { repository }: IContext) {
    if (args.id) {
      let list = [];
      const user = await repository.getRedmineGroup(args.id);
      list.push(user);
      return list;
    }
    return await repository.getRedmineGroups(args);
  }

  @ResolveProperty()
  async issue_statuses(@Context() { repository }) {
    return await repository.getIssueStatuses();
  }
}

@Resolver('TaskType')
export class TaskTypeResolver {
  @ResolveProperty()
  async project_id(@Parent() parent: any) {
    return parent.project.id;
  }

  @ResolveProperty()
  async project_name(@Parent() parent: any) {
    return parent.project.name;
  }

  @ResolveProperty()
  async status_name(@Parent() parent: any) {
    return parent.status.name;
  }

  @ResolveProperty()
  async author_name(@Parent() parent: any) {
    return (parent.author || {}).name;
  }

  @ResolveProperty()
  async author(@Parent() parent: any, @Context() { repository }): Promise<IUser | null> {
    return await repository.getUserById(parent.author?.id);
  }

  @ResolveProperty()
  async assigned_to_name(@Parent() parent: IIssue, @Context() { repository }): Promise<string> {
    let user: IUser = await repository.getUserById(parent.assigned_to?.id);
    return user?.firstname ?? '';
  }

  @ResolveProperty()
  async assigned_to(@Parent() parent: any, @Context() { repository }): Promise<IUser | null> {
    return await repository.getUserById(parent.assigned_to?.id);
  }

  @ResolveProperty()
  async project(@Parent() parent: any, @Context() { repository }) {
    return await repository.getProjectById(parent.project?.id);
  }

  @ResolveProperty()
  async relations(@Parent() { id: issue_id }: any, @Context() { repository }) {
    return await repository.getRelation(issue_id);
  }
}

@Resolver('GroupType')
class GroupTypeResolver {
  @ResolveProperty()
  async users(@Parent() parent: any, @Context() { repository }: IContext) {
    return await repository.getRedmineUserList((parent.users || []).map(user => user.id));
  }
}

@Resolver('ProjectType')
class ProjectTypeResolver {
  @ResolveProperty()
  async issues(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    return await repository.getRedmineIssues({
      ...args,
      project_id: parent.id,
    });
  }

  @ResolveProperty()
  async memberships(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    return await repository.getMemberShipsByProjectId(parent.id, {
      ...args,
      project_id: parent.id,
    });
  }
}

@Resolver('TaskRelationType')
class TaskRelationType {
  @ResolveProperty()
  async issues(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    return await repository.getIssuesByToId({ issue_to_id: args.issue_to_id });
  }
}

@Resolver('MemberShipType')
class MemberShipType {
  @ResolveProperty()
  async user(@Parent() parent: any, @Args() args, @Context() { repository }: IContext): Promise<IUser | null> {
    return await repository.getUserById(parent.user?.id);
  }

  @ResolveProperty()
  async project(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    return (await repository.getProjectById(parent.project?.id)) || {};
  }

  @ResolveProperty()
  async group(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    return (await repository.getGroupById(parent.group?.id)) || {};
  }
}

@Resolver('MutationType')
class MutationType {
  @ResolveProperty()
  async task_update(@Parent() parent: any, @Args() args, @Context() { repository }: IContext) {
    await repository.issue_update(args);
    let issues = await repository.getRedmineIssues({ issue_id: args.issue_id });
    if (issues && issues.length > 0) {
      return issues[0];
    } else {
      return null;
    }
  }
}
