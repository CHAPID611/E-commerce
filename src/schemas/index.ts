import { productTypeDefs } from './types/product';
import { orderTypeDefs } from './types/order';
import { queryTypeDefs } from './queries';
import { mutationTypeDefs } from './mutations';

// Combine all type definitions
export const typeDefs = [
  productTypeDefs,
  orderTypeDefs,
  queryTypeDefs,
  mutationTypeDefs
];

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