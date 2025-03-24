const {gql} = require('graphql-tag');

const typeDefs = gql`
    type Product {
        name: String
        description: String
    }
    type Query {
        allProducts:[Product!]!
    }
`;
module.exports = typeDefs;