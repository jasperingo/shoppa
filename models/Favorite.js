const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Customer = require("./Customer");
const Product = require("./Product");

class Favorite extends Model {}

Favorite.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'favorites',
  modelName: 'favorite'
});


const productForeignKey = {
  name: 'product_id',
  type: DataTypes.BIGINT
};

Product.hasMany(Favorite, { foreignKey: productForeignKey });

Favorite.belongsTo(Product, { foreignKey: productForeignKey });

const customerForeignKey = {
  name: 'customer_id',
  type: DataTypes.BIGINT
};

Favorite.belongsTo(Customer, { foreignKey: customerForeignKey });

Customer.hasMany(Favorite, { foreignKey: customerForeignKey });


module.exports = Favorite;

