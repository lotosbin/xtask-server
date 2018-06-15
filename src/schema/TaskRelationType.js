import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {TaskType} from "./TaskType";
import {keyTask} from "../loaders";

export const TaskRelationType = new GraphQLObjectType({
    name: 'TaskRelationType',
    description: '...',
    fields: () => ({
        redmine_api_host: {type: GraphQLString, defaultValue: ""},
        redmine_api_key: {type: GraphQLString, defaultValue: ""},
        id: {type: GraphQLString},
        issue_id: {type: GraphQLString},
        issue_to_id: {type: GraphQLString},
        relation_type: {type: GraphQLString},
        issues: {
            type: TaskType,
            resolve: async (p, {redmine_api_host, redmine_api_key, issue_to_id}, {loaders, request}) => {
                let {task} = loaders;
                let host = redmine_api_host || request.headers['x-redmine-api-host'];
                let key = redmine_api_key || request.headers['x-redmine-api-key'];
                return await task.load(keyTask({host, key}, issue_to_id));
            }
        }
    }),
});
