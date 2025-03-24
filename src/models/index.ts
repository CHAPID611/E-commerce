const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tienda_db', 'postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: console.log
});

const products = require('./products')(sequelize, Sequelize);

const initDB = async () => {
    try {
       
        await sequelize.sync({ force: false });
        console.log('Base de datos sincronizada correctamente');
        
        // Creamos un producto de prueba
        await products.create({
            name: 'Producto de prueba',
            description: 'Este es un producto de prueba'
        });
        console.log('Producto de prueba creado');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

initDB();

module.exports = { sequelize, products }