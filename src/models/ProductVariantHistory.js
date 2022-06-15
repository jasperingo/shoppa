const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Product = require("./Product");
const ProductVariant = require("./ProductVariant");

class ProductVariantHistory extends Model {}

ProductVariantHistory.init({

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
  tableName: 'product_variants_history',
  modelName: 'product_variant_history'
});

const foreignKey = {
  name: 'product_variant_id',
  type: DataTypes.BIGINT
};


ProductVariant.hasMany(ProductVariantHistory, { foreignKey });

ProductVariantHistory.belongsTo(ProductVariant, { foreignKey });


module.exports = ProductVariantHistory;

