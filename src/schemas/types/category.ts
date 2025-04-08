import { gql } from 'apollo-server-express';

export const categoryTypes = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    slug: String!
    products: [Product]
    createdAt: String!
    updatedAt: String!
  }

  input CreateCategoryInput {
    name: String!
    description: String
    slug: String!
  }

  input UpdateCategoryInput {
    name: String
    description: String
    slug: String
  }
`;
