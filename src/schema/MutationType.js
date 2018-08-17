import {GraphQLObjectType, GraphQLString} from "graphql";
import {TaskType} from "./TaskType";
import {getRedmineIssues, issue_update} from "../services";

export const MutationType = new GraphQLObjectType({
        name: "MutationType",
        fields: {
            task_update: {
                type: TaskType,
                args: {
                    issue_id: {type: GraphQLString},
                    start_date: {type: GraphQLString},
                    due_date: {type: GraphQLString},
                    status_id: {type: GraphQLString},
                },
                resolve: async (root, args, {loaders, request}) => {
                    console.log(`task_update:args=${JSON.stringify(args)}`);
                    let host = args.redmine_api_host || request.headers['x-redmine-api-host'];
                    let key = args.redmine_api_key || request.headers['x-redmine-api-key'];
                    request.headers['x-redmine-api-host'] = host;
                    request.headers['x-redmine-api-key'] = key;
                    await issue_update({host, key}, args);
                    let issues = await getRedmineIssues({host, key}, {issue_id: args.issue_id});
                    if (issues && issues.length > 0) {
                        return issues[0]
                    } else {
                        return null
                    }
                }
            }
        }
    }
);
