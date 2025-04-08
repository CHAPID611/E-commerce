import { ProductModel } from '../models';
import { MyContext } from '../../index';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';

export const productResolvers = {
  Query: {
    // Get all products
    products: async () => {
      try {
        const products = await ProductModel.findAll();
        return products;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
      }
    },

    // Get product by ID
    product: async (_: any, { id }: { id: string }) => {
      try {
        const product = await ProductModel.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }
        return product;
      } catch (error) {
        console.error(`Error fetching product with ID ${id}:`, error);
        throw new Error('Failed to fetch product');
      }
    }
  },

  Mutation: {
    // Create a new product
    createProduct: async (_: any, { input }: { input: any }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to create a product');
      }

      try {
        // Validate input
        if (!input.name || !input.price) {
          throw new UserInputError('Product name and price are required');
        }

        if (input.price <= 0) {
          throw new UserInputError('Product price must be greater than 0');
        }

        // Create new product
        const newProduct = await ProductModel.create({
          name: input.name,
          price: input.price,
          username: context.user.username
        });

        return newProduct;
      } catch (error) {
        console.error('Error creating product:', error);
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Failed to create product');
      }
    },

    // Update a product
    updateProduct: async (_: any, { id, input }: { id: string, input: any }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to update a product');
      }

      try {
        // Find product
        const product = await ProductModel.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }

        // Check if user owns the product
        if (product.getDataValue('username') !== context.user.username) {
          throw new AuthenticationError('You can only update your own products');
        }

        // Validate input
        if (input.price !== undefined && input.price <= 0) {
          throw new UserInputError('Product price must be greater than 0');
        }

        // Update product
        const updatedProduct = await product.update({
          name: input.name || product.getDataValue('name'),
          price: input.price || product.getDataValue('price')
        });

        return updatedProduct;
      } catch (error) {
        console.error(`Error updating product with ID ${id}:`, error);
        if (error instanceof UserInputError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to update product');
      }
    },

    // Delete a product
    deleteProduct: async (_: any, { id }: { id: string }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to delete a product');
      }

      try {
        // Find product
        const product = await ProductModel.findByPk(id);
        if (!product) {
          throw new Error('Product not found');
        }

        // Check if user owns the product
        if (product.getDataValue('username') !== context.user.username) {
          throw new AuthenticationError('You can only delete your own products');
        }

        // Delete product
        await product.destroy();
        return true;
      } catch (error) {
        console.error(`Error deleting product with ID ${id}:`, error);
        if (error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to delete product');
      }
    }
  }
};

