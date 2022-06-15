const { Model, DataTypes } = require("sequelize");
const sequelize = require('../repository/DB');
const DiscountProduct = require("./DiscountProduct");

class DiscountProductHistory extends Model {}

DiscountProductHistory.init({

  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },

  product_id: {
    type: DataTypes.BIGINT
  },

  created_at: {
    type: DataTypes.DATE
  }

},
{
  sequelize,
  timestamps: false,
  tableName: 'discount_products_history',
  modelName: 'discount_product_history'
});

const foreignKey = {
  name: 'discount_product_id',
  type: DataTypes.BIGINT
};

DiscountProduct.hasMany(DiscountProductHistory, { foreignKey });

DiscountProductHistory.belongsTo(DiscountProduct, { foreignKey });


module.exports = DiscountProductHistory;

