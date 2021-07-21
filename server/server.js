const express = require('express');

// import Apollo Server
const { ApolloServer } = require('apollo-server-express');

//import typeDefs and resolvers 
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// create a new apollo server and pass in our schema 
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// integrate our Apollo server with expresss app as middleware
server.applyMiddleware({ app})

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const path = require('path');
const routes = require('./routes');


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    // log where we can go to test our GQL API
    console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  });
});
