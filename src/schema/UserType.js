import {GraphQLInt, GraphQLObjectType, GraphQLString} from "graphql";

export const UserType = new GraphQLObjectType({
    name: 'UserType',
    description: '...',
    fields: () => ({
        id: {type: GraphQLString},
        login: {type: GraphQLString},
        firstname: {type: GraphQLString},
        mail: {type: GraphQLString},
        created_on: {type: GraphQLString},
        last_login_on: {type: GraphQLString},
        api_key: {type: GraphQLString},
        status: {type: GraphQLInt},
        group_id: {type: GraphQLString},
    }),
});

