import { ProductModel } from '../models';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { MyContext } from '../index';

interface ProductInput {
  name: string;
  description?: string;
  price: number;
  categoryId?: number;
  stock: number;
  imageUrl?: string;
}

export const productResolvers = {
  Query: {
    // Get all products
    products: async () => {
      return await ProductModel.findAll();
    },

    // Get product by ID
    product: async (_: any, { id }: { id: string }) => {
      const product = await ProductModel.findByPk(id);
      if (!product) throw new UserInputError('Product not found');
      return product;
    },

    // Get products by category
    productsByCategory: async (_: any, { categoryId }: { categoryId: number }) => {
      return await ProductModel.findAll({
        where: { categoryId }
      });
    }
  },

  Mutation: {
    // Create new product (admin only)
    createProduct: async (_: any, { input }: { input: ProductInput }, { user }: MyContext) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      return await ProductModel.create({
        ...input,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    },

    // Update product (admin only)
    updateProduct: async (_: any, { id, input }: { id: string, input: ProductInput }, { user }: MyContext) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const product = await ProductModel.findByPk(id);
      if (!product) throw new UserInputError('Product not found');

      await product.update({
        ...input,
        updatedAt: new Date()
      });

      return product;
    },

    // Delete product (admin only)
    deleteProduct: async (_: any, { id }: { id: string }, { user }: MyContext) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const product = await ProductModel.findByPk(id);
      if (!product) throw new UserInputError('Product not found');

      await product.destroy();
      return true;
    }
  }
};
