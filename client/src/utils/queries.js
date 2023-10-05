const { gql } = require('@apollo/client');

//* The GET_ME query that should match the me query on the server side
const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        title
        authors
        description
        image
        link
      }
    }
  }
`;

module.export = { GET_ME };
