import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Import schema and resolvers
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';

// Import database models
import { sequelize } from './models';

// Load environment variables
dotenv.config();

// Define the context interface for authenticated users
export interface MyContext {
  token?: string;
  user?: {
    username: string;
    role?: 'user' | 'admin';
  };
}

// JWT interface for decoded token
interface DecodedToken {
  username: string;
  role: string;
  exp: number;
  [key: string]: any;
}

// Function to validate JWT token and extract user information
const validateToken = async (token: string): Promise<{ username: string; role: string } | null> => {
  if (!token || !token.startsWith('Bearer ')) {
    return null;
  }
  
  const tokenValue = token.split(' ')[1];
  
  try {
    // Verify JWT token
    const decoded = jwt.verify(
      tokenValue, 
      process.env.JWT_SECRET || 'your_jwt_secret_key'
    ) as DecodedToken;
    
    return { 
      username: decoded.username,
      role: decoded.role || 'user'
    };
  } catch (error) {
    return null;
  }
};

async function startServer() {
  try {
    // Initialize database connection
    await sequelize.sync();
    console.log('Database synchronized successfully');

    const app = express();
    const httpServer = http.createServer(app);

    // Create Apollo Server instance
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      introspection: process.env.NODE_ENV !== 'production',
    });

    // Start the Apollo Server
    await server.start();

    // Apply middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      bodyParser.json(),
      expressMiddleware(server, {
        context: async ({ req }) => {
          const token = req.headers.authorization || '';
          const user = await validateToken(token);
          return { token, user };
        },
      }),
    );

    // API health check endpoint
    app.get('/health', (_, res) => {
      res.status(200).send('OK');
    });

    // Start the HTTP server
    const PORT = process.env.PORT || 4000;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
    console.log(`Health check endpoint: http://localhost:${PORT}/health`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();

// Handle any uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
