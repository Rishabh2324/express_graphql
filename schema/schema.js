/* This file contains all the information required for 
   telling graphql exactly how your application 
   data looks like
*/

const graphql = require('graphql');
const axios = require('axios');
// For creating data model for information eg: UserType
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
} = graphql;

// CompanyType Schema
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then((res) => res.data);
      },
    },
  }),
});

// UserType Schema
const UserType = new GraphQLObjectType({
  // Data model for a user
  name: 'User',
  // Properties User will have and its type
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    //Nested queries
    company: {
      type: CompanyType,
      resolve(parentValue) {
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((res) => res.data);
      },
    },
  }),
});

//RootQuery
/* 
    Purpose of Root query is to jump to a 
    specific node of a graphql data
*/

/*
    RootQuery 
    If query is provided with id wrt field then query will return data of that schema type
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
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios
          .get(`http://localhost:3000/companies/${args.id}`)
          .then((resp) => resp.data);
      },
    },
  },
});

//Mutation
/*
    Purpose of mutation is to add and delete in graphql data
*/

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // Adding User
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLString) },
        companyId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { firstName, age, companyId }) {
        return axios
          .post(`http://localhost:3000/users/`, {
            firstName,
            age,
            companyId,
          })
          .then((res) => res.data);
      },
    },
    //Deleting User
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return axios
          .delete(`http://localhost:3000/users/${id}`)
          .then((res) => res.data);
      },
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        firstName: { type: GraphQLString },
        age: { type: GraphQLString },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .patch(`http://localhost:3000/users/${args.id}`, args)
          .then((res) => res.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
