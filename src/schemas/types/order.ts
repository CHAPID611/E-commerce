import { gql } from 'graphql-tag';

export const orderTypeDefs = gql`
  type Order {
    id: ID!
    username: String!
    totalAmount: Float!
    status: String!
    products: [OrderProduct!]!
    createdAt: String
    updatedAt: String
  }

  type OrderProduct {
    id: ID!
    product: Product!
    quantity: Int!
    price: Float!
  }

  input OrderProductInput {
    productId: ID!
    quantity: Int!
  }

  input OrderInput {
    products: [OrderProductInput!]!
  }
`;

