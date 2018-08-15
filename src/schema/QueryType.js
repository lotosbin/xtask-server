import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {getRedmineGroups, getRedmineProjects, getRedmineUsers} from "../services";
import {TaskType} from "./TaskType";
import {ProjectType} from "./ProjectType";
import {UserType} from "./UserType";
import {keyUser} from "../loaders/User";
import {keyGroup} from "../loaders/Group";
import {GroupType} from "./GroupType";
import {IssueStatusType} from "./IssueStatusType";

export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
        tasks: {
            type: new GraphQLList(TaskType),
            deprecationReason: "use issues",
            args: {
                offset: { type: GraphQLInt, defaultValue: 0 },
                limit: { type: GraphQLInt, defaultValue: 20 },
                issue_id: {type: GraphQLString, defaultValue: ""},
                redmine_api_host: { type: GraphQLString, defaultValue: "" },
                redmine_api_key: { type: GraphQLString, defaultValue: "" },
            },
            resolve: async (root, args, {loaders, request, repository}) => {
                return await repository.getIssues(args);
            }
        },
        issues: {
            type: new GraphQLList(TaskType),
            args: {
                offset: {type: GraphQLInt, defaultValue: 0},
                limit: {type: GraphQLInt, defaultValue: 20},
                issue_id: {type: GraphQLString, defaultValue: ""},
                redmine_api_host: {type: GraphQLString, defaultValue: ""},
                redmine_api_key: {type: GraphQLString, defaultValue: ""},
            },
            resolve: async (root, args, {loaders, request, repository}) => {
                return await repository.getIssues(args);
            }
        },
        projects: {
            type: new GraphQLList(ProjectType),
            args: {
                offset: { type: GraphQLInt, defaultValue: 0 },
                limit: { type: GraphQLInt, defaultValue: 20 },
                id: {type: GraphQLString, defaultValue: ""},
                redmine_api_host: { type: GraphQLString, defaultValue: "" },
                redmine_api_key: { type: GraphQLString, defaultValue: "" },
            },
            resolve: async (root, args, { loaders, request }) => {
                let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                request.headers['x-redmine-api-host'] = host;
                request.headers['x-redmine-api-key'] = key;
                return await getRedmineProjects({host, key}, args, request);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            args: {
                offset: {type: GraphQLInt, defaultValue: 0},
                limit: {type: GraphQLInt, defaultValue: 20},
                id: {type: GraphQLString, defaultValue: ""},
                redmine_api_host: {type: GraphQLString, defaultValue: ""},
                redmine_api_key: {type: GraphQLString, defaultValue: ""},
            },
            resolve: async (root, args, {loaders, request}) => {
                let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                request.headers['x-redmine-api-host'] = host;
                request.headers['x-redmine-api-key'] = key;
                if (args.id) {
                    let list = [];
                    const user = await loaders.userLoader.load(keyUser(request, args.id));
                    list.push(user);
                    return list
                }
                return await getRedmineUsers({host, key}, args);
            }
        },
        groups: {
            type: new GraphQLList(GroupType),
            args: {
                offset: {type: GraphQLInt, defaultValue: 0},
                limit: {type: GraphQLInt, defaultValue: 20},
                id: {type: GraphQLString, defaultValue: ""},
                redmine_api_host: {type: GraphQLString, defaultValue: ""},
                redmine_api_key: {type: GraphQLString, defaultValue: ""},
            },
            resolve: async (root, args, {loaders, request}) => {
                let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                request.headers['x-redmine-api-host'] = host;
                request.headers['x-redmine-api-key'] = key;
                if (args.id) {
                    let list = [];
                    const group = await loaders.groupLoader.load(keyGroup({host, key}, args.id));
                    list.push(group);
                    return list
                }
                return await getRedmineGroups({host, key}, args);
            }
        },
        issue_statuses: {
            type: new GraphQLList(IssueStatusType),
            args: {},
            resolve: async (root, args, {repository}) => {
                return await repository.getIssueStatuses();
            }
        },
    }),
});
