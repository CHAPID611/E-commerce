import { productResolvers } from './product';
import { orderResolvers } from './order';
import { userResolvers } from './user';
import { categoryResolvers } from './category';

export const resolvers = [
  productResolvers,
  orderResolvers,
  userResolvers,
  categoryResolvers
];