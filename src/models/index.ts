import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initProductModel } from './Product';
import { initOrderModel } from './Order';
import { initOrderProductModel } from './OrderProduct';
import { initUserModel } from './User';
import { initCategoryModel } from './Category';

// Load environment variables
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ecommerce',
  logging: process.env.NODE_ENV !== 'production' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

// Initialize models
const ProductModel = initProductModel(sequelize);
const OrderModel = initOrderModel(sequelize);
const OrderProductModel = initOrderProductModel(sequelize);
const UserModel = initUserModel(sequelize);
const CategoryModel = initCategoryModel(sequelize);

// Define relationships
CategoryModel.hasMany(ProductModel, {
  foreignKey: 'categoryId',
  as: 'products'
});

ProductModel.belongsTo(CategoryModel, {
  foreignKey: 'categoryId',
  as: 'category'
});

OrderModel.belongsToMany(ProductModel, {
  through: OrderProductModel,
  as: 'products'
});

ProductModel.belongsToMany(OrderModel, {
  through: OrderProductModel,
  as: 'orders'
});

UserModel.hasMany(OrderModel, {
  foreignKey: 'userId',
  as: 'orders'
});

OrderModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  as: 'user'
});

export {
  sequelize,
  ProductModel,
  OrderModel,
  OrderProductModel,
  UserModel,
  CategoryModel,
  testConnection
};