import { OrderModel, ProductModel, OrderProductModel } from '../models';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Transaction } from 'sequelize';

interface OrderProductInput {
  productId: number;
  quantity: number;
}

interface CreateOrderInput {
  products: OrderProductInput[];
}

interface OrderProduct {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: any;
}

interface User {
  id: number;
  username: string;
  role: 'user' | 'admin';
}

export const orderResolvers = {
  Query: {
    orders: async (_: any, __: any, context: { user?: User }) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }
      return await OrderModel.findAll();
    },

    order: async (_: any, { id }: { id: string }, context: { user?: User }) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const order = await OrderModel.findByPk(id);
      if (!order) throw new UserInputError('Order not found');

      if (context.user.role !== 'admin' && order.getDataValue('username') !== context.user.username) {
        throw new AuthenticationError('Not authorized');
      }

      return order;
    },

    myOrders: async (_: any, __: any, context: { user?: User }) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');
      return await OrderModel.findAll({
        where: { username: context.user.username }
      });
    }
  },

  Mutation: {
    createOrder: async (_: any, { input }: { input: CreateOrderInput }, context: { user?: User }) => {
      if (!context.user) throw new AuthenticationError('Not authenticated');

      const transaction = await OrderModel.sequelize!.transaction();

      try {
        let totalAmount = 0;

        for (const item of input.products) {
          const product = await ProductModel.findByPk(item.productId);
          if (!product) {
            throw new UserInputError(`Product with ID ${item.productId} not found`);
          }
          const stock = product.get('stock') as number;
          if (stock < item.quantity) {
            throw new UserInputError(`Insufficient stock for product ${product.get('name')}`);
          }
          const price = product.get('price') as number;
          totalAmount += price * item.quantity;
        }

        const now = new Date();
        const order = await OrderModel.create({
          username: context.user.username,
          totalAmount,
          status: 'pending',
          createdAt: now,
          updatedAt: now
        }, { transaction });

        for (const item of input.products) {
          const product = await ProductModel.findByPk(item.productId, { transaction });
          if (!product) continue;

          await OrderProductModel.create({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.get('price') as number,
            createdAt: now,
            updatedAt: now
          }, { transaction });

          await product.update({
            stock: (product.get('stock') as number) - item.quantity,
            updatedAt: now
          }, { transaction });
        }

        await transaction.commit();
        return order;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    },

    updateOrderStatus: async (_: any, { id, status }: { id: string, status: string }, context: { user?: User }) => {
      if (!context.user || context.user.role !== 'admin') {
        throw new AuthenticationError('Not authorized');
      }

      const order = await OrderModel.findByPk(id);
      if (!order) throw new UserInputError('Order not found');

      await order.update({ 
        status,
        updatedAt: new Date()
      });
      return order;
    }
  },

  Order: {
    products: async (parent: any) => {
      const orderProducts = await OrderProductModel.findAll({
        where: { orderId: parent.id },
        include: [{
          model: ProductModel,
          required: true
        }]
      });

      return orderProducts.map((op: any) => ({
        id: op.id,
        quantity: op.quantity,
        price: op.price,
        product: op.get('Product')
      }));
    }
  }
};
