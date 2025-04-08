"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import schema and resolvers
const schemas_1 = require("./src/schemas");
const resolvers_1 = require("./src/resolvers");
// Import database models
const models_1 = require("./src/models");
// Load environment variables
dotenv_1.default.config();
// Function to validate JWT token and extract user information
const validateToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    if (!token || !token.startsWith('Bearer ')) {
        return null;
    }
    const tokenValue = token.split(' ')[1];
    try {
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(tokenValue, process.env.JWT_SECRET || 'your_jwt_secret_key');
        return { username: decoded.username };
    }
    catch (error) {
        console.error('Token validation error:', error);
        return null;
    }
});
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Express instance
        const app = (0, express_1.default)();
        // Create HTTP server
        const httpServer = http_1.default.createServer(app);
        // Create Apollo Server
        const server = new server_1.ApolloServer({
            typeDefs: schemas_1.typeDefs,
            resolvers: resolvers_1.resolvers,
            introspection: process.env.NODE_ENV !== 'production',
        });
        // Start Apollo Server
        yield server.start();
        // Apply Express middleware
        app.use('/graphql', (0, cors_1.default)(), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
            context: (_a) => __awaiter(this, [_a], void 0, function* ({ req }) {
                // Get the authorization header
                const token = req.headers.authorization || '';
                // Validate the token and get user info
                const user = yield validateToken(token);
                // Return the context
                return {
                    token,
                    user: user ? { username: user.username } : undefined,
                };
            }),
        }));
        // API health check endpoint
        app.get('/health', (_, res) => {
            res.status(200).send('OK');
        });
        // Sync database models
        try {
            yield models_1.sequelize.sync();
            console.log('Database synchronized successfully');
        }
        catch (error) {
            console.error('Failed to synchronize database:', error);
            process.exit(1);
        }
        // Start the server
        const PORT = process.env.PORT || 4000;
        yield new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
        console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
        console.log(`Health check endpoint: http://localhost:${PORT}/health`);
    });
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
