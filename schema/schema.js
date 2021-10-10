/* This file contains all the information required for 
   telling graphql exactly how your application 
   data looks like
*/

const graphql = require('graphql');
const axios = require('axios');
// For creating data model for information eg: UserType
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql;

// UserType Schema
const UserType = new GraphQLObjectType({
  // Data model for a user
  name: 'User',
  // Properties User will have and its type
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
});

//RootQuery
/* 
    Purpose of Root query is to jump to a 
    specific node of a graphql data
*/

/*
    RootQuery for user 
    If query is provided with user id then query will return data User of schema UserType
*/

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      //Schema referring you will be referring using Root query
      type: UserType,
      //Arguments provided in root query
      args: { id: { type: GraphQLString } },
      // Resolve function uses arguments to fetch data from database
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
