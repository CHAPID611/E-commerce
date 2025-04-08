import { Model, Optional } from 'sequelize';

// Product interfaces
export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}

// Order interfaces
export interface OrderAttributes {
  id: number;
  username: string;
  totalAmount: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

export interface OrderInstance extends Model<OrderAttributes, OrderCreationAttributes>, OrderAttributes {}

// OrderProduct (join table) interfaces
export interface OrderProductAttributes {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderProductCreationAttributes extends Optional<OrderProductAttributes, 'id'> {}

export interface OrderProductInstance extends Model<OrderProductAttributes, OrderProductCreationAttributes>, OrderProductAttributes {}

