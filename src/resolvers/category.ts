import { CategoryModel } from '../models';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Op } from 'sequelize';

interface Context {
  user?: {
    id: number;
    role: string;
  };
}

interface CategoryInput {
  name: string;
  description?: string;
  slug: string;
}

export const categoryResolvers = {
  Query: {
    // Get all categories
    categories: async () => {
      return await CategoryModel.findAll();
    },

    // Get category by ID
    category: async (_: any, { id }: { id: string }) => {
      const category = await CategoryModel.findByPk(id);
      if (!category) throw new UserInputError('Category not found');
      return category;
    }
  },

  Mutation: {
    // Create new category (admin only)
    createCategory: async (_: any, { input }: { input: CategoryInput }, { user }: Context) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const { name, description, slug } = input;

      // Check if category with same name or slug exists
      const existingCategory = await CategoryModel.findOne({
        where: {
          [Op.or]: [{ name }, { slug }]
        }
      });

      if (existingCategory) {
        throw new UserInputError('Category with this name or slug already exists');
      }

      return await CategoryModel.create({
        name,
        description,
        slug,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    },

    // Update category (admin only)
    updateCategory: async (_: any, { id, input }: { id: string, input: Partial<CategoryInput> }, { user }: Context) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const category = await CategoryModel.findByPk(id);
      if (!category) throw new UserInputError('Category not found');

      await category.update(input);
      return category;
    },

    // Delete category (admin only)
    deleteCategory: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const category = await CategoryModel.findByPk(id);
      if (!category) throw new UserInputError('Category not found');

      await category.destroy();
      return true;
    }
  },

  Category: {
    products: async (category: any) => {
      return await category.getProducts();
    }
  }
};
