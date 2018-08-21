import {GraphQLObjectType, GraphQLString} from "graphql";
import {UserType} from "./UserType";
import {ProjectType} from "./ProjectType";
import {GroupType} from "./GroupType";

export const MemberShipType = new GraphQLObjectType({
    name: 'MemberShipType',
    description: '...',
    fields: () => ({
        id: {type: GraphQLString},
        user: {
            type: UserType,
            args: {},
            resolve: async (root, args, {repository}) => await repository.getUserById(root.user?.id) || {}
        },
        project: {
            type: ProjectType,
            args: {},
            resolve: async (root, args, {repository}) => await repository.getProjectById(root.project?.id) || {}
        },
        group: {
            type: GroupType,
            args: {},
            resolve: async (root, args, {repository}) => await repository.getGroupById(root.group?.id) || {}
        }
    }),
});

