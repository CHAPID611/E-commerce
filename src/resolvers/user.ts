import { UserModel } from '../models';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface Context {
  user?: {
    id: number;
    role: string;
  };
}

interface UserInput {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface LoginInput {
  username: string;
  password: string;
}

export const userResolvers = {
  Query: {
    // Get all users (admin only)
    users: async (_: any, __: any, { user }: Context) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }
      return await UserModel.findAll();
    },
    // Get user by ID
    user: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.role !== 'admin' && user.id !== parseInt(id)) {
        throw new AuthenticationError('Not authorized');
      }
      const foundUser = await UserModel.findByPk(id);
      if (!foundUser) throw new UserInputError('User not found');
      return foundUser;
    },
    // Get current user
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return await UserModel.findByPk(user.id);
    }
  },

  Mutation: {
    // Register new user
    register: async (_: any, { input }: { input: UserInput }) => {
      const { username, email, password, firstName, lastName } = input;

      // Check if username or email already exists
      const existingUser = await UserModel.findOne({
        where: {
          [Op.or]: [{ username }, { email }]
        }
      });

      if (existingUser) {
        throw new UserInputError('Username or email already exists');
      }

      const user = await UserModel.create({
        username,
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user
      };
    },

    // Login user
    login: async (_: any, { input }: { input: LoginInput }) => {
      const { username, password } = input;
      const user = await UserModel.findOne({ where: { username } });

      if (!user) {
        throw new UserInputError('User not found');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UserInputError('Invalid password');
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user
      };
    },

    // Update user
    updateUser: async (_: any, { id, input }: { id: string, input: Partial<UserInput> }, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      if (user.role !== 'admin' && user.id !== parseInt(id)) {
        throw new AuthenticationError('Not authorized');
      }

      const updatedUser = await UserModel.findByPk(id);
      if (!updatedUser) throw new UserInputError('User not found');

      await updatedUser.update(input);
      return updatedUser;
    },

    // Delete user (admin only)
    deleteUser: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user || user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const userToDelete = await UserModel.findByPk(id);
      if (!userToDelete) throw new UserInputError('User not found');

      await userToDelete.destroy();
      return true;
    }
  },

  User: {
    orders: async (user: any) => {
      return await user.getOrders();
    }
  }
};
