import { OrderModel, ProductModel, OrderProductModel, sequelize } from '../models';
import { MyContext } from '../../index';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { Transaction } from 'sequelize';

export const orderResolvers = {
  Query: {
    // Get all orders (admin only)
    orders: async (_: any, __: any, context: MyContext) => {
      // In a real app, add admin check here
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to view all orders');
      }
      
      try {
        const orders = await OrderModel.findAll({
          include: [{ model: ProductModel }]
        });
        return orders;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw new Error('Failed to fetch orders');
      }
    },

    // Get order by ID
    order: async (_: any, { id }: { id: string }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to view an order');
      }

      try {
        const order = await OrderModel.findByPk(id, {
          include: [{ model: ProductModel }]
        });
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        // Check if the user owns the order or is an admin
        if (order.getDataValue('username') !== context.user.username) {
          throw new AuthenticationError('You can only view your own orders');
        }
        
        return order;
      } catch (error) {
        console.error(`Error fetching order with ID ${id}:`, error);
        if (error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to fetch order');
      }
    },

    // Get orders for the current user
    myOrders: async (_: any, __: any, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to view your orders');
      }

      try {
        const orders = await OrderModel.findAll({
          where: { username: context.user.username },
          include: [{ model: ProductModel }]
        });
        
        return orders;
      } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch your orders');
      }
    }
  },

  Mutation: {
    // Create a new order
    createOrder: async (_: any, { input }: { input: any }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to create an order');
      }

      let transaction: Transaction | undefined;

      try {
        // Start a transaction for data consistency
        transaction = await sequelize.transaction();

        // Validate input
        if (!input.products || input.products.length === 0) {
          throw new UserInputError('Order must contain at least one product');
        }

        // Calculate total amount and verify product existence
        let totalAmount = 0;
        const productDetails = [];

        for (const item of input.products) {
          const product = await ProductModel.findByPk(item.productId, { transaction });
          
          if (!product) {
            throw new UserInputError(`Product with ID ${item.productId} not found`);
          }
          
          if (item.quantity <= 0) {
            throw new UserInputError('Product quantity must be greater than 0');
          }
          
          const productPrice = product.getDataValue('price');
          const itemTotal = productPrice * item.quantity;
          totalAmount += itemTotal;
          
          productDetails.push({
            product,
            quantity: item.quantity,
            price: productPrice
          });
        }

        // Create new order
        const newOrder = await OrderModel.create({
          username: context.user.username,
          totalAmount,
          status: 'pending'
        }, { transaction });

        // Create order-product relationships
        for (const detail of productDetails) {
          await OrderProductModel.create({
            orderId: newOrder.getDataValue('id'),
            productId: detail.product.getDataValue('id'),
            quantity: detail.quantity,
            price: detail.price
          }, { transaction });
        }

        // Commit transaction
        await transaction.commit();

        // Fetch the created order with its products
        const order = await OrderModel.findByPk(newOrder.getDataValue('id'), {
          include: [{ model: ProductModel }]
        });

        return order;
      } catch (error) {
        // Rollback transaction in case of error
        if (transaction) {
          await transaction.rollback();
        }
        
        console.error('Error creating order:', error);
        if (error instanceof UserInputError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to create order');
      }
    },

    // Update order status
    updateOrderStatus: async (_: any, { id, status }: { id: string, status: string }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to update an order status');
      }

      try {
        // Find order
        const order = await OrderModel.findByPk(id, {
          include: [{ model: ProductModel }]
        });
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        // Check if the user owns the order or is an admin
        if (order.getDataValue('username') !== context.user.username) {
          throw new AuthenticationError('You can only update your own orders');
        }
        
        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
          throw new UserInputError('Invalid order status');
        }
        
        // Update order status
        const updatedOrder = await order.update({ status });
        
        return updatedOrder;
      } catch (error) {
        console.error(`Error updating order status for ID ${id}:`, error);
        if (error instanceof UserInputError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to update order status');
      }
    },

    // Cancel an order
    cancelOrder: async (_: any, { id }: { id: string }, context: MyContext) => {
      // Check if user is authenticated
      if (!context.user?.username) {
        throw new AuthenticationError('You must be logged in to cancel an order');
      }

      try {
        // Find order
        const order = await OrderModel.findByPk(id, {
          include: [{ model: ProductModel }]
        });
        
        if (!order) {
          throw new Error('Order not found');
        }
        
        // Check if the user owns the order
        if (order.getDataValue('username') !== context.user.username) {
          throw new AuthenticationError('You can only cancel your own orders');
        }
        
        // Check if order can be cancelled
        const currentStatus = order.getDataValue('status');
        if (currentStatus === 'shipped' || currentStatus === 'delivered') {
          throw new UserInputError('Cannot cancel orders that have been shipped or delivered');
        }
        
        // Update order status to cancelled
        const updatedOrder = await order.update({ status: 'cancelled' });
        
        return updatedOrder;
      } catch (error) {
        console.error(`Error cancelling order with ID ${id}:`, error);
        if (error instanceof UserInputError || error instanceof AuthenticationError) {
          throw error;
        }
        throw new Error('Failed to cancel order');
      }
    }
  },

  // Field resolvers for the Order type
  Order: {
    products: async (parent: any) => {
      try {
        const orderProducts = await OrderProductModel.findAll({
          where: { orderId: parent.id },
          include: [{ model: ProductModel }]
        });
        
        return orderProducts.map(op => ({
          id: op.getDataValue('id'),
          product: op.getDataValue('Product'),
          quantity: op.getDataValue('quantity'),
          price: op.getDataValue('price')
        }));
      } catch (error) {
        console.error(`Error resolving products for order ID ${parent.id}:`, error);
        throw new Error('Failed to fetch order products');
      }
    }
  }
};

