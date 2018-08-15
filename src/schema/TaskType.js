import {GraphQLInt, GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {ProjectType} from "./ProjectType";
import {TaskRelationType} from "./TaskRelationType";
import {keyRelation} from "../loaders/Relation";
import {UserType} from "./UserType";

export const TaskType = new GraphQLObjectType({
    name: 'TaskType',
    description: '...',
    fields: () => ({
        id: {type: GraphQLString},
        subject: {type: GraphQLString},
        description: {type: GraphQLString},
        project_id: {type: GraphQLString},
        project_name: {type: GraphQLString, resolve: (t) => t.project.name},
        status_name: {type: GraphQLString, resolve: (t) => t.status.name},
        author_name: {type: GraphQLString, resolve: (t) => (t.author || {}).name},
        author: {
            type: UserType,
            args: {},
            resolve: async (t, args, {repository}) => await repository.getUserById(t.author?.id),
        },
        assigned_to_name: {type: GraphQLString, resolve: (t) => (t.assigned_to || {}).name},
        assigned_to: {
            type: UserType,
            args: {},
            resolve: async (t, args, {repository}) => await repository.getUserById(t.assigned_to?.id),
        },
        created_on: {type: GraphQLString},
        updated_on: {type: GraphQLString},
        closed_on: {type: GraphQLString},
        start_date: {type: GraphQLString},
        due_date: {type: GraphQLString},
        done_ratio: {type: GraphQLInt},
        project: {
            type: ProjectType,
            args: {},
            resolve: async (t, args, {repository}) => await repository.getProjectById(t.project?.id)
        },
        relations: {
            type: new GraphQLList(TaskRelationType),
            resolve: async ({id: issue_id}, {redmine_api_host, redmine_api_key}, {loaders, request}) => {
                let {relation} = loaders;
                let host = redmine_api_host || request.headers['x-redmine-api-host'];
                let key = redmine_api_key || request.headers['x-redmine-api-key'];
                return await relation.load(keyRelation({host, key}, issue_id));
            }
        }
    }),
});
