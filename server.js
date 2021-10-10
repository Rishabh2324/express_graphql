/*
 1.Express server is created in this file
 2.Uses express-graphql middleware for graphql end points
*/

const express = require('express');
// Layer between express and GraphQL [middleware]
const { graphqlHTTP } = require('express-graphql');
//Schema for graphql Middleware
const schema = require('./schema/schema');

const app = express();

// API end points with '/graphql' will navigate for graphql queries
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log('Listening');
});
