import { Model, Optional } from 'sequelize';

// Product interfaces
export interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  username: string;
  categoryId?: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {}

// Order interfaces
export interface OrderAttributes {
  id: number;
  username: string;
  totalAmount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
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

// User interfaces
export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

// Category interfaces
export interface CategoryAttributes {
  id: number;
  name: string;
  description?: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

export interface CategoryInstance extends Model<CategoryAttributes, CategoryCreationAttributes>, CategoryAttributes {}
