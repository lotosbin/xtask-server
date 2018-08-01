import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } from "graphql";
import { getRedmineIssues, getRedmineProjects } from "../services";
import { TaskType } from "./TaskType";
import { ProjectType } from "./ProjectType";
export const QueryType = new GraphQLObjectType({
    name: 'Query',
    description: '...',

    fields: () => ({
        tasks: {
            type: new GraphQLList(TaskType),
            args: {
                offset: { type: GraphQLInt, defaultValue: 0 },
                limit: { type: GraphQLInt, defaultValue: 20 },
                redmine_api_host: { type: GraphQLString, defaultValue: "" },
                redmine_api_key: { type: GraphQLString, defaultValue: "" },
            },
            resolve: async (root, args, { loaders, request }) => {
                let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                return await getRedmineIssues({ host, key }, args);
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
    }),
});
