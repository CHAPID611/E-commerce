import { gql } from 'apollo-server-express';

export const userTypes = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    firstName: String
    lastName: String
    orders: [Order]
    createdAt: String!
    updatedAt: String!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
    firstName: String
    lastName: String
  }

  input UpdateUserInput {
    email: String
    password: String
    firstName: String
    lastName: String
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
