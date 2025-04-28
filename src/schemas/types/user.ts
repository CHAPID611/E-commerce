import { gql } from 'graphql-tag';

export const userTypes = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    orders: [Order!]
    createdAt: String
    updatedAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  input UserInput {
    username: String
    email: String
    password: String
    role: String
  }
`;
