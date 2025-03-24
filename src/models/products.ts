module.exports = (sequelize, DataTypes)=> { 
    const product = sequelize.define(
        'product',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name : {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description:{
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: true,
            tableName: 'products'
        }
    );
    return product;
}