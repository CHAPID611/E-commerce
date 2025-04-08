import { gql } from 'graphql-tag';

export const queryTypeDefs = gql`
  type Query {
    # Product queries
    products: [Product!]!
    product(id: ID!): Product
    
    # Order queries
    orders: [Order!]!
    order(id: ID!): Order
    myOrders: [Order!]!
  }
`;

