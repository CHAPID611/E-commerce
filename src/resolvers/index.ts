import { productResolvers } from './product';
import { orderResolvers } from './order';

// Merge all resolvers
export const resolvers = {
  Query: {
    ...productResolvers.Query,
    ...orderResolvers.Query
  },
  Mutation: {
    ...productResolvers.Mutation,
    ...orderResolvers.Mutation
  },
  Order: orderResolvers.Order
};

const {products: product} = require('../models')
const resolvers = {
    Query: {
        allProducts: async () => {
            try {
                const products = await product.findAll();
                console.log('Productos encontrados:', products);
                return products;
            } catch (error) {
                console.error('Error al obtener productos:', error);
                throw error;
            }
        },
    },
};
module.exports = resolvers