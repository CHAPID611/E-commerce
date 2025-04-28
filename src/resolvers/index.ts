import { mergeResolvers } from '@graphql-tools/merge';
import { productResolvers } from './product';
import { orderResolvers } from './order';
import { userResolvers } from './user';
import { categoryResolvers } from './category';

export const resolvers = mergeResolvers([
  productResolvers,
  orderResolvers,
  userResolvers,
  categoryResolvers
]);