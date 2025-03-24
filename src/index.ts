const {ApolloServer}= require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer');
const cors = require ('cors');
const http = require ('http');
const express = require('express');
const types = require('./schemas');
const resolver = require('./resolvers');
const {sequelize : sq} = require('./models');

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: types,
    resolvers: resolver,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
});
(async () =>{
    await server.start();
    app.use('/', cors(), express.json(),expressMiddleware(server));

    await new Promise((resolve) => httpServer.listen({port: 4000}, resolve));
    console.log(`server ready at http://localhost:4000/`);

    sq.authenticate().then(() => {
        console.log('Database conected');
    }).catch((error) => {
        console.log(error);
    });
}) ().catch((err)=>{
    console.error(err)
});