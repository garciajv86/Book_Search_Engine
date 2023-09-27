const express = require('express');
//* Bring in the apollo server
const { ApolloServer } = require('@apollo/server');
//* Get the express middleware from the apollo server
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
//* Bring in the utils auth middleware
const { authMiddleware } = require('./utils/auth');

//* Grab the typeDefs and resolvers from the schemas
const { typeDefs, resolvers } = require('.schemas');
const db = require('./config/connection');

//? Don't think I will need routes when I finish ?
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
//* Setup the apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//* Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
  
  //* if we're in production, serve client/build as static assets
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    //? Not sure if i need this
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
  //? Don't think Ill need routes when finished ?
  app.use(routes);
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(` API server running on port ${PORT}!`);
      console.log(`🌍 Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

//* Call the async function to start the server
startApolloServer();
