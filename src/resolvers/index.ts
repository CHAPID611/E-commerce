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