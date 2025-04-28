import { gql } from 'graphql-tag';

export const productTypeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    stock: Int!
    category: Category
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    stock: Int!
    categoryId: ID
  }
`;
