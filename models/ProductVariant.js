const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Product = require("./Product");

class ProductVariant extends Model {}

ProductVariant.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  price: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  quantity: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  available: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },

  weight: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'product_variants',
  modelName: 'product_variant'
});

const foreignKey = {
  name: 'product_id',
  type: DataTypes.BIGINT
};

ProductVariant.belongsTo(Product, { foreignKey });

Product.hasMany(ProductVariant, { foreignKey });

module.exports = ProductVariant;

