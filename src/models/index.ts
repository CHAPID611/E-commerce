import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Sequelize instance
const dbName = process.env.DB_NAME || 'ecommerce';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '5432';

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: parseInt(dbPort, 10),
  dialect: 'postgres',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Import models
import { initProductModel } from './Product';
import { initOrderModel } from './Order';
import { initOrderProductModel } from './OrderProduct';

// Initialize models
export const Product = initProductModel(sequelize);
export const Order = initOrderModel(sequelize);
export const OrderProduct = initOrderProductModel(sequelize);

// Define relationships
Order.belongsToMany(Product, { 
  through: OrderProduct,
  foreignKey: 'orderId',
  otherKey: 'productId'
});

Product.belongsToMany(Order, { 
  through: OrderProduct,
  foreignKey: 'productId',
  otherKey: 'orderId'
});

// Export models
export { Product as ProductModel };
export { Order as OrderModel };
export { OrderProduct as OrderProductModel };

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tienda_db', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
});

const products = require('./products')(sequelize, Sequelize);

const initDB = async () => {
    try {
       
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada correctamente');
        
        // Creamos un producto de prueba
        await products.create({
            name: 'Producto de prueba',
            description: 'Este es un producto de prueba'
        });
        console.log('Producto de prueba creado');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

initDB();

module.exports = { sequelize, products }