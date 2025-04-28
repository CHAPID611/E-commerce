import { gql } from 'graphql-tag';

export const categoryTypes = gql`
  type Category {
    id: ID!
    name: String!
    description: String
    products: [Product!]
    createdAt: String
    updatedAt: String
  }

  input CategoryInput {
    name: String!
    description: String
  }
`;
