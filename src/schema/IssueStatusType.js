import {GraphQLBoolean, GraphQLObjectType, GraphQLString} from "graphql";

export const IssueStatusType = new GraphQLObjectType({
    name: 'IssueStatusType',
    description: '...',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        is_default: {type: GraphQLBoolean},
        is_closed: {type: GraphQLBoolean},
    }),
});

