import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {ProjectType} from "./ProjectType";
import {TaskRelationType} from "./TaskRelationType";
import {keyRelation, keyProject} from "../loaders";

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
        assigned_to_name: {type: GraphQLString, resolve: (t) => (t.assigned_to || {}).name},
        created_on: {type: GraphQLString},
        updated_on: {type: GraphQLString},
        closed_on: {type: GraphQLString},
        start_date: {type: GraphQLString},
        due_date: {type: GraphQLString},
        project: {
            type: ProjectType, resolve: async (t, args, {loaders, request}) => {
                return await loaders.project.load(keyProject(t.project.id, args, request));
            }
        },
        relations: {
            type: new GraphQLList(TaskRelationType),
            args: {
                redmine_api_host: {type: GraphQLString, defaultValue: ""},
                redmine_api_key: {type: GraphQLString, defaultValue: ""},
            },
            resolve: async ({id: issue_id}, {redmine_api_host, redmine_api_key}, {loaders, request}) => {
                let {relation} = loaders;
                let host = redmine_api_host || request.headers['x-redmine-api-host'];
                let key = redmine_api_key || request.headers['x-redmine-api-key'];
                return await relation.load(keyRelation({host, key}, issue_id));
            }
        }
    }),
});
