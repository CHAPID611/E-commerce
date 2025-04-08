import { gql } from 'graphql-tag';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    username: String!
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    price: Float!
  }
`;

