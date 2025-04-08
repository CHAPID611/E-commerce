import { types } from './types';
import { gql } from 'apollo-server-express';
import { mergeTypeDefs } from '@graphql-tools/merge';

// Root Query and Mutation types
const rootTypeDefs = gql`
  type Query {
    # Product queries
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(categoryId: ID!): [Product!]!

    # Order queries
    orders: [Order!]!
    order(id: ID!): Order
    myOrders: [Order!]!

    # Category queries
    categories: [Category!]!
    category(id: ID!): Category

    # User queries
    users: [User!]!
    user(id: ID!): User
    me: User
  }

  type Mutation {
    # Product mutations
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!

    # Order mutations
    createOrder(input: OrderInput!): Order!
    updateOrderStatus(id: ID!, status: String!): Order!
    cancelOrder(id: ID!): Order!

    # User mutations
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UserInput!): User!
    deleteUser(id: ID!): Boolean!

    # Category mutations
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

// Combine all type definitions using mergeTypeDefs
export const typeDefs = mergeTypeDefs([rootTypeDefs, ...types]);