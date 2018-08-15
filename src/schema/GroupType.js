import {GraphQLList, GraphQLObjectType, GraphQLString} from "graphql";
import {UserType} from "./UserType";
import {keyUser} from "../loaders/User";

export const GroupType = new GraphQLObjectType({
    name: 'GroupType',
    description: '...',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        users: {
            type: GraphQLList(UserType),
            resolve: async (root, args, {loaders, request}) => {
                console.log(`root:${JSON.stringify(root.users)}`);
                const user_ids = (root.users || []).map(it => keyUser(request, it.id));
                return await loaders.userLoader.loadMany(user_ids)
            }
        }
    }),
});