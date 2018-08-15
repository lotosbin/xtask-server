import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {TaskType} from "./TaskType";
import {getRedmineIssues} from "../services";

export const ProjectType = new GraphQLObjectType({
    name: 'ProjectType',
    description: '...',
    fields: () => ({
        redmine_api_host: {type: GraphQLString, defaultValue: ""},
        redmine_api_key: {type: GraphQLString, defaultValue: ""},
        id: {type: GraphQLString},
        identifier: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        created_on: {type: GraphQLString},
        updated_on: {type: GraphQLString},
        issues: {
            type: new GraphQLList(TaskType),
            args: {
                assigned_to_id: {type: GraphQLString}
            },
            resolve: async (p, args, {loaders, request}) => {
                let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                return await getRedmineIssues({host, key}, {...args, project_id: p.id});
            }
        }
    }),
});
