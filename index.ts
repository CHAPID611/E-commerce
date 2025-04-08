import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Import schema and resolvers
import { typeDefs } from './src/schemas';
import { resolvers } from './src/resolvers';

// Import database models
import { sequelize } from './src/models';

// Load environment variables
dotenv.config();

// Define the context interface for authenticated users
export interface MyContext {
  token?: string;
  user?: {
    username: string;
  };
}

// JWT interface for decoded token
interface DecodedToken {
  username: string;
  exp: number;
  [key: string]: any;
}

// Function to validate JWT token and extract user information
const validateToken = async (token: string): Promise<{ username: string } | null> => {
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
    
    return { username: decoded.username };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

async function startServer() {
  // Create Express instance
  const app = express();
  
  // Create HTTP server
  const httpServer = http.createServer(app);
  
  // Create Apollo Server
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
  });
  
  // Start Apollo Server
  await server.start();
  
  // Apply Express middleware
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Get the authorization header
        const token = req.headers.authorization || '';
        
        // Validate the token and get user info
        const user = await validateToken(token);
        
        // Return the context
        return {
          token,
          user: user ? { username: user.username } : undefined,
        };
      },
    }),
  );
  
  // API health check endpoint
  app.get('/health', (_, res) => {
    res.status(200).send('OK');
  });
  
  // Sync database models
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Failed to synchronize database:', error);
    process.exit(1);
  }
  
  // Start the server
  const PORT = process.env.PORT || 4000;
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`Health check endpoint: http://localhost:${PORT}/health`);
}

// Handle any uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Start the server
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
