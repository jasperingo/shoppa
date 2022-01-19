const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const Discount = require("./Discount");
const Product = require("./Product");

class DiscountProduct extends Model {}

DiscountProduct.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  deleted_at: {
    type: DataTypes.DATE
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  paranoid: true,
  deletedAt: 'deleted_at',
  tableName: 'discount_products',
  modelName: 'discount_product'
});

const foreignKey = {
  name: 'discount_id',
  type: DataTypes.BIGINT
};

Discount.hasMany(DiscountProduct, { foreignKey });

DiscountProduct.belongsTo(Discount, { foreignKey });

const prodForeignKey = {
  name: 'product_id',
  type: DataTypes.BIGINT
};

DiscountProduct.belongsTo(Product, { foreignKey: prodForeignKey });

Product.hasMany(DiscountProduct, { foreignKey: prodForeignKey });

module.exports = DiscountProduct;

